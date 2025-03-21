require("dotenv").config();

module.exports = {
  environment: process.env.ENVIRONMENT,
  port: process.env.PORT || 4000,
  defaultBlockingTime: process.env.DEFAULT_BLOCKING_TIME,
  maxFailedLoginAttempts: process.env.MAX_FAILED_LOGIN_ATTEMPTS,
  tokenLifeTimeOnLogin : process.env.TOKEN_LIFE_TIME_ON_LOGIN,
  tokenLifeTimeOnIdRequest : process.env.TOKEN_LIFE_TIME_ON_ID_REQUEST,
  tokenLifeTimeOnStaffCreationRequest : process.env.TOKEN_LIFE_TIME_ON_STAFF_REQUEST,
  clientBaseUrl: process.env.CLIENT_BASE_URL,
  clientAdminBaseUrl: process.env.CLIENT_ADMIN_BASE_URL,
  supraAdminEmail: process.env.SUPRA_ADMIN,
  db: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },
  o2switch: {
    router: process.env.O2SWITCH_USER_EMAIL_ROUTER,
    contact: process.env.O2SWITCH_USER_EMAIL_CONTACT,
    password: process.env.O2SWITCH_USER_PASSWORD_ROUTER,
    idReceiver: process.env.O2SWITCH_USER_EMAIL_ID_RECEIVER
  },
  cloudinary : {
    name : process.env.CLOUDINARY_NAME,
    apiKey : process.env.CLOUDINARY_API_KEY,
    apiSecret : process.env.CLOUDINARY_API_SECRET
  }
}
