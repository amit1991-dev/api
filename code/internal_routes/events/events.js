const express = require("express");
const router = express.Router();

const {Events,EventPhases,PhaseCategories,CategoryTickets, Medias} = require("../../databases/events/events.js");
const Users = require("../../databases/system/users.js");
const Bookings = require("../../databases/events/bookings.js");
const Tickets = require("../../databases/events/tickets.js");
const Orders = require("../../databases/finance/orders.js");
const Hosts = require("../../databases/events/index.js");
const {bookingHash}=require("../../utility/hashing_functions");
const Ads = require("../../databases/events/advertisements.js");


async function getEvents(filter,forUser=false)
{
	if(forUser){
		filter.event_status="upcoming";
		filter.enabled=true;
		filter.published=true;
		if(!filter.event_timestamp)
		{
			filter.event_timestamp={$gte:new Date()};
		}
	}
	return await Events.find(filter).populate({path:"host"}).populate("media").sort({event_timestamp:-1});
	// return await Events.find(filter).populate({path:"host",select:'-token -password -enabled_as_administrator -enabled_as_host -email'}).populate("media").sort({event_timestamp:-1});
}

async function getEvent(filter)
{
	let event = await Events.findOne(filter).populate([{path:"host"},{path:"phases",populate:{path:"categories",populate:{path:"tickets"}}},{path:"media"},{path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}]).exec();
	return event;
}

router.get("/",async function(req,res){
	let userId=req.user._id;
	let query = req.query;
	

	let role= req.user.role;
	console.log(query);
	let events;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		
		if(role=="administrator")
		{
			events = await getEvents(query)
			
		}
		else if(role=="host")
		{
			console.log("host accessing events");
			// events = await Events.find().populate("host").populate("media");
			events = await getEvents({host:userId});
		}
		else if(role=="helper")
		{
			console.log("helper accessing events");
			let helper = await Users.findById(userId);
			let phone = helper.phone;
			// events = await Events.find().populate("host").populate("media");
			events = await getEvents({helpers:phone});
			// events = await getEvents({host:userId});
			console.log("Events count: "+events.length);
		}
		else if(role=="user")
		{
			events = await getEvents(query,true);
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request"};
		}
		ret.data = events;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
});

router.get("/featured",async function(req,res){
	let userId=req.user._id;
	let query = req.query;
	let city= req.query.city;
	let role= req.user.role;
	console.log(query);
	let events ;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		
		if(role=="user")
		{
			// events = await Ads.findFeatured(city);
			events = await getEvents({},true);
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request"};
		}
		ret.data = events;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});


router.get("/search/:pattern",async (req, res, next) => {
    let userId=req.user._id;
    let pattern = req.params.pattern;
	let city = req.query.city;
	let filter = {'_id':pattern};
	let ret = {status:"failed",code:0,message:"initialized"};

	filter.city = city;
	console.log(filter);
	
    if(pattern.length==24)
    {
        try{
            let events = await getEvents(filter,true);
            ret.status = "success";
            ret.message="done";
            ret.data=events;
            res.status(200).json(ret);
            return;
        }
        
        catch(err){
            console.log(err);
            ret.message=err.message;
            res.status(200).json(ret)
        }
    }
    else
    {
        try{
            pattern = new RegExp('.*'+pattern+'.*','i');
			let filter= {$or:[{'name':pattern},{'artist':pattern},{'city':city!=null?city:pattern},{"venue":pattern}]};
            let events = await getEvents(filter,true);
            
            ret.status = "success";
            ret.message="done";
            ret.data=events;
            res.status(200).json(ret);
            return;
        }
        
        catch(err){
            console.log(err);
            ret.message=err.message;
            res.status(200).json(ret)
        }
    }
}); 


router.get("/today",async function(req,res){
	let userId=req.user._id;
	let city = req.query.city;
	let startToday = new Date().setHours(0,0,0,0);
	let endDate = new Date().setHours(23,59,59,999);
	let filter= {event_timestamp:{$gte:startToday,$lt:endDate}};

		if(city && city != "any")
		{
			filter.city=city;
		}

	let role= req.user.role;
	// console.log(query);
	let events;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		
		if(role=="user")
		{
			events = await getEvents(filter);
		}
		else
		{
			throw {message:"role "+role+" is not accepted for this request"};
		}
		ret.data = events;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});


