const { models, sequelize } = require("../models");
const { tokenLifeTimeOnStaffPasswordResetRequest, tokenLifeTimeOnStaffCreationRequest } = require("../config/dot-env");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const {
  generateHashedPasswordAndSalt,
  isPasswordValid,
} = require("../helpers/password.helpers");

const { verifyToken, generateToken } = require("../utils/jwt.utils");
const { NotFoundError } = require("../utils/errors");

const { supraAdminEmail } = require("../config/dot-env");
const groupDelegate = require("../models/group-delegate");

const {
  sendVerificationEmail,
  
   sendStaffPasswordInitilisationMailRequest,
  sendSuccessPasswordResetMailResponse,
} = require("../services/mail.services");


class StaffService {
  async getStaffs() {
    try {
      const staffMembers = await models.Staff.findAll({
        where: {
          email: { [Op.ne]: supraAdminEmail },
        },
        attributes: ["id", "email"],
        include: [
          {
            model: models.Role,
            as: "roles",
            attributes: ["id", "name", "code"],
            through: { attributes: [] },
          },
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: [
              "id",
              "firstname",
              "lastname",
              "sex",
              "town",
              "country",
            ],
          },
        ],
      });

      return staffMembers;
    } catch (error) {
      throw error;
    }
  }

  async getStaffByEmail(email) {
    try {
      const staffMember = await models.Staff.findOne({
        where: { email },
        attributes: { exclude: ["staffId"] },
      });
      return staffMember;
    } catch (error) {
      throw error;
    }
  }

  async getStaffById(id) {
    try {
      const staffMember = await models.Staff.findByPk(Number(id), {
        attributes: ["id", "email"],
        include: [
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: ["firstname"],
          },
        ],
      });

      if (!staffMember) {
        const message = "Membre de staff inconnu";
        throw new NotFoundError(message);
      }

      return staffMember;
    } catch (error) {
      throw error;
    }
  }

  async getStaffWithRolesById(staffId) {
    try {
      const staff = await models.Staff.findByPk(staffId, {
        attributes: ["id", "email", "createdAt"],
        include: [
          {
            model: models.GroupDelegate,
            as: "groupsDelegate",
          },
          {
            model: models.Role,
            as: "roles",
            through: {
              attributes: [],
            },
            attributes: ["id", "name", "code"],
          },
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: ["id", "firstname", "lastname"],
            include: [
              {
                model: models.Image,
                as: "image",
                attributes: ["url"],
              },
            ],
          },
        ],
      });

      if (!staff) {
        throw new NotFoundError(
          "Cet utilisateur est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      const { subscriber, roles, groups, ...rest } = staff.toJSON();
      const { image, ...subscriberDetails } = subscriber;
      const { id, ...restSubscriberDetails } = subscriberDetails;

      const dataToRetrieve = {
        staff: {
          ...rest,
          ...groups,
          ...restSubscriberDetails,
          subscriberId: id,
          image: image ? image.url : null,
        },
        roles,
      };

      return dataToRetrieve;
    } catch (error) {
      throw error;
    }
  }

  async createStaff(staffData, transaction) {
    try {
      const password = generateHashedPasswordAndSalt(staffData.password);

      const staffToSave = {
        subscriberId: staffData.subscriberId,
        email: staffData.email,
        password: password.hash,
        salt: password.salt,
      };

      const staff = await models.Staff.create(
        staffToSave,
        {
          returning: ["id"],
        },
        { transaction }
      );

      return staff;
    } catch (error) {
      throw error;
    }
  }

  async setRoleToStaff(staffId, roleIds, transaction) {
    try {
      const staff = await models.Staff.findByPk(staffId);

      if (!staff) {
        const message = "Membre de staff inconnu";
        throw new CustomError(message, 409);
      }

      // Vérifier si les rôles existent dans la base de données
      const roles = await models.Role.findAll({
        where: {
          id: roleIds,
        },
      });

      if (roles.length !== roleIds.length) {
        const message = "Un des rôles essayez à ce membre de staff est inconnu";
        throw new CustomError(message, 409);
      }

      await staff.setRoles(roles);
    } catch (error) {
      throw error;
    }
  }

  async initPasswordReset(email, transaction) {
    try {
      const staff = await models.Staff.findOne({
        where: { email },
        attributes: ['id'],
        include: [
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: ["firstname", "lastname"],
          },
        ],
      });

      if (!staff) {
        throw new NotFoundError(
          "Nous ne trouvons aucun compte lié à cette adresse mail. Vérifiez-la et essayez de nouveau."
        );
      }

      let token;

      const resetRequest = await models.StaffPasswordResetRequest.findOne({
        where: {
          staffId: staff.id,
        },
      });

      if (resetRequest) {
        const staffToken = resetRequest.token;
        const payload = verifyToken(staffToken);

        if (payload) {
          token = staffToken;
        } else {
          await resetRequest.destroy();
        }
      }

      if (!token) {
        const expiresIn = tokenLifeTimeOnStaffPasswordResetRequest;
        token = await generateToken(staff.id, expiresIn);
        const newStaffToken = new models.StaffPasswordResetRequest({
          staffId: staff.id,
          token: token,
        });

        await newStaffToken.save();
      }

      //In order to not allow user to log with his previous password, we change the salt.
      //Even if he try, the salt have change so it's impossible to verify the password

      const newSalt = crypto.randomBytes(32).toString("hex");

      staff.salt = newSalt;
      await staff.save();

      const fullname = staff.subscriber.getFullName();

      await sendStaffPasswordInitilisationMailRequest(fullname, email, token);
    } catch (error) {
      throw error;
    }
  }

  async resetStaffPassword (resetPasswordToken, password){
    try {
      if (!resetPasswordToken) {
        throw new CustomError(
          "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
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
  
        const staffId = decoded.sub;
        const staff = await models.Staff.findByPk(staffId, {
          attributes: ['id', 'email'],
          include: [
            {
              model: models.Subscriber,
              as: "subscriber",
              attributes: ["firstname", "lastname"],
            },
          ],
        });
  
        if (!staff) {
          throw new NotFoundError(
            "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de re-initialisation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !"
          );
        }
  
        const resetPassword = await models.StaffPasswordResetRequest.findOne({
          where: { staffId },
        });
  
        if (!resetPassword) {
          throw new CustomError(
            "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de re-initialisation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
            401
          );
        }
  
        await resetPassword.destroy();
  
        const saltHash = generateHashedPasswordAndSalt(password);
  
        staff.password = saltHash.hash;
        staff.salt = saltHash.salt;
  
        await staff.save();
  
        const fullName = staff.subscriber.getFullName();
  
        await sendSuccessPasswordResetMailResponse(fullName, staff.email);
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new StaffService();
