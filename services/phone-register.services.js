const { raw } = require("express");
const { models, sequelize } = require("../models/index");

const { NotFoundError } = require("../utils/errors")

class PhoneRegisterService {
  async getPhoneRegisters(params) {
    try {

      const phoneRegisters = await models.PhoneRegister.findAll();

      return phoneRegisters;
    } catch (e) {
      throw e;
    }
  }

  async createPhoneRegister(phone, transaction) {
    try {
      console.log({phone})
      const phoneRegister = await models.PhoneRegister.create({phone}, transaction);

      return phoneRegister;
    } catch (e) {
      throw e;
    }
  }

  /*
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
  
    async getPlannerById(plannerId){
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
          
        if(!planner){
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
  

  
    async updatePlanner(plannerId, data){
      try {
        const updatedPlanner = await models.Planner.update(data, 
          {
            where: { 
              id: plannerId 
            }
          }
        );
  
        if(!updatedPlanner){
          throw new NotFoundError("Évênement inconnu !");  
        }
  
        return updatedPlanner;
      } catch (e) {
        throw e
      }
    }
  
    async deletePlanner(id) {
      try {
        const planner = await models.Planner.findByPk(plannerId);
    
        if (!planner) throw new Error("Évênement non trouvé");
    
        await planner.destroy();
      
      } catch (e) {
        throw e
      }
    }
  
    */
}

module.exports = new PhoneRegisterService();