// router.get("/upcoming",async function(req,res){
// 	let userId=req.user._id;
// 	let query = req.query;
// 	let role= req.user.role;
// 	let city = req.query.city;
// 	console.log(query);
// 	let events ;
// 	let ret = {status:"failed",code:0,message:"initialized"};
// 	try{
// 		ret.status="success";
		
// 		if(role=="administrator")
// 		{
// 			 events = await Events.find(query).populate("host").populate("media");
			
// 		}
// 		else if(role=="host")
// 		{
// 			console.log("host accessing events");
// 			 events = await Events.find({host:userId}).populate("host").populate("media");
// 		}
// 		else if(role=="user")
// 		{
// 			if(query)
// 			{
// 				 events = await Events.find(query).populate("host").populate("media");
// 			}
// 			else
// 			{
// 				 events = await Events.find({event_status:"upcoming"}).populate("host").populate("media");
// 			}
// 		}
// 		else
// 		{
// 			throw {message:"role "+role+" is not accepted for this request"};
// 		}
// 		ret.data = events;
// 	}
// 	catch(err)
// 	{
// 		console.log(err.message);
// 		ret.message=err.message;
// 		ret.code=-10;
// 	}
// 	res.status(200).json(ret);
	
// });

// router.get("/today",async function(req,res){
// 	let userId=req.user._id;
// 	let query = req.query;
// 	let role= req.user.role;
// 	console.log(query);
// 	let events ;
// 	let ret = {status:"failed",code:0,message:"initialized"};
// 	try{
// 		ret.status="success";
		
// 		if(role=="administrator")
// 		{
// 			 events = await Events.find(query).populate("host").populate("media");
			
// 		}
// 		else if(role=="host")
// 		{
// 			console.log("host accessing events");
// 			 events = await Events.find({host:userId}).populate("host").populate("media");
// 		}
// 		else if(role=="user")
// 		{
// 			if(query)
// 			{
// 				 events = await Events.find(query).populate("host").populate("media");
// 			}
// 			else
// 			{
// 				 events = await Events.find({event_status:"upcoming"}).populate("host").populate("media");
// 			}
// 		}
// 		else
// 		{
// 			throw {message:"role "+role+" is not accepted for this request"};
// 		}
// 		ret.data = events;
// 	}
// 	catch(err)
// 	{
// 		console.log(err.message);
// 		ret.message=err.message;
// 		ret.code=-10;
// 	}
// 	res.status(200).json(ret);
	
// });


