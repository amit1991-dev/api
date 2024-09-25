const mongoose = require("mongoose");
// const notifications = require("./notifications.js");
// const comments = require("./comments.js");
const ObjectId=mongoose.Schema.ObjectId;
// const messages = require("./messages.js");
const Mixed=mongoose.Schema.Types.Mixed;
const RazorpayTransactionsSch = new mongoose.Schema(
    {
    //    amount:{type:Number,set:(v)=>{return v;},required:true},
    //    user_id:{type:ObjectId,required:true},
    //    status:{type:String,required:true,default:"created",enum:["created","pending","finished"]},
    //    transaction_type:{type:String,enum:["straight,refund"],required:true,default:"straight"},
    //    details_json:String,
    //    credit:{type:Boolean,required:true,default:true},// incoming or outgoing?
       order:Mixed,
       payment:Mixed,
       action_status:Mixed,
    //    information:Mixed,
    },
    { strict: false,minimize:false,timestamps:true}
);

let RazorpayTransactions = mongoose.model("rzp_transactions", RazorpayTransactionsSch);
// Products = mongoose.model("products", ProductSch);


//Admin
RazorpayTransactions.getTransaction=async function(transaction_id)
{
    try{
        let p=await RazorpayTransactions.findOne({_id:transaction_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

RazorpayTransactions.createTransaction=async function(transaction)
{
    try{
        let p=new RazorpayTransactions(transaction);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


//Admin
RazorpayTransactions.getAllTransactions=async function()
{
    let transactions=await RazorpayTransactions.find().sort({timestamp:-1});
    return transactions;
}




module.exports = RazorpayTransactions;