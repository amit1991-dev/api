const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;


const RazorpayEventSch = new mongoose.Schema(
    {
       data:{type:Mixed,required:true},
    //    order_id:{type:String,required:true},
    },
    { strict: false,timestamps:true}
);

module.exports = mongoose.model("razorpay", RazorpayEventSch);
