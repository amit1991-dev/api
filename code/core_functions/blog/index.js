const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const Subscribers = require("../../databases/subscribers.js");
const sendMessage = require('../../utility/connectivity_functions');


router.post("/subscribe",async function(req,res,next){
    let email = req.body.email;
    let ret={status:"failed",message:"duplicated email address"};

    let subs = new Subscribers({email});
    try{
     await subs.save();
     ret.status="success";
     ret.message="done";

    }
    catch(err)
    {
     ret.message = err.message;
    }
    finally{
     res.status(200).json(ret);
    }
});


// add more routes: 
// 1.Create A Post. 
// 2. Add a response 
// 3. Add like or dislike per blog

module.exports = router;
