"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupDelegate extends Model {
    static associate(models) {
      GroupDelegate.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      GroupDelegate.belongsTo(models.Subscriber, {
        foreignKey: 'subscriberId'
      });
    }
  }
  
  GroupDelegate.init(
    {
      subscriberId: {
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
      modelName: "GroupDelegate",
    }
  );
  return GroupDelegate;
};
