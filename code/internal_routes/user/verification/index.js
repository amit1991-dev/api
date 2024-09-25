//module imports
const express = require("express");
const router = express.Router(); // route : {root}/shopping/

//local imports
const Verifications = require("../../../databases/system/verifications.js");
const Users = require("../../../databases/system/users.js");
const {sendOtp} = require("../../../utility/connectivity_functions.js");

router.post("/send_otp", async (req, res, next) => {
    var ret= {status:"failed",message:""};
    console.log("checking inside send otp");
    // var destination_type = "phone";
    let contact = req.body.phone;
    console.log("number:"+contact);
    let signature = req.body.signature;

    console.log("signature:"+signature);

    try{
        if(!contact || !signature){
            throw {message:"contact or signature missing"};
        }
        let v = await Verifications.addVerification(contact,"phone",signature);
        sendOtp(v.contact,v.one_time_password,v.signature);
        if(v)
        {
            
            ret.status = "success";
            ret.message = "otp sent successfully to: "+contact;
            // ret.otp = v.one_time_password;
            ret.data = v._id;
        }
        else{
            ret.message="Could not create OTP entry. Please try again";
        }
    }
    catch(err)
    {
        ret.message = err.message;
        console.log(err);
    }
    res.status(200).json(ret);
});

router.post("/verify_otp", async (req, res, next) => {
    var ret= {status:"failed",message:""};

    var verification_id = req.body.verification_id;
    let otp = req.body.otp;
    let role = req.body.role;

    try{
        let v = Verifications.verifyOTP(verification_id,otp);
        if(v)
        {
            // if(await Users.exists({phone:v.contact}))
            // {
            //     let user = await Users.findOne({phone:v.contact});
            //     if(role == "host")
            //     {

            //     }
            // }
            // let user = Users({phone:v.contact});
            // sendOTP(contact,v.one_time_password,destination_type);
            ret.status = "success";
            
            ret.message = "otp verified";
        }
    }
    catch(err)
    {
        ret.message = err.message;
        console.log(err);

    }
    res.status(200).json(ret);
    
});

module.exports = router;
