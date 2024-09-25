const express = require("express");
const router = express.Router();

var validator = require("email-validator");
const bcrypt = require("bcrypt");


const inquiryRoute = require('../../internal_routes/inquiry/index');

const paymentsRoute = require('../../internal_routes/payments/index');

const blogRoute = require('../../internal_routes/blog/index');

const marketRoute = require('../../internal_routes/market/index');

const certificatesRoute = require('../../internal_routes/certifications/certificates/index');

// const Subscribers = require('../../databases/subscribers.js');

router.get('/',async function (req,res){
    let body = req.body;
    
	let ret = { status:"success",message:'Welcome to Business api root!',content:[{path:"/inquiry"}]};
    res.status(200).json(ret);
    // res.json(ret);
});

router.use('/inquiry/',inquiryRoute);
router.use('/payments/',paymentsRoute);
router.use('/blog/',blogRoute);

router.use('/certifications/',certificatesRoute);

router.use('/market/',marketRoute);

module.exports=router;
