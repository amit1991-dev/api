//module imports
const express = require("express");
const router = express.Router(); // route : {root}/shopping/

//local imports
const Verifications = require("../../../databases/verifications.js");
const sendOTP = require("../../../utility/functions.js");

router.post("/send_otp", async (req, res, next) => {
    var ret= {status:"failed",message:""};
    var destination_type = req.body.destination_type;
    let contact = req.body.contact;

    try{
        let v = Verifications.addVerification(contact,destination_type);
        if(v)
        {
            sendOTP(contact,v.one_time_password,destination_type);
            ret.status = "success";
            ret.message = "otp sent successfully to: "+contact;
            ret.otp = v.one_time_password;
            ret.id = v._id;
        }
    }
    catch(err)
    {
        console.log(err);
    }
    finally{
        res.status(200).json(ret);
    }
});

router.post("/verify_otp", async (req, res, next) => {
    var ret= {status:"failed",message:""};

    var id = req.body.id;
    let otp = req.body.otp;

    try{
        let v = Verifications.verifyOTP(id,otp);
        if(v)
        {
            // sendOTP(contact,v.one_time_password,destination_type);
            ret.status = "success";
            ret.message = "otp verified";
        }
    }
    catch(err)
    {
        console.log(err);

    }
    finally{
        res.status(200).json(ret);
    }
    
});

module.exports = router;
