const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var path = require('path');
var crypto = require('crypto');
const ObjectId = mongoose.Types.ObjectId;

const productsSch = require("../node_models/products");
const Products = mongoose.model("products",productsSch);

const Payments = require("../node_models/payments");

var salt="g5RTeblbPl";

router.post("/hash", (req, res, next) => {
    var strdat = '';
    var ret= new Object();
    ret.status="failed";
    var data = req.body;
    Products.findById(data.udf5).then((product)=>{
    if(!product)
    {
        ret.message="error: product not found for id:"+data.udf5;
        
        // console.log("no product found");
        res.json(ret);
        // res.status(404).render('pages/404');
    }
    else
    {
        
        //ret.data=product;
        if(data.amount == product.price)
        {
            // console.log("yes");
            ret.status="success";
            var cryp = crypto.createHash('sha512');
            var text = data.key+'|'+data.txnid+'|'+data.amount+'|'+data.productInfo+'|'+data.fname+'|'+data.email+'|||||'+data.udf5+'||||||'+salt;
            cryp.update(text);
            console.log(text);
            var hash = cryp.digest('hex');      
            // res.setHeader("Access-Control-Allow-Origin", "*");
            ret.hash=hash;
            data.hash=hash;
            res.status(200).render('pages/payment_confirmed',{data:data});
            // res.json(ret);
        }
        else
        {
            // console.log("no");
            ret.status="failed";
            ret.message="Amount has been altered";
            // res.status(200).render('pages/payment_declined',{data:data});
            res.end();
            // res.json(ret);
        }
        
        // res.status(200).render('pages/product_detail',{product:product});
        
    }
    }).catch((e)=>{
        ret.message="error: "+e.message;
        res.json(ret);
    });
});



router.get("/donate", (req, res, next) => {
    res.status(200).render('pages/donate');
});


router.post("/donate/hash", (req, res, next) => {
    var strdat = '';
    var ret= new Object();
    ret.status="failed";

    var data = req.body;
    ret.status="success";
    var cryp = crypto.createHash('sha512');
    var text = data.key+'|'+data.txnid+'|'+data.amount+'|'+data.productInfo+'|'+data.fname+'|'+data.email+'|||||||||||'+salt;
    cryp.update(text);
    console.log(text);
    var hash = cryp.digest('hex');      
    // res.setHeader("Access-Control-Allow-Origin", "*");
    ret.hash=hash;
    data.hash=hash;
    res.status(200).render('pages/payment_confirmed',{data:data});
});

router.get("/generate_transaction_id", (req, res, next) => {

        res.send({transaction_id:ObjectId()});
});

router.post("/response", (req, res, next) => {
    var key = req.body.key;
    var salt = req.body.salt;
    var txnid = req.body.txnid;
    var amount = req.body.amount;
    var productinfo = req.body.productinfo;
    var firstname = req.body.firstname;
    var email = req.body.email;
    var udf5 = req.body.udf5;
    var mihpayid = req.body.mihpayid;
    var status = req.body.status;
    var resphash = req.body.hash;
    
    var keyString       =   key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
    var keyArray        =   keyString.split('|');
    var reverseKeyArray =   keyArray.reverse();
    var reverseKeyString=   salt+'|'+status+'|'+reverseKeyArray.join('|');
    
    var cryp = crypto.createHash('sha512'); 
    cryp.update(reverseKeyString);
    var calchash = cryp.digest('hex');
    var success=false;
    var msg = 'Payment failed for Hash not verified...';

    if(calchash == resphash){
        msg = 'Transaction Successful and Hash Verified...';
        success=true;
        // process_order()
        // create order items now and remove item from inventory! and clear cart!
    }

    let p = new Payments({_id: txnid,amount: amount, product_info: productinfo, 
    name: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg});
    p.save().then(()=>{
        res.render('pages/payment_response.ejs', {key: key,salt: salt,txnid: txnid,amount: amount, productinfo: productinfo, 
    firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg});
        

    }).catch((e)=>{
        res.render('pages/payment_response.ejs', {key: key,salt: salt,txnid: txnid,amount: amount, productinfo: productinfo, 
    firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg});
    });
    
    
});
module.exports = router;





