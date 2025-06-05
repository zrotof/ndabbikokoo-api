const { models } = require("../models/index");

const { NotFoundError } = require("../utils/errors")

class ArticleService {
  async getArticles(params) {
    try {

      let queryOptions = {};
      let conditions = {};

      if (params?.rubricId) {
        conditions.rubricId = params.rubricId;
      }

      if (params?.limit) {
        queryOptions.limit = parseInt(params.limit);
      }

      queryOptions.attributes = { exclude: ["UserId"] };
      queryOptions.order = [["date", "DESC"]];
      queryOptions.where = conditions;

      const articles = await models.Article.findAll(
        {
          ...queryOptions,
          include: [
            {
              model: models.Image,
              required: false,
              attributes: ["url"]
            },
            {
              model: models.ArticleRubric,
              as: 'rubric',
              attributes: ["id", "name"]
            }
          ]
        }
      );

      const formattedArticles = articles.map(article => {
        const cleanArticle = article.get({ plain: true }); // Supprime les références circulaires

        const coverImage =  cleanArticle.Image?.url || null      
        delete cleanArticle.Image;
        const {rubricId , ...rest} = cleanArticle;
        return { 
            ...rest, 
            coverImage// Ajout de coverImage et suppression de Image
        };
    });
    
      return formattedArticles
    } catch (e) {
      throw e;
    }
  }

  async getArticleById(articleId){
    try {
      const article = await models.Article.findByPk(articleId,
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
        
      if(!article){
        throw new NotFoundError('Article non trouvé');
      }

      const cleanArticle = article.get({ plain: true });

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

  async createArticle(data, transaction) {
    try {
      const article = await models.Article.create(data, transaction);

      if (!article) {
        return res.status(500).json({
          status: "error",
          data: null,
          message: "Erreur lors de la création, contactez le web master",
        });
      }

      const  articleData = article.get({ plain: true });

      const formattedArticle = { ...articleData, coverImage: article.Image?.url || null }
      delete formattedArticle.Image;

      return formattedArticle;
    } catch (e) {
      throw e;
    }
  }

  async updateArticle(articleId, data){
    try {
      const updatedArticle = await models.Article.update(data, 
        {
          where: { 
            id: articleId 
          }
        }
      );

      if(!updatedArticle){
        throw new NotFoundError("Article inconnu !");  
      }

      return updatedArticle;
    } catch (e) {
      throw e
    }
  }

  async deleteArticle(articleId) {
    try {
      const article = await models.Article.findByPk(articleId);
  
      if (!article) throw new Error("Article not found");
  
      await article.destroy();
    
    } catch (e) {
      throw e
    }
  }
}

module.exports = new ArticleService();
