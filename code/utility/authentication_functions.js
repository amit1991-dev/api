const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const User = require("../databases/system/users");

// old local strategy function for logins
// function performLoginUser(req, res, next)
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

function performLoginUser(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("otp-strategy", function(err/* true-false */, user, info) {
        console.log("Entered authenticate");
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
            console.log("done authenticate");
            return res.status(200).json({ status:"success",message: `logged in ${user._id}`,data:user});
        });
        console.log(2);
    })(req, res, next);
}


function performValidationUser(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("jwt_user", { session: false },/*callback=>*/function(err, user, info) {
        console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log(info);
            return res.status(400).json({ status:"failed",message:info });
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            console.log("done authenticate");
            
            next();
            // const { password, updated_at,created_at,email_is_verified, ...other } = user._doc;
            //return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:user});
        });
    })(req, res, next);
}


function performLoginPanel(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("local_strategy_admin_panel", function(err, user, info) {
        console.log("Entered authenticate");
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
            console.log("Doing final packing of the return login data...");
            const { password,email, ...other } = user;
            return res.status(200).json({ status:"success",message: `logged in ${user._id}`,user_id:user.id,user:other});
        });
        console.log(2);
    })(req, res, next);
}

function performValidationPanel(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("jwt_admin", { session: false },/*callback=>*/function(err, user, info) {
        console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log("user not found");
            return res.status(400).json({ status:"failed",message:"user not found" });
        }

        console.log(user);

        req.logIn(user, function(err) {
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            console.log("done authenticate");
            next();
        });
    })(req, res, next);
}

module.exports={performLoginUser,performLoginPanel,performValidationUser,performValidationPanel};