const { sequelize } = require("../models/index");

const articleService = require("../services/article.services");
const imageService = require("../services/image.services");

const imageableTypeEnum = require("../enums/imageable-types.enum");

exports.getArticles = async (req, res, next) => {
  try {
    const { rubricId, limit } = req.query;

    const articles = await articleService.getArticles({ rubricId, limit });

    return res.status(200).json({
      status: "success",
      data: articles,
      message: "Succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id;

    const article = await articleService.getArticleById(articleId);

    return res.status(200).json({
      status: "success",
      data: article,
      message: "Article trouvée !",
    });
  } catch (e) {
    next(e);
  }
};

exports.createArticle = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const file = req.file;

    const articleData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      hour: req.body.hour,
      content: req.body.content,
      rubricId: req.body.rubricId,
      userId: req.body.userId,
      hasVideo: req.body.hasVideo,
      videoLink: req.body.hasVideo ? req.body.videoLink : "",
    };

    const article = await articleService.createArticle(
      articleData,
      transaction
    );

    const folder= 'articles';

    await imageService.uploadImage(
      file,
      article.id,
      imageableTypeEnum.ARTICLE,
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

exports.updateArticle = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const articleId = req.params.id;

    const article = await articleService.getArticleById(articleId);

    const file = req.file;

    if (file) {
      const image = await imageService.getImageByUrl(article.coverImage);
      await imageService.deleteImage(image.id, image.publicId);
      
      const folder= 'articles';

      await imageService.uploadImage(
        file,
        article.id,
        imageableTypeEnum.ARTICLE,
        folder,
        transaction
      );
    }

    const reqData = { ...req.body };

    const newArticle = await articleService.updateArticle(article.id, reqData);

    return res.status(201).json({
      status: "success",
      data: newArticle,
      message: "Article modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteArticle = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const articleId = req.params.id;
    const article = await articleService.getArticleById(articleId);
    
    const image = await imageService.getImageByUrl(article.coverImage);
    await imageService.deleteImage(image.id, image.publicId);

    await articleService.deleteArticle(articleId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Article supprimé avec succès !",
    });
  } catch (e) {
    next(e)
  }
};
