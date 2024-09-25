const mongoose = require("mongoose");
const CouponSch = new mongoose.Schema(
    {
        name: {
            type: String
        },
        discount:{type:Number,min:0,max:50},
        applicable:{type:[],deafult:["all"]},
        enabled:{type:Boolean, default:true,required:true}
    },
    { strict: false, timestamps:true }
);

Coupons = mongoose.model("coupons", CouponSch);



//functions
Coupons.getCoupon=async function(coupon_id)
{
    try{
        p=await Coupons.findOne({_id:coupon_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Coupons.getAllCoupons=async function(condition=null)
{
    try{
        var t= await Coupons.find(condition);
        return t;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}

Coupons.enableCoupon=async function(coupon_id)
{
    return await toggleEnableCoupon(coupon_id,true);
    
}

Coupons.disableCoupon=async function(coupon_id)
{
    return await toggleEnableCoupon(coupon_id,false);
    
}


async function toggleEnableCoupon(coupon_id,new_enabled)
{
    try{
        var t= await Coupons.updateOne({_id:coupon_id},{$set:{enabled:new_enabled}});
        return t;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


module.exports = Coupons;
