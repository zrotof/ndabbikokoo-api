const { models, sequelize } = require("../models");
const subscriber = require("../models/subscriber");
const { NotFoundError, CustomError } = require("../utils/errors");
const { generateRegistrationNumber } = require("../utils/generate-registration-number");

class GroupService {
  
  async getGroups(queries) {
    try {
      console.log("here")
      let whereCondition = {}

      if(queries.groupType){
        whereCondition = {
          ...whereCondition,
          isCreatedByMahol : queries.isCreatedByMahol
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
          "groupRegistrationNumber",
          "createdAt",
          [
            sequelize.fn("COUNT", sequelize.col("subscriber.id")),
            "subscriberCount"
          ],
        ],
        where : whereCondition,
        include: [
          {
            model: models.Subscriber,
            as: 'subscriber',
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

  async getGroupsAffectedToStaff(staffId, queries) {
    try {
      console.log("not here")

      let whereCondition = {}

      if(queries.groupType){
        whereCondition = {
          ...whereCondition,
          isCreatedByMahol : queries.isCreatedByMahol
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
          "groupRegistrationNumber",
          "createdAt",
          [
            sequelize.fn("COUNT", sequelize.col("subscriber.id")),
            "subscriberCount"
          ],
        ],
        where : whereCondition,
        include: [
          {
            model: models.Subscriber,
            as: 'subscriber',
            attributes: [],
          },
          {
            model: models.GroupStaff,
            as:'groups',
            where: { staffId: staffId },
            attributes: []
          }
        ],
        group: ["Group.id"],
      });

      return groups;
    } catch (error) {
      throw error;
    }
  }

  async getGroupWithMembersByGroupId(id){
    try {
      const groupWithMembers = await models.Group.findByPk(id,{
        include: [
          {
            model: models.Subscriber,
            as: 'subscriber',
            attributes: ['id', 'subscriberRegistrationNumber', 'firstname', 'lastname', 'town', 'country', 'phoneCode', 'phoneNumber', 'phoneCode'],
            include:[
              {
                model: models.User,
                as: 'user',
                attributes: ['email']
              },
              {
                model: models.Image,
                as: 'image',
                attributes: ['url']
              }
            ]
          }
        ]
      });
      
      if (!groupWithMembers) {
        throw new NotFoundError(
          "Ce groupe est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        )
      }

      const b =  {
        group: {
          id: groupWithMembers.id,
          name: groupWithMembers.name,
          country: groupWithMembers.country,
          town: groupWithMembers.town,
          groupRegistrationNumber: groupWithMembers.groupRegistrationNumber,
          createdAt: groupWithMembers.createdAt
      },

      subscribers: groupWithMembers.subscriber.map(mem => ({
        subscriberRegistrationNumber: mem.subscriberRegistrationNumber,
        lastname: mem.lastname,
        firstname: mem.firstname,
        phoneCode: mem.phoneCode,
        phoneNumber: mem.phoneNumber,
        town: mem.town,
        country: mem.country,
        email: mem.user.email,
        isRepresentative : mem.id === groupWithMembers.representativeId,
        image: mem?.image?.url
      }))
    }

      return b;
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

      let uniqueRegistrationNumber;
      let isUnique = false;
  
      // Ensure unique matricule by checking database
      while (!isUnique) {
        const registrationNumber = generateRegistrationNumber(7);
        const existingGroup = await models.Group.findOne({ where: { groupRegistrationNumber: registrationNumber } });
  
        if (!existingGroup) {
          uniqueRegistrationNumber = registrationNumber;
          isUnique = true;
        }
      }
  
      groupDataToSave = {
        ...groupDataToSave,
        groupRegistrationNumber: uniqueRegistrationNumber
      }

      const newGroup = await models.Group.create(groupDataToSave, {transaction});

      return newGroup;

    } catch (error) {
      throw error;
    }
  }

  async updateGroup(groupId, newGroupData) {
    try {
      
      const [updatedRowCount] = await models.Group.update(newGroupData, {
        where: { id: groupId }
      });

      if (updatedRowCount === 0) {
        throw new NotFoundError(
          "Le Groupe que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      return true;
    } catch (error) {
      throw error
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
