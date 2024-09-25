const express = require("express");
const router = express.Router();

const Market = require("../../../databases/market/index.js");

router.get("/",async function(req,res){
	let userId=req.user._id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.getCart(userId);
		ret.status="success";
		ret.data=cart;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.get("/full",async function(req,res){
	let userId=req.user._id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.getCart(userId).populate("cart.product");
		console.log(cart);
		ret.status="success";
		ret.data=cart;
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.post("/add_item",async function(req,res){
	let userId=req.user._id;
    let item = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.insertItemIntoCart(userId,item);
        if(!cart)
        {
            console.log(cart);
            ret.status="failed";
            ret.message = "market function failed in the server core!";
        }
        else
        {
            console.log(cart);
            ret.status="success";
            ret.message = "Done";
            ret.data=cart;
        }
		
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.get("/remove_item/:product_id",async function(req,res){
	let userId=req.user._id;
    let productId = req.params.product_id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.removeElementFromCart(userId,productId);
        if(!cart)
        {
            console.log(cart);
            ret.status="failed";
            ret.message = "market function failed in the server core!";
        }
        else
        {
            console.log(cart);
            ret.status="success";
            ret.message = "Done!";
            ret.data=cart;
        }
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.post("/modify_quantity/",async function(req,res){
	let userId=req.user._id;
    let item = req.body;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.modifyCartItemQuantity(userId,item.product_id,item.quantity);
        if(!cart)
        {
            console.log(cart);
            ret.status="failed";
            ret.message = "market function failed in the server core!";
        }
        else
        {
            console.log(cart);
            ret.status="success";
            ret.data=cart;
            ret.message = "Done!";
        }
	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
	}
	finally{
		res.status(200).json(ret);
	}
});

router.get("/count",async function(req,res){
	let userId=req.user._id;
	let ret = {status:"failed",code:0,message:"initialized"};
	try{
		let cart = await Market.getCartLength(userId);
		console.log(cart);
		ret.data=cart;

	}
	catch(err)
	{
		console.log(err.message);
		ret.message="Server Problem";
		
	}
	finally{
		res.status(200).json(ret);
	}
});


module.exports = router;
