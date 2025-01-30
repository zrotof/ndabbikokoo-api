const { models } = require("../models");

const { CustomError, NotFoundError } = require("../utils/errors");
const { isObjectEmpty } = require("../utils/parsing.utils");
const groupServices = require("./group.services");
const guestServices = require("./guest.services");

class Subscriber {
  async getSubscribers(queries) {
    try {
      let whereCondition = {};

      if (queries.isAccountValidated) {
        whereCondition = {
          isAccountValidated:
            queries.isAccountValidated === true ||
            queries.isAccountValidated === "true",
        };
      }

      const subscribersList = await models.Subscriber.findAll({
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
            attributes: ["email", "isEmailConfirmed","canAuthenticate"],
            where: whereCondition,
            required: true,
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
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        email: item.user?.email,
        isEmailConfirmed: item.user?.isEmailConfirmed,
        isUserCanAuthenticate: item.user?.canAuthenticate
      }));

      return subscribers;
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
        ]
      });

      if (!subscriber) {
        return NotFoundError('Cet adhérent est inconnu.');
      }
  
      // Compter le nombre total de membres dans le groupe
      const totalMembers = await this.getGroupTotalSubscribers(subscriber.groupId);

      const sub = {
        id: subscriber.id,
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
        isGroupRepresentative : subscriber.group?.representativeId === subscriber.id
      }

      return sub;
    } catch (error) {
      throw error;
    }
  }

  async getGroupTotalSubscribers(groupId) {
    try {
      const totalSubscribers = await models.Subscriber.count({
        where: { groupId }
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

      return await models.Subscriber.create(subscriberData, { transaction });
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriberById(subscriberId, newSunbscriberData, transaction) {
    try {

      const [updatedRowCount] = await models.Subscriber.update(newSunbscriberData, {
        where: { id: subscriberId }
      });

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
        throw new Error("Subscriber not found");
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
