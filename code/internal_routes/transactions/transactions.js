const express = require("express");
const router = express.Router();
const Users = require("../../databases/system/users.js");
const Advertisements = require("../../databases/events/advertisements.js");
const Transactions = require("../../databases/finance/transactions.js");

router.get("/",async function(req,res){
	console.log("fetching ads");
	// let userId=req.user._id;
	let query = req.query;
	let role= req.user.role;
	console.log(query);
	let transactions=[];
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		if(role=="administrator")
		{
			transactions = await Transactions.find(query);
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request",code:-2};
		}
		ret.data = transactions;

	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.get("/single/:transaction_id",async function(req,res){
	// let userId=req.user._id;
	let transasctionId = req.params.transaction_id;
	console.log("fetching transaction");
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let transaction = await Transactions.findOne({_id:transasctionId});
		ret.status="success";
		ret.message = "done";
		ret.data=transaction;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	res.status(200).json(ret);
});

router.post("/create",async function(req,res){
	let userId=req.user._id;
	let role= req.user.role;
	console.log(role);
    let ad = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	console.log("creating Ad"+JSON.stringify(ad));
	try{
		// console.log(role);
		if(role=="administrator" || role == "host")
		{
			ad.host = userId;
			let ads = new Ads(ad);
			
			console.log(role);
			await ads.save();
			let host = await Users.findById(userId);
			
			ads.host = host._id;
			console.log(ads.host);
			ret.status="success";
			ret.data = e.toObject();
			ret.code=200;
			ret.message = "created";
		}
		else
        {
            ret.status="failed";
            ret.message = "Role is not suitable to create an Event:"+role;
			ret.code=-1;
        }
	}
	catch(err)
	{
		console.log(err);
		ret.status="failed";
        ret.message = err.message;
		ret.code=-10;
	}
	
	res.status(200).json(ret);
	
});

router.post("/edit/:ad_id",async function(req,res){
	let userId=req.user._id;
    let adId = req.params.ad_id;
	let role= req.user.role;
	let ad = req.body;
	console.log(ad);
	if(ad.transaction)
	{
		delete ad.transaction;
		console.log("removed transaction from the body");
	}
	let ret = {status:"failed",code:0,message:"initialized"};
	let status=false;
	try{
		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		delete ad.host;
		if(role=="administrator")
		{
			status= await Ads.updateAd(adId,ad);
			if(!status)
			{
				throw {message:"Update failed for Admin"};
			}
			
		}
		else
		{
			// delete event.blocked;
			// delete event.medias;
			// delete event.phases;
			// delete event.thumbnail;
			let host = await Ads.getHost(adId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			console.log(host);
			console.log(userId);
			if(host.toString() == userId.toString())
			{
				if(!(await Ads.updateAd(adId,ad)))
				{
					throw {message:"update failed for Host"};
				}
			}
			else{
				throw {message:"Host not allowed to edit other hosts advertisements"};
			}
		}
        console.log("Update Successful");
		ret.status = "success";
		ret.code=200;
		ret.message = "done";
	}
	catch(err)
	{
		console.log(err.message);
		ret.message = err.message;
	}
	res.status(200).json(ret);
	
});

module.exports = router;
