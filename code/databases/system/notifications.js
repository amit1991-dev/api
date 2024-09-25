const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const NotificationsSch = new mongoose.Schema(
{
  message:{type:String,required:true},
  user:{type:ObjectId,ref:"users",required:true},
  role:{type: String,required:true},
  related_content_type:{type: String,required:true,default:"information",enum:['news','event','course','test','lecture','order','socials','system','information'],},
  related_content:{type:ObjectId},
},
{timestamps:true}
);


let Notifications = mongoose.model("notifications", NotificationsSch);
//News = mongoose.model("news", NewsSch);

module.exports = Notifications;