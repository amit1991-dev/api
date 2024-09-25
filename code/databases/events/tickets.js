const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;


// const ticketSch = new mongoose.Schema({
//     count:{type:Number, min:0},
//     event:{type:ObjectId,ref:"events"},
//     phase:String,
//     category:String,
//     ticket_type:String,
//     price:Number,// for a single, xCount for total price.
// },
//     {strict: false,minimize:false,timestamps:true });


    // let Tickets = mongoose.model("tickets", ticketSch);

const ticketSch = new mongoose.Schema({
    //_id:ObjectID
        name:String,
        count:{type:Number, min:0},
        event:{type:ObjectId,ref:"events"},
        phase:String,//names not ids
        category:String,// ''
        // ticket_type:String,// ''
        timestamp:Date,
        ticket: {type:{},required:true},
    },
        {strict: false,minimize:false,timestamps:true });

let Tickets = mongoose.model("tickets", ticketSch);

module.exports = Tickets;
