const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const path = require("path");
const {models} = require("../models");

// Go up one directory, then look for file name
const pathToKey = path.join(__dirname, "..", "rsa-keys", "id_rsa_pub.pem");

// The verifying public key
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const userOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.user_token
  ]),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"]
};

const staffOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.staff_token
  ]),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"]
};

// server.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {

  // The JWT payload is passed into the verify callback
  passport.use('user-jwt', new JwtStrategy(userOptions, async (payload, done) => {
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


  passport.use('staff-jwt', new JwtStrategy(staffOptions, async (payload, done) => {
    try {
      
      const staff = await models.Staff.findByPk(payload.sub, {
        attributes : ["id"]
      });

      if (!staff) {
        return done(null, false, { message: 'Invalid token' });
      }
      
      return done(null, staff.id);
      } catch (error) {
      throw error;
    }
  })
);
};

