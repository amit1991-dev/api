const express = require("express");
const router = express.Router();
const productsRoute = require('./products/index');
const cartRoute = require('./cart/index');
const transactionsRoute = require('./transactions/index');
const walletRoute = require('./wallet/index');
const ordersRoute = require('./orders/index');
const {performValidationPanel} = require('../../utility/authentication_functions.js');

router.use('/products/',performValidationPanel,productsRoute);
// router.use('/orders/',ordersRoute);
router.use('/orders/',performValidationPanel,ordersRoute);
router.use('/cart/',performValidationPanel,cartRoute);
router.use('/transactions/',performValidationPanel,transactionsRoute);
router.use('/wallet/',performValidationPanel,walletRoute);
router.use('/*',(req,res)=>{
	res.end("Welcome to Market api admin section!");
})


module.exports=router;
