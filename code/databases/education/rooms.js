const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const RoomSch = new mongoose.Schema(
    {
        // name:{type: String,required:true},
        start_time:{type: String,required:true},
        owner_id:{type:ObjectId,required:true},
        finished:{type:Boolean,required:true,default:false},
        feedback:[{type:ObjectId,ref:'ratings'}],
        link:{type: String,required:true}

    },
    { strict: false,minimize:false,timestamps:true }
);

module.exports = Room = mongoose.model("rooms", RoomSch);
