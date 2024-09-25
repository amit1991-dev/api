const mongoose = require("mongoose");
// const notifications = require("./notifications.js");
// const comments = require("./comments.js");
const ObjectId=mongoose.Schema.ObjectId;
// const messages = require("./messages.js");
const Mixed=mongoose.Schema.Types.Mixed;
const TransactionsSch = new mongoose.Schema(
    {
       amount:{type:Number,set:(v)=>{return v;},required:true},
       user_id:{type:ObjectId,required:true},
       status:{type:String,required:true,default:"created",enum:["created","pending","finished"],
       transaction_type:{type:String,enum:["straight,refund"],required:true,default:"straight"},
       information:Mixed,
    },
    { strict: false,minimize:false,timestamps:true}
);

Transactions = mongoose.model("transactions", TransactionsSch);
// Products = mongoose.model("products", ProductSch);


//Admin
Transactions.getTransaction=async function(transaction_id)
{
    try{
        let p=await Transactions.findOne({_id:transaction_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Transactions.createTransaction=async function(transaction)
{
    try{
        let p=new Transactions(transaction);
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


//Admin
Transactions.getAllTransactions=async function()
{
    let transactions=await Transactions.find().sort({timestamp:-1});
    return transactions;
}



Transactions.updateStatus=async function(transaction_id,new_status)
{
    if(!mongoose.Types.ObjectId.isValid(transaction_id))
    {
        return false;
    }
    try{
        await Transactions.updateOne({_id:transaction_id},{$set:{status:new_status}});
        return true;
    } 
    catch(err)
    {
        console.log(err);
        return false;
    }   
}

module.exports = Transactions;