const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const singleResultSchema = require("./result_schema.js");

const studentTestStatusSch = new mongoose.Schema(
  {
    // if_competing is true if the candidate is a student, false for anyone else who is out of the competetion!
    is_competing:{ // in seconds
      type:Boolean,
      default:true,
      required:true,
    },
      test:{
        type:ObjectId,
        required:true,
        ref:'tests'
      },
      attempt_number:{ // current attempt number of this particular test by the student!
        type:Number,
        required:true,
        min:0,
        default:1,
      },  
      time_left:{ // in seconds
        type:Number,
        default:0,
        required:true,
      },
      test_state_status:{
        type:String,
        enum:["uninitialized","paused","finished","running"],
        default:"uninitialized",
        required:true,
      },
      data:{//marking and other data points
        type:[singleResultSchema],
        required:true,
        default:[],
      },
      student:{
        type:ObjectId,
        ref:'students',
        required:true
      },
      // batch:{
      //   type:ObjectId,
      //   ref:'batches',
      //   // required:true
      // },
      
      batch:{type:ObjectId,ref:"batches",required:true},
      branch:{type:ObjectId,ref:"branches"},

      permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

  },
  {strict: false,minimize:false,timestamps:true,collection:"student_test_status"}
);

studentTestStatusSch.index({ test: 1, student: 1,attempt_number:1,batch:1 }, { unique: true });
module.exports = mongoose.model("student_test_status", studentTestStatusSch);