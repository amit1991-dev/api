const express = require("express");
require('dotenv').config();
const Razorpay = require('razorpay');

const router = express.Router();

const crypto = require('crypto');
const Transactions = require("../../databases/events/transactions.js");
const { restart } = require("nodemon");

router.post("/create_order", async (req, res) => {
    let ret = {status:"failed",code:0,message:"initialized"};
    let amount = req.body.amount;
    let user = req.user._id;
	try{
        let transaction = new Transactions({amount,user});
        let rzpConfig = { key_id: process.env.RAZORPAY_KEY_ID, key_secret:  process.env.RAZORPAY_SECRET };
        console.log(rzpConfig);
        var instance = new Razorpay(rzpConfig);
        let orderEntity=await instance.orders.create({
        amount: amount,
        currency: "INR",
        receipt: transaction._id,
        notes: {
            key1: user,
            key2: amount.toString()
            }
        });
        console.log(orderEntity);

        transaction.order_entity= orderEntity;
        transaction.order_id = orderEntity.id;
        transaction.save();

        ret.data = orderEntity.id;
        ret.status = "success";
        code = 200;
        ret.message = "Created Order Id"; 
    }
	catch(err)
	{
        ret.message =err.message;
        console.log(err.message);
	}
	res.status(200).json(ret);
});


router.post("/get_user_transactions", async (req, res) => {
    let ret = {status:"failed",code:0,message:"initialized"};
    // let amount = req.body.amount;
    let user = req.user._id;
	try{
        let transactions = Transactions.find({user:user}).sort({createdAt:-1}).exec();
        ret.data = transactions;
        ret.status = "success";
        code = 200;
        ret.message = "Done"; 
    }
	catch(err)
	{
        ret.message =err.message;
        console.log(err.message);
	}
	res.status(200).json(ret);
});

router.post("/get_all_transactions", async (req, res) => {
    let ret = {status:"failed",code:0,message:"initialized"};
    // let amount = req.body.amount;
    let user = req.user._id;

	try{
        if(req.user.role != "administrator")
        {
            throw {message: "Unauthorized for this request"};
        }
        let transactions = Transactions.find({user:user}).sort({createdAt:-1}).exec();
        ret.data = transactions;
        ret.status = "success";
        code = 200;
        ret.message = "Done"; 
    }
	catch(err)
	{
        ret.message =err.message;
        console.log(err.message);
	}
	res.status(200).json(ret);
});


router.post("/get_transaction/:txn_id", async (req, res) => {
    let ret = {status:"failed",code:0,message:"initialized"};
    let txnId = req.body.txn_id;
    let user = req.user._id;

	try{
        let transaction
        if(req.user.role != "administrator")
        {
            transaction = Transactions.find({_id:txnId,user:user}).populate("user");
        }
        else
        {
            transaction = Transactions.find({_id:txnId}).populate("user");
        }
        ret.data = transaction;
        ret.status = "success";
        code = 200;
        ret.message = "Done"; 
    }
	catch(err)
	{
        ret.message =err.message;
        console.log(err.message);
	}
	res.status(200).json(ret);
});


router.post("/webhook", async (req, res) => {
    let ret = {status:"failed",code:0,message:"initialized"};
    let payload = req.body;
    console.log(payload);

	try{
        // if(body.entity=="order")
        // {

        // }
        let transaction;
        transaction = Transactions.findOne({order_id:txnId}).populate("user");
        
        ret.data = transaction;
        ret.status = "success";
        code = 200;
        ret.message = "Done"; 
    }
	catch(err)
	{
        ret.message =err.message;
        console.log(err.message);
	}
	res.status(200).json(ret);
});


module.exports=router; 
 
