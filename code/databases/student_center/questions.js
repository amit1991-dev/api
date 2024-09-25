const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const Mixed = mongoose.Schema.Types.Mixed;

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
          type:String, // base64 encoded Markdown string
          required:true
        },
        comprehension:{
          type:ObjectId,
          ref:"comprehensions",
        },
        exam:{
          type:ObjectId,
          ref:"exams"
        },
        exam_shift:{
          type:String,
          enum:['morning','evening'],
          // default:'morning',
        },
        instructions: {
          type: String,
        },
        question_type:{     //please provide more values to be filled here
          type:String,
          enum:['scq','mcq','msq','matrix','integer','comprehension','true_false','fill_in_blanks'],
          required:true
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
        correct_answer:{
          //can be anything really, it can be a JSON array or even a JSON object!
          type:Mixed,//in case of RANGES, this is a string wth '::' as a separator
          required:true
        },
        subjects:{
          type:[ObjectId],
          ref:"subjects"
        },

        subject:{
          type:ObjectId,
          ref:"subjects"
        },
        // classes:{type:[Number]},
        difficulty:{
          type:String,
          enum:['very-easy','easy','medium','hard','very-hard'],
          required:true,
          default:'medium',
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
          type:String, // base64 encoded Markdown text
        },
        solution_image:{
          type:String,
        },
        editors:{
        	type:[ObjectId],
        	ref:"users"
        },
        instructions: { // markdown content for the instructions
          type: String,
        },
        boards:{
          type:String,
          enum:["cbse","ics","up","other"],
          default:"cbse"
        },
        streams:[{
          type:ObjectId,
          ref:"streams"
        }],
        for_advanced:{
          type:Boolean,
          default:false
        },

        question_subtype:{
          //for integer range based
          type:String,
          required:false,
          default:"none"
        },

        // range1:{
        //   //for integer range based
        //   type:String,
        //   required:false,
        //   default:"none"
        // },

        // range2:{
        //   //for integer range based
        //   type:String,
        //   required:false,
        //   default:"none"
        // },

        media:{type:String},//url of the file
        document:{
          type:ObjectId,
          ref:"academic_files"
        },// url of the file!
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { 
      collection:"questions",
      strict: false,
      minimize:false,
      timestamps: {
        createdAt: 'created', // Use `created_at` to store the created date
        updatedAt: 'updated' // and `updated_at` to store the last updated date
      }
     }
);

module.exports = mongoose.model("questions", QuestionSch);