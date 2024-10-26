const { db } = require("./dot-env");

module.exports = {
  development: {
      username: db.username,
      password: db.password,
      database: db.name,
      host: db.host,
      port: db.port,
      dialect: db.dialect,
      logging: false,
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      }
  },
  test: {
      username: db.username,
      password: db.password,
      database: db.name,
      host: db.host,
      port: db.port,
      dialect: db.dialect,
      logging: false,
      pool: {
          max: 5,
          min: 0,
          acquire: 10000,
          idle: 5000
      }
  },
  production: {
      username: db.username,
      password: db.password,
      database: db.name,
      host: db.host,
      port: db.port,
      dialect: db.dialect,
      logging: false,
      pool: {
          max: 20,
          min: 5,
          acquire: 60000,
          idle: 30000
      }
  }
};