"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    getFullName() {
      return [this.firstname, this.lastname].join(' ');
    }

    static associate(models) {
      User.belongsToMany(models.Role, { through: 'UserRoles', foreignKey: 'userId' });
    }
  }
  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le(s) prénom(s) !'
          }
        } 
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le(s) nom(s) !'
          }
        } 
      },
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
      modelName: "User",
    }
  );
  return User;
};
