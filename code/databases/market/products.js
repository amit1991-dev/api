const mongoose = require("mongoose");
// const { modifyCartItemQuantity } = require("./cart");
// const Reviews = require("../feedback/reviews");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;


const ProductSch = new mongoose.Schema(
    {
        name:{type:String,required:true},
        version:{type:String},
        highlights:[{type:String}],
        description:String,
        price:{type:Number,required:true,min:0},
        thumbnail:{type:String,default:"/dowser.png",required:true},
        product_type:{type:String,required:true,enum:['service','digital','physical','room','eatable','wearable']},// digital or physical
        // images:[{type:ObjectId,ref:"files"}],
        image_url:[{type:String,}],
        category:String,// lamp, course, wearable, mechanical, applications
        subcategory:String,
        reviews:[{type:ObjectId,ref:"reviews"}],// Example: {rating:4,review:"very good",user_id:"Object ID"}
        extra:String,
        enabled:{type:Boolean,default:true,required:true},
        in_stock:{type:Boolean,default:true},
	},
    { strict: false,minimize:false,timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);
Products = mongoose.model("products", ProductSch);

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

Products.allProducts=async function(condition=null)
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
Products.insertReview=async function(product_id,review_id)
{

   try{
        // let r = Reviews({review});
        await Products.updateOne({_id:product_id},{$push:{reviews:review_id}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Products.updateProduct=async function(product_id,modified_obj)
{

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
    
   try{
        var t=await Products.updateOne({_id:product_id},{$push:{image_url:image}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Products.removeImage=async function(product_id,image)
{

    try{
        var t=await Products.updateOne({_id:product_id},{$pull:{image_url:image}});
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
    
}

Products.disableProduct=async function(product_id)
{
    
    try{
        await Products.updateOne({_id:product_id},{set:{enabled:false}});
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
    
}

Products.enableProduct=async function(product_id)
{
    
    try{
        await Products.updateOne({_id:product_id},{set:{enabled:true}});
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
    
}

module.exports = Products;