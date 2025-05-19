const { models, sequelize } = require("../models");
const { generateToken } = require('../utils/jwt.utils');
const { tokenLifeTimeOnStaffCreationRequest } = require('../config/dot-env');

const { getRoleNamesByIds } = require('../services/role.services');

const {
  generateHashedPasswordAndSalt,
  isPasswordValid,
} = require("../helpers/password.helpers");

const {
  CustomError
} = require("../utils/errors");

const { sendStaffRequestMail } = require("../services/mail.services");
const { where } = require("sequelize");

class StaffRequestService {
  async getRequests() {
    try {
      const staffRequests = await models.StaffRequest.findAll({
        attributes: ["id", "email", "createdAt"],
        include: [
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: ["firstname", "lastname", "phoneCode", "phoneNumber", "town", "country"],
            include: [
              {
                model: models.User,
                attributes: ["email"],
                as: "user",
              },
            ],
          },
        ],
      });
      return staffRequests;
    } catch (error) {
      throw error;
    }
  }

  async getStaffRequestById(subscriberId) {
    try {
      const staffRequest = await models.StaffRequest.findOne({
        where: {
          subscriberId
        }
      })

      return staffRequest;
    } catch (error) {
      throw error;
    }
  }

  async getStaffRequestByEmailAndToken(email, token) {
    try {
      const staffRequest = await models.StaffRequest.findOne({
        where: {
          email,
          token
        },
        attributes: ['id', 'subscriberId', 'rolesId']
      })

      return staffRequest;
    } catch (error) {
      throw error;
    }
  }

  async createStaffRequest(staffData, transaction) {
    try {
      const token = await generateToken(staffData.subscriberId, tokenLifeTimeOnStaffCreationRequest);
      
      const roleNames = await getRoleNamesByIds(staffData.rolesId);
      const roleStringifiedNames = roleNames.join(", ");
      
      const staffRequestDataToSendBuMail = {
        firstname : staffData.firstname,
        emailPro : staffData.email,
        token,
        roleStringifiedNames
      }

      await sendStaffRequestMail(staffRequestDataToSendBuMail);

      const concatenatedRoles = staffData.rolesId.join("|");

      const staffRequestDataToSave = {
        subscriberId : staffData.subscriberId,
        email : staffData.email,
        token : token,
        rolesId : concatenatedRoles
      }

      await models.StaffRequest.create(staffRequestDataToSave, { transaction });

      await transaction.commit();

      return true
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteStaffRequestBySubscriberId(subscriberId, transaction) {
    try {
      const subscriber = await models.Subscriber.findByPk(subscriberId);

      if (!subscriber) {
        throw new NotFoundError(
          "Erreur lors de la suppression de la requêtte d'invitation à devenir membre du staff Ndab Bikokoo   !"
        );
      }

      const staffRequest = await models.StaffRequest.findOne({
        where: {subscriberId}
      });

      await staffRequest.destroy({transaction});

      await transaction.commit();

      return true
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  /*
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
              
              */
}

module.exports = new StaffRequestService();
