const subscriberService = require("../services/subscriber.services");
const userService = require("../services/user.services");
const roleService = require("../services/role.services");

const { sequelize } = require("../models");
const { generateToken } = require("../utils/jwt.utils");
const { sendVerificationEmail } = require("../services/mail.services");

exports.getSubscribers = async (req, res, next) => {
    try {

        const queries = req.query;

        const subscribers = await subscriberService.getSubscribers(queries);

        return res.status(200).json({
            status: "success",
            data: subscribers,
            message: `Liste des utilisateurs trouvée!`,
          });
    } catch (error) {
        next(error)
    }
}

exports.createSubscriber = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscriberData, userData, rolesId } = req.body;

    //Save subscriber data
    const subscriber = await subscriberService.createSubscriber(
      subscriberData,
      userData.email,
      transaction
    );

    //Save user data
    const userToSave = {
      ...userData,
      subscriberId: subscriber.id,
    };

    const user = await userService.createUser(userToSave, transaction);

    //Assign roles to user
    await roleService.assignRolesToSubscriber(subscriber.id, rolesId, transaction);

    //create token and send mail to subscriber
    const expiresIn = "60m";
    const token = await generateToken(user.id, expiresIn);
    const name = subscriber.getFullName();

    await sendVerificationEmail(name, user.email, token);

    await transaction.commit();

    const response = {
        firstname : subscriber.firstname,
        sex: subscriber.sex,
        email: user.email
    }

    return res.status(201).json({
      status: "success",
      data: response,
      message: `Compte créé avec succès  !`,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteSubscriber = async (req, res, next) => {
    try {
        const clientId = req.params.id;

        await subscriberService.deleteSubscriber(clientId);

        return res.status(200).json({
          status: "success",
          data: null,
          message: "Adhérent supprimé avec succès !",
        });
    
    } catch (error) {
        next(error)
    }
}