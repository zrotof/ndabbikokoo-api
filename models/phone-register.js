const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PhoneRegister extends Model {
  }

  PhoneRegister.init(
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "PhoneRegister",
    });
  return PhoneRegister;
};
