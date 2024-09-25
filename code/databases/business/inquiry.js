const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;



const InquirySch = new mongoose.Schema(
    {
        message:{type:String,required:true},
        name:String,//path of the zip for the query
        email:String,
        phone:String,//path to the recording
        tag:String
	},
    { strict: false,minimize:false, timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Inqueries = mongoose.model("inquiries", InquirySch);

Inqueries.getInquiries=async function()
{
    try{
        let p=await Inqueries.find({});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}



//Admin
Inqueries.getInquiry=async function(inquiry_id)
{
    try{
        let p=await Inqueries.findOne({_id:inquiry_id}).populate("users");
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Inqueries.Inquiry=async function(inquiry)
{
    try{
        let p=new Inqueries(inquiry);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}





module.exports=Inqueries;