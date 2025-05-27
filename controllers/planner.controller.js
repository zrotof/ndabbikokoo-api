const { sequelize } = require("../models/index");

const plannerService = require("../services/planner.services");
const imageService = require("../services/image.services");

const imageableTypeEnum = require("../enums/imageable-types.enum");

exports.getPlanners = async (req, res, next) => {
  try {

    const {type} = req.query;

    const planners = await plannerService.getPlanners({type});

    return res.status(200).json({
      status: "success",
      data: planners,
      message: "Succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.getPlannerTypes = async (req, res, next) => {
  try {

    const plannerEventTypes = await plannerService.getPlannerTypes();

    return res.status(200).json({
      status: "success",
      data: plannerEventTypes,
      message: "Succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.getPlannerById = async (req, res, next) => {
  try {
    const plannerId = req.params.id;

    const Planner = await plannerService.getPlannerById(plannerId);

    return res.status(200).json({
      status: "success",
      data: Planner,
      message: "Évênement trouvée !",
    });
  } catch (e) {
    next(e);
  }
};

exports.createPlanner = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const file = req.file;

    const plannerData = {
      type: req.body.type,
      date: req.body.date,
      town: req.body.town,
      country: req.body.country,
      hasVideo: req.body.hasVideo,
      videoLink: req.body.hasVideo ? req.body.videoLink : "",
      content: req.body.content,
      userId: req.body.userId,
    };

    const planner = await plannerService.createPlanner(
      plannerData,
      transaction
    );

    const folder= 'planners';

    await imageService.uploadImage(
      file,
      planner.id,
      imageableTypeEnum.PLANNER,
      folder,
      transaction
    );

    return res.status(201).json({
      status: "success",
      data: null,
      message: "Article créé avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.updatePlanner = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const plannerId = req.params.id;

    const planner = await plannerService.getPlannerById(plannerId);

    const file = req.file;

    if (file) {
      const image = await imageService.getImageByUrl(planner.coverImage);
      await imageService.deleteImage(image.id, image.publicId);
      
      const folder= 'planners';

      await imageService.uploadImage(
        file,
        planner.id,
        imageableTypeEnum.PLANNER,
        folder,
        transaction
      );
    }

    const reqData = { ...req.body };

    const newPlanner = await plannerService.updatePlanner(planner.id, reqData);

    return res.status(201).json({
      status: "success",
      data: newPlanner,
      message: "Évênement modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.deletePlanner = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const plannerId = req.params.id;
    const planner = await plannerService.getPlannerById(plannerId);
    
    const image = await imageService.getImageByUrl(planner.coverImage);
    await imageService.deleteImage(image.id, image.publicId);

    await plannerService.deletePlanner(plannerId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Évênement supprimé avec succès !",
    });
  } catch (e) {
    next(e)
  }
};
