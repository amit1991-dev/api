const mongoose = require("mongoose");
// const notifications = require("./notifications.js");
// const comments = require("./comments.js");
const ObjectId=mongoose.Schema.ObjectId;
// const messages = require("./messages.js");
const Mixed=mongoose.Schema.Types.Mixed;
const TransactionsSch = new mongoose.Schema(
    {
      amount:{type:Number,set:(v)=>{return v;},required:true},//In paisa
      user_id:{type:ObjectId},
    //   status:{type:String,required:true,default:"created",enum:["created","pending","finished","cancelled"]},
    //   transaction_type:{type:String,enum:["straight","refund","withdrawl"],required:true,default:"straight"},
      data:{},//{from:UserId,business:"something",data: relevantId}
      credit:{type:Boolean,required:true},// incoming or outgoing?
      settled:{type:Boolean, default:false,required:true},
      approved:{type:Boolean, default: false,required:true},
    },
    { strict: false,minimize:false,timestamps:true}
);

Transactions = mongoose.model("transactions", TransactionsSch);
Transactions.updateDetails=async function(transaction_id,details)
{
    try{
        await Transactions.updateOne({_id:transaction_id},{$set:details});
        return true;
    } 
    catch(err)
    {
        console.log(err);
        return false;
    }   
}

Transactions.setSettled=async function(transaction_id)
{
   return await Transactions.updateDetails(transaction_id,{settled:true});
}

Transactions.resetSettled=async function(transaction_id)
{
   return await Transactions.updateDetails(transaction_id,{settled:false});
}

Transactions.setApproved=async function(transaction_id)
{
   return await Transactions.updateDetails(transaction_id,{approved:true});
}

Transactions.resetApproved=async function(transaction_id)
{
   return await Transactions.updateDetails(transaction_id,{approved:false});
}


module.exports = Transactions;