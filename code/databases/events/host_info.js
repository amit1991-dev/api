const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;

const HostInfoSch = new mongoose.Schema(
    {
        host:{type:ObjectId,ref:"users",required:true},
        account_number:{type:String},
        ifsc:{type:String},
        notifications:{type:[String],default:[],required:true},
        transactions:[{type:ObjectId,ref:"transactions"}],
	},
    { strict: false,minimize:false,timestamps:true }
);
let HostInfos = mongoose.model("host_informations", HostInfoSch);

HostInfos.getInformation=async function(host_id)
{
    try{
        let info = await HostInfos.findOne({host:host_id}).populate("host");
        return info;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

HostInfos.addNotifications=async function(host_id,notification)
{
    try{
        await HostInfos.findByIdAndUpdate({host:host_id},{$push:{notifications:notification}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

HostInfos.addTransaction=async function(host_id,transaction_id)
{
    try{
        await HostInfos.findByIdAndUpdate({host:host_id},{$push:{transactions:transaction_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

HostInfos.deleteHostInformation=async function(host_id)
{
    try{
        let t = await HostInfos.findByIdAndUpdate({host:host_id},{$set:{transactions:[],notifications:[],account_number:"",ifsc:""}});
        console.log(t);
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

module.exports = HostInfos;