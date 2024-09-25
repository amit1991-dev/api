const bcrypt = require("bcrypt");
const User = require("../node_models/users");
const passport = require("passport");

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;



passport.use('jwt',
  new JWTstrategy(
    {
      secretOrKey: 'jwt@neoned71',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
module.exports = passport;