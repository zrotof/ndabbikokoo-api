"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Memorial extends Model {

    static associate(models) {
      Memorial.belongsToMany(models.Role, { through: 'UserRoles', foreignKey: 'userId' });
    }
  }
  Memorial.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Cet email existe déjà, vous ne pouvez la re-utiliser !'
        },
        validate: {
          isEmail: {
            msg: "L'email n'est pas bien formaté !"
          },
          notEmpty: {
            msg: "Veuillez renseigner l'email !"
          }
        } 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le mot de passe !'
          }
        } 
      },
      canAuthenticate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isAccountValidated: {
        type: DataTypes.STRING,
        defaultValue: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Memorial",
    }
  );
  return Memorial;
};
