const mongoose = require("mongoose");
const { modifyCartItemQuantity } = require("./cart");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;

const ReviewSchema = new mongoose.Schema({
    review:{type:String},
    rating:{type:Number,min:1,max:5,required:true},
    reason:{type:String},
    user_id:{type:ObjectId,ref:"users"},

},{ strict: false,minimize:false,timestamps:true })

const ProductSch = new mongoose.Schema(
    {
        name:{type:String,required:true},
        description:String,
        price:{type:Number,required:true,min:1},
        inventory:{type:Number,default:10},
        type:String,// digital or physical
        images:[String],
        category:String,// lamp, course, wearable, mechanical, applications
        // details:[String],
        reviews:[ReviewSchema],// Example: {rating:4,review:"very good",user_id:"Object ID"}
        extra:String,
        enabled:{type:Boolean,default:false}
    },
    { strict: false,minimize:false }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Products = mongoose.model("products", ProductSch);
Reviews = mongoose.model("reviews", ReviewSchema);

Products.getProduct=async function(product_id)
{
    try{
        p=await Products.findOne({_id:product_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Products.listing=async function(condition=null)
{
    try{
        var t= await Products.find(condition);
        return t;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}

//review should be like: {rating,review,user_id}
Products.insertReview=async function(product_id,review)
{
    if(!mongoose.Types.ObjectId.isValid(product_id))
    {
        return false;
    }
    
   try{
        let r = Reviews({review});
        var t=await Products.updateOne({_id:product_id},{$push:{reviews:review}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Products.updateProductInfo=async function(product_id,modified_obj)
{
    // console.log(modified_obj);
    if(!mongoose.Types.ObjectId.isValid(product_id))
    {
        return false;
    }
    
    try{
        var t=await Products.updateOne({_id:product_id},{$set:modified_obj});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Products.addImage=async function(product_id,image)
{
    if(!mongoose.Types.ObjectId.isValid(product_id))
    {
        return false;
    }
    console.log("image added");
    
   try{
        var t=await Products.updateOne({_id:product_id},{$push:{image_url:image}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Products.removeImage=async function(product_id,image_url)
{
    if(!mongoose.Types.ObjectId.isValid(product_id))
    {
        return false;
    }
    
    try{
        var t=await Products.updateOne({_id:product_id},{$pull:{image_url:image_url}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}

module.exports = Products;