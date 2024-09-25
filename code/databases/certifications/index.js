const mongoose = require("mongoose");
const Products = require("./products");
const Coupons = require("./coupons");

const ObjectId = mongoose.Schema.ObjectId;

const CertificationsSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            required:true,
            ref:"users",
            unique:true,
        },
        certificates:{
            type:[type:ObjectId,ref:"certificates"],
            default:[],
            required:true,
        },
    },
    { strict: false,timestamps:true,minimize:false }
);

Certifications = mongoose.model("certifications", CertificationsSchema);

Certifications.getUserCertificates=async function(user_id,detail=false)
{
    try{
        if(detail)
            var c=await Certifications.findOne({user_id:user_id}).populate('certificates');
        else
            var c=await Certifications.findOne({user_id:user_id});
        return c;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Certifications.listUsers=async function(user_id,detail=false)
{
    try{
        
        var c=await Certifications.find().populate("user_id");
        return c;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Certifications.insertCertificateIntoUser=async function(user_id,item)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }
    try{
        await Certifications.findOneAndUpdate({user_id:user_id},{$addToSet:{certificates:item}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Certifications.removeCertificateFromUser=async function(user_id,certificate_id)
{
    try{
        await Certifications.findOneAndUpdate({user_id:user_id},{$pull:{certificates:certificate_id}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


module.exports = Market;
