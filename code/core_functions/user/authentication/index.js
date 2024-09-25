const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const User = require("../../../databases/users");


const {performLoginUser,performValidationUser} = require('../../../utility/authentication_functions');


router.post("/login",async function(req,res,next){
     performLoginUser(req,res,next);
});


router.get("/whoami", performValidationUser, async function(req,res,next){
//console.log(req.user);
	var ret = {};
	if(req.user)
	{
    	console.log(req.user);
    	ret.data=req.user;
    	ret.status="success";
    	res.status(200).json(ret);	

	}
	else
	{
		ret.status="failed";
		res.status(403).json(ret);
	}
console.log("whoami complete");
});

router.get("/logout", async function(req,res,next){
	if(req.user)
	{
		req.logout();
    }
	ret.status="success";
    res.status(200).json(ret);  
    // console.log("logout complete");
});

router.post("/register",async function(req,res,next){
     console.log(req.body);
    if(validator.validate(req.body.email) && req.body.password.length>6){

        const salt = bcrypt.genSaltSync(2);
        
        const hashedPassword =  bcrypt.hashSync(req.body.password, salt);

        const newUser = new User(req.body);

        newUser.save().then(async function(){

        performLoginUser(req,res,next);// this performs login

        }).catch(function(err){
            console.log(err);
            res.json({status:"failed",message:"User already registered."});
        });
    }
    else{
        res.status(400).json({status:"failed",message:"Improper email or password"});
    }
});

// router.post("/forgot_password/:email",async function(req,res,next){
//      console.log(req.body);
//     if(validator.validate(req.body.email) && req.body.password.length>6){

//         const salt = bcrypt.genSaltSync(2);
        
//         const hashedPassword =  bcrypt.hashSync(req.body.password, salt);

//         const newUser = new User(req.body);

//         newUser.save().then(async function(){

//         performLoginUser(req,res,next);// this performs login

//         }).catch(function(err){
//             console.log(err);
//             res.json({status:"failed",message:"User already registered."});
//         });
//     }
//     else{
//         res.status(400).json({status:"failed",message:"Improper email or password"});
//     }
// });



module.exports = router;
