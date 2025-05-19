const { models, sequelize } = require("../models");

const { NotFoundError, CustomError } = require("../utils/errors");


class FamilyService {
  
  async getFamilyMembersBySubscriberId(id) {
    try {
      const families = await models.Family.findAll({ where: { subscriberId: id } });
  
      if (!families) {
        throw new NotFoundError(
          "Aucun membre trouvé ...",
          404
        );  
      }
  
      return families;
    } catch (e) {
      throw e;
    }
  }

  async registerFamily (familyToSave) {
    try {
  
      const family = await models.Family.create(familyToSave);
  
      if (!family) {
        throw new CustomError(
          "Nous rencontrons un problème. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }
  
      return family;
  
    } catch (e) {
      throw e;
    }
  }


  async editFamilyMemberById(familyId, newFamilyData, transaction) {
    try {

      const [updatedRowCount] = await models.Family.update(
        newFamilyData,
        {
          where: { id: familyId }
        }
      );

      if (updatedRowCount === 0) {
        throw new NotFoundError(
          "Le membrede famille que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez Ndab Bikokoo !"
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteFamilyMember(subscriberId, familyMemberId) {
    try {
      const familyMember = await models.Family.findOne({ where: { id: familyMemberId, subscriberId } });
  
      if (!familyMember) {
        throw new NotFoundError(
          "Membre de famille non trouvé ...",
          404
        );
      }
  
      await familyMember.destroy();
  
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new FamilyService();
