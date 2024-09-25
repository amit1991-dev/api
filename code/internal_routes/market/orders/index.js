const express = require("express");
const router = express.Router();

const Orders = require("../../../databases/market/orders.js");
const Users = require("../../../databases/system/users.js");


router.get("/all",async function(req,res){
    let ret = {status:"failed",code:-1,message:"failed"};
    let userId = req.user._id;

    let user= await Users.findById(userId);

    const filters=req.queries || {};
    let orders;
    if(!user || user.role!="administrator")
    {
        orders = await Orders.getUserOrders(userId,filters);
    }
    else
    {
        orders = await Orders.getAllOrders(filters);
    }
    
    // console.log("order all!");
    
    if(orders)
    {
        // console.log("order all done!");
        ret.status="success";
        ret.code=200;
        ret.message="done";
        ret.data = orders;
    }

    res.status(200).json(ret);
});

router.get("/single/:order_id",async function(req,res){
    let ret = {status:"failed",code:-1,message:"order not found!"};
    const orderId=req.params.order_id;
    let order = await Orders.getOrder(orderId);
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(order && (user.role=="administrator" || (userId == order.user_id)))
    {
        ret.status="success";
        ret.code=200;
        ret.message="done";
        ret.data = order;
    }
    else if(userId != order.user_id)
    {
        ret.message = "Sorry it does not seem like an order from you!!";
    }

    res.status(200).json(ret);
});

router.post("/:order_id", async(req, res, next) => {
    let certificateId = req.params.certificate_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
        res.status(200).json(ret);
        return;
    }
    let certificate=req.body;
    

    try{
        if(Orders.updateOrderInfo(certificateId,certificate))
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

router.post("/cancel/:order_id", async(req, res, next) => {
    let order_id = req.params.order_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
        res.status(200).json(ret);
        return;
    }
    let cancel_obj=req.body;
    

    try{
        if(Orders.cancelOrder(order_id,cancel_obj))
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
module.exports = router;
