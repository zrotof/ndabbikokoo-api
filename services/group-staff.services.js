const { models } = require("../models");
const { CustomError } = require("../utils/errors");

class GroupStaffService {
  async createGroupStaff(ids, transaction) {
    try {
      
      const existingAssignments = await models.GroupStaff.findAll({
        where: { staffId: ids.staffId },
        attributes: ['groupId'],
      });

      const existingGroupIds = existingAssignments.map(g => g.groupId);

      const newGroups = ids.groupsId.filter(groupId => !existingGroupIds.includes(groupId));

      if (newGroups.length === 0) {
        throw new CustomError( "Aucun nouveau groupe à assigner !")
      }
  
      const groupStaffEntries = ids.groupsId.map(groupId => ({
        staffId: ids.staffId,
        groupId,
        startDate: new Date(),
      }));
  
      const result = await models.GroupStaff.bulkCreate(groupStaffEntries, { transaction });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GroupStaffService();
