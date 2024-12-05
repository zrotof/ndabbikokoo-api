const logger = require('../config/logger');

const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
  
    logger.info("Incoming request", {
      method: req.method,
      url: req.originalUrl
    });
  
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info("Response sent", {
        url: req.originalUrl,
        duration: `${duration}ms`,
        status: res.statusCode,
      });
    });
  
    next();
  };
  
  module.exports = loggerMiddleware