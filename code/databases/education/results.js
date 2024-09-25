const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const singleResultSchema = new mongoose.Schema({
            question:{type:ObjectId,required:true,ref:"questions"},
            attempted:{type:Boolean,default:false,required:true},
            answer_value:String,
            marks_obtained:Number,
            subject:String,
            correctly_marked:{type:Boolean,default:false},
            visited:{type:Boolean,default:false,required:true},
            time_allotted:{type:Number,default:0,required:true}//time alotted in SECONDS!
          },{_id:false});

const ResultSch = new mongoose.Schema(
    {
        test_id:{
          type:ObjectId,
          required:true,
          ref:'tests'
        },    
        marked:{
          type:[singleResultSchema],
          required:true
        },
        student_id:{
          type:ObjectId,
          ref:'students'
        },
        total:Number,
        max_marks:Number
        // state:{
        //   type:String,
        //   enum:["started","finished"],
        // }
        
    },
    { strict: false,minimize:false,timestamps:true }
);


ResultSch.index({ test_id: 1, student_id: 1 }, { unique: true });

module.exports = Results = mongoose.model("results", ResultSch);