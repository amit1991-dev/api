const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;


const PaymentsSch = new mongoose.Schema(
    {
       product_info:{type:String,required:true},
       mihpayid:{type:String,required:true},
       amount:{type:Number,set:(v)=>{return v;}},
       name:{type:String,required:true},
       email:{type:String,required:true},
       phone:{type:Number,required:true},
       status:{type:String,required:true},

       resphash:String,//i dont know why i am keeping these!!
       msg:String
    },
    { strict: false,timestamps:true}
);

module.exports = mongoose.model("payments", PaymentsSch);
