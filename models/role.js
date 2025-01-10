"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Subscriber, { through: 'SubscriberRoles', foreignKey: 'roleId' });
      Role.belongsToMany(models.Staff, { through: 'StaffRoles', foreignKey: 'roleId' });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Ce nom de rôle existe déjà !'
        },
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le nom !'
          }
        }
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Ce code de rôle existe déjà !'
        },
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le code du rôle !'
          }
        } 
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner la description !'
          }
        } 
      }
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
