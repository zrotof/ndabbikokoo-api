"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    static associate(models) {
      Guest.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'group'
      });
    }
  }
  
  Guest.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Guest",
    }
  );
  return Guest;
};
