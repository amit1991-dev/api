require('dotenv').config();
require("./piping.js");

const bcrypt = require("bcrypt");
const User = require("../code/databases/system/users");
const HostInfos = require("../code/databases/events/host_info");

const Verifications = require("../code/databases/system/verifications");//verifyOTP
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');
const Students = require("../code/databases/student_center/students");
const Faculties = require("../code/databases/student_center/faculties");


const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
var crypto = require('crypto');
const Staff = require("../code/databases/staff/staff");

let panelSignature=process.env.PASSPORT_PANEL_SIGNATURE;
let clientSignature=process.env.PASSPORT_CLIENT_SIGNATURE;
let signature;

const salt= process.env.PASSPORT_SALT;

// import passportCustom from 'passport-custom';
const CustomStrategy = require("passport-custom").Strategy;
// const  = passportCustom.Strategy;

//saving the role of the candidate for the later purposes
passport.use('otp-strategy', new CustomStrategy(
  async function(req, callback) {
    if(req.body.otp && req.body.verification_id)
    {
        let role= req.body.role;
        let contact = await Verifications.verifyOTP(req.body.verification_id,req.body.otp);
        // console.log("contact"+contact);
        if(contact){
            // try{
                let user;
                if(await Users.exists({phone:contact})){
                    let systemUser = await Users.findOne({phone:contact});
                    if(!systemUser.enabled)
                    {
                      callback(null,false,{ message: 'Sorry, You are not enabled by the administrator, please contact the administrators for more details' });
                      await Verifications.unverifyOTP(req.body.verification_id);
                      return;
                    }
                    if(role=="user"){
                      console.log("going into user found as user:"+contact);
                      console.log(1);
                      if(await Students.exists({user:systemUser._id})){
                        console.log("going into student found");
                        user = await Students.findOne({user:systemUser._id});

                        console.log(user);
                        console.log("student found done");
                      }
                      else
                      {
                        console.log("going into student not found");
                        user = new Students({user:systemUser._id,phone:contact});
                        await user.save();
                      }
                      
                      signature = clientSignature;
                    }
                    else if(role=="faculty"){
                      console.log("faculty trying to login");
                      if(await Faculties.exists({user:systemUser._id})){
                        user = await Faculties.findOne({user:systemUser._id});
                      }
                      else
                      {
                        callback(null,false,{ message: 'Sorry, OTP Registration is not available for Faculties like this, please ask the institute to register you as a faculty!' });
                        await Verifications.unverifyOTP(req.body.verification_id);
                        return;
                      }
                      signature = clientSignature;
                    }
                    else
                    {
                      console.log(2);
                      user = await Staff.findOne({user:systemUser._id});
                      signature = panelSignature;
                    }
                }
                else
                {
                    console.log("going into user not found:"+contact);
                    if(role=="user"){
                      // console.log(3);
                      let systemUser;
                      if(!(await Users.exists({phone:contact}))){
                        systemUser = new Users({phone:contact});
                        await systemUser.save();
                      }
                      else
                      {
                        systemUser = await Users.findOne({phone:contact});
                      }
                      user = new Students({user:systemUser._id,phone:user.phone});
                      await user.save();
                      signature = clientSignature;
                    }
                    // else if(role=="faculty"){
                    //   // console.log(3);
                    //   callback(null,false,{ message: 'Sorry, OTP Registration is not available for Any other than student at this server members' });
                    //   await Verifications.unverifyOTP(req.body.verification_id);
                    //   return;
                    // }
                    else
                    {
                      // console.log(4);
                      callback(null,false,{ message: 'Sorry, OTP Registration is not available for Any other than student at this server members' });
                      await Verifications.unverifyOTP(req.body.verification_id);
                      return;
                    }
                }
                // console.log(user);
                console.log("what");
                let body={_id:user._id,role:role};
                const token = jwt.sign({ body }, signature);
                user = user.toObject();
                user.token = token;
                user.role= role;
                callback(null,user);
            // }
            // catch(err)
            // {
            //   await Verifications.unverifyOTP(req.body.verification_id);
            //     callback(err);
            // }
        }
        else
        {
            callback(null, false, { message: 'Incorrect latest one time password' });
            await Verifications.unverifyOTP(req.body.verification_id);
        }
    }
    else{
        callback(null, false, { message: 'Missing OTP or the Verifications ID' });

    }
  }
));

passport.use('local_strategy_admin_panel',
    new LocalStrategy({usernameField: "email",passwordField:"password",passReqToCallback:true},async function(req,email, password, done){
        const hashedPassword =  bcrypt.hashSync(req.body.password, salt);
        console.log("passport: inside localstrategy");
        try{
          let user=await Staff.findOne({email:email});
          // console.log(email);
          // console.log(user);

          if (!user) {
            console.log("passport: user not found");
            return done(null, false, { message: "Please Sign Up" });
          } 
          else 
          {
            // console.log(user);
            // console.log(user.password+":"+password);
              if(user.password==password){
                  console.log("passport:user found");

                  if(!user.enabled)
                  {
                    done(null,false,{ message: 'Sorry, You are not enabled by the administrator, please contact the administrators for more details' });
                    return;
                    
                  }
                  let role = user.role;
                  let body={_id:user._id,role:role};
                  const token = jwt.sign({ body }, panelSignature);// panelSignature is key used for encrypting jwt!
                  
                  user = user.toObject();
                  user.token = token;
                  user.role=role;
                  return done(null, user);
              }
              else{
                  return done(null, false, { message: "wrong password" });
              } 
          }
        }
        catch(err) {
            console.log("setup.js:"+err);
            return done(null, false, { message: err });
        }
      })
);

passport.use('jwt_admin',
  new JWTstrategy(
    {
      secretOrKey: panelSignature,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        
        let user = await Staff.findOne({_id:token.body._id}).lean().exec();
        delete user.password;
        // console.log("token role::"+token.body.role);
        user.role = token.body.role;
        // delete user.
        return done(null, user);
      } catch (error) {
        // console.log("token not found");
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
        // console.log(token);
        let role=token.body.role;
        let user;
        if(role == "user"){
          user = await Students.findOne({_id:token.body._id}).lean();
        }
        else if(role=="faculty")
        {
          user = await Faculties.findOne({_id:token.body._id}).lean();
        }
        user.role = role;
        
        //console.log("token role::"+token.body.role);
        return done(null, user);
      } catch (error) {
        console.log(error);
        done(null,false);
      }
    }
  )
);


// passport.use('jwt_faculty',
//   new JWTstrategy(
//     {
//       secretOrKey: clientSignature,
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
//     },
//     async (token, done) => {
//       try {
//         console.log(token);
//         let user = await Faculties.findOne({_id:token.body._id}).lean();
//         //console.log(user);
//         user.role = token.body.role;
        
//         //console.log("token role::"+token.body.role);
//         return done(null, user);
//       } catch (error) {
//         console.log(error);
//         done(null,false);
//       }
//     }
//   )
// );

module.exports = passport;
