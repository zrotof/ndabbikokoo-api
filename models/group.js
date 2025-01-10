"use strict";
const { Model } = require("sequelize");
const { GroupTypeEnum } = require('../enums/group-type.enum');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Subscriber, {
        foreignKey: 'groupId', as: 'subscriber'
      });
      Group.hasMany(models.GroupStaff, {
        foreignKey: 'groupId'
      });
    }
  }
  
  Group.init(
    {
      maholGroupId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Erreur lors de l'enregistrement veuillez contacter le web master !"
        }
      },
      representativeId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      groupType: {
        type: DataTypes.ENUM(GroupTypeEnum.ASSOCIATION, GroupTypeEnum.STAFF),
        allowNull: false
      },
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
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true 
      }
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
