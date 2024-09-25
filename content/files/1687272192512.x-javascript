const mongoose = require("mongoose");


const ObjectId = mongoose.Schema.ObjectId;

const HostSch = new mongoose.Schema(
    {
        host_id: {
            type: mongoose.Schema.ObjectId,
            required:true,
            unique:true,
        },
        helpers:[{
            type:ObjectId,
            ref:"users"
        }],
        bank_details:{
            type:ObjectId,
            ref:"bank_details"// try for null
        },
        contact:{
            type:String,
        }, 
        address:{
            type:ObjectId,
            ref:"addresses",   
        }
    },
    { strict: false,timestamps:true,minimize:false }
);

let Hosts = mongoose.model("hosts", HostSch);

Hosts.getHost=async function(user_id,detail=false)
{
    try{
        if(detail)
            var c=await Hosts.findOne({user_id:user_id}).populate('cart.product');
        else
            var c=await Hosts.findOne({user_id:user_id});
        return c;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Hosts.getCart=async function(user_id,detail=false)
{
    try{
        // console.log(user_id);
        var cart;
        if(detail)
        {
            cart=await Hosts.findOne({user_id:user_id}).populate('cart.product').lean();
        }
        else{
            cart=await Hosts.findOne({user_id:user_id}).lean();
            // console.log(cart.cart);

        }
        
        return cart.cart || [];
    }
    catch(err){
        console.log(err);
        return false;
    }
}

// Hosts.getCartLength=async function(user_id)
// {
//     try{
//         var cartLength=await Hosts.find({user_id:user_id}).cart.length;
//         console.log("cart length:"+cartLength);
//         return cartLength;
//     }
//     catch(err){
//         console.log(err);
//         return -1;
//     }
// }

// //item should be like: {product_id,quantity}
// Hosts.insertItemIntoCart=async function(user_id,item)
// {
    
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         // console.log("rej");
//         return false;
//     }

//     try{
//         var Hosts=await Hosts.findOne({user_id:user_id});
//         // console.log(Hosts);
//         var found=false;
//         for(var i =0;i< Hosts.cart.length;i++){
//             if(Hosts.cart[i].product == item.product_id)
//             {
//                 found=true;
//                 // if(item.quantity>0)
//                 // {
//                 //     Hosts.cart[i].quantity += Math.abs(item.quantity);
//                 // }
//                 Hosts.cart[i].quantity = item.quantity;
//                 break;
//             }
//         }
//         if(!found)
//         {
//             Hosts.cart.push({product:item.product_id,quantity:item.quantity});
//         }
//         Hosts.markModified('cart');
//         // console.log(Hosts);
//         await Hosts.save();
//         return Hosts.cart;
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }
//     // console.log(t);
//     // var t=await Hosts.updateOne({user_id:user_id},{$push:{items:item}});
    
// }


// Hosts.modifyCartItemQuantity=async function(user_id,product_id,quantity)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         return false;
//     }
//     try{
//         var found=false;
//         var Hosts=await Hosts.findOne({user_id:user_id});
//         // console.log(t.items);
//         for(var i =0;i< Hosts.cart.length;i++){
//             if(Hosts.cart[i].product == product_id)
//             {
//                 found=true;
//                 if(quantity>0 && quantity <=10)
//                 {
//                     Hosts.cart[i].quantity= quantity;
                    
//                 }
//                 else{
//                     Hosts.cart.splice(i,1);
//                 }
//                 break;
//             }
//         }
//         if(!found)
//         {
//             Hosts.cart.push({});
//         }
//         Hosts.markModified('cart');
//         await Hosts.save();
//         return Hosts.cart;
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     } 
// }

// Hosts.removeElementFromCart=async function(user_id,product_id)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         console.log("wer");
//         return false;
//     }

//     try{
//         var found=false;
//         var Hosts=await Hosts.findOne({user_id:user_id});
//         for(var i =0;i< Hosts.cart.length;i++){
//             if(Hosts.cart[i].product == product_id)
//             {
//                 // console.log("wer");
//                 found=true;
//                 Hosts.cart.splice(i,1);
//                 break;

//             }
//         }
//         if(!found)
//         {
//             console.log("sd");
//             return false;
//         }

//         Hosts.markModified('cart');//should be called before save() function!
//         await Hosts.save();
//         return Hosts.cart;
        
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }

// }

// Hosts.clearCart=async function(user_id)
// {
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         return false;
//     }

//     try{
        
//         var Hosts=await Hosts.findOne({user_id:user_id});

//         Hosts.cart.splice(i,Hosts.cart.length);
//         Hosts.markModified('cart');
//         await Hosts.save();

//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }   
// }


// Hosts.getTotalAmount=async function(user_id)
// //get total amount based on items in the inventory
// {
//     var t={list:[],status:"success",total:0,discount:0};
//     var failed=false;
//     if(!mongoose.Types.ObjectId.isValid(user_id))
//     {
//         console.log("not a valid user_id");
//         return false;
//     }
//     // var found=false;
//     var Hosts=await Hosts.getHosts({user_id:user_id});
//     var total=0;
//     var tmp;
//     // console.log(t.items);
//     for(var i =0;i< Hosts.cart.length;i++){
//        tmp = await Products.getProduct(Hosts.cart[i].product);
//        if(tmp.inventory > Hosts.item[i].quantity)
//        {
//         total += tmp.price * Hosts.item[i].quantity;
//        }
//        else{
//            t.list.push(Hosts.cart[i].product);
//            failed=true;
//        }
//     }
    
//     t.total = total;
//     t.discount=0;
//     if(failed)
//     {
//         t.status="failed";
        
//     }
    
//     return t;
// }


module.exports = Hosts;
