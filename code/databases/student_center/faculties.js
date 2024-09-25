const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const FacultySch = new mongoose.Schema(
{
  user:{
    type:ObjectId,
    ref:"users",
    required:true
  },
  class_number:{
    type:String,
  },
  stream:{
    type:ObjectId,
    ref:"streams",
    required:true
  },
  student:{
    type:ObjectId,
    ref:"students",
    required:true
  },
  name: {
      type: String,
  },
  subject:{
    type:ObjectId,
    ref:"subjects",
    required:true,
  },
  email: {
      type: String,
  },
  phone:{//mobile student
    type:String,
    required:true,
  },
  permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
  enabled:{
    type:Boolean,
    required:true,
    default:true,
  },
      },  
        { strict: false,minimize:false,timestamps:true });

module.exports = mongoose.model("faculties", FacultySch);
