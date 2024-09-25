const express = require("express");
const router = express.Router();

const Events = require("../../databases/events/events.js");
const Users = require("../../databases/system/users.js");
const Advertisements = require("../../databases/events/advertisements.js");
const Ads = require("../../databases/events/advertisements.js");


router.get("/",async function(req,res){
	console.log("fetching ads");
	// let userId=req.user._id;
	let query = req.query;
	let role= req.user.role;
	console.log(query);
	let ads;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		if(role=="administrator")
		{
			ads = await Advertisements.find(query);
		}
		else if(role=="host")
		{
			throw {message:"This API is not for this role",code:-1};
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request",code:-2};
		}

		ret.data = ads;

	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.get("/single/:ad_id",async function(req,res){
	// let userId=req.user._id;
	let adId = req.params.ad_id;
	console.log("fetching ads");
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		if(role=="administrator" || role=="host")
		{
			let ad = await Advertisements.findOne({_id:adId}).populate([{path:"user"},{path:"host"},{path:"event",populate:["host","medias"]},{path:"transaction"}]);
			ret.status="success";
			ret.message = "done";
			ret.data=ad;
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
			let ads = new Ads(ad);
			await ads.save();
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
