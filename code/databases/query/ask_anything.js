const mongoose = require("mongoose");
const { modifyCartItemQuantity } = require("./cart");
// const notifications = require("./notifications.js");

const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;

const CommentSch = new mongoose.Schema(
    {
        comment:{type:String,required:true},
        user_id:{type:ObjectId,required:true,ref:"users"},        
        
    },
    { strict: false,minimize:false, timestamps:true }
);

const QueryResponseSch = new mongoose.Schema(
    {
        response:{type:String,required:true},
        file_path:String,//path of the zip for the query
        recording:String,//path to the recording      
    },
    { strict: false,minimize:false, timestamps:true }
);

const QuerySch = new mongoose.Schema(
    {
        query:{type:String,required:true},
        file_path:String,//path of the zip for the query
        description:String,
        recording:String,//path to the recording
        user_id:{type:ObjectId,required:true,ref:"users"},        
        comments:[CommentSch],
        extra:String,
        status:{type:String,enum:["open","closed"],default:"open"},
        response:QueryResponseSch,
        
	},
    { strict: false,minimize:false, timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Queries = mongoose.model("queries", QuerySch);

Queries.getQueries=async function()
{
    try{
        let p=await Queries.find({});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}



//Admin
Queries.getQuery=async function(query_id)
{
    try{
        let p=await Queries.findOne({_id:query_id}).populate("users");
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Queries.createQuery=async function(query)
{
    try{
        let p=new Queries(query);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Queries.comment=async function(query_id,comment)
{
    try{
        await Queries.updateOne({_id:query_id},{$push:{comments:comment}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}



Queries.updateStatus=async function(query_id,new_status)
{
    try{
        await Queries.updateOne({_id:query_id},{$set:{status:new_status}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Queries.sendResponse=async function(query_id,response)
{
    try{
        await Queries.updateOne({_id:query_id},{$set:{response:response}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}




module.exports=Queries;