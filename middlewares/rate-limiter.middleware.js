const rateLimit = require("express-rate-limit");

const { models } = require("../models");

const { TooManyAttemptsError } = require("../utils/errors");

const { defaultBlockingTime, maxLoginAttempts } = require("../config/dot-env");

const { getRemainingTime } = require("../utils/hour-convertion.utils");

exports.loginRateLimiter = async (req, res, next) =>
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: maxLoginAttempts || 8,
    handler: async () => {
      try {
        const email = req.body.email;
        const ipAddress =
          req.header("x-forwarded-for") || req.socket.remoteAddress;

        const user = await models.User.findOne({
          where: { email },
        });

        const loginAttempts = await models.LoginAttempt.findOne({
          where: { ipAddress },
        });

        if (!loginAttempts) {
          loginAttempts = await models.LoginAttempt.create({
            ipAddress,
            attempts: 0,
          });
        }

        if (user) {
          if (user.canAuthenticate === true) {
            user.canAuthenticate = false;
            await user.save();
          }

          // On identifie l'utilisateur à risque
          if (!loginAttempts.userId) {
            loginAttempts.userId = user.userId;
          }
        }

        loginAttempts.attempts += 1;
        loginAttempts.blockDurationMultiplier += 1;

        const newBlocage =
          Date.now() +
          1000 *
            60 *
            defaultBlockingTime *
            loginAttempts.blockDurationMultiplier;
        const remainingTime = getRemainingTime(newBlocage);

        loginAttempts.blockUntil = newBlocage;
        await loginAttempts.save();

        const messageError = `Attention, suite à un très grand nombre de tentatives de connexion erronées, vous ne pouvez vous connecter. Veuillez éssayer de nouveau dans ${remainingTime}`;

        return next( new TooManyAttemptsError(messageError));
      } catch (error) {
        return next(error);
      }
    },
  });
