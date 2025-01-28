const { models, sequelize } = require("../models");

const { NotFoundError, CustomError } = require("../utils/errors");


class FamilyService {
  
  async getFamilyMembersBySubscriberId(id) {
    try {
      const families = await models.Family.findAll({ where: { subscriberId: id } });
  
      if (!families) {
        throw new CustomError(
          "Il semble y avoir une erreur! Assurez-vous de bien cliquer sur le bouton de validation contenu dans le mail que vous avez reçu et veillez à ne pas modifier l'url de la page sur laquelle vous attérisez !",
          401
        );  
      }
  
      return families;
    } catch (e) {
      throw e;
    }
  }

  async registerFamily (familyToSave) {
    try {
  
      const subscriber = await models.Subscriber.findByPk(beneficiaryToSave.subscriberId);

      if (!subscriber) {
        return new NotFoundError('Cet adhérent est inconnu .');
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

module.exports = new FamilyService();
