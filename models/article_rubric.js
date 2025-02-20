"use strict";

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class ArticleRubric extends Model{
    static associate(models) {
      ArticleRubric.hasMany(models.Article , {
        foreignKey : 'rubricId', as : 'articles'
      });
      ArticleRubric.hasMany(models.Staff , {
        foreignKey : 'staffId', as : 'staffs'
      })
    }
  }

  ArticleRubric.init(
    {
      staffId : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Staffs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      order : {
        type: DataTypes.NUMBER
      },
      isActive: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: "ArticleRubric",
      tableName : 'Article_Rubrics'
    }
  );
  return ArticleRubric;
}