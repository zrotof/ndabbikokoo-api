'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupType extends Model {}

  GroupType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez renseigner le nom du type de groupe !'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez renseigner la description du type de groupe !'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'GroupType',
  });
  return GroupType;
};