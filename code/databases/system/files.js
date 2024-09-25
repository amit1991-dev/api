const mongoose = require("mongoose");
const FilesSch = new mongoose.Schema(
    {
        name: {
            type: String
        },
        url: {
            type: String,
            required: true,
        },
        // information:{// {'academic':{subject(ObjectId),chapter(ObjectID),class_number,},stats:{size:,content_type:,}}
        //     type:{},
        // },
        size:{type:Number,required:true,default:0},
        content_type:{type:String,required:true,default:"application/text"},
        // file_type:{
        //     type: String,
        //     enum:['academic','official','student_personal','faculty_personal'],
        //     required: true,
        // },
        owner: {
            type: mongoose.Schema.ObjectId,  
            ref:"users",          
        },
    },
    { strict: false,timestamps:true }
);

// module.exports = FilesSch;
// FilesSch.index({directory:1,name:1},{unique:true});
module.exports = Files = mongoose.model("files", FilesSch);
