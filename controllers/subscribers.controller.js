const ms = require('ms');
const { o2switch } = require('../config/dot-env')
const { models, sequelize } = require("../models");
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


const idRequestService = require('../services/id-request.services');
const mailServices = require('../services/mail.services');
const subscriberService = require("../services/subscriber.services");
const userService = require("../services/user.services");
const satffService = require("../services/staff.services");
const groupService = require("../services/group.services");
const idService = require("../services/id-request.services");
const beneficiaryService = require('../services/beneficiary.services');
const familyService = require('../services/family.services');
const imageService = require('../services/image.services');

const imageableTypeEnum = require('../enums/imageable-types.enum');
const userStatusEnum = require('../enums/subscriber-status.enum')

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

exports.getTotalSubscribers = async(req, res, next) => {
  try {

    const totalSubscribers = await subscriberService.getTotalSubscribers();

    return res.status(200).json({
      status: "success",
      data: totalSubscribers,
      message: `Requêtte réussie!`,
    });
  } catch (error) {
    next(error);
  }
}

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
    const subscriberId = req.params.id;

    await satffService.deleteStaffBySubscriberId(subscriberId)
    await subscriberService.deleteSubscriber(subscriberId);

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
    const user = await userService.getUserBySubscriberId(subscriberId);

    const subscriberFullName = subscriber.firstname + " " + subscriber.lastname;

    await userService.checkIfAccountIsAlreadyValidated(subscriber.isAccountValidated);
    await userService.checkIfEmailIsConfirmed(subscriber.isEmailConfirmed, 'validate');
    
    const isRequestId = await idRequestService.checkIfIdsAreAlreadySended(user.id);
    
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

    //Change the status of the subscriber to validated
    await userService.updateUser(user.id, {status: userStatusEnum.ACTIF }, null, transaction);

    //Pour supprimer la demande de pièce d'idetité de la base de donnée
    await idRequestService.deleteIdRequest(isRequestId, transaction);
    
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

    const idRequest = await idRequestService.getIdRequestByUserId(userId);
    idRequest.files = files;
    idRequest.identificationType = identificationType;

    await idRequestService.updateIdRequest(idRequest.id, {isAlreadyUsed: true});

    console.log(idRequest);
    await mailServices.sendEmailIdenticationWithAttachments(idRequest);

    return res.status(201).json({
      status: "success",
      data: null,
      message: "",
    });

  } catch (e) {
    next(e)
  }
}

exports.editBeneficiary = async (req, res, next) => {
  try {
    const { subscriberId, beneficiaryId } = req.params;
    const newData = req.body;

    await beneficiaryService.getBeneficiary(subscriberId, beneficiaryId);

    await beneficiaryService.editBeneficiaryById(beneficiaryId, newData);
    
    return res.status(201).json({
      status: "success",
      data: null,
      message: "Bénéficiaire modifié avec succès",
    });

  } catch (e) {
    next(e)
  }
}

exports.getSubscriberFamily = async (req, res, next) => {
  try {
    const { id } = req.params;

    const families = await familyService.getFamilyMembersBySubscriberId(id);

    return res.status(200).json({
      status: "success",
      data: families,
      message: "",
    });

  } catch (e) {
    next(e)
  }
}

exports.registerSubscriberFamilyMember = async (req, res, next) => {
  try {

      const { id } = req.params;

      const subscriberFamilyMemberToSave = { 
        firstname: req.body?.firstname,
        filiation: req.body?.filiation,
        lastname: req.body?.lastname,
        sex: req.body?.sex
      }

      await subscriberService.getSubscriberById(id);
  
      subscriberFamilyMemberToSave.subscriberId = id;

      const family = await familyService.registerFamily(subscriberFamilyMemberToSave);
  
      return res.status(201).json({
        status: "success",
        data: family,
        message: 'Membre de famille créé avec succès !'
      });
  
    } catch (error) {
      next(error);
    }
}

exports.editSubscriberFamilyMember= async (req, res, next) => {
  try {
    const { id, familyMemberId } = req.params;
    const newData = req.body;

    await subscriberService.getSubscriberById(id);

    await familyService.editFamilyMemberById(familyMemberId, newData);
    
    return res.status(201).json({
      status: "success",
      data: null,
      message: "Membre de famille modifié avec succès",
    });

  } catch (e) {
    next(e)
  }
}

exports.deleteSubscriberFamilyMember = async (req, res, next) => {
  try {
    const { id, familyMemberId } = req.params;

    await subscriberService.getSubscriberById(id);

    await familyService.deleteFamilyMember(id, familyMemberId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Membre de famille supprimé avec succès !",
    });

  } catch (e) {
    next(e)
  }
}

exports.editSubscriberProfile = async (req, res, next) => {
  try {
    const transaction = await sequelize.transaction();

    const { id } = req.params;

    const file = req.file;

    const { 
      email,
      country,
      town,
      phoneCode,
      phoneNumber,
      address,
      postalCode
    } = req.body;

    const subscriberData = await subscriberService.getSubscriberById(id);

    const subscriber = {};

    if (email) {
      await userService.updateUser(id,{email});
    } 

    if (phoneCode) subscriber.phoneCode = phoneCode;
    if (address) subscriber.address = address;
    if (postalCode) subscriber.postalCode = postalCode;
    if (country) subscriber.country = country;
    if (town) subscriber.town = town;
    if (phoneNumber) subscriber.phoneNumber = phoneNumber;

    if(phoneCode || address || postalCode || country || town || phoneNumber){
      await subscriberService.updateSubscriberById(id, subscriber);
    }

    if(file){
      const image = await imageService.getImageableIdAndimageableType(id, imageableTypeEnum.SUBSCRIBER);
      
      if(image){
        await imageService.deleteImage(image.id, image.publicId);
      }
      
      const folder= `subscribers/${subscriberData.registrationNumber}`;
      
      await imageService.uploadImage(
        file,
        id,
        imageableTypeEnum.SUBSCRIBER,
        folder,
        transaction
      );
    }

    return res.status(201).json({
      status: "success",
      data: null,
      message: "Profil modifié avec succès",
    });
    
  } catch (e) {
    next(e);
  }
}