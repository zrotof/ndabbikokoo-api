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
        id: cleanRequest.id,
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

  async updateIdRequest(id,reqData) {
    try {
      const idRequest = await models.IdRequest.update(reqData,{
        where: {id}
      });

      if (!idRequest) {
        throw new NotFoundError(
          "Le demande pièce d'identité que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );      }

        return true;
      } catch (e) {
      throw e;
    }
  }

  async deleteIdRequest(id, transction) {
    try {
      console.log(id)
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

  async checkIfIdsAreAlreadySended(userId) {
    try {
      const idRequest = await models.IdRequest.findOne({
        where: { userId }
      });

      if (!idRequest?.isAlreadyUsed){
        throw new CustomError("L'adhérent n'a pas encore envoyé de pièce d'identité pour le moment");
      }

      return idRequest.id;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new IdRequestService();