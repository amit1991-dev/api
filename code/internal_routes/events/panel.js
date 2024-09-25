const express = require("express");
const router = express.Router();
const eventsRoute = require('./events');
const bookingsRoute = require("./bookings");
const advertisementsRoute = require("./advertisements");
const {performValidationPanel} = require('../../utility/authentication_functions.js');

router.use('/',performValidationPanel,eventsRoute);
router.use('/bookings',performValidationPanel,bookingsRoute);
router.use('/advertisements',performValidationPanel,advertisementsRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"Welcome to Events Panel api section!"};
	res.json(ret);
});

module.exports=router;
