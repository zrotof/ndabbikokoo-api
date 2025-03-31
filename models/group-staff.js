"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupStaff extends Model {
    static associate(models) {
      GroupStaff.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      GroupStaff.belongsTo(models.Staff, {
        foreignKey: 'staffId'
      });
    }
  }
  
  GroupStaff.init(
    {
      staffId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      groupId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "GroupStaff",
    }
  );
  return GroupStaff;
};
