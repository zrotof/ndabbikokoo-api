const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const {
AuthenticationError,
InvalidCredentialsError
} = require('../utils/errors')

exports.generateToken = async (userId, expiresIn) => {
  try {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    };

    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_priv.pem");

    // The verifying public key
    const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

    const signedToken = jwt.sign(payload, PRIV_KEY, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });

    return signedToken;
  } catch (error) {
    throw error;
  }
};

exports.verifyToken = async (token) => {
  try {
    if(!token){
      throw new AuthenticationError("No token provided", 401);
    }

    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");
    const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

    const payload = await jwt.verify(token, PUB_KEY);
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token has expired", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidCredentialsError("Invalid token", 403);
    }

    throw error;
  }
};