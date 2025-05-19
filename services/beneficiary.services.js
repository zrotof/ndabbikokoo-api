const { models, sequelize } = require("../models");

const {
  NotFoundError,
  CustomError
} = require("../utils/errors");
const { deleteRole } = require("./role.services");


class BeneficiaryService {
  
  async getBeneficiariesBySubscriberId (id) {
    try {
  
      const beneficiaries = await models.Beneficiary.findAll({ where: { subscriberId: id } });
  
      if (!beneficiaries) {
        throw new CustomError(
          "Vous n'avez pas encore déclaré de bénéficiaire."
        )
      }
  
      return beneficiaries;
  
    } catch (e) {
      throw e;
    }
  }

  async getBeneficiary(subscriberId, beneficiaryId ) {
    try {
  
      const beneficiary = await models.Beneficiary.findOne(
        { 
          where: { 
            id: beneficiaryId,
            subscriberId
          } 
        });
  
      if (!beneficiary) {
        throw new CustomError(
          "Bénéfciaire non trouvé."
        )
      }
  
      return beneficiary;
  
    } catch (e) {
      throw e;
    }
  }

  async registerBeneficiary (beneficiaryToSave) {
    try {
  
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

  async editBeneficiaryById(beneficiaryId, newBeneficiaryData, transaction) {
    try {

      const [updatedRowCount] = await models.Beneficiary.update(
        newBeneficiaryData,
        {
          where: { id: beneficiaryId },
        }
      );

      if (updatedRowCount === 0) {
        throw new NotFoundError(
          "Le bénéficiaire que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez Ndab Bikokoo !"
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteBeneficiaryById(beneficiaryId) {
    try {
      const deletedBenefiniary = await models.Beneficiary.destroy({
        where: { id: beneficiaryId },
      });
  
      if (deletedBenefiniary === 0) {
        throw new NotFoundError("Nous rencontrons un problème pour la suppression de ce bénéficiaire. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !");
      }
  
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BeneficiaryService();
