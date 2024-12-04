"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdminGroup extends Model {
    static associate(models) {
      AdminGroup.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      AdminGroup.belongsTo(models.Subscriber, {
        foreignKey: 'adminId'
      });
    }
  }
  
  AdminGroup.init(
    {
      adminId: {
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
      modelName: "AdminGroup",
    }
  );
  return AdminGroup;
};
