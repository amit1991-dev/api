const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const TopicSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        sequence:{
          type:Number,
        },
        content: {
          type: String,
          required:true
        },
        chapter:{
          type:ObjectId,
          ref:"chapters"
        }
       
    },
    { strict: false,minimize:false,timestamp:true }
);



const ChapterSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        subject:{     //please provide more values to be filled here
          type:String,
          enum:['physics','chemistry','mathematics','biology'],
          required:true
        },
        sequence:{
          type:Number,
          required:true
        },
        content: {
          type: String,
          required:true
        },
        
       
    },
    { strict: false,minimize:false,timestamp:true }
);


const SubTopicSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        sequence:{
          type:Number,
          required:true,
        },
        content: {
          type: String,
          required:true
        },
        topic:{
          type:ObjectId,
          ref:"topics",
          required:true
        }
       
    },
    { strict: false,minimize:false,timestamp:true }
);


const CategoriesSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
       
    },
    { strict: false,minimize:false,timestamp:true }
);

Topics = mongoose.model("topics", TopicSch);
SubTopics = mongoose.model("subtopics", SubTopicSch);
Chapters = mongoose.model("chapters", ChapterSch);
Categories = mongoose.model("categories", CategoriesSch);

module.exports = {Topics,SubTopics,Chapters,Categories};
