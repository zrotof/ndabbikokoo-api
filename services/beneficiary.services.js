const { models, sequelize } = require("../models");

const {
  NotFoundError,
  CustomError,
} = require("../utils/errors");


class BeneficiaryService {
  
  async getBeneficiaryBySubscriberId (id) {
    try {
  
      const beneficiary = await models.Beneficiary.findOne({ where: { subscriberId: id } });
  
      if (!beneficiary) {
        throw new NotFoundError(
          "Nous rencontrons un problème. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }
  
      return beneficiary;
  
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new BeneficiaryService();
