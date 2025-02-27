const { where } = require("sequelize");
const { models } = require("../models/index");
const { NotFoundError, CustomError } = require("../utils/errors");

class IdRequestService {
  async getIdRequestByUserId(userId) {
    try {
      const idRequest = await models.IdRequest.findOne({
        where: { userId },
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["email"],
            include: [
              {
                model: models.Subscriber,
                as: "subscriber",
                attributes: [
                  "firstname",
                  "lastname",
                  "subscriberRegistrationNumber"
                ]
              }
            ],
          },
        ],
      });

      if (!idRequest) {
        throw new NotFoundError("Il se posse un problème !");
      }

      const cleanRequest = idRequest.get({ plain: true });

      const formattedIdRequest = {
        email: cleanRequest.user.email,
        firstname: cleanRequest.user.subscriber.firstname,
        lastname: cleanRequest.user.subscriber.lastname,
        subscriberRegistrationNumber:
        cleanRequest.user.subscriber.subscriberRegistrationNumber,
      };

      return formattedIdRequest;
    } catch (e) {
      throw e;
    }
  }

  async createIdRequest(reqData) {
    try {
      const idRequest = await models.IdRequest.create(reqData);

      if (!idRequest) {
        throw new CustomError("Erreur lors de la requêtte d'envois");
      }

      return idRequest;
    } catch (e) {
      throw e;
    }
  }

  async createIdRequest(reqData) {
    try {
      const idRequest = await models.IdRequest.create(reqData);

      if (!idRequest) {
        throw new CustomError("Erreur lors de la requêtte d'envois");
      }

      return idRequest;
    } catch (e) {
      throw e;
    }
  }

  async deleteIdRequest(id) {
    try {
      const idRequest = await models.IdRequest.destroy({
        where: {id}
        }
      );

      if (idRequest === 0) {
        throw new NotFoundError(
          "L'IdRequest a une erreur"
        )      
      }

      return true;

    } catch (e) {
      throw e;
    }
  }
}

module.exports = new IdRequestService();
