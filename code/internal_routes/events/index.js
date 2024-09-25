const express = require("express");
const router = express.Router();

const eventsRoute = require('./events');
const bookingsRoute = require("./bookings");
const {performValidationUser} = require('../../utility/authentication_functions.js');



// router.use('/products/',productsRoute);
// router.use('/orders/',ordersRoute);
router.use('/',performValidationUser,eventsRoute);
router.use('/bookings',performValidationUser,bookingsRoute);
// router.use('/cart/',performValidationUser,cartRoute);
// router.use('/transactions/',performValidationUser,transactionsRoute);
// router.use('/wallet/',performValidationUser,walletRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"Welcome to Events api section!"};
	res.json(ret);
});


module.exports=router;
