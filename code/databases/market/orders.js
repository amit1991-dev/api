const mongoose = require("mongoose");
const Market = require("./index");
// const Cart = require("./cart");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;
const OrderSch = new mongoose.Schema(
    {
        amount:{type:Number,set:(v)=>{return v;}},//total after applying coupon then tax!
        user_id:{type:ObjectId,ref:"users",required:true},
        items:[{
            product:{type:ObjectId,ref:"products"},
            quantity:{type:Number,min:0,max:9,required:true,},
            remark:String,
        }],
        status:{type:String,enum:['placed','confirmed','dispatched','delivered','cancelled'],default:"placed"},
        cancel:{type:{
                    cancelled:Boolean,
                    reason:String,
                    action:String
                    }
                },//{cancelled:false}
        // coupon:{type:String},
        delivery_type:{type:String,enum:['pickup','online','delivery','other'],required:true},
        address:{type:ObjectId,ref:"addresses",required:true},
        transaction:{type:ObjectId,ref:"transactions",required:true},
    },
    { strict: false,minimize:false,timestamps:true }
);

Orders = mongoose.model("orders", OrderSch);

Orders.getUserOrders=async function(user_id,filter={})
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }
    try{
        orders=await Orders.find({user_id:user_id,...filter}).sort({timestamp:-1});
        return orders;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}

Orders.getAllOrders=async function(filter={})
{
    try{
        orders=await Orders.find(filter).sort({timestamp:-1});
        return orders;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Orders.getOrder=async function(order_id)
{
    if(!mongoose.Types.ObjectId.isValid(order_id))
    {
        return false;
    }
    try{
        orders=await Orders.find({_id:order_id}).populate("products").populate("address").populate("transaction");
        return orders;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Orders.createFromCart=async function(user_id)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }
    try{
        cart=await Market.getCart(user_id);
        var t = new Orders()
        if(cart)
        {
            //cloning items
            let productIds=[];
            cart.map(function(item){
                productIds.push(item.product._id);
            })
            t.items=productIds;
            let amountObj = await Market.getTotalAmount(user_id);
            t.total = amountObj.total*(100-amountObj.discount)/100;
            t.coupon= cart.coupon;
            await t.save();
            await Market.clearCart(user_id);
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
    
    return orders;
}

//cancelObj should be like: cancelled:Boolean,reason:String,action:String
Orders.cancelOrder=async function(order_id,cancel_obj)
{
    if(!mongoose.Types.ObjectId.isValid(order_id))
    {
        return false;
    }
    try{
            await Orders.updateOne({_id:order_id},{$set:{cancel:cancel_obj,status:"cancelled"}},function(err,res){console.log(res);console.log(err)});

    }
    catch(err)
    {
        console.log(err);
        return false;
    }
   
    
}


module.exports = Orders
