'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class StaffPasswordResetRequest extends Model {

    static associate(models) { 
      StaffPasswordResetRequest.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'staff' });
    }
  }
  
  StaffPasswordResetRequest.init({
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'StaffPasswordResetRequest',
  });
  
  return StaffPasswordResetRequest;
};