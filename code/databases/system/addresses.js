const mongoose = require("mongoose");
const AddressSch = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.ObjectId,
        required:true,
        sparse:false
    },
    address_type:{type:String,enum:["primary","secondary"],required:true},
    address:{
        type:{
            name:String,
            address_line_1:{type:String,required:true},
            address_line_2:{type:String},
            city:{type:String,required:true},
            state:{type:String,required:true},
            pincode:{type:String,max:6,required:true},
            phone:{type:String},
            google_place_id:{type:String},
        },
        default:[],
        required:true,
    },
},
{ strict: false,timestamps:true,minimize:false });

let Addresses = mongoose.model("addresses", AddressSch);



// Market.getMarket=async function(user_id,detail=false)
// {
//     try{
//         if(detail)
//             var c=await Market.find({user_id:user_id}).populate('cart.product');
//         else
//             var c=await Market.find({user_id:user_id});
//         return c;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Market.getCart=async function(user_id)
// {
//     try{
//         var cart=await Market.find({user_id:user_id}).populate('cart.product').cart;
//         return cart;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// //item should be like: {product_id,quantity}
// Market.insertItemIntoCart=async function(user_id,item)
// {
    
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         // console.log("rej");
//         return false;
//     }

//     try{
//         var market=await Market.findOne({user_id:user_id}).populate("cart.product");
//         // console.log(market);
//         var found=false;
//         for(var i =0;i< market.cart.length;i++){
//             if(market.cart[i].product_id == item.product_id)
//             {
//                 found=true;
//                 if(item.quantity>0)
//                 {
//                     market.cart[i].quantity += Math.abs(item.quantity);
//                 }
//                 break;
//             }
//         }
//         if(!found)
//         {
//             market.cart.push(item);
//         }
//         market.markModified('cart');
//         // console.log(market);
//         await market.save();
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }
//     // console.log(t);
//     // var t=await Market.updateOne({user_id:user_id},{$push:{items:item}});
    
// }


// Market.modifyCartItemQuantity=async function(user_id,product_id,quantity)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         return false;
//     }
//     try{
//         var found=false;
//         var market=await Market.findOne({user_id:user_id}).populate("cart.product");
//         // console.log(t.items);
//         for(var i =0;i< market.cart.length;i++){
//             if(market.cart[i].product_id == product_id)
//             {
//                 found=true;
//                 if(quantity>0)
//                 {
//                     market.cart[i].quantity= quantity;
                    
//                 }
//                 else{
//                     market.cart.splice(i,1);
//                 }
//                 break;
//             }
//         }
//         if(!found)
//         {
//             market.cart.push(item);
//         }
//         market.markModified('items');
//         await market.save();
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     } 
// }

// Market.removeElementFromCart=async function(user_id,product_id)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         console.log("wer");
//         return false;
//     }

//     try{
//         var found=false;
//         var market=await Market.findOne({user_id:user_id}).populate("cart.product");
//         // console.log(t.items);
//         for(var i =0;i< market.cart.length;i++){
//             if(market.cart[i].product_id == product_id)
//             {
//                 // console.log("wer");
//                 found=true;
//                 market.cart.splice(i,1);
//                 break;

//             }
//         }
//         if(!found)
//         {
//             // console.log("sd");
//             return false;
//         }

//         market.markModified('items');//should be called before save() function!
//         await market.save();
        
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }

// }

// Market.clearCart=async function(user_id)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         return false;
//     }

//     try{
        
//         var market=await Market.findOne({user_id:user_id});

//         market.cart.splice(i,market.cart.length);
//         market.markModified('items');
//         await market.save();

//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }   
// }


// Market.getTotalAmount=async function(user_id)//get total amount based on items in the inventory
// {
//     var t={list:[],status:"success",total:0,discount:0};
//     var failed=false;
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         console.log("not a valid user_id");
//         return false;
//     }
//     // var found=false;
//     var market=await Market.getMarket({user_id:user_id}).populate("cart.product");
//     var total=0;
//     var tmp;
//     // console.log(t.items);
//     for(var i =0;i< market.cart.length;i++){
//        tmp = await Products.getProduct(market.cart[i].product_id);
//        if(tmp.inventory > market.item[i].quantity)
//        {
//         total += tmp.price * market.item[i].quantity;
//        }
//        else{
//            t.list.push(market.cart[i].product_id);
//            failed=true;
//         //    return {message:"there are some"};
//        }
//     }
    
//     t.total = total;
//     t.discount=0;
//     // if(market.coupon)
//     // {
//     //     var coupon = await Coupons.getCoupon(market.coupon);
//     //     if(coupon)
//     //     {
//     //         t.discount = coupon.discount;
//     //     }
//     // }
    
//     if(failed)
//     {
//         t.status="failed";
        
//     }
    
//     return t;
// }


module.exports = Addresses;
 
