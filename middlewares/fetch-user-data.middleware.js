const models = require("../models/index");

const fetchUserData = async (req, res, next) => {
    try {
      const userId = req.user;
      const user = await models.User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ 
            status: 'erreur',
            data: null,
            message: "Accès interdit !" 
        });
      }
      req.user = user;
      next();
    } catch (error) {
        return res.status(500).json({ 
            status: 'error',
            data: null,
            message: "Erreur système, contactez le webmaster"
        });
    }
  };

  module.exports = { fetchUserData }