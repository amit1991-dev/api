const mongoose = require("mongoose");

const VerificationSch = new mongoose.Schema(
    {
        contact:{
            type:String,//phone(+919975599067) or email address(usual)
            required:true
        },
        one_time_password:{
            type:String,
            required:true
        },
        verified:{
            type:Boolean,
            default:false,
            required:true
        },
        destination_type:{
            type:String,
            enum:['phone','email'],
            required:true
        }

    },
    { strict: false, timestamps:true }
);

Verifications = mongoose.model("verifications", VerificationSch);

function generateOTP(){
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

Verifications.addVerification=async function(contact,destination_type){
    try{
        let otp = generateOTP();
        let v = new Verifications({one_time_password:otp,contact:contact,destination_type:destination_type});
        await v.save();
        return v.toObject();
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Verifications.markVerification=async function(id){
    try{
        let v = await Verifications.findById(id);
        v.verified = true;
        await v.save();
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Verifications.removeVerification=async function(id){
    try{
        let v = await Verifications.findByIdAndRemove(id);
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Verifications.verifyOTP=async function(id,otp){
    try{
        let v=await Verifications.findById(id);
        if(!v.verified && v.one_time_password == otp)
        {
            Verifications.markVerification(id);
            return true;
        }
        else
        {
            return false;
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
}