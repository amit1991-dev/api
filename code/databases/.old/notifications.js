const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const NotificationsSch = new mongoose.Schema(
{
  data:{type:String},
  user_id:{type:ObjectId,ref:"users"},
  related_content_type:{type: String,enum:['news','event','system'],},
  related_content_id:{type:ObjectId},
},
{timestamps:true}
);


Notifications = mongoose.model("notifications", NotificationsSch);
//News = mongoose.model("news", NewsSch);

module.exports = Notifications;