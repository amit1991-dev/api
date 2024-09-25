const mongoose = require("mongoose");
// const notifications = require("./notifications.js");
// const comments = require("./comments.js");
const ObjectId=mongoose.Schema.ObjectId;
// const messages = require("./messages.js");
const Mixed=mongoose.Schema.Types.Mixed;
const OrderSchema = new mongoose.Schema(
    {
       order_type:{type:String,enum:["tickets","advertisement"],required:true},
       amount:{type:Number,required:true},
       data:{type:Mixed,required:true},
       status:{type:String,enum:["unpaid","paid-partially","paid-fully"],default:"unpaid",required:true},
    },
    { strict: false,minimize:false,timestamps:true}
);

Orders = mongoose.model("finance_orders", OrderSchema);
// Products = mongoose.model("products", ProductSch);


//Admin
Orders.getTransaction=async function(order_id)
{
    try{
        let p=await Orders.findOne({_id:order_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


//Admin
Orders.getAllOrders=async function()
{
    let transactions=await Orders.find().sort({timestamp:-1});
    return transactions;
}



Orders.updateStatus=async function(order_id,new_status)
{
    if(!mongoose.Types.ObjectId.isValid(order_id))
    {
        return false;
    }
    try{
        await Orders.updateOne({_id:order_id},{$set:{status:new_status}});
        return true;
    } 
    catch(err)
    {
        console.log(err);
        return false;
    }   
}

module.exports = Orders;