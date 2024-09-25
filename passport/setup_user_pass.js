const bcrypt = require("bcrypt");
require('dotenv').config();
const User = require("../code/databases/system/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');

let panelSignature=process.env.PASSPORT_PANEL_SIGNATURE;
let clientSignature=process.env.PASSPORT_CLIENT_SIGNATURE;
const salt= process.env.PASSPORT_SALT;


var crypto = require('crypto');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local_strategy_admin_panel',
    new LocalStrategy({ usernameField: "email",passwordField:"password",passReqToCallback : true }, async function(req,email, password, done){
        const hashedPassword =  bcrypt.hashSync(req.body.password, salt);
        
        console.log("passport: inside localstrategy");
        User.findOne({ email: email,password:password,role:"administrator"}).then(user => {
            if (!user) {
                console.log("passport: user not found");
                return done(null, false, { message: "Please Sign Up" });
                
            } else {
                if(user.password==password){
                    console.log("passport:user found");
                    //user.token=uuidv4();
                    const body = { _id: user._id, id: user._id, email: user.email,role:user.role };
                    const token = jwt.sign({ user: body }, panelSignature);
                    user.token=token;
                    user.save();
                    return done(null, user);
                }
                else{
                    return done(null, false, { message: "wrong password" });
                }
                
            }
        })
        .catch(err => {
            console.log("setup.js:"+err);
            return done(null, false, { message: err });
        });
    })
);

passport.use('local_strategy_user',
    new LocalStrategy({ usernameField: "email",passwordField:"password",passReqToCallback : true }, async function(req,email, password, done){
        const hashedPassword =  bcrypt.hashSync(req.body.password, salt);

        

        console.log("passport: inside localstrategy");
        User.findOne({ email: email,password:password}).then(user => {
            if (!user) {
                console.log("passport: user not found");
                return done(null, false, { message: "Please Sign Up" });
                
            } else {
                if(user.password==password){
                    console.log("passport:user found");
                    //user.token=uuidv4();
                    const body = { _id: user._id, id: user._id, email: user.email,role:user.role };
                    const token = jwt.sign({ user: body }, clientSignature);
                    user.token=token;
                    user.save();
                    return done(null, user);
                }
                else{
                    return done(null, false, { message: "wrong password" });
                }
                
            }
        })
        .catch(err => {
            console.log("setup.js:"+err);
            return done(null, false, { message: err });
        });
    })
);

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


passport.use('jwt_admin',
  new JWTstrategy(
    {
      secretOrKey: panelSignature,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        // console.log(token.user);
        return done(null, token.user);
      } catch (error) {
        // console.log(error);
        done(null,false);
      }
    }
  )
);

passport.use('jwt_user',
  new JWTstrategy(
    {
      secretOrKey: clientSignature,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        // console.log(token.user);
        return done(null, token.user);
      } catch (error) {
        // console.log(error);
        done(null,false);
      }
    }
  )
);

module.exports = passport;
