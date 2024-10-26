"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginAttempt extends Model {
    
    static associate(models) {
      LoginAttempt.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  LoginAttempt.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      blockUntil: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      blockDurationMultiplier: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
    },
    {
      sequelize,
      modelName: "LoginAttempt",
    }
  );
  return LoginAttempt;
};
