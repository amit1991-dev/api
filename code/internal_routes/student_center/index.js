const express = require("express");
const router = express.Router();

const studentsRoute = require('./students');
const panelRoute = require("./panel");
const {performValidationUser,performValidationPanel} = require('../../utility/authentication_functions.js');



// router.use('/products/',productsRoute);
// router.use('/orders/',ordersRoute);
router.use('/',performValidationUser,studentsRoute);
router.use('/panel',performValidationPanel,panelRoute);
// router.use('/bookings',performValidationUser,bookingsRoute);
// router.use('/cart/',performValidationUser,cartRoute);
// router.use('/transactions/',performValidationUser,transactionsRoute);
// router.use('/wallet/',performValidationUser,walletRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"404! Welcome to Students api section but it seems you have put in a wrong path that does not exist!"};
	res.json(ret);
});


module.exports=router;
