const { models, sequelize } = require("../models");

const {
  generateHashedPasswordAndSalt,
  isPasswordValid,
} = require("../helpers/password.helpers");

class StaffService {

  async createStaff(staffData, transaction) {
    try {
      const isStaffExist = await models.Staff.findOne({
        where: { email: staffData.email },
      });

      if(isStaffExist){
        const message =
          "Un membre du staff associé à cet adresse email existe déjà!";
        throw new CustomError(message, 409);
      }

      const hashedPassword = generateHashedPasswordAndSalt(
        staffData.password
      );

      staffDataToSave = {
        ...staffData,
        password: hashedPassword.hash,
        salt: hashedPassword.salt,
      };

      return await models.Staff.create(staffDataToSave, { transaction });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StaffService();
