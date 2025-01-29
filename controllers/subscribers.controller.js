const subscriberService = require("../services/subscriber.services");
const userService = require("../services/user.services");
const roleService = require("../services/role.services");
const groupService = require("../services/group.services");
const guestService = require("../services/guest.services");
const subscriberServices = require("../services/subscriber.services");

const { sequelize } = require("../models");
const { generateToken } = require("../utils/jwt.utils");
const {
  sendEmailVerificationMailRequest,
  sendGroupAssignmentMailResponse,
  sendGuestInvitationMailRequest,
  sendAccountValidationMailResponse,
  sendGroupValidationMailResponse,
} = require("../services/mail.services");

const { models } = require("../models");


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
    next(error);
  }
};

exports.getSubscriberById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const subscriber = await subscriberService.getSubscriberById(id);

    return res.status(200).json({
      status: "success",
      data: subscriber,
      message: "Utilisateur trouvé!",
    });
  } catch (error) {
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
    next(error);
  }
};

exports.assignSubscriberToGroup = async (req, res, next) => {
  try {
    const { subscriberId, groupId } = req.params;

    const response = await subscriberService.assignSubscriberToGroup(
      subscriberId,
      groupId
    );

    if (response) {
      await sendGroupAssignmentMailResponse(response);
    }

    return res.status(201).json({
      status: "success",
      data: null,
      message: `${response.subscriberName} a été affecté au groupe ${response.groupName}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.validateSubscriber = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {

    const subscriberId = req.params.id;

    const subscriber = await subscriberService.getSubscriberById(subscriberId);
    const subscriberFullName = subscriber.firstname + " " + subscriber.lastname;

    await userService.checkIfAccountIsAlreadyValidated(subscriber.isAccountValidated);
    await userService.checkIfEmailIsConfirmed(subscriber.isEmailConfirmed);

    const group = await groupService.validateGroupIfExistBySubscriberId(subscriberId, transaction);

    if (group.isGroupRepresentative === true) {
      //Affected group to subscriber in case of group owner
      await models.Subscriber.update(
        { groupId: group.groupId },
        { where: { id: subscriberId } },
        {transaction}
      );

      const mailGroupValidationObject = {
        groupName: group.groupName,
        groupCreatorName: subscriberFullName,
        creatorEmail: subscriber.email,
      };

      await sendGroupValidationMailResponse(mailGroupValidationObject);
    }

    await userService.validateUser(subscriberId, transaction);

    const mailValidationObject = {
      username: subscriberFullName,
      email: subscriber.email,
    };

    await sendAccountValidationMailResponse(mailValidationObject);

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Le compte de ${subscriberFullName} a bien été validé !`,
    });
  } catch (error) {
    next(error);
  }
};
