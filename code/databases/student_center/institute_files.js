const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const {Subjects,Chapters} = require("../../databases/student_center/academics");
const {Batches} = require("../../databases/student_center/batches");

const AcademicFilesSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        file:{type:ObjectId,ref:"files",required:true},
        subject:{
          type:ObjectId,
          ref:"subjects"
        },
        chapter:{type:ObjectId,ref:"chapters"},
        class_number: {
          type: Number,
          min:5,
          max:13,
          required:true
        },
        // enabled_online:{type:Boolean,default:false,required:true},
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId},
    },
    { strict: false,minimize:false,timestamp:true }
);

const OfficialFilesSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        file:{type:ObjectId,ref:"files",required:true},
        branch:{
          type:ObjectId,
          ref:"branches"
        },
        class_number: {
          type: Number,
          min:5,
          max:13,
          required:true
        },
        // enabled_online:{type:Boolean,default:false,required:true},
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId},
    },
    { strict: false,minimize:false,timestamp:true }
);

let AcademicFiles = mongoose.model("academic_files", AcademicFilesSch);
let OfficialFiles = mongoose.model("official_files", OfficialFilesSch);



AcademicFiles.batchFilesSubjects=async function(batchId){
  try{
      let batch = await Batches.findById(batchId).populate([{path:"files"}]);
      let subjectIds = batch.files.map(function(m){
        if(m.subject){
          return m.subject.toString();
        }
        else{
          return null;
        }
      });
      subjectIds = [...new Set(subjectIds.filter(s=>s!=null))];
      console.log(subjectIds);
      let subjects = [];

      for(var i in subjectIds){
        let s = await Subjects.findById(subjectIds[i]);
        if(s!=null){
          subjects.push(s);
        }
          
      }

      console.log(subjects);
      return subjects;
  }
  catch(err){
      console.log(err);
      return false;
  }
}

AcademicFiles.filesSubjectChapters=async function(batchId,subjectId){
  try{
      let batch = await Batches.findById(batchId).populate([{path:"files"}]);
      let batchFiles = batch.files;
      let relevantFiles = [];

      for(var i in batchFiles){
        console.log(batchFiles[i]);
          if(batchFiles[i].subject == subjectId){
            console.log("pushing"+batchFiles[i].chapter);
            relevantFiles.push(batchFiles[i]);
          }
      }
      let relevantChapters= relevantFiles.map(function(m){
        if(m.chapter){
          return m.chapter.toString();
        }
        else{
          return null;
        }
      });
      console.log(relevantChapters);
      relevantChapters = [...new Set(relevantChapters.filter(c=>c!=null))];
      let chapters = [];

      for(var i in relevantChapters){
          chapters.push(await Chapters.findById(relevantChapters[i]));
      }
      console.log(chapters);
      return chapters;
  }
  catch(err){
      console.log(err);
      return false;
  }
}

AcademicFiles.getFiles=async function(batchId,subjectId,chapterId){
  try{
    let batch = await Batches.findById(batchId).populate([{path:"files",populate:['file']}]);
    let batchFiles = batch.files;
    let relevantFiles = [];

    for(var i in batchFiles){
        if(batchFiles[i].subject == subjectId && batchFiles[i].chapter== chapterId){
          relevantFiles.push(batchFiles[i]);
        }
    }
    
    console.log(relevantFiles);
    return relevantFiles;
      console.log(files);
      return files;
  }
  catch(err){
      console.log(err);
      return false;
  }
}

// Batches.addStudent=async function(batchId,studentId){
//     try{
//         await Batches.updateOne({_id:batchId},{$addToSet:{students:studentId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.removeStudent=async function(batchId,studentId){
//     try{
//         await Batches.updateOne({_id:batchId},{$pull:{students:studentId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.allStudents=async function(batchId){
//     try{
//         let data = await Batches.findOne({_id:batchId},{students:1}).populate("students");
//         console.log(data);
//         return data.students;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }
 
// /////////// Tests //////////////

// Batches.addTest=async function(batchId,testId){
//     try{
//         await Batches.updateOne({_id:batchId},{$addToSet:{tests:testId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.removeTest=async function(batchId,testId){
//     try{
//         await Batches.updateOne({_id:batchId},{$pull:{tests:testId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.allTests=async function(batchId){
//     try{
//         let data = await Batches.findOne({_id:batchId},{tests:1}).populate("tests");
//         console.log(data);
//         return data.students;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// /////////// Lectures //////////////

// Batches.addLecture=async function(batchId,lectureId){
//     try{
//         await Batches.updateOne({_id:batchId},{$addToSet:{lectures:lectureId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.removeLecture=async function(batchId,lectureId){
//     try{
//         await Batches.updateOne({_id:batchId},{$pull:{lectures:lectureId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.allLectures=async function(batchId){
//     try{
//         let data = await Batches.findOne({_id:batchId},{lectures:1}).populate("lectures");
//         console.log(data);
//         return data.lectures;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// /////////// Files //////////////////

// Batches.addFile=async function(batchId,fileId){
//     try{
//         await Batches.updateOne({_id:batchId},{$addToSet:{files:fileId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.removeFile=async function(batchId,fileId){
//     try{
//         await Batches.updateOne({_id:batchId},{$pull:{files:fileId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Batches.allFiles=async function(batchId){
//     try{
//         let data = await Batches.findOne({_id:batchId},{files:1}).populate("files");
//         console.log(data);
//         return data.files;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// //////////////// Lectures ////////////////////

// Lectures.addFile=async function(batchId,fileId){
//     try{
//         await Lectures.updateOne({_id:batchId},{$addToSet:{files:fileId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Lectures.removeFile=async function(batchId,fileId){
//     try{
//         await Lectures.updateOne({_id:batchId},{$pull:{files:fileId}});
//         return true;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Lectures.allFiles=async function(batchId){
//     try{
//         let data = await Lectures.findOne({_id:batchId},{files:1}).populate("files");
//         console.log(data);
//         return data.files;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// // let StudentBatchMappings = mongoose.model("student_batch_mappings", StudentBatchMappingSch);

// Batches.getStudentBatches = async function(student_id){
//         try{
//             if(!student_id){
//                 throw {message:"student Id not present"};
//             }
//             let batches = await Batches.findOne({students:student_id}).lean();
//             // let installments = await Installments.find({fees:fees._id});
//             // fees.installments = installments;
//             return batches;
//         }
//         catch(err){
//             console.log(err.message);
//             return false;
//         }
    
// }
module.exports = {AcademicFiles,OfficialFiles};
