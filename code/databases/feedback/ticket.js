const mongoose = require("mongoose");
const { modifyCartItemQuantity } = require("./cart");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;

const TicketSchema = new mongoose.Schema({
    complaints:[{type:{text:String,attatchments:[{typs:ObjectId,ref:"files"}],handler:{type:ObjectId,ref:"users"}}}],
    rating:{type:Number,min:1,max:5},
    reason:{type:String},
    current_status:{type:String,enum:['opened','closed','under-review']},
    resolution:String,
    updates:[{type"String",enum:['opened','closed',''],handler:{type:ObjectId,ref:"users"},timestamp:{type:Date,default:Date.now(),required:true}}],
    user_id:{type:ObjectId,ref:"users",required:true},
    data:{type:String}

},{ strict: false,minimize:false,timestamps:true });

Tickets = mongoose.model("tickets", TicketSchema);


Tickets.getOne=async function(ticket_id)
{
    try{
        let t=await Tickets.findOne({_id:ticket_id});
        return t;
    }
    catch(err)
    {
        return false;
    }
}

Tickets.getAllUser=async function(user_id)
{
    try{
        let data=await Tickets.findOne({user_id:user_id});
        return data;
    }
    catch(err)
    {
        return false;
    }
}

module.exports = Tickets; 
