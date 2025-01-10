const { models, sequelize } = require("../models");

class GuestService {
  async getGuestsByGroupId(groupId) {
    try {

      
      const guests = await models.Guest.findAll({
        attributes: [
          "id",
          "email",
          "firstname",
          "lastname",
          "createdAt"
        ],
        where: { groupId: groupId }
      });

      return guests;
    } catch (error) {
      throw error;
    }
  }

  async getGuestByEmail(email) {
    try {
      const guest = await models.Guest.findOne({
        where: { email: email }
      });

      return guest;
    } catch (error) {
      throw error;
    }
  }

  async bulkCreateGuest(groupId, guestsData, transaction) {
    try {

      const guestsToCreate = guestsData.map((guest) => ({
        ...guest,
        groupId: groupId
      }));
  
      const createdGuests = await models.Guest.bulkCreate(guestsToCreate, {transaction});
  
      return createdGuests;
  
    } catch (error) {
      throw error;
    }
  }

  async deleteGuestByEmail(email, {transaction}) {
    try {
      const deletedGuest = await models.Guest.destroy({
        where: { email: email },
        transaction
      });

      return deletedGuest;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GuestService();
