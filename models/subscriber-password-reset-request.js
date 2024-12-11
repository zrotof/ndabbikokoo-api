'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriberPasswordResetRequest extends Model {
  }
  SubscriberPasswordResetRequest.init({
    subscriberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SubscriberPasswordResetRequest',
  });
  return SubscriberPasswordResetRequest;
};