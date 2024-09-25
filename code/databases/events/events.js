const mongoose = require("mongoose");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;

const CategoryTicketSchema = new mongoose.Schema(
    {
        category_id:{type:ObjectId,required:true},
        name:{type:String,required:true},
        price:Number,
        total_available:{type:Number,default:0,required:true},// decrement at each booking!
        supply:{type:Number,default:-1,required:true},// if supply not equal to -1
    },
    { strict: false,minimize:false,timestamps:true }
);

let CategoryTickets = mongoose.model("category_tickets", CategoryTicketSchema);

const PhaseCategorySchema = new mongoose.Schema(
    {
        phase_id:{type:ObjectId,required:true},
        name:{type:String,required:true},
        tickets:[{
            type:ObjectId,
            ref:"category_tickets"
        }],
    },
    { strict: false,minimize:false,timestamps:true }
);
let PhaseCategories = mongoose.model("phase_categories", PhaseCategorySchema);

const EventPhaseSchema = new mongoose.Schema(
    {
        event_id:{type:ObjectId,required:true},
        name:{type:String,required:true},
        categories:[{
            type:ObjectId,
            ref:"phase_categories"
        }],
    },
    { strict: false,minimize:false,timestamps:true }
);

let EventPhases = mongoose.model("event_phases", EventPhaseSchema);
// const VenueSchema = new mongoose.Schema(
//     {
//         name:{type:String,required:true},
//         details:[String],
//         address:{type:ObjectId,ref:"addresses"},
//         google_places_id:String,
//     },
//     { strict: false,minimize:false,timestamps:true }
// );
// let Venues = mongoose.model("venues", VenueSchema);

const MediaSchema = new mongoose.Schema(
    {
        path:String,//s3 bucket URL
        media_type:String//image, video
    },
    { strict: false,minimize:false,timestamps:true }
);

let Medias = mongoose.model("medias", MediaSchema);

const EventsSchema = new mongoose.Schema(
    {
        name:{type:String,required:true}, 
        host:{type:ObjectId,ref:"users",required:true},
        artist:{type:String,required:true,default:"-"},
        helpers:{type:[String],default:[]},//to be able to add ticket scan helper guys!
        version:{type:String,required:true,default:"-"},
        recurring:{type:String,default:"none",required:true,enum:['none','daily','weekly']},
        highlights:{type:[String],default:[],required:true},
        event_status:{type:String,required:true,enum:['upcoming','running','finished'],default:"upcoming"},
        event_status_extra:{type:String,required:true,default:"-"},//extra details like Day:2 
        booking_status:{type:String,required:true,enum:['booking_starting_soon','booking_terminated','booking_open','booking_closed'],default:"booking_starting_soon"},
        description:{type:String,required:true,default:"-"},
        advertisement:{type:ObjectId,ref:"advertisements"},
        event_timestamp:Date,// in case of weekly events only the week day matters
        event_duration:{type:String,required:true,default:"1 Day"},
        thumbnail:{type:String,default:"https://clumsyapp.com/images/c_logo.png",required:true},
        event_type:{type:String,required:true,enum:['party','concert','gathering','meet','other'],default:"party"},// digital or physical
        media:[{
            type:ObjectId,
            ref:"medias"
        }],
        category:{type:String,required:true,default:"-"},
        bookings:[{type:ObjectId,ref:"bookings"}],
        venue:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        pincode:{type:String,required:true},
        google_places_id:{type:String,required:true,default:"-"},
        phases:{
            type:[{type:ObjectId,ref:"event_phases"}],
            default:[]
        },
        active_phase:{type:ObjectId,ref:"event_phases",default:null},
        subcategory:{type:String,required:true,default:"-"},
        reviews:[{type:ObjectId,ref:"reviews"}],// Example: {rating:4,review:"very good",user_id:"Object ID"}
        extra:{type:String,required:true,default:"-"},
        enabled:{type:Boolean,default:true,required:true},
        terms_conditions:{type:String,default:"Clumzy Terms And Conditions apply"},
        discount:{type:Number,min:0,max:100,default:0,required:true},//global discount from the host!!
        published:{type:Boolean,default:false,required:true}
	},
    { strict: false,minimize:false,timestamps:true,strictPopulate:false }
);


let Events = mongoose.model("events", EventsSchema);

