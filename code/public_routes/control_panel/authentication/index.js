const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const User = require("../../../databases/system/users");

const {performLoginPanel,performValidationPanel} = require('../../../utility/authentication_functions');

router.post("/login",async function(req,res,next){
    performLoginPanel(req,res,next);
});

router.get("/whoami", performValidationPanel, async function(req,res,next){
	var ret = {};
	if(req.user)
	{
    	// console.log(req.user);
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
module.exports = router;
