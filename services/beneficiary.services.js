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
        throw new CustomError(
          "Vous n'avez pas encore déclaré de bénéficiaire."
        )
      }
  
      return beneficiary;
  
    } catch (e) {
      throw e;
    }
  }

  async registerBeneficiary (beneficiaryToSave) {
    try {
  
      console.log(beneficiaryToSave);

      const subscriber = await models.Subscriber.findByPk(beneficiaryToSave.subscriberId);

      if (!subscriber) {
        return new NotFoundError('Cet adhérent est inconnu.');
      }

      const beneficiary = await models.Beneficiary.create(beneficiaryToSave);
  
      if (!beneficiary) {
        throw new CustomError(
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
