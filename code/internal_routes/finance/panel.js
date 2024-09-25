const express = require("express");
const router = express.Router();
const walletsRoute = require('./wallets');
const {performValidationPanel} = require('../../utility/authentication_functions.js');

router.use('/wallet',performValidationUser,walletsRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"success",message:"Welcome to Finance Panel api section!"};
	res.json(ret);
});

module.exports=router;
