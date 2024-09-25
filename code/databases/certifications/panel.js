const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const CertificationsConfigSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            required:true,
            ref:"users",
            unique:true,
        },
        signature: {//path for an image!
            type: String,
            required:true,
        },
        logo: {//path for an image!
            type: String,
            required:true,
        },
        title:{
            type: String,
            required:true,
        },
        organization:{
            type: String,
            required:true,
        },
    },
    { strict: false,timestamps:true,minimize:false }
);

CertificationsConfig = mongoose.model("certifications_configurations", CertificationsConfigSchema);

CertificationsConfig.get=async function(user_id)
{
    try{
        
        var c=await CertificationsConfig.findOne({user_id:user_id});
        return c;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

CertificationsConfig.update=async function(user_id,item)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }
    try{
        var market=await CertificationsConfig.findOneAndUpdate({user_id:user_id},{$set:item});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


module.exports = CertificationsConfig;
