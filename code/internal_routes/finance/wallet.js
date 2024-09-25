const express = require("express");
const router = express.Router();

const Events = require("../../databases/events/events.js");
const Users = require("../../databases/system/users.js");
const Wallets = require("../../databases/finance/wallets");
// const Ads = require("../../databases/events/advertisements.js");


router.get("/",async function(req,res){
	console.log("fetching wallets");
	// let userId=req.user._id;
	let query = req.query;
	let role= req.user.role;
	console.log(query);
	let wallets;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		if(role=="administrator")
		{
			wallets = await Wallets.find(query);
		}
		else if(role=="host")
		{
			throw {message:"This API is not for this role",code:-1};
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request",code:-2};
		}

		ret.data = wallets;

	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.get("/single/:wallet_id",async function(req,res){
	// let userId=req.user._id;
	let walletId = req.params.wallet_id;
	console.log("fetching wallet");
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		if(role=="administrator" || role=="host")
		{
			let wallet = await Wallets.getWallet(walletId);
			if(wallet)
			{
				ret.status="success";
				ret.message = "done";
				ret.data=wallet;
			}
			else{
				throw {message:"Wallet fetching error, see server console for more information",code:-2};
			}
			
		}
		else{
			throw {message:"role "+role+" is not accepted for this request",code:-2};
		}
		
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	res.status(200).json(ret);
});

router.get("/single_user_wallet/:user_id",async function(req,res){
	// let userId=req.user._id;
	let userId = req.params.user_id;
	console.log("fetching wallet");
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		if(role=="administrator" || role=="host")
		{
			let wallet = await Wallets.getUserWallet(userId);
			if(wallet)
			{
				ret.status="success";
				ret.message = "done";
				ret.data=wallet;
			}
			else{
				throw {message:"Wallet fetching error, see server console for more information",code:-2};
			}
			
		}
		else{
			throw {message:"role "+role+" is not accepted for this request",code:-2};
		}
		
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	res.status(200).json(ret);
});

router.get("/user_wallet",async function(req,res){
	// let userId=req.user._id;
	let userId = req.user._id;
	console.log("fetching wallet");
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		
		let wallet = await Wallets.getUserWallet(userId);
		if(wallet)
		{
			ret.status="success";
			ret.message = "done";
			ret.data=wallet;
		}
		else{
			throw {message:"Wallet fetching error, see server console for more information",code:-2};
		}
		
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	res.status(200).json(ret);
});

module.exports = router;
