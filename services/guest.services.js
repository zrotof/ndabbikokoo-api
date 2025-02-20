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

  /**
   * 
   * 
   * 
   * 
  

      const guests = await guestService.getGuestsByGroupId(group.groupId);

      if (guests.length > 0) {
        const guestsMailObject = guests.map((guest) => ({
          firstname: guest.firstname,
          lastname: guest.lastname,
          email: guest.email,
          groupName: group.groupName,
          representantName: subscriberFullName,
        }));

        guestsMailObject.forEach(async (guestMailObject) => {        
          await sendGuestInvitationMailRequest(guestMailObject);
        })
      }


    //If subscriber is a guest, we validate his account, assign him to his group using the group id in the guest table and delete him from the guest table after validation
    const guest = await guestService.getGuestByEmail(subscriber.email);

    if (guest) {
      await models.Subscriber.update(
        { groupId: guest.groupId },
        { where: { id: subscriberId } },
        {transaction}
      );

      await guestService.deleteGuestByEmail(subscriber.email, transaction);
    }
   */


}

module.exports = new GuestService();
