const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;



const SubscribersSch = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true},
	},
    { strict: false,minimize:false, timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Subscribers = mongoose.model("subscribers", SubscribersSch);

Subscribers.getSubscribers=async function()
{
    try{
        let p=await Subscribers.find({});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}




module.exports=Subscribers;