const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const User = require("../databases/users");

const productsRoute = require('./products/index');
const cartRoute = require('./cart/index');

const transactionsRoute = require('./transactions/index');
const walletRoute = require('./wallet/index');



router.use('products/',productsRoute);
router.use('cart/',cartRoute);
router.use('transactions/',transactionsRoute);
router.use('wallet/',walletRoute);



module.exports=router;