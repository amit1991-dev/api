const express = require("express");
const router = express.Router();

const Events = require("../../databases/events/events.js");
const Users = require("../../databases/system/users.js");
const Bookings = require("../../databases/events/bookings.js");
// const Tickets = require("../../databases/events/tickets.js");
// const Transactions = require("../../databases/events/transactions.js");
// const Hosts = require("../../databases/events/index.js");
// const {bookingHash}=require("../../utility/hashing_functions");

router.get("/",async function(req,res){
	let userId=req.user._id;
	let query = req.query;
	let role= req.user.role;
	console.log(query);
	let eventPopulate = [{path:"host"},{path:"phases",populate:{path:"categories",populate:{path:"tickets"}}},{path:"media"},{path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}];

	let bookings ;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		if(role=="user" || role=="host")
		{
			if(!query)
			{
				query = {event_status:"upcoming"};
			}
		}
		bookings = await Bookings.find(query).populate([{path:"user"},{path:"host"},{path:"event",populate:eventPopulate},{path:"tickets",populate:[{path:"event",populate:eventPopulate}]},{path:"transaction"}]);

		console.log(JSON.stringify(bookings));

		ret.data = bookings;

	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=err.code;
	}
	res.status(200).json(ret);
	
});

router.get("/single/:booking_id",async function(req,res){
	let userId=req.user._id;
	let bookingId = req.params.booking_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	let eventPopulate = [{path:"host"},{path:"phases",populate:{path:"categories",populate:{path:"tickets"}}},{path:"media"},{path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}];
	try{
		let booking = await Bookings.findOne({_id:bookingId}).populate([{path:"user"},{path:"host"},{path:"event",populate:eventPopulate},{path:"tickets",populate:[{path:"event",populate:eventPopulate}]},{path:"transaction"}]);
		ret.status="success";
		ret.message = "done";
		console.log(booking);
		ret.data=booking;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	res.status(200).json(ret);
});

module.exports = router;
