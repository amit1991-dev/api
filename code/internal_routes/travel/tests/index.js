const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
// const User = require("../../databases/users");


// router.post("/login",async function(req,res,next){
//      performLogin(req,res,next);
// });


// router.get("/whoami", performValidation, async function(req,res,next){
// //console.log(req.user);
// 	var ret = {};
// 	if(req.user)
// 	{
//     	console.log(req.user);
//     	ret.data=req.user;
//     	ret.status="success";
//     	res.status(200).json(ret);	

// 	}
// 	else
// 	{
// 		ret.status="failed";
// 		res.status(403).json(ret);
// 	}
// console.log("whoami complete");
// });

// router.get("/logout", async function(req,res,next){
// 	if(req.user)
// 	{
// 		req.logout();
//     }
// 	ret.status="success";
//     res.status(200).json(ret);  
//     // console.log("logout complete");
// });

// router.post("/register",async function(req,res,next){
//      console.log(req.body);
//     if(validator.validate(req.body.email) && req.body.password.length>6){

//         const salt = bcrypt.genSaltSync(2);
        
//         const hashedPassword =  bcrypt.hashSync(req.body.password, salt);

//         const newUser = new User({ email:req.body.email,password:req.body.password, username:req.body.username});

//         newUser.save().then(async function(){

//         performLogin(req,res,next);// this performs login

//         }).catch(function(err){
//             console.log(err);
//             res.json({status:"failed",message:"User already registered."});
//         });
//     }
//     else{
//         res.status(400).json({status:"failed",message:"Improper email or password"});
//     }
// });


// function performLogin(req, res, next)
// {
//     //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
//     passport.authenticate("local_strategy_user", function(err, user, info) {
//         console.log("Entered authenticate");
//         if (err) {
//             console.log("err authenticate"+err);
//             return res.status(400).json({ status:"failed",message:err });
//         }

//         if (!user) {
//             console.log(1);
//             console.log(info);
//             return res.status(400).json({ status:"failed",message:info.message });
//         }

//         req.logIn(user, function(err) {
//             if (err) {
//                 console.log("err login");
//                 return res.status(400).json({ status:"failed",message : err });
//             }
//             console.log("done authenticate");
//             const { password, updated_at,created_at,email_is_verified, ...other } = user._doc;
//             return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:{...other,id:other._id}});
//         });
//         console.log(2);
//     })(req, res, next);
// }

// function performValidationUser(req, res, next)
// {
//     //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
//     passport.authenticate("jwt_user", { session: false },/*callback=>*/function(err, user, info) {
//         console.log("Entered authenticate");
//         if (err) {
//             console.log("err authenticate"+err);
//             return res.status(400).json({ status:"failed",message:err });
//         }

//         if (!user) {
//             console.log(info);
//             return res.status(400).json({ status:"failed",message:info.message });
//         }

//         req.logIn(user, function(err) {
//             if (err) {
//                 console.log("err login");
//                 return res.status(400).json({ status:"failed",message : err });
//             }
//             console.log("done authenticate");
//             // const { password, updated_at,created_at,email_is_verified, ...other } = user._doc;
//             return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:user});
//         });
//     })(req, res, next);
// }

module.exports = router;
