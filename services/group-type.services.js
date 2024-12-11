const { models } = require("../models");
const { NotFoundError } = require("../utils/errors");

class GroupTypeService {

  async getGroupTypes() {
    try {
      const groupTypes = await models.GroupType.findAll({
        attributes: [
          "id",
          "name",
        ]
      });

      return groupTypes;
    } catch (error) {
      throw error;
    }
  }

  async getGroupTypeByName(groupTypeName) {
    try {
      const groupType = await models.GroupType.findOne({
        where : {
          name : groupTypeName
        }
      });

      if (!groupType) {
        throw new NotFoundError(
          "Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
        );
      }

      return groupType;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GroupTypeService();
