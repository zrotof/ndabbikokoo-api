'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTokenPasswordReset extends Model {
    
  }
  UserTokenPasswordReset.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserTokenPasswordReset',
  });
  return UserTokenPasswordReset;
};