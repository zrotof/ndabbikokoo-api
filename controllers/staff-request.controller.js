const { sequelize } = require("../models");
const { CustomError } = require("../utils/errors")

const staffService = require("../services/staff.services");
const staffRequestService = require('../services/staff-request.services');
const subscriberService = require("../services/subscriber.services");
const mailService = require("../services/mail.services");

exports.getStaffRequests = async (req, res, next) => {
  try {

    const staffRequests = await staffRequestService.getRequests(); 

    return res.status(200).json({
      status: "success",
      data: staffRequests,
      message: `Liste des membres de staff qui n'ont pasencore validé leur compte !`,
    });
  } catch (error) {
    next(error);
  }
};

exports.createStaffRequest = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {

    const { subscriberId, email, rolesId } = req.body;
    
    const staff = await staffService.getStaffByEmail(email);

    if(staff) {
      const message = "Un membre du staff associé à cette addresse mail existe déjà!";
      throw new CustomError(message, 409);
    }

    const staffRequest = await staffRequestService.getStaffRequestById(subscriberId);
    
    if(staffRequest) {
      const message = "Une demande d'invitation est déjà en attente pour cet utilisateur!";
      throw new CustomError(message, 409);
    }
    
    const subscriber = await subscriberService.getSubscriberById(subscriberId);

    const staffDataToSave = {
      subscriberId,
      firstname: subscriber.firstname,
      email,
      rolesId
    }

    await staffRequestService.createStaffRequest(staffDataToSave, transaction);

    return res.status(201).json({
      status: "success",
      data: null,
      message: `L'invitation à devenir membre du staff de Ndab Bikokoo a bien été envoyé avec ${subscriber.firstname}`
    });
  } catch (e) {
    next(e);
  }
};