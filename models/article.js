const { Model } = require("sequelize");
const imageableTypeEnum = require('../enums/imageable-types.enum');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.ArticleRubric, { foreignKey: 'rubricId', as : 'rubric' });
      Article.belongsTo(models.Staff, { foreignKey: 'staffId', as : 'staff' });
      Article.hasOne(models.Image, { foreignKey: 'imageableId', constraints: false, scope: {
        imageableType: imageableTypeEnum.ARTICLE
      }});
    }
  }

  Article.init(
    {
    rubricId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Article_Rubrics',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Staffs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hour: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hasVideo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    videoLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Article",
  });
  return Article;
};
