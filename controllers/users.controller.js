const groupServices = require("../services/group.services");
const {
  getUsersWithRoles,
  getUserWithRolesById,
  createUserWithRoles,
  updateUser,
  deleteUser,
  validateUserEmailAccount,
  loginUser,
  askVerificationEmail,
  initPasswordReset,
  resetPassword,
  validateSubscriber
} = require("../services/user.services");

const { sendSucceedEmailVerificationMailResponse } = require('../services/mail.services')

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsersWithRoles();

    return res.status(201).json({
      status: "success",
      data: users,
      message: "Liste d'utilisateurs retournée",
    });
  } catch (e) {
    next(e);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserWithRolesById(userId);

    return res.status(201).json({
      status: "success",
      data: user,
      message: "Utilisateur trouvé",
    });
  } catch (e) {
    next(e);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, roles } = req.body;

    const userToSave = { firstname, lastname, email, password };

    await createUserWithRoles(userToSave, roles);

    return res.status(201).json({
      status: "success",
      data: "",
      message:
        "L'utilisateur a été créé avec succès ! Pour valider votre compte, veuillez accéder au mail qui vous a été envoyé par l'adresse mail que vous avez renseigné.",
    });
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const { userData, roleNames } = req.body;

    await updateUser(userId, userData, roleNames);

    return res.status(201).json({
      status: "success",
      data: null,
      message: "Utilisateur modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await deleteUser(userId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Utilisateur supprimé avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.retrieveConnectedUser = async (req, res, next) => {
    try {
        const userId = req.user

        const user = await getUserWithRolesById(userId);

        return res.status(201).json({
          status: "success",
          data: user,
          message: "Utilisateur trouvé",
        });
    
    } catch (e) {
        next(e)
    }
}

exports.loginUser = async (req, res, next) => {
  try {

    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
    const { email, password } = req.body;

    const token = await loginUser(email,password,ipAddress);

    return res.status(200).json(
      {
        status : "success",
        data : token,
        message : "Connexion réussie !"
      }
    )

  } catch (e) {
    next(e)
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const response = await validateUserEmailAccount(authHeader);

    console.log(response);
    
    await sendSucceedEmailVerificationMailResponse(response.name, response.email);
    
    return res.status(201).json({
      status: "success",
      data: "",
      message:
        "Votre compte vient d'être validé, vous pouvez désormais vous connecter !",
    });
  } catch (e) {
    next(e);
  }
};

exports.askEmailVerification = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    await askVerificationEmail(authHeader);

    return res.status(200).json({
      status: "success",
      data: "",
      message:
        "Un nouveau mail de validation a été envoyé à l'adresse mail que vous avez renseigné lors de la création de votre compte ! Ne l'oubliez pas aurez environ 30 minutes pour valider votre compte. Veuillez donc à bien effectuer l'opération de validation cette fois ci !",
    });
  } catch (e) {
    next(e);
  }
};

exports.initPasswordReset = async (req, res, next) => {
    try{
        const { email } = req.body;

        await initPasswordReset(email);

        return res.status(201).json(
            {
                status : "success",
                data : null,
                message : "Un email vous permettant de changer votre mot de passe a été envoyé à l'adresse mail renseignée."
            }
        )
    }
    catch(e) {
        next(e)
    }
}

exports.resetPassword = async (req, res, next) =>{

    try{
      const authHeader = req.headers["authorization"];

        const { password } = req.body

        await resetPassword(authHeader, password);

        return res.status(201).json(
            {
                status : "success",
                data : null,
                message : "Mot de passe changé avec succès !"
            }
        )

    }
    catch(e){
        next(e)
    }
}
