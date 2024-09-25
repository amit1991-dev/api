const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const EventsSch = new mongoose.Schema(
{
  //data types
  headline:{type:String},
  image:{type: String},
  description:{type:String},
  venue:{type:String},
  price:{type:Number,default:0},
  author:{type:ObjectId,ref:"users"},
  extra:{type:String},

  //arrays
  registrants:[{type:ObjectId,ref:"users"}],
  updates:[{type:String}],
  pictures:[{type:String}],
  videos:[{type:String}],
  likes:[{type:ObjectId,ref:"users"}],  
},
{
  timestamps:true
});

Events = mongoose.model("events", EventsSch);


Events.getEvents=async function()
{
    try{
        let p=await Events.find({});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}



//Admin
Events.getEvent=async function(event_id)
{
    try{
        let p=await Events.findOne({_id:event_id}).populate("users");
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.createEvent=async function(event)
{
    try{
        let p=new Events(event);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Events.like=async function(event_id,user_id)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{likes:user_id}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.unlike=async function(event_id,user_id)
{
    try{
        await Events.updateOne({_id:event_id},{$pop:{likes:user_id}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.register=async function(event_id,user_id)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{registrants:user_id}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.unregister=async function(event_id,user_id)
{
    try{
        await Events.updateOne({_id:event_id},{$pull:{registrants:user_id}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.addUpdate=async function(event_id,update)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{updates:update}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.edit=async function(event_id,update)
{
    try{
        await Events.updateOne({_id:event_id},{$set:{updates:update}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.edit=async function(event_id,update)
{
    try{
        await Events.updateOne({_id:event_id},{$set:{updates:update}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.addPicture=async function(event_id,picture_path)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{pictures:picture_path}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.removePicture=async function(event_id,picture_path)
{
    try{
        await Events.updateOne({_id:event_id},{$pull:{pictures:picture_path}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.addVideo=async function(event_id,video_path)
{
    try{
        await Events.updateOne({_id:event_id},{$push:{videos:video_path}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Events.removeVideo=async function(event_id,video_path)
{
    try{
        await Events.updateOne({_id:event_id},{$pull:{videos:video_path}});
        return true;
        
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}




module.exports=Events;