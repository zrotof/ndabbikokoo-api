const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const path = require("path");
const {models} = require("../models");

// Go up one directory, then look for file name
const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");

// The verifying public key
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token
  ]),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"]
};

// server.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {

  // The JWT payload is passed into the verify callback
  passport.use('user-jwt', new JwtStrategy(options, async (payload, done) => {
      try {

        const user = await models.User.findByPk(payload.sub);
      
        if (!user) {
          return done(null, false, { message: 'Invalid token' });
        }

        return done(null, user.id);

      } catch (error) {
        throw error;
      }
    })
  );

  // The JWT payload is passed into the verify callback
  passport.use('staff-jwt', new JwtStrategy(options, async (payload, done) => {
    try {
      const staff = await models.Staff.findOne({ where: { email: payload.sub } });
    
      if (!staff) {
        return done(null, false, { message: 'Invalid token' });
      }
      
      // Si le membre du staff est trouvé, renvoyer l'objet staff
      return done(null, staff);
      } catch (error) {
      throw error;
    }
  })
);
};

