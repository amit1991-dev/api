const express = require("express");
const router = express.Router();

const walletsRoute = require('./wallet.js');
const {performValidationUser} = require('../../utility/authentication_functions.js');
router.use('/wallet',performValidationUser,walletsRoute);
router.use('/*',(req,res)=>{
	let ret = {status:"failed",message:"Resource not found"};
	res.json(ret);
});
module.exports=router;
