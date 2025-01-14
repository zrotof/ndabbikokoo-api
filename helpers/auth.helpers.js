const {
    InvalidCredentialsError,
    TooManyAttemptsError
  } = require("../utils/errors");
  
const { models } = require('../models')

const { getRemainingTime } = require('../utils/hour-convertion.utils')

class AuthHelpers {
  async resetLoginAttempts(user, attempts) {
    user.canAuthenticate = true;
    await user.save();
    if (attempts) await attempts.destroy();
  }

  // Helper: Handle blocked user
  async handleBlockedUser(attempts, defaultBlockingTime) {
    
    attempts.attempts += 1;
    attempts.blockDurationMultiplier += 1;

    attempts.blockUntil = 
      Date.now() +
      1000 * 60 * defaultBlockingTime * (attempts.blockDurationMultiplier + attempts.attempts);

    await attempts.save();

    throw new TooManyAttemptsError(
      `Compte temporairement bloqué. Réessayez dans ${getRemainingTime(
        attempts.blockUntil
      )}.`
    );
  }

  async handleSuccessfulLogin(user, attempts) {
    user.canAuthenticate = true;
    await user.save();
    if (attempts) await attempts.destroy();
  }

  async handleFailedLogin(user, attempts, maxFailedLoginAttempts, defaultBlockingTime) {
    if (!attempts) {
      await models.LoginAttempt.create({
        userId: user.id,
        attempts: 1,
        blockDurationMultiplier: 1,
        blockUntil: null,
      });
    } else {
      attempts.attempts += 1;
      if (attempts.attempts >= maxFailedLoginAttempts) {
        user.canAuthenticate = false;
        attempts.blockUntil =
          Date.now() +
          1000 * 60 * defaultBlockingTime * attempts.blockDurationMultiplier;
        attempts.blockDurationMultiplier += 1;
        await user.save();
        await attempts.save();
        throw new TooManyAttemptsError(
          `Compte temporairement bloqué à la suite de nombreuses tentatives échouées. Veuillez réessayez dans ${getRemainingTime(
            attempts.blockUntil
          )}.`
        );
      }
      await attempts.save();
    }

    throw new InvalidCredentialsError(
      `Paramètres de connexion erronés. Il vous reste ${
        maxFailedLoginAttempts - (attempts ? attempts.attempts : 1)
      } tentatives.`
    );
  }
}

module.exports = new AuthHelpers();
