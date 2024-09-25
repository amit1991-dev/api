const mongoose = require("mongoose");
const { stringify } = require("uuid");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;

// const ticketSch = new mongoose.Schema({
//     count:{type:Number, min:0},
//     event:{type:ObjectId,ref:"events"},
//     phase:String,
//     category:String,
//     ticket_type:String,
//     ticket: {type:String,required:true},
//     // ticket:{type:ObjectId,ref:"category_tickets"},
// },
//     {strict: false,minimize:false,timestamps:true });


// let Tickets = mongoose.model("tickets", ticketSch);


const AdvertisementSchema = new mongoose.Schema(
    {
        event:{type:ObjectId,ref:"events",required:true},
        event_city:{type:String,required:true},
        advertisement_type:{type:String,enum:["pay_later","pay_later_fixed","pay_now"]},
        ending_timestamp:{type:Date,required:true},
        enabled:{type:Boolean,default:false,required:true},
        transaction:{
            type:ObjectId,
            ref:"rzp_transactions"
        },
	},
    { strict: false,minimize:false,timestamps:true }
);
let Ads = mongoose.model("advertisements", AdvertisementSchema);


Ads.findFeatured=async function(city)// return events 
{
    try{
        let filter ={ending_timestamp:{$gt:Date.now()},enabled:true};
        if(city!=null)
        {
            filter.city = city;
        }
        let featuredEvents = await Ads.find(filter,{event:1}).populate({path:"event",populate:[{path:"host"},{path:"medias"}]});
        return featuredEvents;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Ads.updateAdvertisement=async function(ad_id,modified_obj)
{
    console.log(modified_obj);
    try{
        var t=await Ads.updateOne({_id:ad_id},{$set:modified_obj});
        console.log("update successful");
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Ads.toggleAdvertisement=async function(ad_id,enable=true)
{
    try{
        var t=await Ads.findById(ad_id);
        if(t)
        {
            // console.log("")
            t.enabled = enable;
            await t.save();
        }
        else
        {
            console.log("Property not set for toggling the event!");
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

Ads.disableAd=async function(ad_id)
{
    return await Ads.toggleAdvertisement(ad_id,false);
}

Ads.enableAd=async function(ad_id)
{
    return await Ads.toggleAdvertisement(ad_id,true);
}


Ads.getHost=async function(ad_id){
    try{
        p=await Ads.findOne({_id:ad_id});
        return p.host;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

module.exports = Ads;