router.get("/single/:event_id",async function(req,res){
	let userId=req.user._id;
	let eventId = req.params.event_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let event = await getEvent({_id:eventId});
		ret.status="success";
		ret.data=event;
		console.log(event);
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.post("/create",async function(req,res){
	let userId=req.user._id;
	let role= req.user.role;
	console.log(role);
    let event = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	console.log("create Event"+JSON.stringify(event));
	try{
		// console.log(role);
		if(role=="administrator" || role == "host")
		{
			event.host = userId;
			let e = new Events(event);
			
			console.log(role);
			await e.save();
			let host = await Users.findById(userId);
			
			e.host = host._id;
			console.log(e.host);
			ret.status="success";
			ret.data = await Events.findOne({_id:e._id}).populate("host").populate({path:"phases",populate:{path:"categories",populate:{path:"tickets"}}}).populate("media").populate({path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}).exec();
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

router.post("/create_order_for_tickets",async function(req,res){
	let userId=req.user._id;
	let orderUserId = userId;
	let role= req.user.role;
	console.log(role);
    let order = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	console.log("creating order"+JSON.stringify(order));
	try{
		// console.log(role);
		if(role=="administrator" || role == "host")
		{
			orderUserId = order.user_id;
		}

	// 	order_type:{type:String,enum:["tickets"],required:true},
    //    amount:{type:Number,required:true},
    //    data:{type:Mixed,required:true},
    //    status:{type:String,enum:["unpaid","paid-partially","paid-fully"],default:"unpaid",required:true},

		let orderDoc = new Orders({order_type:"tickets",amount:order.total_amount,data:order});
		await orderDoc.save();
		ret.status="success";
		ret.data = orderDoc._id;
		// ret.data = await Events.findOne({_id:e._id}).populate("host").populate({path:"phases",populate:{path:"categories",populate:{path:"tickets"}}}).populate("media").populate({path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}).exec();
		ret.code=200;
		ret.message = "created order:"+orderDoc._id;
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


router.post("/create_order_for_advertisement",async function(req,res){
	let userId=req.user._id;
	let orderUserId = userId;
	let role= req.user.role;
	console.log(role);


// order details structure{
//     order_type:"advertisement"
//     event_id:
//     total_amount,

    let order = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	console.log("creating order"+JSON.stringify(order));
	try{
		// console.log(role);
		if(role=="administrator" || role == "host")
		{
			orderUserId = order.user_id;
			let orderDoc = new Orders({order_type:"advertisement",amount:order.total_amount,data:order});
			await orderDoc.save();
			ret.status="success";
			ret.data = orderDoc._id;
			// ret.data = await Events.findOne({_id:e._id}).populate("host").populate({path:"phases",populate:{path:"categories",populate:{path:"tickets"}}}).populate("media").populate({path:"active_phase",populate:{path:"categories",populate:{path:"tickets"}}}).exec();
			ret.code=200;
			ret.message = "created order:"+orderDoc._id;
		}
		else{
			ret.message = "User type not supported for this type of operation";
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

router.post("/edit/:event_id",async function(req,res){
	let userId=req.user._id;
    let eventId = req.params.event_id;
	let role= req.user.role;
	let event = req.body;
	console.log(event);
	if(event.phases)
	{
		delete event.phases;
		console.log("removed phases from the body");
	}
	let ret = {status:"failed",code:0,message:"initialized"};
	let status=false;
	try{
		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		delete event.host;
		if(role=="administrator")
		{
			status= await Events.updateEvent(eventId,event);
			if(!status)
			{
				throw {message:"Update failed for Admin"};
			}
			
		}
		else
		{
			delete event.blocked;
			delete event.medias;
			delete event.phases;
			delete event.thumbnail;
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			console.log(host);
			console.log(userId);
			if(host.toString() == userId.toString())
			{
				if(!(await Events.updateEvent(eventId,event)))
				{
					throw {message:"update failed for Host"};
				}
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
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


// //POST payment successful!! IMPORTANT to consider that the payment is successfully done
// router.post("/book_tickets",bookTickets);


// async function bookTickets(req,res){
// 	let userId=req.user._id;
//     let bookingInfo = req.body;
// 	let role= req.user.role;
// 	let ret = {status:"failed",code:0,message:"initialized"};
// 	try{
// 		// if(role=="administrator" || role == "host")
// 		// {
// 		// 	throw {message:"not authorized",code:-1};
// 		// }
// 		//assuming transaction id is present because it should
// 		if(!(await Transactions.exists({_id:bookingInfo.transaction})))
// 		{
// 			throw {message:"Could not find valid transaction details",code:-2};
// 		}
// 		if(!(await Users.exists({_id:bookingInfo.host})))
// 		{
// 			throw {message:"Could not find valid host details",code:-3};
// 		}
// 		if(!(await Events.exists({_id:bookingInfo.event})))
// 		{
// 			throw {message:"Could not find valid event details",code:-4};
// 		}

// 		let transaction = await Transactions.findById(bookingInfo.transaction);
		
// 		if(transaction.status!="successful")
// 		{
// 			throw {message:"Payment Transaction status: "+transaction.status,code:-5};
// 		}
// 		if((await bookingHash(bookingInfo.tickets))!=bookingInfo.booking_hash)
// 		{
			
// 			throw {message:"Booking Has been revoked as the data integrity is lost. Payment shall be reverted back.",code:-6};
// 		}
		
// 		//Payment is a success, simply book the ticket!
// 		let event = await Events.findById(bookingInfo.event);
// 		let host = await Users.findById(event.host);
// 		let tkts = [];
// 		for(var i=0; i<bookingInfo.tickets.length;i++){
// 			let ticket = bookingInfo.tickets[i];
// 			let t = new Tickets(ticket);
// 			await t.save();
// 			tkts.push(t._id);
// 		}
// 		tkts;
// 		let event_object=event.toObject();
// 		let booking = new Bookings({user:userId,host:host._id,event:event._id,event_object,booking_status:"normal",tickets:tkts,transaction:transaction._id});
// 		await booking.save();
//         console.log("Booking Successful");
// 		ret.status = "success";
// 		ret.code=200;
// 		ret.message = "done";
// 	}
// 	catch(err)
// 	{
// 		console.log(err.message);
// 		ret.message = "Server Error in Processing request";
// 		ret.code=err.code;
// 		if(code==-6)
// 		{
// 			let transaction = await Transactions.findById(bookingInfo.transaction);
// 			transaction.action= "revert";
// 			await transaction.save();
// 		}
// 	}
// 	res.status(200).json(ret);
	
// }

//=============================== Media ==================================
router.post("/add_media/:event_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let role = req.user.role;
	let userId=req.user._id;
	let eventId = req.params.event_id;
	let body = req.body;

	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			// body.path = picture_path;
			let media = Medias(body);
				await media.save();
				await Events.addMedia(eventId,media._id);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				let media = Medias(body);
				await media.save();
				await Events.addMedia(eventId,media._id);
				// await EventPhases.add_media(eventId,phase);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Media Add successful Successful");
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

router.post("/remove_media/:event_id/:media_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	let eventId = req.params.event_id;
	let mediaId = req.params.media_id;
	let role = req.user.role;

	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			await Events.removeMedia(eventId,mediaId);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await Events.removeMedia(eventId,mediaId);
				// await EventPhases.add_media(eventId,phase);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Media Removed Successful");
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

router.post("/add_picture/:event_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let role = req.user.role;
	let userId=req.user._id;
	let eventId = req.params.event_id;
	let picture_path = req.body.picture_path;

	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			event.thumbnail = picture_path;
			await event.save();
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				console.log("saving picture");
				event.thumbnail = picture_path;
				await event.save();
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Media Add successful Successful");
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


//=============================== Phases ==================================

router.get("/get_phases/:event_id",async function(req,res){
	let eventId = req.params.event_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let phases = await EventPhases.find({event_id:eventId}).populate({path:"categories",populate: { path: 'tickets' }}).exec();;
		console.log(phases);
		ret.data = phases;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});

router.get("/get_phase/:phase_id",async function(req,res){
	let phaseId = req.params.phase_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let phase = await EventPhases.findById(phaseId).populate({path:"categories",populate: { path: 'tickets' }}).exec();
		console.log(phase);
		ret.data = phase;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});

router.get("/get_phase_category/:category_id",async function(req,res){
	let categoryId = req.params.category_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let category = await PhaseCategories.findById(categoryId).populate("tickets").exec();
		console.log("inside get phase category");
		ret.data = category;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});

router.get("/get_phase_categories/:phase_id",async function(req,res){
	let phaseId = req.params.phase_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let categories = await PhaseCategories.find({phase_id:phaseId}).populate("tickets").exec();
		ret.data = categories;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});

router.get("/get_category_tickets/:category_id",async function(req,res){
	let categoryId = req.params.category_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let tickets = await CategoryTickets.find({category_id:categoryId});
		ret.data = tickets;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});

router.get("/get_category_ticket/:ticket_id",async function(req,res){
	let ticketId = req.params.ticket_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		ret.status="success";
		let ticket = await CategoryTickets.findById(ticketId);
		ret.data = ticket;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message=err.message;
		ret.code=-10;
	}
	res.status(200).json(ret);
	
});


router.post("/create_phase",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    
	let role= req.user.role;
	let phase = req.body;
	let eventId = phase.event_id;
	
	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			await Events.addPhase(eventId,phase);
			
		}
		else
		{
			delete event.blocked;
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{

				console.log("adding a phase");
				await Events.addPhase(eventId,phase);
				// if(event.phases.length = 1)
				// {
				// 	event.active_phase = phase._id;
				// 	await event.save();
				// }
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("New Phase added Successfully");
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

router.post("/add_helper/:eventId",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    let eventId = req.params.eventId;
	let role= req.user.role;
	let phone = req.body.phone;
	// let phase = req.body;
	// let eventId = phase.event_id;
	
	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);
		// if(event.published)
		// {
		// 	throw {message:"Event is in published state"};
		// }

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			await Events.addHelper(eventId,phone);
			
		}
		else
		{
			console.log("adding the helper");
			if(event.host.toString() == userId.toString())
			{

				// console.log("adding an helper");
				await Events.addHelper(eventId,phone);
				console.log("added the helper");
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("New helper Successfully");
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
router.post("/remove_helper/:eventId",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    let eventId = req.params.eventId;
	let role= req.user.role;
	let phone = req.body.phone;
	// let phase = req.body;
	// let eventId = phase.event_id;
	
	try{
		let event;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		event = await Events.findById(eventId);
		// if(event.published)
		// {
		// 	throw {message:"Event is in published state"};
		// }

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			await Events.removeHelper(eventId,phone);
			
		}
		else
		{
			// delete event.blocked;
			// let added = await Events.removeHelper(eventId,phone);
			// if(!added)
			// {
			// 	throw {message:"Some Error Occured!"};
			// }
			if(event.host.toString() == userId.toString())
			{

				console.log("removing an helper");
				await Events.removeHelper(eventId,phone);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("New helper Successfully");
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


router.post("/delete_phase/:phase_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    
	let phaseId = req.params.phase_id;
	let role= req.user.role;
	// let phase = req.body;
	
	try{
		let phase = await EventPhases.findById(phaseId);
		if(!phase)
		{
			throw {message:"Phase Not Found"};
		}
		let eventId = phase.event_id;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		// delete event.host_id;
		if(role=="administrator")
		{
			await Events.removePhase(eventId,phaseId);
			// if(event.active_phase == phaseId)
			// 	{
			// 		event.active_phase = event.phases.length==0?null:event.phases[0];
			// 		await event.save();
			// 	}
			
			
		}
		else
		{
			// delete event.blocked;
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await Events.removePhase(eventId,phaseId);
				// if(event.active_phase == phaseId)
				// {
				// 	event.active_phase = event.phases.length==0?null:event.phases[0];
				// 	await event.save();
				// }
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
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

router.post("/edit_phase/:phase_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    
	let phaseId = req.params.phase_id;
	let role= req.user.role;
	let phase = req.body;

	try{
		let phaseDoc = await EventPhases.findById(phaseId);
		if(!phaseDoc)
		{
			throw {message:"Phase Not Found"};
		}
		let eventId = phaseDoc.event_id;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		if(role=="administrator")
		{
			await EventPhases.editPhase(phase);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await EventPhases.editPhase(phase);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
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

//==========================Categories==================
router.post("/create_phase_category",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	// let phaseId = req.params.phase_id;
	let role= req.user.role;
	let category = req.body;
	let phaseId = category.phase_id;
	
	try{
		
		if(!await EventPhases.exists({_id:phaseId}))
		{
			throw {message:"Phase Not Found"};
		}
		let phase = await EventPhases.findById(phaseId);
		let event = await Events.findById(phase.event_id);
		let eventId = event._id;
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		if(role=="administrator")
		{
			await EventPhases.addCategory(phaseId,category);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				console.log("creating category");
				await EventPhases.addCategory(phaseId,category);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Create Successful");
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

router.post("/delete_category/:category_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    // let eventId = req.params.event_id;
	// let phaseId = req.params.phase_id;
	let categoryId = req.params.category_id;
	let role= req.user.role;
	// let phase = req.body;
	
	try{
		let categoryDoc = await PhaseCategories.findById(categoryId);
		if(!categoryDoc)
		{
			throw {message:"Category Not Found"};
		}
		let phaseId = categoryDoc.phase_id;
		if(!await EventPhases.exists({_id:phaseId}))
		{
			throw {message:"Phase Not Found"};
		}
		let phase = await EventPhases.findById(phaseId);
		let eventId = phase.event_id;
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}
		

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}

		if(role=="administrator")
		{
			await EventPhases.removeCategory(phaseId,categoryId);
		}
		else
		{

			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await EventPhases.removeCategory(phaseId,categoryId);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Delete Successful");
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

router.post("/edit_category/:category_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	let role= req.user.role;
	let category = req.body;
	let categoryId = req.params.phase_id;

	try{
		if(!await EventPhases.exists({_id:phaseId}))
		{
			throw {message:"Phase Not Found"};
		}
		let phase = await EventPhases.findById(phaseId);

		let eventId = phase.event_id;
		let event  = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}

		if(role=="administrator")
		{
			await PhaseCategories.editCategory(category);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await PhaseCategories.editCategory(category);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Category update Successful");
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

//==================Phase Ticket=============
router.post("/create_ticket",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	// let categoryId= req.params.category_id;
	let role= req.user.role;
	let ticket = req.body;
	let categoryId = ticket.category_id;
	
	try{
		if(!await PhaseCategories.exists({_id:categoryId}))
		{
			throw {message:"Category Not Found"};
		}
		let category = await PhaseCategories.findById(categoryId);
		if(!await EventPhases.exists({_id:category.phase_id}))
		{
			throw {message:"Phase Not Found"};
		}
		let phase = await EventPhases.findById(category.phase_id);

		let eventId = phase.event_id;
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}

		if(role=="administrator")
		{
			await PhaseCategories.addTicket(categoryId,ticket);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(	host.toString() == userId.toString())
			{
				await PhaseCategories.addTicket(categoryId,ticket);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Created Ticket Successful");
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

router.post("/delete_ticket/:ticket_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	let ticketId = req.params.ticket_id;
	console.log("inside Delete: "+ticketId);
	
	let role= req.user.role;
	// let phase = req.body;
	
	try{
		let ticketDoc = await  CategoryTickets.findById(ticketId);
		console.log(ticketDoc.toObject());
		if(!ticketDoc)
		{
			throw {message:"ticket not found"};
		}
		let categoryId = ticketDoc.category_id;
		console.log(categoryId);
		let category = await PhaseCategories.findById(categoryId);
		if(!category)
		{
			throw {message:"Category Not Found"};
		}
		let phase = await EventPhases.findById(category.phase_id);

		let eventId = phase.event_id;
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}
		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}

		if(role=="administrator")
		{
			await PhaseCategories.removeTicket(categoryId,ticketId);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await PhaseCategories.removeTicket(categoryId,ticketId);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Delete Successful");
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

router.post("/edit_ticket/:ticket_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
    let ticketId = req.params.event_id;
	let role= req.user.role;
	let ticketBody = req.body;

	try{
		let ticket = await CategoryTickets.findById(ticketId);
		let category = await PhaseCategories.findById(ticket.category_id);
		let phase = await EventPhases.findById(category.phase_id);
		let eventId = phase.event_id;
		if(!await Events.exists({_id:eventId}))
		{
			throw {message:"Event Not Found"};
		}
		let event = await Events.findById(eventId);
		if(event.published)
		{
			throw {message:"Event is in published state"};
		}

		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}

		if(role=="administrator")
		{
			await CategoryTickets.editTicket(ticket);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(host.toString() == userId.toString())
			{
				await CategoryTickets.editTicket(ticketBody);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
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


router.post("/create_highlight/:event_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	// let categoryId= req.params.category_id;
	let role= req.user.role;
	let eventId = req.params.event_id;
	let highlight = req.body.highlight;
	// let categoryId = ticket.category_id;
	try{
		let event = await Events.findById(eventId);
		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		if(role=="administrator")
		{
			await Events.addHighlight(eventId,highlight);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(	host.toString() == userId.toString())
			{
				await Events.addHighlight(eventId,highlight);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Created highlight Successful");
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

router.post("/delete_highlight/:event_id",async function(req,res){
	let ret = {status:"failed",code:0,message:"initialized"};
	let userId=req.user._id;
	// let categoryId= req.params.category_id;
	let role= req.user.role;
	let eventId = req.params.event_id;
	let highlight = req.body.highlight;
	// let categoryId = ticket.category_id;
	try{
		// let event = await Events.findById(eventId);
		if(!(role=="administrator" || role == "host"))
		{
			throw {message:"not authorized"};
		}
		if(role=="administrator")
		{
			await Events.removeHighlight(eventId,highlight);
		}
		else
		{
			let host = await Events.getHost(eventId);
			if(!host)
			{
				throw {message:"Host not found!"};
			}
			if(	host.toString() == userId.toString())
			{
				await Events.removeHighlight(eventId,highlight);
			}
			else{
				throw {message:"Host not allowed to edit other hosts events"};
			}
			
		}
        console.log("Deleted highlight Successful");
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

//=============================End Of all functions!/////////////////////
module.exports = router;
