const { where } = require("sequelize");
const { models, sequelize } = require("../models");
const { NotFoundError, CustomError } = require('../utils/errors');

class GroupService{
  async getGroups() {
    try {
      const groups = await models.Group.findAll(
        {
          attributes: [
            'id',
            'name',
            'country',
            'town',
            [sequelize.fn('COUNT', sequelize.col('Subscribers.id')), 'subscriberCount']
          ],
          include: [
            {
              model: models.Subscriber,
              attributes: [],
            }
          ],
          group: ['Group.id']
  
        }
      );
  
      return groups;
    } catch (error) {
      throw error;
    }
  }

  async getGroupById (groupId) {
    try {
      const group = await models.Group.findByPk(groupId);
  
      if (!group) {
        throw new NotFoundError(
          "Ce groupe est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      return group;
    } catch (error) {
      throw error;
    }
  };
  
  async createGroup( groupDataToSave ){
    try {
      const group = await models.Group.findOne({
        where: {
          name : groupDataToSave.name,
          country: groupDataToSave.country,
          town: groupDataToSave.town
        }
      })

      if(group){
        throw new CustomError("Ce nom de groupe existe déjà, veuillez en renseigner un autre", 409)
      }

      const newGroup = await models.Group.create(groupDataToSave)

      return newGroup
    } catch (error) {
      throw error
    }
  }

  async updateGroup(groupId, newGroupData){
    try {
      console.log(groupId, newGroupData)
      const updatedRowCount = await models.Group.update(newGroupData, {
        where: { id: groupId },
      });
  
      if (updatedRowCount[0] === 0) {
        throw new NotFoundError("Le Groupe que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !");
      }
  
      return true;
    } catch (error) {
      throw error
    }
  };
  

  async deleteGroup( groupId ){
    try {

      const deletedGroup = await models.Group.destroy({
        where: { id: groupId },
      });
  
      if (deletedGroup === 0) {
        throw new NotFoundError("Le Groupe que vous essayez de supprimer est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !");
      }
  
      return true;
      } catch (error) {
      throw error
    }
  }}

module.exports = new GroupService();


