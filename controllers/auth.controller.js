const { models, sequelize } = require("../models");
const { clientBaseUrl, clientAdminBaseUrl, environment } = require('../config/dot-env')
const { generateToken } = require("../utils/jwt.utils");

const roleService = require("../services/role.services");
const guestService = require("../services/guest.services");
const groupService = require("../services/group.services");
const userService = require("../services/user.services");
const subscriberService = require("../services/subscriber.services");
const authService = require("../services/auth.services");
const mailService = require("../services/mail.services");
const staffService = require("../services/staff.services");

exports.registerSubscriber = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {

    const {
      subscriberData,
      userData,
      groupData
    } = req.body;

    let isGroupRepresentative = false;
      
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

    if(groupData) {

      isGroupRepresentative = true;

      const groupToSave = {
        ...groupData,
        representativeId: subscriber.id,
        country: subscriber.country,
        town: subscriber.town,
        isActive: false
      };

      await groupService.createGroup(
        groupToSave,
        transaction
      );
    }

    //Assign roles to user
    await roleService.assignRolesToSubscriber(
      subscriber.id,
      isGroupRepresentative,
      transaction
    );

    //create token and send mail to subscriber
    const expiresIn = "1h";
    const token = await generateToken(user.id, expiresIn);
    const name = subscriber.getFullName();

    await mailService.sendEmailVerificationMailRequest(name, user.email, token);

    await transaction.commit();

    const response = {
      firstname: subscriber.firstname,
      sex: subscriber.sex,
      email: user.email
    };

    return res.status(201).json({
      status: "success",
      data: response,
      message: `Compte créé avec succès  !`,
    });

  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

exports.registerStaff = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscriberId, email, password, roles } = req.body;

    const staffData = {email,password};

    await subscriberService.getSubscriberById(subscriberId);

    await staffService.createStaff(staffData, transaction)

    await roleService.assignRolesToStaff();

    await transaction.commit();

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Membre du staff créé avec succès !`,
    });

  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.loginSubscriber = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const token = await authService.loginSubscriber(email,password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: environment === 'production',
      maxAge: 3600 * 1000,
      domain: +clientBaseUrl
    });

    res.status(201).json({
      status: "success",
      data: null,
      message: `login effectué avec succès !`,
    });
  } catch (e) {
    next(e)
  }
};

exports.loginStaff = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const token = await authService.loginStaff(email,password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: environment === 'production',
      maxAge: 3600 * 1000,
      domain: +clientAdminBaseUrl
    });

    res.status(201).json({
      status: "success",
      data: null,
      message: `login effectué avec succès !`,
    });
  } catch (e) {
    next(e)
  }
};

exports.isTokenValid = async (req, res, next) => {
  try {
    const {token} = req.body;

    const payload = await authService.isTokenValid(token)

    return res.status(200).json(
      {
        status : "success",
        data : payload,
        message : "Connexion réussie !"
      }
    )
  } catch (e) {
    next(e)
  }
}

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
      status: "success",
      data: null,
      message: "Déconnexion réussie"
  });

  } catch (e) {
    next(e)
  }
}

