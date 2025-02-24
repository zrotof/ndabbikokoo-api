const ms = require('ms');

const subscriberService = require("../services/subscriber.services");
const userService = require("../services/user.services");
const roleService = require("../services/role.services");
const groupService = require("../services/group.services");
const guestService = require("../services/guest.services");
const subscriberServices = require("../services/subscriber.services");
const idService = require("../services/id-request.services");
const { sequelize } = require("../models");
const { generateToken } = require("../utils/jwt.utils");
const { tokenLifeTimeOnIdRequest } = require('../config/dot-env');

const {
  sendEmailVerificationMailRequest,
  sendGroupAssignmentMailResponse,
  sendGuestInvitationMailRequest,
  sendAccountValidationMailResponse,
  sendGroupValidationMailResponse,
  sendEmailIdRequest,
  sendEmailIdenticationWithAttachments
} = require("../services/mail.services");

const { models } = require("../models");
const idRequestServices = require('../services/id-request.services');
const mailServices = require('../services/mail.services');


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

exports.editSubscriberById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { newSubscriberData } = req.body;

    await subscriberService.updateSubscriberById(id, newSubscriberData);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Utilisateur modifié avec succès !",
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
    await userService.checkIfEmailIsConfirmed(subscriber.isEmailConfirmed, 'validate');

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

exports.idRequest = async (req, res, next) => {
  try {
    const subscriberId = req.params.id;

    const user = await userService.getUserBySubscriberId(subscriberId);

    await userService.checkIfEmailIsConfirmed(user.isEmailConfirmed, 'id request');

    const token = await generateToken(user.id, tokenLifeTimeOnIdRequest);

    const expiresInMs = ms(tokenLifeTimeOnIdRequest); 
    const expiresAt = new Date();
    expiresAt.setMilliseconds(expiresAt.getMilliseconds() + expiresInMs);

    const idRequestData = {
      userId: user.id,
      token,
      expires_at: expiresAt
    }

    await idService.createIdRequest(idRequestData);
    
    const subscriberFullName = user.firstname + " " + user.lastname;

    await sendEmailIdRequest(subscriberFullName, token, user.email);

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Un mail de demande de pièce d'identité a bien été envoyé à ${subscriberFullName}.`,
    });
  } catch (error) {
    next(error)
  }
}

exports.identification = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {token, identificationType} = req.body;
    const files = req.files;

    const idRequest = await idRequestServices.getIdRequestByUserId(userId);
    idRequest.files = files;
    idRequest.identificationType = identificationType;

    await mailServices.sendEmailIdenticationWithAttachments(idRequest);

    await idRequestServices.deleteIdRequest(idRequest.id);

    return res.status(201).json({
      status: "success",
      data: null,
      message: "",
    });

  } catch (e) {
    next(e)
  }
}
