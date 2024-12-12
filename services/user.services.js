const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { defaultBlockingTime, supraAdminEmail } = require("../config/dot-env");

const {
  NotFoundError,
  CustomError,
  InvalidCredentialsError,
  TooManyAttemptsError,
  AccountNotValidatedError,
  AuthorizationError,
} = require("../utils/errors");

const { models, sequelize } = require("../models");
const { generateToken, verifyToken } = require("../utils/jwt.utils");

const {
  generateHashedPasswordAndSalt,
  isPasswordValid,
} = require("../helpers/password.helpers");

const {
  sendVerificationEmail,
  sendInitChangePasswordEmail,
  sendSuccessPasswordChangedEmail,
} = require("../services/mail.services");

const { getRemainingTime } = require("../utils/hour-convertion.utils");
const { where } = require("sequelize");
const { logger } = require("sequelize/lib/utils/logger");

exports.getUsersWithRoles = async () => {
  try {
    const users = await models.User.findAll({
      attributes: {
        exclude: ["password", "salt"],
      },
      include: [
        {
          model: models.Role,
          attributes: ["name"],
          through: { attributes: [] }, // Exclude join table attributes
        }
      ],
    });

    const userWithRoleNames = users.map((user) => ({
      ...user.toJSON(),
      roles: user.Roles.map((role) => role.name),
    }));

    return userWithRoleNames;
  } catch (error) {
    throw error;
  }
};

