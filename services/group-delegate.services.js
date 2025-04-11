const { models, sequelize } = require("../models");
const { CustomError } = require("../utils/errors");

class GroupDelegateService {
  async createGroupsDelegate(ids, transaction) {
    try {
      const groupsDelegateEntries = ids.groupsId.map((groupId) => ({
        staffId: ids.staffId,
        groupId,
        startDate: new Date(),
      }));

      const result = await models.GroupDelegate.bulkCreate(
        groupsDelegateEntries,
        { transaction }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDeputyGroupsByDeputyId(staffId) {
    try {
      const existingAssignments = await models.GroupDelegate.findAll({
        where: { staffId },
        attributes: ["id", "staffId", "groupId",],
        include: [
          {
            model: models.Group,
            as: "groups",
            attributes: [
              "id",
              "groupRegistrationNumber",
              "name",
              "town",
              "country",
              "createdAt",
              [
                sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("groups->subscriber.id"))),
                "subscriberCount"
              ]  
            ],
            include: [
              {
                model: models.Subscriber,
                as: "subscriber",
                attributes: []
              }
            ]
          }
        ],
        group: ["GroupDelegate.id", "groups.id"]
      });  

      const jsonData = existingAssignments.map((item) => item.toJSON());

      console.log("jsonData", jsonData);
      return jsonData.map(({ groups, groupId, ...others }) => ({
        ...others,
        ...groups,
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GroupDelegateService();
