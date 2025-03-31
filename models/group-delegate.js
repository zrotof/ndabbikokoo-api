"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupDelegate extends Model {
    static associate(models) {
      GroupDelegate.belongsTo(models.Group, {
        foreignKey: 'groupId', as : 'groups'
      });
      GroupDelegate.belongsTo(models.Staff, {
        foreignKey: 'staffId', as : 'group'
      });
    }
  }
  
  GroupDelegate.init(
    {
      staffId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      groupId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "GroupDelegate",
    }
  );
  return GroupDelegate;
};
