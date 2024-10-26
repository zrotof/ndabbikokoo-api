"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, { through: 'UserRoles', foreignKey: 'roleId' });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Ce rôle existe déjà !'
        },
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le nom !'
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
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
