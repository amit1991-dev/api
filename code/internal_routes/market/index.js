const express = require("express");
const router = express.Router();

const productsRoute = require('./products/index');
const cartRoute = require('./cart/index');

const transactionsRoute = require('./transactions/index');
const walletRoute = require('./wallet/index');

const ordersRoute = require('./orders/index');

const {performValidationUser} = require('../../utility/authentication_functions.js');



router.use('/products/',productsRoute);
// router.use('/orders/',ordersRoute);
router.use('/orders/',performValidationUser,ordersRoute);
router.use('/cart/',performValidationUser,cartRoute);
router.use('/transactions/',performValidationUser,transactionsRoute);
router.use('/wallet/',performValidationUser,walletRoute);
router.use('/*',(req,res)=>{
	res.end("Welcome to Market api section!");
})


module.exports=router;
