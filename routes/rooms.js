const express = require("express");
const roomRouter = express.Router();
const roomClass = require("../roomClass");
const Room = require("../node_models/rooms.js");


var rooms = new Map();

roomRouter.get('/create', async function(req, res) {
	let user=req.user;
	let ownerId = req.user._id;
	console.log(ownerId);

	let ret={status:"failed",message:"Authentication failure"};

	let cancelled = false;
	try{
		if(user)
		{
			let ownerId = user.id;
			let d=new Room({owner:ownerId});
			// console.log(d.id.toString());
			rooms.set(d.id.toString(),new roomClass(d.id,ownerId,req.io));
		  	console.log(rooms.keys());
		  	await d.save();
		  	console.log("room created: "+d._id+","+d.id);
		  	ret={status:"success",room_id:d.id};
		  	
		  	
		}
		
	}
	catch(e){
		console.log(e);
		ret.error=e;
	}
	finally{
		res.json(ret);
	}
	
  	
});


roomRouter.get('/status/:room_id', async function(req, res) {
	let user=req.user;
	let roomId = req.params.room_id;


	

	let ret={status:"failed",message:"Authentication failure"};

	let cancelled = false;
	try{
		if(user)
		{
			console.log(rooms.has(roomId));
			if(rooms.has(roomId))
			{

				var data = {};
				var room = rooms.get(roomId);
				data.id=roomId;
				data.masters = room.masters;
				data.primary = room.primary;
				data.chat = room.chat;
				data.user_states = room.user_states;

				ret.status = "success";
				ret.message = "all done";
				ret.data = data;

			}
			else
			{
				ret.message = "Room not found";
			}
		  	
		}
		
		
	}
	catch(e){
		console.log(e);
		ret.error=e;
		// ret.error= e;
	}
	finally{
		res.json(ret);
	}
	
  	
});

module.exports = {roomRouter,rooms};

