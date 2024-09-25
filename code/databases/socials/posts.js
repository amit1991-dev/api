const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const NewsSch = new mongoose.Schema(
{
  headline:{type:String},
  image:{type: String},
  text:{type:String},
},
  {timestamps:true}
);


News = mongoose.model("news", NewsSch);



News.getNews=async function()
{
    try{
        let p=await News.find({}).sort({createdAt:-1});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

//Admin
News.getNewsSingle=async function(event_id)
{
    try{
        let p=await News.findOne({_id:event_id});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

News.createNews=async function(news)
{
    try{
        let p=new News(news);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


module.exports = News;