"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaffRequest extends Model {
    static associate(models) {
      StaffRequest.belongsTo(models.Subscriber, {
        foreignKey: "subscriberId",
        as: "subscriber",
      });
    }
  }

  StaffRequest.init(
    {
      subscriberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Subscribers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Cet email existe déjà, vous ne pouvez la re-utiliser !",
        },
        validate: {
          isEmail: {
            msg: "L'email n'est pas bien formaté !",
          },
          notEmpty: {
            msg: "Veuillez renseigner l'email !",
          },
        },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rolesId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StaffRequest",
      tableName: "Staff_Requests",
    }
  );

  return StaffRequest;
};
