const { sequelize } = require("../models");
const { environment } = require('../config/dot-env')
const { generateToken } = require("../utils/jwt.utils");

const roleService = require("../services/role.services");
const guestService = require("../services/guest.services");
const groupService = require("../services/group.services");
const userService = require("../services/user.services");
const subscriberService = require("../services/subscriber.services");
const authService = require("../services/auth.services");
const mailService = require("../services/mail.services");


exports.registerSubscriber = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {

    const {
      subscriberData,
      userData,
      groupData,
      guestsData
    } = req.body;

    let isGroupRepresentative = false;
      
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

    if(groupData) {

      isGroupRepresentative = true;

      const groupToSave = {
        ...groupData,
        representativeId: subscriber.id,
        country: subscriber.country,
        town: subscriber.town,
        isActive: false
      };

      const createdGroup = await groupService.createGroup(
        groupToSave,
        transaction
      );



      // If there are guests, save them to guest table
      if (Array.isArray(guestsData) && guestsData?.length > 0) {
        await guestService.bulkCreateGuest(createdGroup.id, guestsData, transaction);
      }
    }

    //Assign roles to user
    await roleService.assignRolesToSubscriber(
      subscriber.id,
      isGroupRepresentative,
      transaction
    );

    //create token and send mail to subscriber
    const expiresIn = "60m";
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
      maxAge: 3600 * 1000
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

