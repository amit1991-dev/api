const express = require("express");
const router = express.Router();

const crypto = require('crypto');

var salt="g5RTeblbPl";

router.post("/request_hash", (req, res, next) => {
    // var strdat = '';
    var ret= {};
    // ret.status="failed";
    var data = req.body;
    console.log(data);	
    
    var cryp = crypto.createHash('sha512');
    var text = data.key+'|'+data.txnid+'|'+data.amount+'|'+data.productinfo+'|'+data.firstname+'|'+data.email+'|||||||||||'+salt;
    cryp.update(text);
    // console.log(text);
    var hash = cryp.digest('hex');
    // ret.hash=hash;
    // data.hash = hash;
    data.hash=hash;

    ret.data = data;
    ret.status="success";
    res.status(200).json(ret);
    // res.status(200).render('pages/payment_confirmed',{data:data});
});


module.exports=router; 
 
