const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const TestSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        test_type:{     //please provide more values to be filled here
          type:String,
          enum:['neet','jee-mains','jee-advanced','olympiad','boards','mat','ntse','other'],
          required:true
        },
        class_number:{ // minutes
          type:Number,
        },
        duration:{ // minutes
          type:Number,
          required:true
        },
        instructions: { //url to instructions file/api
          type: String,
        },
        questions:{
          type:[ObjectId],
          ref:"questions",
          required:true
        },
        category:{//customized category of the test
          type:String,
          required:true,
        },
        stream:{//stream category of the test
          type:String,
          enum:['engineering','medical','school'],
          required:true,
        },
        subjects:{
          type:[String],
          required:true
        },
        enabled:{
          type:Boolean,
          default:true,
          required:true
        },
        max_marks:{
          type:Number,
          required:true
        },
        owner:{
          type:ObjectId,
          required:true,
          ref:"users"
        },
        boards:{
          type:String,
          enum:["cbse","ics","up","other"],
        },
        test_pdf:{type:String,required:true,default:"-"},//url to get the pdf file, use this to convert from MARKDOWN to PDF if need to ==> https://www.npmjs.com/package/markdown-pdf
        start_time:{
          type:Date,

        },
        end_time:{
          type:Date
        },



    },
    { strict: false,minimize:false,timestamp:true }
);

module.exports = Tests = mongoose.model("tests", TestSch);
