const { models } = require("../models");
const { Op } = require("sequelize");

const { CustomError, NotFoundError } = require("../utils/errors");
const { isObjectEmpty } = require("../utils/parsing.utils");
const groupServices = require("./group.services");
const guestServices = require("./guest.services");
const {
  generateRegistrationNumber,
} = require("../utils/generate-registration-number");

const { supraAdminEmail } = require("../config/dot-env");
class Subscriber {
  async getSubscribers(queries) {
    try {
      let whereCondition = {};
      let userWhereCondition = {};

      if (queries.searchTerm) {
        let searchValue = `%${queries.searchTerm}%`;
    
        whereCondition[Op.or] = [
          { firstname: { [Op.iLike]: searchValue } },
          { lastname: { [Op.iLike]: searchValue } },
          { subscriberRegistrationNumber: { [Op.iLike]: searchValue } },
          { country: { [Op.iLike]: searchValue } },
          { town: { [Op.iLike]: searchValue } },
          { phoneNumber: { [Op.iLike]: searchValue } },
        ];

        userWhereCondition[Op.or] = [
          { email: { [Op.iLike]: searchValue } },
        ];
      }

      if (queries.isAccountValidated) {
        userWhereCondition.isAccountValidated =
          queries.isAccountValidated === "true" ? true : false;
      }

      userWhereCondition[Op.and] = [
        {
          '$user.email$': { [Op.ne]: supraAdminEmail },
        }
      ];

      let limit = queries.limit ? parseInt(queries.limit) : 10;
      let offset = queries.offset ? parseInt(queries.offset) : 0;

      const subscribersList = await models.Subscriber.findAll({
        where: whereCondition,
        attributes: {
          exclude: [
            "areStatusInternalRegulationsAndMembershipAgreementAccepted",
            "areRgpdConsentAccepted",
          ],
        },
        include: [
          {
            model: models.User,
            as: "user",
            attributes: [
              "email",
              "status",
              "isEmailConfirmed",
              "canAuthenticate",
            ],
            ...(Object.keys(userWhereCondition).length > 0 && {
              where: userWhereCondition,
            }),
          },
          {
            model: models.Group,
            as: "group",
            attributes: ["id", "name"],
          },
        ],
      });

      const subscribers = subscribersList.map((item) => ({
        id: item.id,
        subscriberRegistrationNumber: item.subscriberRegistrationNumber,
        firstname: item.firstname,
        lastname: item.lastname,
        marriedName: item.marriedName,
        sex: item.sex,
        groupId: item.groupId,
        groupName: item?.group?.name,
        address: item.address,
        postalCode: item.postalCode,
        country: item.country,
        town: item.town,
        phoneNumber: item.phoneNumber,
        phoneCode: item.phoneCode,
        is_contribution_up_to_date: item.is_contribution_up_to_date,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        email: item.user?.email,
        status: item.user?.status,
        isEmailConfirmed: item.user?.isEmailConfirmed,
        isUserCanAuthenticate: item.user?.canAuthenticate,
      }));

      return subscribers;
    } catch (error) {
      throw error;
    }
  }

  async getTotalSubscribers() {
    try {
      return await models.Subscriber.count();
    } catch (error) {
      throw error;
    }
  }

  async getSubscriberById(subscriberId) {
    try {
      const subscriber = await models.Subscriber.findByPk(subscriberId, {
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["email", "isEmailConfirmed", "isAccountValidated"],
          },
          {
            model: models.Group,
            as: "group",
            attributes: ["id", "name", "representativeId"],
          },
          {
            model: models.Image,
            as: "image",
            attributes: ["url"],
          },
        ],
      });

      if (!subscriber) {
        return new NotFoundError("Cet adhérent est inconnu.");
      }

      // Compter le nombre total de membres dans le groupe
      const totalMembers = await this.getGroupTotalSubscribers(
        subscriber.groupId
      );

      const sub = {
        id: subscriber.id,
        registrationNumber: subscriber.subscriberRegistrationNumber,
        firstname: subscriber.firstname,
        lastname: subscriber.lastname,
        sex: subscriber.sex,
        address: subscriber.address,
        postalCode: subscriber.postalCode,
        createdAt: subscriber.createdAt,
        phoneCode: subscriber.phoneCode,
        phoneNumber: subscriber.phoneNumber,
        country: subscriber.country,
        town: subscriber.town,
        marriedName: subscriber.marriedName,
        email: subscriber.user.email,
        isEmailConfirmed: subscriber.user.isEmailConfirmed,
        isAccountValidated: subscriber.user.isAccountValidated,
        groupId: subscriber.group?.id,
        groupName: subscriber.group?.name,
        groupTotalNumber: totalMembers,
        isGroupRepresentative:
          subscriber.group?.representativeId === subscriber.id,
      };

      if(subscriber.image){
        sub.image = subscriber.image.url
      }

      return sub;
    } catch (error) {
      throw error;
    }
  }

  async getGroupTotalSubscribers(groupId) {
    try {
      const totalSubscribers = await models.Subscriber.count({
        where: { groupId },
      });

      return totalSubscribers;
    } catch (error) {
      throw error;
    }
  }

  async createSubscriber(subscriberData, subscriberEmail, transaction) {
    try {
      const isUserExist = await models.User.findOne({
        where: { email: subscriberEmail },
      });

      if (isUserExist) {
        const message =
          "Un utilisateur associé à cet adresse email existe déjà!";
        throw new CustomError(message, 409);
      }

      let uniqueRegistrationNumber;
      let isUnique = false;

      // Ensure unique matricule by checking database
      while (!isUnique) {
        const registrationNumber = generateRegistrationNumber(7);
        const existingGroup = await models.Subscriber.findOne({
          where: { subscriberRegistrationNumber: registrationNumber },
        });

        if (!existingGroup) {
          uniqueRegistrationNumber = registrationNumber;
          isUnique = true;
        }
      }

      const subscriberDataToSave = {
        ...subscriberData,
        subscriberRegistrationNumber: uniqueRegistrationNumber,
      };

      return await models.Subscriber.create(subscriberDataToSave, {
        transaction,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriberById(subscriberId, newSunbscriberData, transaction) {
    try {
      const [updatedRowCount] = await models.Subscriber.update(
        newSunbscriberData,
        {
          where: { id: subscriberId },
        }
      );

      if (updatedRowCount === 0) {
        throw new NotFoundError(
          "L'adhérent que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubscriber(subscriberId) {
    try {
      
      const subscriber = await models.Subscriber.findByPk(subscriberId);

      if (!subscriber) {
        throw new NotFoundError(
          "Cet adhérent est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      await subscriber.destroy();
    } catch (error) {
      throw error;
    }
  }

  async assignSubscriberToGroup(subscriberId, groupId) {
    try {
      const subscriber = await models.Subscriber.findByPk(subscriberId, {
        include: {
          model: models.User,
          as: "user",
          attributes: ["email"],
        },
      });

      if (!subscriber) {
        throw new NotFoundError("Subscriber not found");
      }

      const group = await models.Group.findByPk(groupId);

      if (!group) {
        throw new Error("Group not found");
      }

      subscriber.groupId = groupId;
      await subscriber.save();

      const response = {
        subscriberName: subscriber.getFullName(),
        groupName: group.name,
        subscriberEmail: subscriber.user.email,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Subscriber();
