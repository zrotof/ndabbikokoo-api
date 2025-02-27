const { where } = require("sequelize");
const { cloudinary } = require("../config/cloudinary-config");

const { models } = require("../models");

class ImageService {

  async uploadImage(file, imageableId, imageableType, folder, transaction) {
    try {
      if (!file) throw new Error("No file uploaded");

      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const uploadedImage = await cloudinary.uploader.upload(dataUrl, {
        folder: folder
      });

      const imageData = {
        publicId: uploadedImage.public_id,
        url: uploadedImage.secure_url,
        imageableId,
        imageableType
      }
      
      const newImage = await models.Image.create(imageData);

      return newImage;
    } catch (e) {
      throw e
    }
  }

  async getImageByUrl(url){
    try {
      const image = await models.Image.findOne(
        {
          where : {
            url
          }
        }
      )

      return image.get({ plain: true });
    } catch (e) {
      throw e
    }
  }

  async getImageableIdAndimageableType(imageableId, imageableType){
    try {
      const image = await models.Image.findOne(
        {
          where : {
            imageableId,
            imageableType
          }
        }
      )

      if(image){
        return image.get({ plain: true });
      }

    } catch (e) {
      throw e
    }
  }

  async deleteImage(imageId, publicId){
    try {
      await cloudinary.uploader.destroy(publicId);
      await models.Image.destroy({where: {id: imageId}});
    } catch (e) {
      throw e
    }
  }

}

module.exports = new ImageService();
