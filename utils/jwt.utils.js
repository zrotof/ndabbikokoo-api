const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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
    const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");
    const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

    // Verify the token with the provided secret key
    const payload = jwt.verify(token, PUB_KEY);
    return payload;
  } catch (error) {
    throw error;
  }
};