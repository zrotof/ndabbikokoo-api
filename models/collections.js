"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
        Collection.belongsTo(models.Group, {
            foreignKey: 'groupId'
          });
          
          Collection.belongsTo(models.Staff, {
            foreignKey: 'staffId'
          });
    
    }
  }
  
  Collection.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Staffs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active', // active, completed, cancelled, etc.
        allowNull: false
      },
    }, {
      timestamps: true,
      sequelize,
      tableName: 'collections',
    }
  );
  return Collection;
};