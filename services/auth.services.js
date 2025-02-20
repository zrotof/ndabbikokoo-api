
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { models, sequelize } = require("../models");

const { defaultBlockingTime, tokenLifeTimeOnLogin, maxFailedLoginAttempts } = require("../config/dot-env");
const authHelpers = require("../helpers/auth.helpers");

const {
  NotFoundError,
  CustomError,
  AccountNotValidatedError
} = require("../utils/errors");



const { generateToken, verifyToken } = require("../utils/jwt.utils");
const { isPasswordValid } = require("../helpers/password.helpers");

class AuthService {
  
  async loginSubscriber (email, password) {
    try {
  
      // Recherche de l'utilisateur par email
      const user = await models.User.findOne({ where: { email } });
  
      if (!user) {
        throw new NotFoundError(
          "Données incorrectes! Veuillez vérifier votre email ou votre mot de passe !"
        );
      }
  
      // Vérification si le compte est validé
      if (!user.isAccountValidated) {
        throw new AccountNotValidatedError(
          `Votre compte n'a pas encore été validé! Veuillez cliquer sur le lien de validation transmis par mail à ${user.email}.`
        );
      }
  
      const resetUserPassword = await models.UserPasswordResetRequest.findOne({
        where: {
          userId: user.id,
        },
      });
  
      if(resetUserPassword){
        throw new CustomError("Vous ne pouvez vous connecter car une demande de changement de mot de passe est déjà en cours. Veuillez vérifier votre email pour le lien de réinitialisation de ce dernier.",403)
      }
  
      // Recherche des tentatives de connexion par utilisateur
      let attempts = await models.LoginAttempt.findOne({
        where: {
          userId: user.id
        },
      });

      // Gestion du blocage si des tentatives existent pour cet utilisateur
      if (attempts && !user.canAuthenticate) {
        const isBlockDurationPassed = Date.now() > attempts.blockUntil;
        if (isBlockDurationPassed) {
          await authHelpers.resetLoginAttempts(user, attempts);
        } else {
          await authHelpers.handleBlockedUser(attempts, defaultBlockingTime);
        }
      }

    const isValid = isPasswordValid(password, user.password, user.salt);
    if (!isValid) {
      await authHelpers.handleFailedLogin(user, attempts, maxFailedLoginAttempts, defaultBlockingTime);
    }

    await authHelpers.handleSuccessfulLogin(user, attempts, defaultBlockingTime);

    const token = await generateToken(user.id, tokenLifeTimeOnLogin);
    
    return token;
  
    } catch (e) {
      throw e;
    }
  }

  async isTokenValid (token) {
    try {
      return await verifyToken(token);
    } catch (e) {
      throw e;
    }
  } 

}

module.exports = new AuthService();
