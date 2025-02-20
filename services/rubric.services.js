const { models } = require("../models/index");
const { NotFoundError, CustomError } = require("../utils/errors");

class RubricService {
  async getRubrics(queryParams) {
    try {
      const whereCondition = {};

      if (queryParams.isActive && queryParams.isActive !== undefined) {
        whereCondition.isActive = true;
      }

      const rubrics = await models.ArticleRubric.findAll();

      return rubrics;
    } catch (e) {
      throw e;
    }
  }

  async getRubricById(rubricId) {
    try {
      const articleRubric = await models.ArticleRubric.findByPk(rubricId);

      if (!articleRubric) {
        throw new NotFoundError("Rubrique inconnue !");
      }

      return articleRubric;
    } catch (e) {
      throw e;
    }
  }

  async createRubric(reqData) {
    try {
      await models.ArticleRubric.addHook(
        "beforeCreate",
        async (articleRubric, options) => {
          const lastArticleRubric = await models.ArticleRubric.findOne({
            order: [["order", "DESC"]],
          });

          if (lastArticleRubric) {
            articleRubric.order = lastArticleRubric.order + 1;
          } else {
            articleRubric.order = 0;
          }
        }
      );

      const rubric = await models.ArticleRubric.create(reqData);

      if (!rubric) {
        throw new CustomError(
          "Erreur lors de la création de rubrique d'article"
        );
      }

      return rubric;
    } catch (e) {
      throw e;
    }
  }

  async updateRubric(rubric, newData) {
    try {
      const updatedRubric = await rubric.update(newData);

      if (!updatedRubric) {
        throw new CustomError(
          "impossible de modifier cette rubrique. Re-essayez plus tard !"
        );
      }

      return updatedRubric;
    } catch (e) {
      throw e;
    }
  }

  async deleRubricById(rubricId) {
    try {
      const rubric = await models.ArticleRubric.findByPk(rubricId);

      if (!rubric) {
        throw new NotFoundError("Rubrique à supprimer inconnu !");
      }

      const rubricDeleted = await rubric.destroy();

      return rubricDeleted;
    } catch (e) {
      throw e;
    }
  }

  async updateArtcleRubricListOrder(dataArray) {
    try {
      const updatePromises = dataArray.map(({ id, index }) => {
        return models.ArticleRubric.update(
          { order: index },
          {
            where: {
              id: id,
            },
          }
        );
      });

      await Promise.all(updatePromises);
    } catch (e) {
      throw e
    }
  }
}

module.exports = new RubricService();
