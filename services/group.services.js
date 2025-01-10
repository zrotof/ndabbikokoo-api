const { models, sequelize } = require("../models");
const { NotFoundError, CustomError } = require("../utils/errors");
const { generateMaholId } = require("../utils/generate-mahol-ids");

class GroupService {
  async getGroups(queries) {
    try {

      let whereCondition = {}

      if(queries.groupType){
        whereCondition = {
          ...whereCondition,
          groupType : queries.groupType
        }
      }

      if(queries.isActive){
          whereCondition = {
              ...whereCondition,
              isActive : queries.isActive === true || queries.isActive === 'true' 
          }
      }

      const groups = await models.Group.findAll({
        attributes: [
          "id",
          "name",
          "country",
          "town",
          "maholGroupId",
          "createdAt",
          [
            sequelize.fn("COUNT", sequelize.col("Subscribers.id")),
            "subscriberCount"
          ],
        ],
        where : whereCondition,
        include: [
          {
            model: models.Subscriber,
            attributes: [],
          }
        ],
        group: ["Group.id"],
      });

      return groups;
    } catch (error) {
      throw error;
    }
  }

  async getGroupMembersByGroupId(id){
    try {
      const members = await models.Group.findByPk(id,{
        include: [
          {
            model: models.Subscriber,
            as: 'subscriber',
            attributes: ['firstname', 'lastname', 'town', 'phoneCode', 'phoneNumber'],
            include:{
              model: models.User,
              as: 'user',
              attributes: ['email']
            }
          }
        ]
      });
      
      if (!members) {
        throw new NotFoundError(
          "Ce groupe est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }

      
      const a = members.subscriber.map(mem => ({
        lastname: mem.lastname,
        firstname: mem.firstname,
        phoneCode: mem.phoneCode,
        phoneNumber: mem.phoneNumber,
        town: mem.town,
        email: mem.user.email
      }))

      return a;
    } catch (error) {
      throw error;
    }
  }

  async getGroupById(groupId) {
    try {
      const group = await models.Group.findByPk(groupId);
      
      if (!group) {
        throw new NotFoundError(
          "Ce groupe est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }
      
      return group;
    } catch (error) {
      throw error;
    }
  }

  async getGroupBySubscriberId(subscriberId) {
    try {
      const group = await models.Group.findOne({
        where: {
          representativeId: subscriberId
        },
      });

      return group;
      
    } catch (error) {
      throw error;
    }
  }

  async createGroup(groupDataToSave, transaction) {
    try {
      const group = await models.Group.findOne({
        where: {
          name: groupDataToSave.name,
          country: groupDataToSave.country,
          town: groupDataToSave.town
        }
      })

      if(group) {
        throw new CustomError(
          "Ce nom de groupe existe déjà, veuillez en renseigner un autre",
          409
        )
      }

      const year = new Date().getFullYear();

      const groupCount = await models.Group.count({
        where: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      });

      const maholGroupId = generateMaholId(groupCount + 1, "GRP");

      groupDataToSave = {
        ...groupDataToSave,
        maholGroupId: maholGroupId
      }


      const newGroup = await models.Group.create(groupDataToSave, {transaction});

      return newGroup;

    } catch (error) {
      throw error;
    }
  }

  async updateGroup(groupId, newGroupData) {
    try {
      const updatedRowCount = await models.Group.update(newGroupData, {
        where: { id: groupId },
      });

      if (updatedRowCount[0] === 0) {
        throw new NotFoundError(
          "Le Groupe que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteGroup(groupId) {
    try {
      const deletedGroup = await models.Group.destroy({
        where: { id: groupId },
      });

      if (deletedGroup === 0) {
        throw new NotFoundError(
          "Le Groupe que vous essayez de supprimer est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async validateGroupIfExistBySubscriberId(subscriberId, transaction) {
    try {

      const response = {
        isGroupRepresentative: false,
        groupName: null,
        groupId: null
      };

      const group = await models.Group.findOne({
        where: {
          representativeId: subscriberId
        }
      });

      console.log(group);

      if (group) {

        if (group.isActive === false) {
          group.isActive = true;
          await group.save(transaction);
        }

        response.isGroupRepresentative = true;
        response.groupName = group.name;
        response.groupId = group.id;
      }
            
      return response;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new GroupService();
