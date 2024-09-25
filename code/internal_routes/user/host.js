const express = require("express");
const router = express.Router();

const Events = require("../../databases/events/events.js");
const Users = require("../../databases/system/users.js");
const Bookings = require("../../databases/events/bookings.js");
const HostInfos = require("../../databases/events/host_info.js");
const Tickets = require("../../databases/events/tickets.js");
const {bookingHash}=require("../../utility/hashing_functions");
const jwt = require('jsonwebtoken');


router.get("/all",async function(req,res){
	let userId=req.user._id;
	let query = req.query;
	let role= req.user.role;
	console.log("query");
	console.log(query);
	let user;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		
		
		if(role=="administrator")
		{
			user = await Users.find(query);	
		}
		else
		{
			throw {message:"Only administrator is allowed to request.",code:-1};
		}
        ret.status="success";
		ret.data = user;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.get("/single/:info_id",async function(req,res){
	// let userId=req.user._id;
	let infoId = req.params.info_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let info = await HostInfos.findById(infoId).populate("host");
		// user = user.toObject();
		// if(user.enabled_as_host)
		// {
		// 	console.log("trying to get host info");
		// 	if(!(await HostInfos.exists({host:userId})))
		// 	{
		// 		let h= new HostInfos({host:userId});
		// 		await h.save();
		// 	}
		// 	let host_info = await HostInfos.getInformation(userId);
		// 	user.host_information = host_info;
		// 	console.log("attatching host info");
		// }
		ret.status="success";
		ret.data=info;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
        ret.code=err.code;
	}
	res.status(200).json(ret);
	
});


router.get("/host_info/:host_id",async function(req,res){
	let userId=req.user._id;
	let hostId = req.params.host_id;
	let role = req.user.role;
	console.log("host info logs");
	console.log(role);
	// let eventId = req.params.event_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		if(role == "host")
		{
			console.log("yes role is correct");
			console.log(userId+":"+hostId);
			if(userId.toString() == hostId.toString())
			{
				console.log("yes role is correct");
				if(!(await HostInfos.exists({host:hostId})))
				{
					let h= new HostInfos({host:hostId});
					await h.save();
				}
				let data= await HostInfos.findOne({host:hostId});
				console.log(data);
				ret.data = data.toObject();
				ret.status = "success";
			}
			else{
				throw {message:"host cannot access someones else's account information"};
			}
		}
		else if(role == "administrator")
		{
			
			if(!(await HostInfos.exists({host:hostId})))
			{
				let h= new HostInfos({host:hostId});
				await h.save();
			}
			let data= await HostInfos.findOne({host:hostId});

			ret.data = data.toObject();
			ret.status = "success";
			
		}
		else{
			throw {message:"Not suitable for this role of the user"};
		}
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
        ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.post("/switch_to_client", async function(req,res){
	let userId = req.user._id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		// let user = await Users.findById(userId);
		let clientSignature=process.env.PASSPORT_CLIENT_SIGNATURE;
		let body={_id:userId,role:"user"};
		const token = jwt.sign({ body }, clientSignature);
		ret.status="success";
		ret.data = token;
		res.status(200).json(ret);
	}
	catch(err)
	{
		ret.message = err.message;
		res.status(200).json(ret);
	}
});


router.post("/edit_host_info/:host_id",async function(req,res){
	console.log("inside edit host information");
	let userId=req.user._id;
	let hostId = req.params.host_id;
	let role = req.user.role;
	let body = req.body;
	// let eventId = req.params.event_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		if(role == "host")
		{
			if(userId.toString() == hostId.toString())
			{
				if(!(await HostInfos.exists({host:hostId})))
				{
					let h= new HostInfos({host:hostId});
					await h.save();
				}
				await HostInfos.findOneAndUpdate({host:hostId},{$set:body});
				// console.log(data);
				// ret.data = data.toObject();
				ret.status = "success";
			}
			else{
				throw {message:"host cannot access someones else's account information"};
			}
		}
		else if(role == "administrator")
		{
			
			if(!(await HostInfos.exists({host:hostId})))
			{
				let h= new HostInfos({host:hostId});
				await h.save();
			}
			await HostInfos.findOneAndUpdate({host:hostId},{$set:body});

			// ret.data = data.toObject();
			ret.status = "success";
			
		}
		else{
			throw {message:"Not suitable for this role of the user"};
		}
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
        ret.code=err.code;
	}
	res.status(200).json(ret);
	
});
//Only for editing name and email address if not admin, else anything can be updated from here!
router.post("/edit/:user_id",async function(req,res){
	let selfId=req.user._id;
    let userId=  req.params.user_id;
	let role= req.user.role;
	let profile = req.body;
	console.log("editing a user with body");
	console.log(profile);
	console.log(role);
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
        // let user = await Users.findById(userId);
		if(role!="administrator")
		{
			// throw {message:"not authorized",code:-1};
            // Only allowed to change email and name like this
            delete profile.enabled;
            delete profile.password;
            delete profile.phone;
            delete profile.enabled_as_administrator;
            delete profile.enabled_as_host;
            delete profile.token;
            delete profile.display_picture;
            delete profile._id;
            if(selfId!=userId)
            {
                throw {message:"Not allowed to edit someone else's Profile.",code:-1};
            }
        }
		await Users.updateOne({_id:userId},{$set:profile});
		
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


router.post("/edit_dp/:user_id",/* A file upload middleware for bucket missing here! */async function(req,res){
	let selfId=req.user._id;
    let userId=  req.params.user_id;
	let role= req.user.role;
	let fileUrl = req.body.url;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
        // let user = await Users.findById(userId);
		if(role!="administrator")
		{
            if(selfId!=userId)
            {
                throw {message:"Not allowed to edit someone else's Profile.",code:-1};
            }
		}
        
		
		await Users.updateOne({_id:userId},{$set:{display_picture:fileUrl}});
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
