const { raw } = require("express");
const { models, sequelize } = require("../models/index");

const { NotFoundError } = require("../utils/errors")

class PlannerService {
  async getPlanners(params) {
    try {

      let queryOptions = {};
      let conditions = {};

      if (params?.rubricId) {
        conditions.rubricId = params.rubricId;
      }

      if (params?.type) {
        conditions.type = params.type
      }

      if (params?.limit) {
        queryOptions.limit = parseInt(params.limit);
      }

      if (params?.startDate) {
        conditions.dateStart = {
          [models.Sequelize.Op.gte]: new Date(params.startDate)
        };
      }

      const orderDirection = params?.startDate ? "ASC" : "DESC";
      queryOptions.order = [["dateStart", orderDirection]];

      queryOptions.attributes = { exclude: ["UserId"] };
      queryOptions.order = [["dateStart", "DESC"]];
      queryOptions.where = conditions;

      const planners = await models.Planner.findAll(
        {
          ...queryOptions,
          include: [
            {
              model: models.Image,
              required: false,
              attributes: ["url"]
            }
          ]
        }
      );

      const formattedPlanners = planners.map(planner => {
        const cleanPlanner = planner.get({ plain: true }); // Supprime les références circulaires

        const coverImage = cleanPlanner.Image?.url || null
        delete cleanPlanner.Image;

        return {
          ...cleanPlanner,
          coverImage
        };
      });

      return formattedPlanners
    } catch (e) {
      throw e;
    }
  }

  async getPlannerTypes() {
    try {
      const plannerTypes = await models.Planner.findAll(
        {
          attributes: [sequelize.fn('DISTINCT', sequelize.col('type')), 'type'],
          raw: true
        }
      );

      return plannerTypes;
    }
    catch (e) {
      throw e;
    }
  }

  async getPlannerById(plannerId) {
    try {
      const planner = await models.Planner.findByPk(plannerId,
        {
          include: [
            {
              model: models.Image,
              required: false,
              attributes: ["url"]
            }
          ]
        }
      )

      if (!planner) {
        throw new NotFoundError('Évênement non trouvé');
      }

      const cleanArticle = planner.get({ plain: true });

      const formattedArticle = {
        ...cleanArticle,
        coverImage: cleanArticle.Image?.url || null
      };

      delete cleanArticle.Image;

      return formattedArticle

    } catch (error) {
      throw e
    }
  }

  async createPlanner(data, transaction) {
    try {
      const planner = await models.Planner.create(data, transaction);

      if (!planner) {
        return res.status(500).json({
          status: "error",
          data: null,
          message: "Erreur lors de la création, contactez le web master",
        });
      }

      const plannerData = planner.get({ plain: true });

      const formattedPlanner = { ...plannerData, coverImage: planner.Image?.url || null }
      delete formattedPlanner.Image;

      return formattedPlanner;
    } catch (e) {
      throw e;
    }
  }

  async updatePlanner(plannerId, data) {
    try {
      const updatedPlanner = await models.Planner.update(data,
        {
          where: {
            id: plannerId
          }
        }
      );

      if (!updatedPlanner) {
        throw new NotFoundError("Évênement inconnu !");
      }

      return updatedPlanner;
    } catch (e) {
      throw e
    }
  }

  async deletePlanner(plannerId) {
    try {
      const planner = await models.Planner.findByPk(plannerId);

      if (!planner) throw new Error("Évênement non trouvé");

      await planner.destroy();

    } catch (e) {
      throw e
    }
  }
}

module.exports = new PlannerService();
