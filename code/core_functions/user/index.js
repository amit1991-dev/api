const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const User = require("../../databases/users");

const verificationRoute = require('./verification/index');
const authenticationRoute = require('./authentication/index');

router.use('/verification/',verificationRoute);
router.use('/authentication/',authenticationRoute);
router.use('/socials/',socialsRoute);
router.use('/market/',marketRoute);
router.use('/education/',educationRoute);

module.exports=router;
