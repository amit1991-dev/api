const mongoose = require("mongoose");
const { modifyCartItemQuantity } = require("./cart");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;

const ReviewSchema = new mongoose.Schema({
    review:{type:String},
    rating:{type:Number,min:1,max:5},
    reason:{type:String},
    user_id:{type:ObjectId,ref:"users",required:true},
    data:{type:String}

},{ strict: false,minimize:false,timestamps:true });

Reviews = mongoose.model("reviews", ReviewSchema);


Reviews.getAll=async function(filter={})
{
    try{
        let data=await Reviews.findAll();
        return data;
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
}

Reviews.deleteReview=async function(review_id)
{
    try{
        await Reviews.findOneAndDelete({_id:review_id});
    }
    catch(err)
    {
        // console.log(err);
        return false;
    }
}

module.exports = Reviews; 
