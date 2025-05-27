const { models, sequelize } = require("../models");
const { NotFoundError, CustomError } = require("../utils/errors");
const { generateRegistrationNumber } = require("../utils/generate-registration-number");

class TestimonyService {

  async getTestimonies(params) {
    try {

      let queryOptions = {};
      let conditions = {};

      if (params?.isActive) {
        conditions.isActive = params.isActive
      }

      queryOptions.where = conditions;

      const testimonies = await models.Testimony.findAll({
        ...queryOptions,
        attributes: [
          "id",
          "name",
          "testimonyOwnerType",
          "title",
          "message",
          "isActive"
        ],
        include: [
          {
            model: models.Image,
            required: false,
            attributes: ["url"]
          }
        ]
      });

      const formattedTestimonies = testimonies.map(testimony => {
        const cleanTestimony = testimony.get({ plain: true });

        const image = cleanTestimony.Image?.url || null
        delete cleanTestimony.Image;

        return {
          ...cleanTestimony,
          image
        };
      });

      return formattedTestimonies;
    } catch (error) {
      throw error;
    }
  }

  async getTestimonyById(testimonyId) {
    try {
      const testimony = await models.Testimony.findByPk(testimonyId,
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

      if (!testimony) {
        throw new NotFoundError('Témoignage non trouvé');
      }

      const cleanTestimony = testimony.get({ plain: true });

      const formattedTestimony = {
        ...cleanTestimony,
        image: cleanTestimony.Image?.url || null
      };

      delete formattedTestimony.Image;

      return formattedTestimony

    } catch (error) {
      throw e
    }
  }

  async createTestimony(newTestimony, transaction) {
    const testimony = await models.Testimony.create(newTestimony, transaction);

    if (!testimony) {
      return res.status(500).json({
        status: "error",
        data: null,
        message: "Erreur lors de la création, contactez le web master",
      });
    }

    const testimonyData = testimony.get({ plain: true });

    const formattedTestimony = { ...testimonyData, image: testimony.Image?.url || null }
    delete formattedTestimony.Image;

    return formattedTestimony;
  }

  async updateTestimony(testimonyId, data) {
    try {
      const updatedTestimony = await models.Testimony.update(data,
        {
          where: {
            id: testimonyId
          }
        }
      );

      if (!updatedTestimony) {
        throw new NotFoundError("Témoignage inconnu !");
      }

      return updatedTestimony;
    } catch (e) {
      throw e
    }
  }

  async deleteTestimony(testimonyId) {
    try {
      const testimony = await models.Testimony.findByPk(testimonyId);

      if (!testimony) throw new Error("Témoignage non trouvé");

      await testimony.destroy();

    } catch (e) {
      throw e
    }
  }
}

module.exports = new TestimonyService();