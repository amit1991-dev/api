const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;
const CertificateSch = new mongoose.Schema(
    {
        name:{type:String,required:true},
        issuer_id:{type:ObjectId, ref:'users',required:true},
        template:{type:ObjectId, ref:'templates',required:true},
        enabled:{type:Boolean,default:true,required:true},
        logo:{type:String},
        display_date:{type:Date,default:Date.now(),required:true},

	},
    { strict: false,minimize:false,timestamps: { createdAt: 'timestamp', updatedAt: 'updated_at' } }
);

var Certificates = mongoose.model("certificates", CertificateSch);

Certificates.getCertificate=async function(certificate_id,detail=false)
{
   try{
    let p;
    if(detail)
    {
        p=await Certificates.findOne({_id:certificate_id}).populate("template").exec();
    }
    else{
        p=await Certificates.findOne({_id:certificate_id});
    }
    
    return p;
   }
   catch(err){
    return false;
   }
}

Certificates.listing=async function(filter)
{
    try{
    var t= await Certificates.find(filter).populate("template").sort({'timestamp':-1}).exec();
    return t;
   }
   catch(err){
    return false;
   }
    
}

Certificates.updateCertificateInfo=async function(certificate_id,modified_obj)
{
    try{
        if(!mongoose.Types.ObjectId.isValid(certificate_id))
        {
            // console.log("rejected");
            return false;
        }
        await Certificates.updateOne({_id:certificate_id},{$set:modified_obj});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }   
}

Certificates.delete=async function(certificate_id)
{
    try{
        await Certificates.findOneAndDelete({_id:certificate_id});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}



module.exports = Certificates;