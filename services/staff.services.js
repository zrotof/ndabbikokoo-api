const { models, sequelize } = require("../models");
const { tokenLifeTimeOnStaffCreationRequest } = require("../config/dot-env");

const {
  generateHashedPasswordAndSalt,
  isPasswordValid,
} = require("../helpers/password.helpers");

const { generateToken } = require("../utils/jwt.utils");
const { NotFoundError } = require("../utils/errors");

class StaffService {
  async getStaffs() {
    try {
      const staffMembers = await models.Staff.findAll({
        attributes: ["id", "email"],
        include: [
          {
            model: models.Role,
            as: "roles",
            attributes: ["id", "name", "code"],
            through: { attributes: [] },
          },
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: [
              "id",
              "firstname",
              "lastname",
              "sex",
              "town",
              "country",
            ],
          },
        ],
      });

      return staffMembers;
    } catch (error) {
      throw error;
    }
  }

  async getStaffByEmail(email) {
    try {
      const staffMember = await models.Staff.findOne({
        where: { email },
        attributes: { exclude: ["staffId"] },
      });
      return staffMember;
    } catch (error) {
      throw error;
    }
  }

  async getStaffById(id) {
    try {

      const staffMember = await models.Staff.findByPk(Number(id),
        {
          attributes: ["id", "email"],
          include : [
            {
              model: models.Subscriber,
              as: 'subscriber',
              attributes: ["firstname"]
            }
          ]
        }
      );
      
      if(!staffMember){
        const message = "Membre de staff inconnu";
        throw new NotFoundError(message);
      }

      return staffMember;
    } catch (error) {
      throw error;
    }
  }

  async getStaffWithRolesById(staffId) {
    try {
      const staff = await models.Staff.findByPk(staffId, {
        attributes: ["id", "email", "createdAt"],
        include: [
          {
            model: models.Role,
            as: "roles",
            through: {
              attributes: [],
            },
            attributes: ["id", "name", "code"],
          },
          {
            model: models.Subscriber,
            as: "subscriber",
            attributes: ["id", "firstname", "lastname"],
            include: [
              {
                model: models.Image,
                as: "image",
                attributes: ["url"],
              },
            ],
          },
        ],
      });

      if (!staff) {
        throw new NotFoundError(
          "Cet utilisateur est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      const { subscriber, roles, ...rest } = staff.toJSON();
      const { image, ...subscriberDetails } = subscriber;
      const { id, ...restSubscriberDetails } = subscriberDetails;

      const dataToRetrieve = {
        staff : {
          ...rest,
          ...restSubscriberDetails,
          subscriberId: id,
          image: image ? image.url : null
        },
        roles
      };

      return dataToRetrieve;
    } catch (error) {
      throw error;
    }
  }

  async createStaff(staffData, transaction) {
    try {
      const password = generateHashedPasswordAndSalt(staffData.password);

      const staffToSave = {
        subscriberId: staffData.subscriberId,
        email: staffData.email,
        password: password.hash,
        salt: password.salt,
      };

      const staff = await models.Staff.create(
        staffToSave,
        {
          returning: ["id"],
        },
        { transaction }
      );

      return staff;
    } catch (error) {
      throw error;
    }
  }

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
}

module.exports = new StaffService();
