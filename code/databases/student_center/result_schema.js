const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;



const singleResultSchema = new mongoose.Schema({
            question:{
              question:ObjectId,
              subject:ObjectId,
              scheme:ObjectId,
              instructions:ObjectId,
            },
            max_marks:{type:Number,default:100,required:true},
            is_optional:{type:Boolean,default:false,required:true},// if the question is optional
            contribution:{type:Boolean,default:true,required:true}, //in case of optional question it is used to keep a record of whether the question marks have been included or not?
            attempted:{type:Boolean,default:false,required:true},
            answer_value:mongoose.Schema.Types.Mixed,
            marks_obtained:Number,
            subject:String,
            correctly_marked:{type:Boolean,default:false},
            visited:{type:Boolean,default:false,required:true},
            time_allotted:{type:Number,default:0,required:true}//time alotted in SECONDS!
          },{_id:false});

module.exports = singleResultSchema;
    