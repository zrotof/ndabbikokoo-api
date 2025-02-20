"use strict";

const { Model } = require("sequelize");
const imageableTypes = require("../enums/imageable-types.enum");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Article, { foreignKey: "imageableId", constraints: false, as: "article" });
      Image.belongsTo(models.User, { foreignKey: "imageableId", constraints: false });
    }
  }

  Image.init(
    {
      publicId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageableType: {
        type: DataTypes.ENUM(...Object.values(imageableTypes)),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );

  return Image;
};
