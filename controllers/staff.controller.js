const { sequelize } = require("../models");
const { CustomError, NotFoundError } = require("../utils/errors")

const staffRequestService = require("../services/staff-request.services");
const staffService = require("../services/staff.services");
const subscriberService = require("../services/subscriber.services");
const mailServices = require("../services/mail.services");
const roleService = require("../services/role.services")
const groupStaffService = require("../services/group-staff.services");


exports.retrieveConnectedStaff = async (req, res, next) => {
  try {
      const staffId = req.user

      const staff = await staffService.getStaffWithRolesById(staffId);

      return res.status(201).json({
        status: "success",
        data: staff,
        message: "Memebre de staff trouvé",
      });
  
  } catch (e) {
      next(e)
  }
}

exports.getStaffs = async (req, res, next) => {
  try {
    const staffs = await staffService.getStaffs();

    return res.status(200).json({
      status: "success",
      data: staffs,
      message: `Liste des membres de staff trouvée!`,
    });
  } catch (error) {
    next(error);
  }
};

exports.createStaff = async (req, res, next) => {
  const transaction = await sequelize.transaction();  
  try {
    const { password, token, email } = req.body;

    const staff = await staffService.getStaffByEmail(email);
 
    if(staff) {
      const message = "Un membre du staff associé à cette addresse mail existe déjà!";
      throw new CustomError(message, 409);
    }

    const staffRequest = await staffRequestService.getStaffRequestByEmailAndToken(email, token);

    if(!staffRequest){
      const message = "Nous ne trouvons aucun compte lié. Veuillez contacter le webmaster ";
      throw new NotFoundError(message);
    }

    const staffData = {
      subscriberId: staffRequest.subscriberId,
      email,
      password
    }
    
    const staffCreated = await staffService.createStaff(staffData, transaction);

    const roleIds = staffRequest.rolesId.split('|');

    await roleService.assignRolesToStaff(staffCreated.id, roleIds, transaction);

    const subscriber = await subscriberService.getSubscriberById(staffRequest.subscriberId);
    
    await staffRequestService.deleteStaffRequestBySubscriberId(staffRequest.subscriberId, transaction);

    const mailObject = {
      emailPro: email,
      firstname: subscriber.firstname
    }

    await mailServices.sendSucceedStaffRegisteredMailResponse(mailObject);

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Votre compte a bien été créé, vous allez être redirigé sur l'interface de connexion !`,
    });
  } catch (e) {
    next(e);
  }
};

exports.assignStaffToGroup = async (req, res, next) => {
  const transaction = await sequelize.transaction();  

  try {
    const { staffId } = req.params;
    const { groupsId } = req.body;

    const staff = await staffService.getStaffById(staffId);

    const groupStaffToSave = {
      staffId,
      groupsId
    }

    const response = await groupStaffService.createGroupStaff(
      groupStaffToSave,
      transaction
    );

    if (response) {
      const mailObject = {
        firstname: staff.subscriber.firstname,
        emailPro: staff.email
      }

      await mailServices.sendSucceedGroupAffectationMailResponse(mailObject);
    }

    await transaction.commit();

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Affectation réussie !`,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
