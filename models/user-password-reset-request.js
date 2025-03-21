'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class UserPasswordResetRequest extends Model {

    static associate(models) { 
      UserPasswordResetRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  
  UserPasswordResetRequest.init({
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
    modelName: 'UserPasswordResetRequest',
  });
  
  return UserPasswordResetRequest;
};