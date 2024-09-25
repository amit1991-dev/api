const express = require("express");
const router = express.Router();
const transactionsRoute = require('./transactions');
const {performValidationPanel} = require('../../utility/authentication_functions.js');

router.use('/',performValidationPanel,transactionsRoute);

router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"Welcome to Transactions Panel api section!"};
	res.json(ret);
});

module.exports=router;
