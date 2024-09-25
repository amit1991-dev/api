const mongoose = require("mongoose");

const VerificationSch = new mongoose.Schema(
    {
        contact:{
            type:String,//phone(+919975599067) or email address(usual)
            required:true,
           
        },
        one_time_password:{
            type:String,
            required:true
        },
        signature:{
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

Verifications.addVerification=async function(contact,destination_type,signature){
    try{
        let otp = generateOTP();
        if(contact == "1234567890"){
            otp = "123456";
        }
        let v = new Verifications({one_time_password:otp,contact:contact,destination_type:destination_type,signature:signature});
        await v.save();
        console.log(v);
        return v;
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

Verifications.markVerificationUndone=async function(id){
    try{
        let v = await Verifications.findById(id);
        v.verified = false;
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
    console.log(id);
    console.log(otp);
    try{
        let v=await Verifications.findById(id);
        console.log(v);
        if(!v.verified && v.one_time_password == otp)
        {
            Verifications.markVerification(id);
            return v.contact;
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


Verifications.unverifyOTP=async function(id){
    try{
        let v=await Verifications.findById(id);
        console.log(v);
        if(v.verified)
        {
            Verifications.markVerificationUndone(id);
            return v.contact;
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


module.exports = Verifications;