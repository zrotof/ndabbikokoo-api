"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Subscriber, {
        foreignKey: 'groupId'
      });
    }
  }
  
  Group.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le nom du groupe !'
          }
        } 
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le pays où se trouve le groupe !'
          }
        } 
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner la ville où se trouve le grouve !"
          }
        } 
      }
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
