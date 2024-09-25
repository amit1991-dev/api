const mongoose = require("mongoose");
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


const BookingsSch = new mongoose.Schema(
    {
        user:{type:ObjectId,ref:"users",required:true},
        host:{type:ObjectId,ref:"users",required:true},
        event:{type:ObjectId,ref:"events",required:true},
        booking_status:{
            type:String,
            enum:["pending-confirmation","cancelled","blocked",'booked'],
            default:"pending-confirmation"
        },
        verified:{type:Number, min:0,default:0,required:true},
        tickets:[{
            type:ObjectId,
            ref:"tickets",
        }],
        transaction:{type:ObjectId,ref:"rzp_transactions"},
        // transaction:{
        //     type:ObjectId,
        //     ref:"transactions"
        // },
        // order_id:{
        //     type:ObjectId,
        //     ref:"orders"
        // },
	},
    { strict: false,minimize:false,timestamps:true }
);
let Bookings = mongoose.model("bookings", BookingsSch);


Bookings.registerEntry=async function(bookingId,numPeople)
{
    try{
        await Bookings.findByIdAndUpdate(bookingId,{$inc:{verified:numPeople}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

module.exports = Bookings;