Event.getHost=async function(eventId){
    try{
        p=await Events.findOne({_id:eventId});
        return p.host;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.addAdvertisement=async function(eventId,advertisement)
{
    try{
        let ad = new Ads(advertisement);
        await ad.save();
        await Events.updateOne({_id:eventId},{$set:{advertisement:ad._id}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.getEvent=async function(event_id)
{
    try{
        p=await Events.findOne({_id:event_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}
Events.getHost=async function(event_id)
{
    try{
        p=await Events.findOne({_id:event_id});
        return p.host;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.allEvents=async function(filters=null)
{
    try{
        var t= await Events.find(filters);
        return t;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }   
}

//review should be like: {rating,review,user_id}
Events.insertReview=async function(event_id,review_id)
{
   try{
        // let r = Reviews({review});
        await Events.updateOne({_id:event_id},{$push:{reviews:review_id}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.addHighlight=async function(event_id,highlight)
{
   try{
        // let r = Reviews({review});
        await Events.updateOne({_id:event_id},{$push:{highlights:highlight}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}
Events.removeHighlight=async function(event_id,highlight)
{
   try{
        await Events.updateOne({_id:event_id},{$pull:{'highlights':highlight}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}
//review should be like: {rating,review,user_id}
Events.addHelper=async function(event_id,helper)
{
   try{
        // let r = Reviews({review});
        await Events.updateOne({_id:event_id},{$addToSet:{helpers:helper}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.removeHelper=async function(event_id,helper)
{
   try{
        await Events.updateOne({_id:event_id},{$pull:{helpers:helper}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Events.updateEvent=async function(event_id,modified_obj,host=null)
{
    console.log(modified_obj);
    try{
        var t=await Events.updateOne({_id:event_id},{$set:modified_obj});
        console.log("update successful");
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.toggleEvent=async function(event_id,enable=true)
{
    try{
        var t=await Events.findById(event_id);
        if(t.phases.length > 0 && t.phases.includes(t.active_phase))
        {
            // console.log("")
            t.enabled = enable;
            await t.save();
        }
        else
        {
            console.log("Property not set for enabling the event!");
        }
        // console.log("update successful");
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

// Events.disableEvent=async function(event_id)
// {
//     try{
//         var t=await Events.findById(event_id);
//         t.enabled = false;
//         await t.save();
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }
// }

Events.disableEvent=async function(event_id)
{
    return await Events.toggleEvent(event_id,false);
}

Events.enableEvent=async function(event_id)
{
    return await Events.toggleEvent(event_id,true);
}


Events.addImage=async function(event_id,image)
{
    
   try{
        var t=await Events.updateOne({_id:event_id},{$push:{image_url:image}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Events.removeImage=async function(event_id,image)
{

    try{
        var t=await Events.updateOne({_id:event_id},{$pull:{image_url:image}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}


Events.disableEvent=async function(event_id)
{
    
    try{
        await Events.updateOne({_id:event_id},{$set:{enabled:false}});
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
    
}


Events.enableEvent=async function(event_id)
{
    try{
        await Events.updateOne({_id:event_id},{$set:{enabled:true}});
    }
    catch(err)
    {
        return false;
    }
}


Events.addMedia=async function(event_id,mediaId)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{media:mediaId}});
        console.log("added");
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
}


Events.removeMedia=async function(event_id,mediaId)
{
    try{
        await Events.updateOne({_id:event_id},{$pull:{media:mediaId}});
        console.log("removed");
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
}

Events.addPhase=async function(eventId,phase)
{
    try{
        phase.event_id = eventId;
        let ep = new EventPhases(phase);
        await ep.save();
        await Events.updateOne({_id:eventId},{$push:{phases:ep._id}});
        let event = await Events.findById(eventId);

        console.log("added new phase");
        console.log("current active phase:"+event.active_phase);
        if(!event.active_phase)
        {
            // console.log("setting active Phase for event:"+event._id+" with phase id"+ep._id);
            console.log("setting an active phase");
            let t=await Events.updateOne({_id:event._id},{$set:{active_phase:ep._id}});
            // console.log(t);
            // event.active_phase = phase._id;
            // console.log(event);
            // await event.save();
        }
        console.log("finishing up adding a phase");
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    return true;
}

Events.removePhase=async function(eventId,phaseId)
{
    try{
        let event = await Events.findById(eventId);
        if(!event)
        {
            throw {message:"Event id not found"};
        }
        
        // if(event.active_phase == phaseId)
        // {

        // }
        await Events.updateOne({_id:eventId},{$pull:{phases:phaseId}});
        
        if(event.active_phase == phaseId){
            event = await Events.findById(event.id);
            let newActivePhase = event.phases.length==0?null:event.phases[0];
            console.log("resetting the active phase"+newActivePhase);
            await Events.updateOne({_id:eventId},{$set:{active_phase:newActivePhase}});
        }
        await EventPhases.deleteOne({_id:phaseId});
        console.log("removed");
    }
    catch(err)
    {
        console.log("deletion error Ticket");
        console.log(err);
        return false;
    }
    return true;
}

EventPhases.editPhase=async function(phase)
{
    try{
        await EventPhases.updateOne({_id:phase._id},{$set:phase});
        console.log("edited");
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
    return true;
}

EventPhases.addCategory=async function(phaseId,category)
{
    try{
        category.phase_id= phaseId;
        let pc = PhaseCategories(category);
        await pc.save();
        await EventPhases.updateOne({_id:phaseId},{$push:{categories:pc._id}});
        console.log("Pushed new category");
    }
    catch(err)
    {
        return false;
    }
    return true;
}

EventPhases.removeCategory=async function(phaseId,categoryId)
{
    try{
        await EventPhases.updateOne({_id:phaseId},{$pull:{categories:categoryId}});
        await PhaseCategories.deleteOne({_id:categoryId});
        console.log("pulled out category");
    }
    catch(err)
    {
        console.log("deletion error Category");
        console.log(err);
        return false;
    }
    return true;
}

PhaseCategories.editCategory=async function(category)
{
    try{
        await PhaseCategories.updateOne({_id:category._id},{$set:category});
    }
    catch(err)
    {
        return false;
    }
    return true;
}

PhaseCategories.addTicket=async function(categoryId,ticket)
{
    try{
        ticket.category_id= categoryId;
        let ct = CategoryTickets(ticket);
        await ct.save();
        await PhaseCategories.updateOne({_id:categoryId},{$push:{tickets:ct._id}});
    }
    catch(err)
    {
        return false;
    }
    return true;
}

PhaseCategories.removeTicket=async function(categoryId,ticketId)
{
    try{
        await PhaseCategories.updateOne({_id:categoryId},{$pull:{tickets:ticketId}});
        await CategoryTickets.deleteOne({_id:ticketId});
    }
    catch(err)
    {
        console.log("deletion error Ticket");
        console.log(err);
        return false;
    }
    return true;
}

CategoryTickets.editTicket = async function(ticket){
    try{
        await CategoryTickets.updateOne({_id:ticket._id},{$set:ticket});
    }
    catch(err)
    {
        return false;
    }
    return true;
}

module.exports = {Events,EventPhases,PhaseCategories,CategoryTickets,Medias};
