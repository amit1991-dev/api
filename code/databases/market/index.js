const mongoose = require("mongoose");
const Products = require("./products");
const Coupons = require("./coupons");

const ObjectId = mongoose.Schema.ObjectId;

const MarketSch = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            required:true,
            unique:true,
        },
        cart:{
            type:[{
                product:{type:ObjectId,ref:"products"},
                quantity:{type:Number,required:true,min:0,max:5},
            }],
            default:[],
            required:true,
            },
    },
    { strict: false,timestamps:true,minimize:false }
);

Market = mongoose.model("market", MarketSch);

Market.getMarket=async function(user_id,detail=false)
{
    try{
        if(detail)
            var c=await Market.findOne({user_id:user_id}).populate('cart.product');
        else
            var c=await Market.findOne({user_id:user_id});
        return c;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Market.getCart=async function(user_id,detail=false)
{
    try{
        // console.log(user_id);
        var cart;
        if(detail)
        {
            cart=await Market.findOne({user_id:user_id}).populate('cart.product').lean();
        }
        else{
            cart=await Market.findOne({user_id:user_id}).lean();
            // console.log(cart.cart);

        }
        
        return cart.cart || [];
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Market.getCartLength=async function(user_id)
{
    try{
        var cartLength=await Market.find({user_id:user_id}).cart.length;
        console.log("cart length:"+cartLength);
        return cartLength;
    }
    catch(err){
        console.log(err);
        return -1;
    }
}

//item should be like: {product_id,quantity}
Market.insertItemIntoCart=async function(user_id,item)
{
    
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        // console.log("rej");
        return false;
    }

    try{
        var market=await Market.findOne({user_id:user_id});
        // console.log(market);
        var found=false;
        for(var i =0;i< market.cart.length;i++){
            if(market.cart[i].product == item.product_id)
            {
                found=true;
                // if(item.quantity>0)
                // {
                //     market.cart[i].quantity += Math.abs(item.quantity);
                // }
                market.cart[i].quantity = item.quantity;
                break;
            }
        }
        if(!found)
        {
            market.cart.push({product:item.product_id,quantity:item.quantity});
        }
        market.markModified('cart');
        // console.log(market);
        await market.save();
        return market.cart;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    // console.log(t);
    // var t=await Market.updateOne({user_id:user_id},{$push:{items:item}});
    
}


Market.modifyCartItemQuantity=async function(user_id,product_id,quantity)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }
    try{
        var found=false;
        var market=await Market.findOne({user_id:user_id});
        // console.log(t.items);
        for(var i =0;i< market.cart.length;i++){
            if(market.cart[i].product == product_id)
            {
                found=true;
                if(quantity>0 && quantity <=10)
                {
                    market.cart[i].quantity= quantity;
                    
                }
                else{
                    market.cart.splice(i,1);
                }
                break;
            }
        }
        if(!found)
        {
            market.cart.push({});
        }
        market.markModified('cart');
        await market.save();
        return market.cart;
    }
    catch(err)
    {
        console.log(err);
        return false;
    } 
}

Market.removeElementFromCart=async function(user_id,product_id)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        console.log("wer");
        return false;
    }

    try{
        var found=false;
        var market=await Market.findOne({user_id:user_id});
        for(var i =0;i< market.cart.length;i++){
            if(market.cart[i].product == product_id)
            {
                // console.log("wer");
                found=true;
                market.cart.splice(i,1);
                break;

            }
        }
        if(!found)
        {
            console.log("sd");
            return false;
        }

        market.markModified('cart');//should be called before save() function!
        await market.save();
        return market.cart;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }

}

Market.clearCart=async function(user_id)
{
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        return false;
    }

    try{
        
        var market=await Market.findOne({user_id:user_id});

        market.cart.splice(i,market.cart.length);
        market.markModified('cart');
        await market.save();

    }
    catch(err)
    {
        console.log(err);
        return false;
    }   
}


Market.getTotalAmount=async function(user_id)
//get total amount based on items in the inventory
{
    var t={list:[],status:"success",total:0,discount:0};
    var failed=false;
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        console.log("not a valid user_id");
        return false;
    }
    // var found=false;
    var market=await Market.getMarket({user_id:user_id});
    var total=0;
    var tmp;
    // console.log(t.items);
    for(var i =0;i< market.cart.length;i++){
       tmp = await Products.getProduct(market.cart[i].product);
       if(tmp.inventory > market.item[i].quantity)
       {
        total += tmp.price * market.item[i].quantity;
       }
       else{
           t.list.push(market.cart[i].product);
           failed=true;
       }
    }
    
    t.total = total;
    t.discount=0;
    if(failed)
    {
        t.status="failed";
        
    }
    
    return t;
}


module.exports = Market;
