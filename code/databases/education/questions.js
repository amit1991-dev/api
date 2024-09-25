const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const QuestionSch = new mongoose.Schema(
    {
    	id:Number,
        owner:{
          type:ObjectId,
          required:true,
          ref:"users"
        },
        body: {
            type: String,
        },
        image: {
            type: String,
        },
        question:{
          type:String,
          required:true
        },
        passage:{
          type:String,
        },
        instructions: { //url to instructions file/api
          type: String,
        },
        question_type:{     //please provide more values to be filled here
          type:String,
          enum:['scq','mcq','match','integer','fill_in_blanks','comprehension','true_false'],
          required:true
        },
        positive_marks:{
          type:Number,
          required:true,
          default:3
        },
        negative_marks: {
          type: Number,
          default:0,
          required:true,
        },
        is_advanced:{
          type:Boolean,
          default:false,
          required:true
        },
        options:{
          type:[{
            option_type:String,//can be a url for an image or text for latex/text // No its going to be just text for base64 encoded markdown representation
            option_value:String
          }]
        },
        correct_answer:{//can be anything really, it can be a JSON array or even a JSON object!
          type:String,
          required:true
        },
        subject:{
          type:String,
          required:true
        },
        difficulty:{
          type:String,
          enum:['very-easy','easy','medium','hard','very-hard'],
          required:true,
          default:'medium'
         
        },
        topic:{
          type:ObjectId,
          ref:"topics"
        },
        chapter:{
          type:ObjectId,
          ref:"chapters"
        },
        subtopic:{
          type:ObjectId,
          ref:"subtopics"
        },
        solution:{
          type:String,
        },
        solution_image:{
          type:String,
        },
        editors:{
        	type:[ObjectId],
        	ref:"users"
        },
        instructions: { //markdown content for the instructions
          type: String,
        },
        class_number:{
          type:Number,
          default:13,
          required:true,
          min:7
        },
        boards:{
          type:String,
          enum:["cbse","ics","up","other"],
          default:"cbse"
        },
        stream:{
          type:String,
          enum:["engineering","medical","school"],//just add names in this, switch from the client side
          default:"school"
        },

        for_advanced:{
          type:Boolean,
          default:false
        },
        
        

    },
    { strict: false,minimize:false,timestamp:true }
);

module.exports = Questions = mongoose.model("questions", QuestionSch);