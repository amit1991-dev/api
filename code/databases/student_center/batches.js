const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId=mongoose.Schema.ObjectId;
// const {Subjects,Chapters} = require("../../databases/student_center/academics");
// const { normalizeNotes } = require("razorpay/dist/utils/razorpay-utils");
TAG = "batches.js";
const BatchSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true,
            default:"-"
        },
        stream:{
          type:ObjectId,
          ref:"streams"
        },
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
        batch_subjects:{
            type:[ObjectId],
            ref:"batch_subjects",
            default:[],
            required:true,
        },

        lectures:{
            type:[ObjectId],
            ref:"lectures",
            default:[],
            required:true,
        },
        files:{
            type:[ObjectId],
            ref:"academic_files",
            default:[],
            required:true,
        },
        tests:{
            type:[ObjectId],
            ref:"tests",
            default:[],
            required:true,
        },
        students:{
            type:[ObjectId],
            ref:"students",
            default:[],
            required:true,
        },
        faculties:{
            type:[ObjectId],
            ref:"faculties",
            default:[],
            required:true,
        },

        modules:{
            type:[ObjectId],
            ref:"modules",
            default:[],
            required:true,
          },
          enabled_online:{type:Boolean,default:false,required:true},
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId},
    },
    { strict: false,minimize:false,timestamp:true }
);

const LectureSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true,
            default:"",
        },
        faculties: {
            type: String,
            required:true,
            default:"",
        },
        
        media:{
            // ID of the youtube video
            type:String,
        },

        channel:{
            // ID of the youtube video
            type:String,
        },

        live_lecture:{
            // ID of the youtube video
            type:Boolean,
        },

        subject:{
          type:ObjectId,
          ref:"subjects",
          required:true,
        },
        chapter:{
            type:ObjectId,
            ref:"chapters",
            
        },
        files:{
            type:[ObjectId],
            ref:"academic_files",
            default:[],
            required:true,
        },

        // batches:{
        //      type:[ObjectId],
        //      ref:"batches",
        //      default:[],
        //      required:true,
        // },

        timestamp:{
            type:Date,
            required:true
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId()},

        class_terminated:{
            type:Boolean,
            default:false,
            required:true
        },
        stream_lecture_path:{
            type:String, 
            default:null,           
        },
        playback_lecture_path:{
            type:String, 
            default:null,           
        },
        rtmps_stream_lecture_path:{
            type:String, 
            default:null,           
        },
        rtmps_playback_lecture_path:{
            type:String, 
            default:null,           
        },
        live_status:{
            type:Boolean,
            default:false,
            required:true          
        },
        cloudflare_live_input_id:{
            type:String,
            default:null,
            
        },
    },
    { strict: false,minimize:false,timestamp:true }
);


const BatchChapterSchema = new Schema({
    chapterId: { type: ObjectId, ref: "chapters" },

    lectures:{
        type:[ObjectId],
        ref:"lectures", 
    },
    // notes:{
    //     type:[ObjectId],
    //     ref:"notes", 
    // },
    files:{
        type:[ObjectId],
        ref:"academic_files", 
    },
    module_files:{
        type:[ObjectId],
        ref:"academic_files", 
    },
    dpp_tests:{
        type:[ObjectId],
        ref:"dpp_tests",
        default:[],
    },

});

// const BatchChapterSchema = new Schema({
//     chapterId: { type: ObjectId, ref: "chapters" },
//     lectures: [{ type: ObjectId, ref: "lectures" }],
//     notes: [{ type: ObjectId, ref: "notes" }],
//     files: [{ type: ObjectId, ref: "files" }],
//     modules: [{ type: ObjectId, ref: "pdf_modules" }],
//   });

const BatchSubjectSchema = new Schema({
    subjectId: { type: ObjectId, ref: "subjects" },
    chapters:{
        type:[ObjectId],
        ref:"batch_chapters", 
    },
    chapter_wise_tests:{
        type:[ObjectId],
        ref:"tests",
        default:[],
    },
});

// const BatchSubjectSchema = new Schema({
//     subjectId: { type: ObjectId, ref: "subjects" },
//     chapters: [{ type: ObjectId, ref: "batch_chapters" }],
//   });

