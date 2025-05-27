
const { sequelize } = require("../models/index");

const testimonyService = require("../services/testimony.services");
const imageService = require("../services/image.services");

const imageableTypeEnum = require("../enums/imageable-types.enum");

exports.getTestimonies = async (req, res, next) => {
  try {

    const { isActive } = req.query;

    const testimonies = await testimonyService.getTestimonies({isActive});

    return res.status(200).json({
      status: "success",
      data: testimonies,
      message: ""
    });
  } catch (e) {
    next(e);
  }
}

exports.getTestimonyById = async (req, res, next) => {
  try {
    const testimonyId = req.params.id;

    const testimony = await testimonyService.getTestimonyById(testimonyId);

    return res.status(200).json({
      status: "success",
      data: testimony,
      message: "Témoignage trouvé !",
    });
  } catch (e) {
    next(e);
  }
};

exports.createTestimony = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const file = req.file;

    const testimonyData = {
      testimonyOwnerType: req.body.testimonyOwnerType,
      name: req.body.name,
      title: req.body.title,
      message: req.body.message
    };

    const testimony = await testimonyService.createTestimony(
      testimonyData,
      transaction
    );

    const folder = 'testimonies';

    await imageService.uploadImage(
      file,
      testimony.id,
      imageableTypeEnum.TESTIMONY,
      folder,
      transaction
    );

    return res.status(201).json({
      status: "success",
      data: null,
      message: "Témoignage créé avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.updateTestimony = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const testimonyId = req.params.id;

    const testimony = await testimonyService.getTestimonyById(testimonyId);

    const file = req.file;

    if (file) {
      const image = await imageService.getImageByUrl(testimony.image);
      await imageService.deleteImage(image.id, image.publicId);

      const folder = 'testimonies';

      await imageService.uploadImage(
        file,
        testimony.id,
        imageableTypeEnum.TESTIMONY,
        folder,
        transaction
      );
    }

    const reqData = { ...req.body };

    const newTestimony = await testimonyService.updateTestimony(testimonyId, reqData);

    return res.status(201).json({
      status: "success",
      data: newTestimony,
      message: "Témoignage modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteTestimony = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const testimonyId = req.params.id;
    const testimony = await testimonyService.getTestimonyById(testimonyId);

    if (testimony?.image) {
      const image = await imageService.getImageByUrl(testimony.image);
      await imageService.deleteImage(image.id, image.publicId);
    }

    await testimonyService.deleteTestimony(testimonyId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Témoignage supprimé avec succès !",
    });
  } catch (e) {
    next(e)
  }
};