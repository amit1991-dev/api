const express = require("express");
const router = express.Router();
const userRoute = require('./profile');
// const bookingsRoute = require("./bookings");

const {performValidationPanel} = require('../../utility/authentication_functions.js');
const hostRoute = require('./host');


// router.use('/products/',productsRoute);
// router.use('/orders/',ordersRoute);
// router.use('/',performValidationPanel,eventsRoute);
// router.use('/bookings',performValidationPanel,bookingsRoute);
router.use("/",performValidationPanel,userRoute);
router.use('/host/',performValidationPanel,hostRoute);
// router.use('/cart/',performValidationUser,cartRoute);
// router.use('/transactions/',performValidationUser,transactionsRoute);
// router.use('/wallet/',performValidationUser,walletRoute);
router.use('/*',(req,res)=>{
	res.end("Welcome to User Panel api section!");
});

module.exports=router;