exports.getUserWithRolesById = async (userId) => {
  try {
    const user = await models.User.findByPk(userId, {
      attributes: {
        exclude: ["password", "salt", "canAuthenticate", "isAccountValidated"],
      },
      include: [
        {
          model: models.Role,
          attributes: ["name"],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!user) {
      throw new NotFoundError(
        "Cet utilisateur est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
      );
    }

    const userWithRoleNames = {
      ...user.toJSON(),
      roles: user.Roles.map((role) => role.name),
    };

    return userWithRoleNames;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (userDataToSave, transaction) => {

  try {
    const hashedPassword = generateHashedPasswordAndSalt(userDataToSave.password);

    userDataToSave = {
      ...userDataToSave,
      password: hashedPassword.hash,
      salt: hashedPassword.salt,
    };

    return await models.User.create(userDataToSave, { transaction });
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, userData, roleNames) => {
  const transaction = await sequelize.transaction();

  try {
    const userToEdit = await models.User.findByPk(userId);

    if (!userToEdit) {
      throw new NotFoundError(
        "Cet utilisateur est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
      );
    }

    await userToEdit.update(userData, { transaction });

    if(roleNames){
      const roles = await models.Role.findAll({
        where: {
          name: roleNames,
        },
        transaction,
      });
  
      await userToEdit.setRoles(roles, { transaction });
    }
    
    await transaction.commit();

    return userToEdit;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteUser = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await models.User.findByPk(userId, {
      include: models.Role,
      transaction,
    });

    if(user.email === supraAdminEmail){
      throw new AuthorizationError("Vous n'êtes pas autorisé à supprimer cet utilisateur")
    }

    if (!user) {
      throw new NotFoundError(
        "Cet utilisateur est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
      );
    }

    await user.setRoles([], { transaction });
    await user.destroy({ transaction });

    await transaction.commit();

    return true;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

exports.loginUser = async (email, password, ipAddress) => {
  try {
    const maxFailedLoginAttempts = 7;

    // Recherche de l'utilisateur par email
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError(
        "Données incorrectes! Veuillez vérifier votre email ou votre mot de passe !"
      );
    }

    // Vérification si le compte est validé
    if (!user.isAccountValidated) {
      throw new AccountNotValidatedError(
        `Votre compte n'a pas encore été validé! Veuillez cliquer sur le lien de validation transmis par mail à ${user.email}.`
      );
    }

    const resetUserPassword = await models.UserTokenPasswordReset.findOne({
      where: {
        userId: user.id,
      },
    });

    if(resetUserPassword){
      throw new CustomError("Vous ne pouvez vous connecter car une demande de changement de mot de passe est déjà en cours. Veuillez vérifier votre email pour le lien de réinitialisation de ce dernier.",403)
    }

    // Recherche des tentatives de connexion par adresse IP et utilisateur
    let attempts = await models.LoginAttempt.findOne({
      where: {
        ipAddress,
        userId: user.id, // Lier la tentative à la fois à l'utilisateur et à l'IP
      },
    });

    // Gestion du blocage si des tentatives existent pour cet utilisateur
    if (attempts) {
      if (!user.canAuthenticate) {
        const isBlockDurationPassed = Date.now() > attempts.blockUntil;

        // Si la période de blocage est écoulée
        if (isBlockDurationPassed) {
          user.canAuthenticate = true; // Débloquer l'utilisateur
          await user.save();
          await attempts.destroy(); // Supprimer les tentatives après succès
        } else {
          // Si le blocage est encore actif, incrémenter les tentatives et prolonger le blocage
          attempts.attempts += 1;
          attempts.blockDurationMultiplier += 1;

          const newBlockUntil =
            Date.now() +
            1000 * 60 * defaultBlockingTime * attempts.blockDurationMultiplier;
          attempts.blockUntil = newBlockUntil;

          await attempts.save();

          throw new TooManyAttemptsError(
            `Compte temporairement bloqué. Veuillez réessayer dans ${getRemainingTime(
              newBlockUntil
            )}.`
          );
        }
      }
    }

    // Validation du mot de passe
    const isValid = isPasswordValid(password, user.password, user.salt);

    if (!isValid) {
      // Si aucune tentative n'existe pour cette IP et cet utilisateur, en créer une
      if (!attempts) {
        attempts = await models.LoginAttempt.create({
          userId: user.id,
          ipAddress,
          attempts: 1,
          blockDurationMultiplier: 1,
        });
      } else {
        // Incrémente les tentatives
        attempts.attempts += 1;
      }

      // Si le nombre maximum de tentatives est atteint
      if (attempts.attempts >= maxFailedLoginAttempts) {
        user.canAuthenticate = false;
        const newBlockUntil =
          Date.now() +
          1000 * 60 * defaultBlockingTime * attempts.blockDurationMultiplier;
        attempts.blockUntil = newBlockUntil;
        attempts.blockDurationMultiplier += 1;

        await user.save();
        await attempts.save();

        throw new TooManyAttemptsError(
          `Compte temporairement bloqué à la suite de nombreuses tentatives échouées. Veuillez essayer de nouveau dans ${getRemainingTime(
            newBlockUntil
          )}.`
        );
      }

      await attempts.save();
      throw new InvalidCredentialsError(
        `Paramètres de connexion erronés. Il vous reste ${
          maxFailedLoginAttempts - attempts.attempts
        } tentatives.`
      );
    }

    user.canAuthenticate = true;

    await user.save();


    // Si la connexion réussit et qu'il y avait des tentatives échouées
    if (attempts) {
      await attempts.destroy(); // Supprimer les tentatives après connexion réussie
    }

    // Génération du token JWT
    const token = generateToken(user.id, "3d"); // Le token expire dans 3 jours

    return token;
  } catch (e) {
    throw e;
  }
};

exports.validateUserEmailAccount = async (authHeader) => {
  try {
    if (!authHeader) {
      throw new CustomError(
        "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail de vérification que vous avez reçu et veuillez à ne pas modifier l'url de la page sur laquelle vous attérisez!",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new CustomError(
        "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
        401
      );
    }

    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");

    // The verifying public key
    const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

    await jwt.verify(token, PUB_KEY, async (err, decoded) => {
      if (err) {

        if (err.name === "TokenExpiredError") {
          const decoded = jwt.decode(token);
          const userId = decoded.sub;

          try {
            const user = await models.User.findByPk(userId, {
              include: [
                {
                  model: models.Subscriber,
                  attributes: ['firstname']
                }
              ]
            });

            if (user.isEmailConfirmed) {
              const firstname = user.Subscriber?.firstname;

              throw new CustomError(
                `Nous sommes content de vous revoir ${firstname}, votre compte avait déjà été validé !`,
                200
              );
            }

            throw new CustomError(
              "Le lien de vérification n'est plus fonctionnel. Veuillez en demander un autre en cliquant sur le boutton ci-dessous et un nouveau mail de validation vous sera envoyé à l'adresse mail associé à votre compte. Une fois que vous aurez reçu ce nouveau mail, vous aurez environ 30 minutes pour valider votre compte. Veuillez donc à bien effectuer l'opération de validation à nouveau dès que possible !",
              401
            );
          } catch (error) {
            throw error;
          }
        } else {
          throw new CustomError(
            "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
            401
          );
        }
      }

      const userId = decoded.sub;
      const user = await models.User.findByPk(userId, {
        include: [
          {
            model: models.Subscriber,
            attributes: ['firstname']
          }
        ]
      });
      
      if (user.isEmailConfirmed === true) {
        throw new CustomError(
          `Nous sommes content de vous revoir ${user.Subscriber?.firstname}, votre compte a déjà été validé ! Vous pouvez vous connecter`,
          200
        );
      }

      user.isEmailConfirmed = true;
      user.save({ id: userId });
    });
  } catch (error) {
    throw error;
  }
};

exports.askVerificationEmail = async (authHeader) => {
  try {
    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");

    // The verifying public key
    const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

    if (!authHeader) {
      throw new CustomError(
        "Il semble y avoir une erreur! Veuillez contacter le web master!",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new CustomError(
        "Il semble y avoir une erreur! Veuillez contacter le web master!",
        401
      );
    }

    await jwt.verify(token, PUB_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          const decoded = jwt.decode(token);
          const userId = decoded.sub;
          const user = await models.User.findByPk(userId, {
            include: [
              {
                model: models.Subscriber,
                attributes: ['firstname']
              }
            ]
          });

          if (!user) {
            throw new CustomError(
              "Il semble y avoir une erreur! Veuillez contacter le web master!",
              401
            );
          }

          const expiresIn = "30m";
          const newToken = await generateToken(user.id, expiresIn);
          const firstname = user.Subscriber?.firstname;

          await sendVerificationEmail(firstname, user.email, newToken);
        } else {
          throw new CustomError(
            "Il semble y avoir une erreur! Veuillez contacter le web master!",
            401
          );
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.initPasswordReset = async (email) => {
  try {
    const user = await models.User.findOne({where:{ email }});

    if (!user) {
      throw new NotFoundError(
        "Nous ne trouvons aucun compte lié à cette adresse mail. Vérifiez-la et essayez de nouveau."
      );
    }

    let token;

    const previousUserToken = await models.UserTokenPasswordReset.findOne({
      where: {
        userId: user.id,
      },
    });

    if (previousUserToken) {
      const userToken = previousUserToken.token;
      const payload = verifyToken(userToken);

      if (payload) {
        token = userToken;
      } else {
        await previousUserToken.destroy();
      }
    }

    if (!token) {
      const expiresIn = "1d";
      token = await generateToken(user.id, expiresIn);
      const newUserToken = new models.UserTokenPasswordReset({
        userId: user.id,
        token: token,
      });

      await newUserToken.save();
    }

    //In order to not allow user to log with his previous password, we change the salt.
    //Even if he try, the salt have change so it's impossible to verify the password

    const newSalt = crypto.randomBytes(32).toString("hex");

    user.salt = newSalt;
    await user.save();

    const fullname = user.getFullName();

    await sendInitChangePasswordEmail(fullname, email, token);
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (authHeader, password) => {

  try {
    if (!authHeader) {
      throw new CustomError(
        "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
        401
      );
    }

    const resetPasswordToken = authHeader.split(" ")[1];

    if (!resetPasswordToken) {
      throw new CustomError(
        "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
        401
      );
    }

    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");

    // The verifying public key
    const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

    await jwt.verify(resetPasswordToken, PUB_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          
          throw new CustomError(
            "Le lien de re-initialisation n'est plus fonctionnel. Veuillez en demander un autre en cliquant sur le boutton ci-dessous et un nouveau mail vous sera envoyé à l'adresse mail associé à votre compte. Une fois que vous aurez reçu ce nouveau mail, vous aurez environ 1h heure pour changer votre mot de passe.",
            401
          );
        } else {
          throw new CustomError(
            "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de re-initialisation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
            401
          );
        }
      }

      const userId = decoded.sub;
      const user = await models.User.findByPk(userId);

      if (!user) {
        throw new NotFoundError(
          "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de re-initialisation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
        );
      }

      const previousUserToken = await models.UserTokenPasswordReset.findOne({where:{userId}});

      
      if(!previousUserToken){
        throw new CustomError(
          "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de re-initialisation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
          401
        );
      }

      await previousUserToken.destroy();

      const saltHash = generateHashedPasswordAndSalt(password);

      user.password = saltHash.hash;
      user.salt = saltHash.salt

      await user.save();

      const fullName = user.getFullName(); 
      
      await sendSuccessPasswordChangedEmail(fullName, user.email)
    });
  } catch (error) {
    throw error
  }
}

exports.validateSubscringRequest = async (subscriberId) => {
  try { 
    const user = await models.User.findOne({
      where:{
        subscriberId: subscriberId
      },
      attributes: ["id", "isEmailConfirmed", "isAccountValidated"],
      include: [
        {
          model: models.Subscriber,
          attributes : ["firstname", "lastname"]
        }
      ]
    })

    if(!user){
      throw new NotFoundError("Il semble y avoir une erreur, l'adhérent que vous essayer de valider est inconnu. Veuillez re-essayer et si le problème persiste veuiller contacter le webmaster")
    }

    if(!user.isEmailConfirmed){
      throw new CustomError("Attention, vous ne pouvez pas activer le compte de quelqu'un qui n'a pas encore vérifié son adresse mail !")
    }

    user.isAccountValidated = true;
    user.canAuthenticate = true;

    user.save();
    
    const name = user.Subscriber?.lastname +" "+ user.Subscriber?.firstname

    return name

  } catch (error) {
    throw error
  }
}
