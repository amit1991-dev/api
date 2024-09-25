const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const singleResultSchema = require("./result_schema.js");

const ResultSch = new mongoose.Schema(
    {
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
        attempt_number:{
          type:Number,
          required:true,
          min:0
        },  
        marked:{
          type:[singleResultSchema],
          required:true
        },
        student:{
          type:ObjectId,
          ref:'students',
          required:true
        },
        test_state:{
          type:ObjectId,
          required:true,
          ref:'student_test_status'
        },
        declaration_time:{
          type:Date,
          default:null,
        },
        total:Number,
        max_marks:Number,
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
        section_wise:{},
        batch:{type:ObjectId,ref:"batches",required:true},
        branch:{type:ObjectId,ref:"branches"},
        result_name: {
          type: String,
      },
      result_type:{     //please provide more values to be filled here
        type:String,
        enum:['general','iit-mains','iit-advanced','neet'],
      },
    //   batch_name: {
    //     type: String,
    // },
    },
    { strict: false,minimize:false,timestamps:true }
);

ResultSch.index({ test: 1, student: 1,attempt_number:1,batch:1 }, { unique: true });
module.exports = mongoose.model("results", ResultSch);