// const StudentBatchMappingSch = new mongoose.Schema(
//     {
//         batch:{
//             type:ObjectId,
//             ref:"batches"
//         },
//         students:{
//           type:[ObjectId],
//           ref:"students",
//           default:[],
//           required:true,
//         },
//         data:{type:Mixed},// to be used for storing status for the student in a batch!!
//         permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId()},
//     },
//     { strict: false,minimize:false,timestamp:true }
// );

let Batches = mongoose.model("batches", BatchSch);
let Lectures = mongoose.model("lectures", LectureSch);
let BatchSubject = mongoose.model("batch_subjects", BatchSubjectSchema);
let BatchChapter = mongoose.model("batch_chapters", BatchChapterSchema);



/////////// Batch Delete with associated BatchSubject and BatchChapter collection //////////////

// BatchSch.pre('remove', async function(next) {
//     // Remove all the batch_subjects and batch_chapters associated with this batch
//     await BatchSubject.deleteMany({ _id: { $in: this.batch_subjects } });
//     let subjects = await BatchSubject.find({ _id: { $in: this.batch_subjects } });
//     for(let subject of subjects) {
//         await BatchChapter.deleteMany({ _id: { $in: subject.chapters } });
//     }
//     next();
// });



Batches.addStudent=async function(batchId,studentId){
    console.log("adding student ID: "+studentId+" to batchID: "+batchId);
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{students:studentId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeStudent=async function(batchId,studentId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{students:studentId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allStudents=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{students:1}).populate("students");
        console.log(data);
        return data.students;
    }
    catch(err){
        console.log(err);
        return false;
    }
}
 
/////////// Tests //////////////

Batches.addTest=async function(batchId,testId){
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{tests:testId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeTest=async function(batchId,testId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{tests:testId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allTests=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{tests:1}).populate("tests");
        console.log(data);
        return data.students;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

/////////// Lectures //////////////

Batches.addLecture=async function(batchId,lectureId){
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{lectures:lectureId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeLecture=async function(batchId,lectureId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{lectures:lectureId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allLectures=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{lectures:1}).populate("lectures");
        console.log(data);
        return data.lectures;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

/////////// Files //////////////////

Batches.addFile=async function(batchId,fileId){
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{files:fileId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeFile=async function(batchId,fileId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{files:fileId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allFiles=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{files:1}).populate("files");
        console.log(data);
        return data.files;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

//////////////// Lectures ////////////////////



Batches.addModule=async function(batchId,moduleId){
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{modules:moduleId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeModule=async function(batchId,moduleId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{modules:fileId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allModules=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{modules:1}).populate("modules");
        console.log(data);
        return data.modules;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

//////////Batch faculties ////////////////

Batches.addFaculty=async function(batchId,facultyId){
    try{
        await Batches.updateOne({_id:batchId},{$addToSet:{faculties:facultyId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.removeFaculty=async function(batchId,facultyId){
    try{
        await Batches.updateOne({_id:batchId},{$pull:{faculties:facultyId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Batches.allFaculty=async function(batchId){
    try{
        let data = await Batches.findOne({_id:batchId},{faculties:1}).populate("faculties");
        console.log(data);
        return data.faculties;
    }
    catch(err){
        console.log(err);
        return false;
    }
}


////////////////////////////////////////

Lectures.addFile=async function(batchId,fileId){
    try{
        await Lectures.updateOne({_id:batchId},{$addToSet:{files:fileId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Lectures.removeFile=async function(batchId,fileId){
    try{
        await Lectures.updateOne({_id:batchId},{$pull:{files:fileId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Lectures.allFiles=async function(batchId){
    try{
        let data = await Lectures.findOne({_id:batchId},{files:1}).populate("files");
        console.log(data);
        return data.files;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Lectures.createLiveInput=async function(lectureId,lecture_live_link){
    let cfAccountId=process.env.CLOUDFLARE_ID;
    let cFAuthToken=process.env.CLOUDFLARE_AUTH_TOKEN;
    if(!cfAccountId){
        console.log("null cfaccount id");
        return false;
    }
    let cfAuth_key = process.env.CLOUDFLARE_API_KEY;
    try{
        let lecture = await Lectures.findById(lectureId);
        if(lecture && !lecture.cloudflare_live_input_id){
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization':'Bearer '+cFAuthToken},
                body: '{"defaultCreator":"string","deleteRecordingAfterDays":45,"meta":{"name":"'+lecture.name+"_"+lecture.createdAt+'"},"recording":{"mode":"automatic","requireSignedURLs":false,"timeoutSeconds":0}}'
              };

              console.log(options);

              let path = "https://api.cloudflare.com/client/v4/accounts/"+cfAccountId+"/stream/live_inputs";
              console.log(path);
            let cfLiveInputResponse = await fetch(path,options);
            console.log(cfLiveInputResponse);
            if(cfLiveInputResponse.status==200){
                let response = await cfLiveInputResponse.json();
                console.log(response);
                if(response.errors.length!=0){
                    console.log(response.errors);
                    throw {message:response.errors};
                }
                else{
                    let data = response.result;
                    if(lecture_live_link){
                        
                        const options = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'Authorization':'Bearer '+cFAuthToken},
                            body: '{"enabled":true,"streamKey":"'+data.rtmps.streamKey+'","url":"'+lecture_live_link+'"}'
                            };
                            
                        let respo=await fetch('https://api.cloudflare.com/client/v4/accounts/'+cfAccountId+'/stream/live_inputs/'+cfInputId+'/outputs', options);
                        if(respo.status==200){
                        console.log("successfully added the link as output");
                        }
                        else{
                        console.log("Error occurred in creating and adding the video field");
                        console.log(respo.status);
                        console.log(respo.body);
                        } 
                    }
                    console.log(response);
                    let rtpmsURL = data.rtmps.url+data.rtmps.streamKey;
                    let rtpmsPlaybackURL = data.rtmpsPlayback.url+data.rtmpsPlayback.streamKey;
                    let webrtcStream = data.webRTC;
                    let webrtcPlayback = data.webRTCPlayback;
                    cfInputId = data.uid;
                    lecture.stream_lecture_path = webrtcStream.url;
                    lecture.playback_lecture_path = webrtcPlayback.url;
                    lecture.rtmps_stream_lecture_path = rtpmsURL;
                    lecture.rtmps_playback_lecture_path = rtpmsPlaybackURL;
                    lecture.cloudflare_live_input_id = cfInputId;
                    await lecture.save();
                    return cfInputId;
                }
            }
        }
        else if(lecture){
            return lecture.cloudflare_live_input_id;
        }
        else{
            // console.log();
            throw {message:"Lecture not found"};
            // return false;
        }
    }
    catch(err){
        console.log(TAG+""+err.message);
        return false;
    }
    return false;
}

Lectures.enableLiveStreaming=async function(lectureId){
    return await toggleLiveStreaming(lectureId,true);
}

Lectures.disableLiveStreaming=async function(lectureId){
    return await toggleLiveStreaming(lectureId,false);
}


let toggleLiveStreaming=async function(lectureId,value){
    try{
        let lecture = await Lectures.findById(lectureId);
        if(!lecture.cloudflare_live_input_id){
            throw {message:"No Live input found"};
            // return false;
        }
        lecture.live_status=value;
        await lecture.save();
        // await Lectures.updateOne({_id:lectureId},{$set:{live_status:value}});
        return true;
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}


Lectures.terminateClass=async function(lectureId){
    return await toggleClassTermination(lectureId,true);
}

Lectures.unterminateClass=async function(lectureId){
    return await toggleClassTermination(lectureId,false);
}


Lectures.matchStatus=async function(lectureId,currentStatus){
    try{
        let lecture = await Lectures.findById(lectureId);
        if(lecture.live_status == currentStatus){
            return 0;
        }
        else{
            return 1;
        }
    }
    catch(err){
        console.log(err.message);
        return 2;
    }
}

let toggleClassTermination=async function(lectureId,value){
    try{
        await Lectures.updateOne({_id:lectureId},{$set:{class_terminated:value}});
        return true;
    }
    catch(err){
        return false;
    }
}

// Lectures.batchLectureSubjects=async function(batchId){
//     try{
//         let lectureWithSubjectId = await Lectures.findOne({_id:batchId},{subject:1}).lean();
//         let subjectIds = lectureWithSubjectId.map(l => l.subject);
//         subjectIds = [...new Set(subjectIds)];
//         console.log(subjectIds);
//         let subjects = [];
//         for(var i in subjectIds){
//             subjects.push(await Subjects.findById(i));
//         }
//         console.log(data);
//         return subjects;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Lectures.batchLectureSubjects=async function(batchId){
//     try{
//         let lectureWithSubjectId = await Lectures.find({_id:batchId},{subject:1}).lean();
//         let subjectIds = lectureWithSubjectId.map(l => l.subject);
//         subjectIds = [...new Set(subjectIds)];
//         console.log(subjectIds);
//         let subjects = [];

//         for(var i in subjectIds){
//             subjects.push(await Subjects.findById(i));
//         }

//         console.log(data);
//         return subjects;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Lectures.lectureSubjectChapters=async function(batchId,subjectId){
//     try{
//         let lectureWithChapterId = await Lectures.find({_id:batchId,subject:subjectId},{chapter:1}).lean();
//         let chapterIds = lectureWithChapterId.map(l => l.chapter);
//         chapterIds = [...new Set(chapterIds)];
//         console.log(chapterIds);
//         let chapters = [];

//         for(var i in chapterIds){
//             chapters.push(await Chapters.findById(i));
//         }
        
//         console.log(data);
//         return chapters;
//     }
//     catch(err){
//         console.log(err);
//         return false;
//     }
// }

// Lectures.getSpecificLectures=async function(batchId,subjectId,chapterId){
//     try{
//         let lectures = await Lectures.find({_id:batchId,subject:subjectId,chapter:chapterId}).lean();
//         console.log(lectures);
//         return lectures;
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
//             return batches;
//         }
//         catch(err){
//             console.log(err.message);
//             return false;
//         }
    
// }

Lectures.batchLectureSubjects=async function(batchId){
    try{
        let batch = await Batches.findById(batchId).populate([{path:"lectures"}]);
        let subjectIds = batch.lectures.map(m=>m.subject.toString());
        subjectIds = [...new Set(subjectIds)];
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
  
  Lectures.lectureSubjectChapters=async function(batchId,subjectId){
    try{
        let batch = await Batches.findById(batchId).populate([{path:"lectures"}]);
        let batchLectures = batch.lectures;
        let relevantLectures = [];
  
        for(var i in batchLectures){
            if(batchLectures[i].subject == subjectId){
              relevantLectures.push(batchLectures[i]);
            }
        }
        let relevantChapters= relevantLectures.map(function(f){
            if(f.chapter)
                return f.chapter.toString();
            else{
                return null;
            }
        });
        relevantChapters = [...new Set(relevantChapters.filter(chapter=>chapter!=null))];
        let chapters = [];
  
        for(var i in relevantChapters){
            let c = await Chapters.findById(relevantChapters[i]);
            if(c!=null){
                chapters.push(c);
            }
        }
        console.log(chapters);
        return chapters;
    }
    catch(err){
        console.log(err);
        return false;
    }
  }
  
  Lectures.getSpecificLectures=async function(batchId,subjectId,chapterId){
    try{
      let batch = await Batches.findById(batchId).populate([{path:"lectures",populate:[{path:'files',populate:['file','subject','chapter']},'subject','chapter']}]);
      let batchLectures = batch.lectures;
      let relevantLectures = [];
  
      for(var i in batchLectures){
          if(batchLectures[i].subject && batchLectures[i].chapter && batchLectures[i].subject._id == subjectId && batchLectures[i].chapter._id== chapterId){
            relevantLectures.push(batchLectures[i]);
          }
      }
      console.log(relevantLectures);
      return relevantLectures;
    }
    catch(err){
        console.log(err);
        return false;
    }
  }
  
module.exports = {Batches,Lectures, BatchSubject, BatchChapter};
