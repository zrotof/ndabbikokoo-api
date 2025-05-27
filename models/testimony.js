const { Model } = require("sequelize");
const imageableTypeEnum = require('../enums/imageable-types.enum');

module.exports = (sequelize, DataTypes) => {
  class Testimony extends Model {
    static associate(models) {
      Testimony.hasOne(models.Image, {
        foreignKey: 'imageableId', constraints: false, scope: {
          imageableType: imageableTypeEnum.TESTIMONY
        }
      });
    }
  }

  Testimony.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testimonyOwnerType: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "Testimony",
    });
  return Testimony;
};
