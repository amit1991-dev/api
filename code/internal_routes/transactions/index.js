const express = require("express");
const router = express.Router();

const transactionsRoute = require('./events');
// const bookingsRoute = require("./bookings");
const {performValidationUser} = require('../../utility/authentication_functions.js');

router.use('/',performValidationUser,transactionsRoute);
// router.use('/bookings',performValidationUser,bookingsRoute);
// router.use('/cart/',performValidationUser,cartRoute);
// router.use('/transactions/',performValidationUser,transactionsRoute);
// router.use('/wallet/',performValidationUser,walletRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"Welcome to Transaction api section!"};
	res.json(ret);
});



module.exports=router;
