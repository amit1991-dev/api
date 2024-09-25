 const express = require("express");
const router = express.Router();

const Directories = require("../../node_models/directories.js");
const Files = require("../../node_models/files.js");

const Student = require("../../node_models/students");

const Questions = require("../../node_models/questions");
const Results = require("../../node_models/results");
const {Topics,SubTopics,Chapters,Categories} = require("../../node_models/academics");
const Test = require("../../node_models/tests");

const passport = require("passport");

const mongoose = require("mongoose");
// const passport = require("passport");

router.post("/login",async function(req,res,next){
    console.log("inside login");
     performLogin(req,res,next);
});


router.post("/register", (req, res, next) => {
    // let ownerId=req.user._id;
    let student=req.body;
    
    let ret={message:"",status:"failed"};
    // console.log(req.body);

    let d=new Student(student);
    
    d.save((err)=>{
        if (err){
		console.log(err);
            if(err.code == 11000)
            {
                ret.message="Email already present";
            }
            else{
                ret.message="Some error occured, please check the values sent in the form";
            }
            
            // console.log(err);
        } 
        else {

            // console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=d._id;
            // res.redirect("/directories");
        }
        res.status(200).json(ret);      

    });
});
   
function performLogin(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("local_strategy_student", function(err, user, info) {
        // console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log(1);
            console.log(info);
            return res.status(400).json({ status:"failed",message:info.message });
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            // console.log("done authenticate");
            const { password,password_hash,login_time, updated_at,created_at,email_is_verified,__v, ...other } = user._doc;
            return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:{...other,id:other._id}});
        });
        console.log(2);
    })(req, res, next);
}

function performValidation(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("jwt_student", { session: false },/*callback=>*/function(err, user, info) {
        // console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log(info);
            return res.status(400).json({ status:"failed",message:info.message });
        }

        req.logIn(user, function(err) {
            let {  password, password_hash, email_is_verified, login_time,updated_at,created_at,__v, ...other } = user;
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            // console.log("done authenticate");
            // const { password, updated_at,created_at,email_is_verified, ...other } = user._doc;
            return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:other});
        });
    })(req, res, next);
}
module.exports=router;
