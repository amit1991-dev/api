const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const ExamSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        // sequence:{//Part 1 or part 2
        //   type:Number,
        // },
        // paper_number:{// for exams that happen 2wice in an year
        //     type:String,
        // },
        // session: {
        //   type: String,
        //   required:true
        // },
        // session:{//2016-2017
        //     type:String,
        //     required:true,
        //     // default:Date.now().year,
        // },
        exam_date:{
            type:Date,
            required:true
        }
    },
    { strict: false,minimize:false,timestamp:true }
);

let Exams = mongoose.model("exams", ExamSch);
module.exports = Exams;