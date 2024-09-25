const express = require("express");
const router = express.Router();

const Products = require("../../../databases/market/products.js");
const Users = require("../../../databases/system/users.js");


router.get("/all",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const filters=req.queries || {};
	let products = await Products.allProducts(filters);
	if(products)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = products;
	}

	res.status(200).json(ret);
});

router.get("/single/:product_id",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const productId=req.params.product_id;
	let product = await Products.getProduct(productId);

	if(product)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = product;
	}

	res.status(200).json(ret);
});

router.put("/", async (req, res, next) => {
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role != "administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let product=req.body;

    try{
        let d=new Products(product);
        await d.save();
        ret.message="done";
        ret.status = "success";  
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});

router.post("/:product_id", async (req, res, next) => {
	let productId = req.params.product_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let product=req.body;
    

    try{
        if(Products.updateProduct(productId,product))
        {
        	ret.message="done";
        	ret.status = "success";
        }
        else
        {
        	ret.message = "some error occured";
        }
        
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});


router.post("/image/add/:product_id/",async (req, res, next) => {
	let productId = req.params.product_id;
	let imageUrl = req.body.image_url;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);
    if(!user || user.role!="administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    // let product=req.body;
    console.log(imageUrl);
    try{
        if(Products.addImage(productId,imageUrl))
        {
        	ret.message="done";
        	ret.status = "success";
        }
        else
        {
        	ret.message = "some error occured";
        }
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});

router.post("/image/remove/:product_id",async (req, res, next) => {
	let productId = req.params.product_id;
	let imageUrl = req.body.image_url;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);
    if(!user || user.role!="administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    console.log(imageUrl);
    // let product=req.body;
    try{
        if(Products.removeImage(productId,imageUrl))
        {
        	ret.message="done";
        	ret.status = "success";
        }
        else
        {
        	ret.message = "some error occured";
        }
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});

//delete is not implemented as its use is very minimal!
// still have to do it!
router.delete("/:product_id", async(req, res, next) => {
    let ret={message:"",status:"failed"};

    let product_id = req.params.product_id;
    Products.findOneAndDelete({_id:product_id},function(err){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "Reason:"+err.message;
            }
            else{
                ret.status="success";
                ret.message = "done";
            }
            res.status(200).json(ret);
        });
});

module.exports = router;
