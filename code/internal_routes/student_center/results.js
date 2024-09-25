const express = require("express");
const router = express.Router();
const { Batches, Lectures } = require("../../databases/student_center/batches");
const {
  Modules,
  Subjects,
} = require("../../databases/student_center/academics");
const Tests = require("../../databases/student_center/tests");
const Students = require("../../databases/student_center/students");
const Results = require("../../databases/student_center/results");
const Doubts = require("../../databases/student_center/doubts");
const Files = require("../../databases/system/files");
const {
  AcademicFiles,
  OfficialFiles,
} = require("../../databases/student_center/institute_files");
const {
  getLectureSubjects,
  getMouleSubjects,
  getFilesSubjects,
} = require("./_functions");
const Faculties = require("../../databases/student_center/faculties");
const TestStatus = require("../../databases/student_center/student_test_status");
// const Questions = require("../../databases/student_center/questions");

function checkForPermission() {
  return true;
}
//Batches api

// var resultPopulateObject = [
//     // {path:"marked.question",populate:[{path:"comprehension"},],model:"questions"},
//     // {path:"marked.question.subject",model:"subjects"},
//     // {path:"marked.question.scheme",model:"marking_schemes"},
//     // {path:"structure.sections.questions.instructions",model:"instructions"},
// ];

router.get("/", (req, res, next) => {
  let query = req.query;
  let role = req.user.role;
  console.log(role);
  let permission = "academic_desk_read";

  let ret = {
    message:
      "Sorry you are not allowed to perform this task, permission denied.",
    status: "failed",
  };
  if (!checkForPermission(req.user, permission)) {
    res.status(200).json(ret);
  }

  Results.find(query).exec(function (err, results) {
    if (err) {
      console.log("some error occured:" + err);
      ret.message = "some error occured";
    } else {
      // console.log(results);
      ret.data = results;
      ret.message = "done";
      ret.status = "success";
    }
    res.status(200).json(ret);
  });
});

// router.get("/subjects/:batch_id",async (req, res, next) => {
//     let query = req.query;
//     let permission = "academic_desk_read";
//     let batchId = req.params.batch_id;
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

//     try{
//         let batch = await Batches.findById(batchId);
//         let subjects = await Subjects.find({streams:batch.stream});
//         ret.data=subjects;
//         ret.message = "done";
//         ret.status ="success";
//     }
//     catch(err){
//         ret.message= "some error occured";
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_create", (req, res, next) => {
//     let ownerId=req.user._id;
//     let batch=req.body;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     console.log(batch);
//     let f=new Batches(batch);
//     f.save((err)=>{
//         if (err) {
//             ret.message= "some error occured";
//             console.log(err);
//         }
//         else {
//             console.log("no error occured");
//             ret.message="done";
//             ret.status="success";
//         }
//         res.status(200).json(ret);
//     });
// });

// router.post("/batch_edit/:batch_id", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let batch=req.body;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let batch_id = req.params.batch_id;
//     try{
//         await Batches.updateOne({_id:batch_id},{$set:batch});
//         ret.status="success";
//         ret.message = "done";
//     }
//     catch(err){
//         console.log("some error occured:"+err);
//         ret.message="some error occured";
//     }
//     res.status(200).json(ret);
// });

router.post("/result_delete/:result_id", async (req, res, next) => {
  let permission = "academic_desk_create";
  let ret = {
    message:
      "Sorry you are not allowed to perform this task, permission denied.",
    status: "failed",
  };
  if (!checkForPermission(req.user, permission)) {
    res.status(200).json(ret);
  }
  let resultId = req.params.result_id;
  try {
    let result = await Results.findById(resultId);
    if (result) {
      if (result.test_state) {
        console.log("removing test state: " + result.test_state);
        await TestStatus.deleteOne({ _id: result.test_state });
      } else {
        console.log("no test state: " + result.test_state);
      }
      await Results.deleteOne(result._id);
    }
    ret.status = "success";
    // ret.batch=batch;
    ret.message = "done";
  } catch (err) {
    console.log(err.message);
    ret.message = "some error occured";
  }
  res.status(200).json(ret);
});

router.get("/results/:test_Id", (req, res, next) => {
  let ownerId = req.user._id;
  let testId = req.params.test_Id;
  let permission = "academic_desk_create";

  let ret = {
    message:
      "Sorry you are not allowed to perform this task, permission denied.",
    status: "failed",
  };
  if (!checkForPermission(req.user, permission)) {
    res.status(200).json(ret);
    return;
  }
  Results.find({ test: testId })
    .populate(["student"])
    .populate(["batch"])
    .populate(["branch"])
    .exec(function (err, result) {
      if (err) {
        console.log("some error occured:" + err);
        ret.message = "some error occured";
      } else {
        ret.data = result;
        ret.message = "done";
        ret.status = "success";
        // res.status(200).json(ret);
      }
      res.status(200).json(ret);
    });
});

// router.get("/results/:batch_Id", async (req, res, next) => {
//   try {
//     let ownerId = req.user._id;
//     let batchId = req.params.batch_Id;
//     console.log(batchId);
//     let permission = "academic_desk_create";

//     let ret = {
//       message:
//         "Sorry you are not allowed to perform this task, permission denied.",
//       status: "failed",
//     };
//     if (!checkForPermission(req.user, permission)) {
//       res.status(200).json(ret);
//       return;
//     }
//     const results = await Results.find({ batch: batchId })
//       .populate(["student"])
//       .lean();

//     ret.data = results;
//     ret.message = "done";
//     ret.status = "success";
//     console.log("batchid:" + batchId);
//     // res.status(200).json(ret);
//   } catch (err) {
//     console.log("some error occured:" + err);
//     ret.message = "some error occured";
//   }
//   res.status(200).json(ret);
// });

// router.get("/results/:batch_id/:test_id",async (req, res, next) => {
//   let permission = "academic_desk_read";
//   let batchId = req.params.batch_id;
//   let testId = req.params.test_id;
//   let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//   if(!checkForPermission(req.user,permission))
//   {
//       res.status(200).json(ret);
//   }
//   // ret.message="Server Problem";
//  try{ let results = await Results.find({batch:batchId,test:testId})
//   .populate(["student"])
//   .populate(["batch"])
//   .populate(["branch"])
//   .lean();
//   for (var a = 0; a < results.length; a++) {
//     let result = results[a];
//     let subjectWise = {};
//     for (var i = 0; i < result.marked.length; i++) {
//       if (result.marked[i].subject in subjectWise) {
//         if (result.marked[i].attempted)
//           subjectWise[result.marked[i].subject].attempted += 1;
//         if (result.marked[i].correctly_marked)
//           subjectWise[result.marked[i].subject].correctly_marked += 1;
//         if (result.marked[i].time_allotted > 0)
//           subjectWise[result.marked[i].subject].time_allotted +=
//             result.marked[i].time_allotted;
//       } else {
//         subjectWise[result.marked[i].subject] = {
//           attempted: result.marked[i].attempted ? 1 : 0,
//           correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//           time_allotted: result.marked[i].time_allotted,
//         };
//       }
//     }
//     results[a].subject_wise = subjectWise;
//     //console.log(results[a]);
//     // r.push(result);
//   }
//   ret.data = results;
//   // console.log(results);
//   ret.message = "done";
//   ret.status = "success";
// } catch (err) {
//   console.log("some error occured:" + err);
//   ret.message = "some error occured";
// }
// res.status(200).json(ret);
// });

// router.get("/results/:batch_id/:test_id", async (req, res, next) => {
//   let permission = "academic_desk_read";
//   let batchId = req.params.batch_id;
//   let testId = req.params.test_id;
//   let ret = {
//     message:
//       "Sorry you are not allowed to perform this task, permission denied.",
//     status: "failed",
//   };

//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filter = {
//       batch: batchId,
//       test: testId,
//     };
//     let query = req.query;
//     // Add additional filters based on query parameters
//     if (query._id) {
//       filter._id = query._id;
//       // delete filter._id;
//     } else {
//       if (query.result_type) {
//         filter.result_type = query.result_type;
//         // delete filter.result_type;
//       }

//       if (query.branch) {
//         filter.branch = query.branch;
//         // delete filter.branch;
//       }

//       if (query.batch) {
//         filter.batch = query.batch;
//         // delete filter.batch;
//       }

//       if (query.test) {
//         filter.test = query.test;
//         // delete filter.test;
//       }

//       // Add more filters as needed
//     }
//     let results = await Results.find(filter)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//     for (var a = 0; a < results.length; a++) {
//       let result = results[a];
//       let subjectWise = {};
//       for (var i = 0; i < result.marked.length; i++) {
//         if (result.marked[i].subject in subjectWise) {
//           if (result.marked[i].attempted)
//             subjectWise[result.marked[i].subject].attempted += 1;
//           if (result.marked[i].correctly_marked)
//             subjectWise[result.marked[i].subject].correctly_marked += 1;
//           if (result.marked[i].time_allotted > 0)
//             subjectWise[result.marked[i].subject].time_allotted +=
//               result.marked[i].time_allotted;
//         } else {
//           subjectWise[result.marked[i].subject] = {
//             attempted: result.marked[i].attempted ? 1 : 0,
//             correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//             time_allotted: result.marked[i].time_allotted,
//           };
//         }
//       }
//       results[a].subject_wise = subjectWise;
//       //console.log(results[a]);
//       // r.push(result);
//     }
//     ret.data = results;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("some error occurred:" + err);
//     ret.message = "some error occurred";
//   }

//   res.status(200).json(ret);
// });

// const moment = require("moment");
// this can also possible:
// router.get("/results/:batch_id/:test_id", async (req, res, next) => {
//   let permission = "academic_desk_read";
//   let batchId = req.params.batch_id;
//   let testId = req.params.test_id;
//   let ret = {
//     message:
//       "Sorry you are not allowed to perform this task, permission denied.",
//     status: "failed",
//   };

//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {
//       batch: batchId,
//       test: testId,
//     };
//     let filter = req.query;
//     if (filter) {
//       // if (filter.startDate && filter.endDate) {
//       //   // Parse the date range from query parameters
//       //   let startDate = moment(filter.startDate, "YYYY-MM-DD");
//       //   let endDate = moment(filter.endDate, "YYYY-MM-DD");

//       //   // Check if both startDate and endDate are valid moments
//       //   if (startDate.isValid() && endDate.isValid()) {
//       //     filterObj.declaration_time = {
//       //       $gte: startDate.toDate(),
//       //       $lte: endDate.toDate(),
//       //     };
//       //   }

//       //   // Remove startDate and endDate from filter
//       //   delete filter.startDate;
//       //   delete filter.endDate;
//       // }
//       // Start Date Filter
//       if (filter.startDate) {
//         let startDate = moment(filter.startDate, "YYYY-MM-DD");
//         if (startDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$gte = startDate.toDate();
//         }
//         delete filter.startDate;
//       }

//       // End Date Filter
//       if (filter.endDate) {
//         let endDate = moment(filter.endDate, "YYYY-MM-DD");
//         if (endDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$lte = endDate.toDate();
//         }
//         delete filter.endDate;
//       }
//       // Add additional filters based on query parameters
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type) {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }

//         if (filter.branch) {
//           filterObj.branch = filter.branch;
//           delete filter.branch;
//         }

//         if (filter.batch) {
//           filterObj.batch = filter.batch;
//           delete filter.batch;
//         }

//         if (filter.test) {
//           filterObj.test = filter.test;
//           delete filter.test;
//         }

//         // Add more filters as needed
//       }
//     }
//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//     for (var a = 0; a < results.length; a++) {
//       let result = results[a];
//       let subjectWise = {};
//       for (var i = 0; i < result.marked.length; i++) {
//         if (result.marked[i].subject in subjectWise) {
//           if (result.marked[i].attempted)
//             subjectWise[result.marked[i].subject].attempted += 1;
//           if (result.marked[i].correctly_marked)
//             subjectWise[result.marked[i].subject].correctly_marked += 1;
//           if (result.marked[i].time_allotted > 0)
//             subjectWise[result.marked[i].subject].time_allotted +=
//               result.marked[i].time_allotted;
//         } else {
//           subjectWise[result.marked[i].subject] = {
//             attempted: result.marked[i].attempted ? 1 : 0,
//             correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//             time_allotted: result.marked[i].time_allotted,
//           };
//         }
//       }
//       results[a].subject_wise = subjectWise;
//       //console.log(results[a]);
//       // r.push(result);
//     }
//     ret.data = results;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("some error occurred:" + err);
//     ret.message = "some error occurred";
//   }

//   res.status(200).json(ret);
// });

// router.get("/results/:batch_Id",async (req, res, next) => {
//     let ownerId=req.user._id;
//     let batchId = req.params.batch_Id;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//         try{
//             let results = await Results.find({batch:batchId}).populate(["student"]).lean();
//             for(var a=0;a<results.length;a++){
//                 let result = results[a];
//                 let subjectWise = {};
//                 for(var i=0;i<result.marked.length;i++){
//                     if(result.marked[i].subject in subjectWise){
//                         if(result.marked[i].attempted)subjectWise[result.marked[i].subject].attempted+=1;
//                         if(result.marked[i].correctly_marked)subjectWise[result.marked[i].subject].correctly_marked+=1;
//                         if(result.marked[i].time_allotted>0)subjectWise[result.marked[i].subject].time_allotted+=result.marked[i].time_allotted;
//                         }

//                     else{
//                         subjectWise[result.marked[i].subject]={
//                             attempted:result.marked[i].attempted?1:0,
//                             correctly_marked:result.marked[i].correctly_marked?1:0,
//                             time_allotted:result.marked[i].time_allotted
//                         }
//                     }
//                 }
//                 results[a].subject_wise=subjectWise;
//                 console.log(results[a]);
//                 // r.push(result);
//             }
//             ret.data=results;
//             // console.log(results);
//             ret.message= "done";
//             ret.status ="success";

//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= "some error occured";
//         }
//         res.status(200).json(ret);
//     });

// router.get("/results/:test_Id",async (req, res, next) => {
//     let ownerId=req.user._id;
//     let testId = req.params.test_Id;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//         try{
//             let results = await Results.find({test:testId}).populate(["student"]).lean();
//             for(var a=0;a<results.length;a++){
//                 let result = results[a];
//                 let subjectWise = {};
//                 for(var i=0;i<result.marked.length;i++){
//                     if(result.marked[i].subject in subjectWise){
//                         if(result.marked[i].attempted)subjectWise[result.marked[i].subject].attempted+=1;
//                         if(result.marked[i].correctly_marked)subjectWise[result.marked[i].subject].correctly_marked+=1;
//                         if(result.marked[i].time_allotted>0)subjectWise[result.marked[i].subject].time_allotted+=result.marked[i].time_allotted;
//                         }

//                     else{
//                         subjectWise[result.marked[i].subject]={
//                             attempted:result.marked[i].attempted?1:0,
//                             correctly_marked:result.marked[i].correctly_marked?1:0,
//                             time_allotted:result.marked[i].time_allotted
//                         }
//                     }
//                 }
//                 results[a].subject_wise=subjectWise;
//                 console.log(results[a]);
//                 // r.push(result);
//             }
//             ret.data=results;
//             // console.log(results);
//             ret.message= "done";
//             ret.status ="success";

//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= "some error occured";
//         }
//         res.status(200).json(ret);
//     });

// router.get("/results_filter",async (req, res) => {
//     let ownerId=req.user._id;
//     let testId = req.params.test_Id;
//     let query = req.query;
//     // query.attempt_number=1;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }

//     try{
//         console.log("query");
//         console.log(query);
//         let results = await Results.find(query).populate(["student"]).populate(["batch"]).populate(["branch"]).lean();
//         for(var a=0;a<results.length;a++){
//             let result = results[a];
//             let subjectWise = {};
//             for(var i=0;i<result.marked.length;i++){
//                 if(result.marked[i].subject in subjectWise){
//                     if(result.marked[i].attempted)subjectWise[result.marked[i].subject].attempted+=1;
//                     if(result.marked[i].correctly_marked)subjectWise[result.marked[i].subject].correctly_marked+=1;
//                     if(result.marked[i].time_allotted>0)subjectWise[result.marked[i].subject].time_allotted+=result.marked[i].time_allotted;
//                     }

//                 else{
//                     subjectWise[result.marked[i].subject]={
//                         attempted:result.marked[i].attempted?1:0,
//                         correctly_marked:result.marked[i].correctly_marked?1:0,
//                         time_allotted:result.marked[i].time_allotted
//                     }
//                 }
//             }
//             results[a].subject_wise=subjectWise;
//             console.log(results[a]);
//             // r.push(result);
//         }
//         ret.data=results;
//         // console.log(results);
//         ret.message= "done";
//         ret.status ="success";

//     }
//     catch(err){
//         console.log("some error occured:"+err);
//         ret.message= "some error occured";
//     }
//     res.status(200).json(ret);
// });

router.get("/results_filter", async (req, res) => {
  let ownerId = req.user._id;
  let testId = req.params.test_Id;
  let filter = req.query;
  // query.attempt_number=1;
  let permission = "academic_desk_create";

  let ret = {
    message:
      "Sorry you are not allowed to perform this task, permission denied.",
    status: "failed",
  };
  if (!checkForPermission(req.user, permission)) {
    res.status(200).json(ret);
    return;
  }

  try {
    let filterObj = {};
    if (filter) {
      if (filter._id) {
        filterObj._id = filter._id;
        delete filter._id;
      } else {
        if (filter.result_type && filter.result_type != "-") {
          filterObj.result_type = filter.result_type;
          delete filter.result_type;
        }
        if (filter.batch && filter.batch != "-") {
          filterObj.batch = filter.batch;
          // console.log(filterObj.batch);
          delete filter.batch;
          // console.log(filterObj.batch);
        }
        if (filter.branch && filter.branch != "-") {
          filterObj.branch = filter.branch;
          // console.log(filterObj.branch);
          delete filter.branch;
          // console.log(filterObj.branch);
        }
        if (filter.test && filter.test != "-") {
          filterObj.test = filter.test;
          // console.log(filterObj.branch);
          delete filter.test;
          // console.log(filterObj.branch);
        }
        // if (filter.result_name && filter.result_name != "-") {
        //     filterObj.result_name = filter.result_name;
        //     delete filter.result_name;
        // }
      }
    }
    console.log("golu-filter-checker");
    // console.log(filterObj);
    console.log("filter");
    console.log(filter);
    let results = await Results.find(filterObj)
      .populate(["student"])
      .populate(["batch"])
      .populate(["branch"])
      .lean();
    for (var a = 0; a < results.length; a++) {
      let result = results[a];
      let subjectWise = {};
      for (var i = 0; i < result.marked.length; i++) {
        if (result.marked[i].subject in subjectWise) {
          if (result.marked[i].attempted)
            subjectWise[result.marked[i].subject].attempted += 1;
          if (result.marked[i].correctly_marked)
            subjectWise[result.marked[i].subject].correctly_marked += 1;
          if (result.marked[i].time_allotted > 0)
            subjectWise[result.marked[i].subject].time_allotted +=
              result.marked[i].time_allotted;
        } else {
          subjectWise[result.marked[i].subject] = {
            attempted: result.marked[i].attempted ? 1 : 0,
            correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
            time_allotted: result.marked[i].time_allotted,
          };
        }
      }
      results[a].subject_wise = subjectWise;
      //console.log(results[a]);
      // r.push(result);
    }
    ret.data = results;
    // console.log(results);
    ret.message = "done";
    ret.status = "success";
  } catch (err) {
    console.log("some error occured:" + err);
    ret.message = "some error occured";
  }
  res.status(200).json(ret);
});

// router.get("/results_filter_second", async (req, res) => {
//   let ownerId = req.user._id;
//   let testId = req.params.test_Id;
//   let filter = req.query;
//   // query.attempt_number=1;
//   let permission = "academic_desk_create";

//   let ret = {
//     message:
//       "Sorry you are not allowed to perform this task, permission denied.",
//     status: "failed",
//   };
//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {};
//     if (filter) {
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type && filter.result_type != "-") {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }
//         if (filter.batch && filter.batch != "-") {
//           filterObj.batch = filter.batch;
//           // console.log(filterObj.batch);
//           delete filter.batch;
//           // console.log(filterObj.batch);
//         }
//         if (filter.branch && filter.branch != "-") {
//           filterObj.branch = filter.branch;
//           // console.log(filterObj.branch);
//           delete filter.branch;
//           // console.log(filterObj.branch);
//         }
//         if (filter.test && filter.test != "-") {
//           filterObj.test = filter.test;
//           // console.log(filterObj.branch);
//           delete filter.test;
//           // console.log(filterObj.branch);
//         }
//         // if (filter.result_name && filter.result_name != "-") {
//         //     filterObj.result_name = filter.result_name;
//         //     delete filter.result_name;
//         // }
//       }
//     }
//     console.log("golu-filter-checker");
//     // console.log(filterObj);
//     console.log("filter");
//     console.log(filter);
//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();
//     for (var a = 0; a < results.length; a++) {
//       let result = results[a];
//       let subjectWise = {};
//       for (var i = 0; i < result.marked.length; i++) {
//         if (result.marked[i].subject in subjectWise) {
//           if (result.marked[i].attempted)
//             subjectWise[result.marked[i].subject].attempted += 1;
//           if (result.marked[i].correctly_marked)
//             subjectWise[result.marked[i].subject].correctly_marked += 1;
//           if (result.marked[i].time_allotted > 0)
//             subjectWise[result.marked[i].subject].time_allotted +=
//               result.marked[i].time_allotted;
//         } else {
//           subjectWise[result.marked[i].subject] = {
//             attempted: result.marked[i].attempted ? 1 : 0,
//             correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//             time_allotted: result.marked[i].time_allotted,
//           };
//         }
//       }
//       results[a].subject_wise = subjectWise;
//       //console.log(results[a]);
//       // r.push(result);
//     };
//     let total_test_results = [];

//     let uniqueResultIds = new Set();
//     if (results.length != 0) {
//       //  const uniqueResultIds = new Set(); // Create a set to store unique result_id values
    
//       for (let i = 0; i < results.length; i++) {
//         if (results[i].test !== " ") {
//           // Check if the result_id is already in the set
//           if (!uniqueResultIds.has(results[i].test)) {
//             // If it's not in the set, add it to both the set and the total_test_results array
//             uniqueResultIds.add(results[i].test);
    
//             total_test_results.push(results[i]);
//           }
//         }
//       }
//     }
    
    
//         // ret.data = uniqueResultIds;
//         console.log(uniqueResultIds);
//         ret.data = total_test_results ;

//     // ret.data = results;
//     // console.log(results);
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("some error occured:" + err);
//     ret.message = "some error occured";
//   }
//   res.status(200).json(ret);
// });

// router.get("/results_filter_second", async (req, res) => {
//   let ownerId = req.user._id;
//   let testId = req.params.test_Id;
//   let filter = req.query;
//   let permission = "academic_desk_create";

//   let ret = {
//     message:
//       "Sorry, you are not allowed to perform this task. Permission denied.",
//     status: "failed",
//   };

//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {};
//     // if (filter) {
//     //   if (filter._id) {
//     //     filterObj._id = filter._id;
//     //     delete filter._id;
//     //   } else {
//     //     if (filter.result_type && filter.result_type != "-") {
//     //       filterObj.result_type = filter.result_type;
//     //       delete filter.result_type;
//     //     }
//     //     if (filter.batch && filter.batch != "-") {
//     //       filterObj.batch = filter.batch;
//     //       delete filter.batch;
//     //     }
//     //     if (filter.branch && filter.branch != "-") {
//     //       filterObj.branch = filter.branch;
//     //       delete filter.branch;
//     //     }
//     //     if (filter.test && filter.test != "-") {
//     //       filterObj.test = filter.test;
//     //       delete filter.test;
//     //     }
//     //   }
//     // }
//     if (filter) {
//       // if (filter.startDate && filter.endDate) {
//       //   // Parse the date range from query parameters
//       //   let startDate = moment(filter.startDate, "YYYY-MM-DD");
//       //   let endDate = moment(filter.endDate, "YYYY-MM-DD");

//       //   // Check if both startDate and endDate are valid moments
//       //   if (startDate.isValid() && endDate.isValid()) {
//       //     filterObj.declaration_time = {
//       //       $gte: startDate.toDate(),
//       //       $lte: endDate.toDate(),
//       //     };
//       //   }

//       //   // Remove startDate and endDate from filter
//       //   delete filter.startDate;
//       //   delete filter.endDate;
//       // }
//       // Start Date Filter
//       if (filter.startDate) {
//         let startDate = moment(filter.startDate, "YYYY-MM-DD");
//         if (startDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$gte = startDate.toDate();
//         }
//         delete filter.startDate;
//       }

//       // End Date Filter
//       if (filter.endDate) {
//         let endDate = moment(filter.endDate, "YYYY-MM-DD");
//         if (endDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$lte = endDate.toDate();
//         }
//         delete filter.endDate;
//       }
//       // Add additional filters based on query parameters
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type) {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }

//         if (filter.branch) {
//           filterObj.branch = filter.branch;
//           delete filter.branch;
//         }

//         if (filter.batch) {
//           filterObj.batch = filter.batch;
//           delete filter.batch;
//         }

//         if (filter.test) {
//           filterObj.test = filter.test;
//           delete filter.test;
//         }

//         // Add more filters as needed
//       }
//     }
//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//     for (var a = 0; a < results.length; a++) {
//       let result = results[a];
//       let subjectWise = {};

//       for (var i = 0; i < result.marked.length; i++) {
//         if (result.marked[i].subject in subjectWise) {
//           if (result.marked[i].attempted)
//             subjectWise[result.marked[i].subject].attempted += 1;
//           if (result.marked[i].correctly_marked)
//             subjectWise[result.marked[i].subject].correctly_marked += 1;
//           if (result.marked[i].time_allotted > 0)
//             subjectWise[result.marked[i].subject].time_allotted +=
//               result.marked[i].time_allotted;
//         } else {
//           subjectWise[result.marked[i].subject] = {
//             attempted: result.marked[i].attempted ? 1 : 0,
//             correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//             time_allotted: result.marked[i].time_allotted,
//           };
//         }
//       }

//       results[a].subject_wise = subjectWise;
//     }

//     // let testWiseResults = {};

//     // for (let i = 0; i < results.length; i++) {
//     //   const testId = results[i].test;

//     //   if (!(testId in testWiseResults)) {
//     //     testWiseResults[testId] = [];
//     //   }

//     //   testWiseResults[testId].push(results[i]);
//     // }

//     let testWiseResults = [];

// const groupedResults = results.reduce((acc, result) => {
//   const testId = result.test;
//   if (!acc[testId]) {
//     acc[testId] = [];
//   }
//   acc[testId].push(result);
//   return acc;
// }, {});

// for (const [testId, resultsArray] of Object.entries(groupedResults)) {
//   testWiseResults.push({
//     testId: testId,
//     results: resultsArray,
//   });
// }

// // Adding an entry for overall results
// testWiseResults.unshift({
//   testId: "overall",
//   results: results,
// });


// //     let testWiseResults = [];

// // for (let i = 0; i < results.length; i++) {
// //   const testId = results[i].test;

// //   let existingTest = testWiseResults.find((item) => item.testId === testId);

// //   if (existingTest) {
// //     existingTest.results.push(results[i]);
// //   } else {
// //     testWiseResults.push({
// //       testId: testId,
// //       results: [results[i]],
// //     });
// //   }
// // }

// // let testWiseResults = [];

// // for (let i = 0; i < results.length; i++) {
// //   testWiseResults.push(results[i]);
// // }

// // let testWiseResults = [];
// // let overallResults = [];

// // for (let i = 0; i < results.length; i++) {
// //   const testId = results[i].test;

// //   let existingTest = testWiseResults.find((item) => item.testId === testId);

// //   if (existingTest) {
// //     existingTest.results.push(results[i]);
// //   } else {
// //     testWiseResults.push({
// //       testId: testId,
// //       results: [results[i]],
// //     });
// //   }

// //   overallResults.push(results[i]);
// // }

// // let testWiseResults = [];

// // const groupedResults = results.reduce((acc, result) => {
// //   const testId = result.test;
// //   if (!acc[testId]) {
// //     acc[testId] = [];
// //   }
// //   acc[testId].push(result);
// //   return acc;
// // }, {});

// // for (const [testId, resultsArray] of Object.entries(groupedResults)) {
// //   testWiseResults.push({
// //     testId: testId,
// //     results: resultsArray,
// //   });
// // }

// // // Adding an entry for overall results
// // testWiseResults.unshift({
// //   testId: "overall",
// //   results: results,
// // });

// // let testWiseResults = [];

// // for (let i = 0; i < results.length; i++) {
// //   const testId = results[i].test;

// //   if (!testWiseResults.some((item) => item.testId === testId)) {
// //     testWiseResults.push({
// //       testId: testId,
// //       results: [],
// //     });
// //   }

// //   const testResult = testWiseResults.find((item) => item.testId === testId);
// //   testResult.results.push(results[i]);
// // }

// // let testWiseResults = [];

// // for (let i = 0; i < results.length; i++) {
// //   const testId = results[i].test;

// //   if (!testWiseResults.some((item) => item.testId === testId)) {
// //     testWiseResults.push({
// //       testId: testId,
// //     });
// //   }
// // }

//     ret.data = testWiseResults;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("Some error occurred: " + err);
//     ret.message = "Some error occurred";
//   }

//   res.status(200).json(ret);
// });

// router.get("/results_filter_third", async (req, res) => {
//   let ownerId = req.user._id;
//   let testId = req.params.test_Id;
//   let filter = req.query;
//   let permission = "academic_desk_create";

//   let ret = {
//     message:
//       "Sorry, you are not allowed to perform this task. Permission denied.",
//     status: "failed",
//   };

//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {};
//     // if (filter) {
//     //   if (filter._id) {
//     //     filterObj._id = filter._id;
//     //     delete filter._id;
//     //   } else {
//     //     if (filter.result_type && filter.result_type != "-") {
//     //       filterObj.result_type = filter.result_type;
//     //       delete filter.result_type;
//     //     }
//     //     if (filter.batch && filter.batch != "-") {
//     //       filterObj.batch = filter.batch;
//     //       delete filter.batch;
//     //     }
//     //     if (filter.branch && filter.branch != "-") {
//     //       filterObj.branch = filter.branch;
//     //       delete filter.branch;
//     //     }
//     //     if (filter.test && filter.test != "-") {
//     //       filterObj.test = filter.test;
//     //       delete filter.test;
//     //     }
//     //   }
//     // }
//     if (filter) {
//       // if (filter.startDate && filter.endDate) {
//       //   // Parse the date range from query parameters
//       //   let startDate = moment(filter.startDate, "YYYY-MM-DD");
//       //   let endDate = moment(filter.endDate, "YYYY-MM-DD");

//       //   // Check if both startDate and endDate are valid moments
//       //   if (startDate.isValid() && endDate.isValid()) {
//       //     filterObj.declaration_time = {
//       //       $gte: startDate.toDate(),
//       //       $lte: endDate.toDate(),
//       //     };
//       //   }

//       //   // Remove startDate and endDate from filter
//       //   delete filter.startDate;
//       //   delete filter.endDate;
//       // }
//       // Start Date Filter
//       if (filter.startDate) {
//         let startDate = moment(filter.startDate, "YYYY-MM-DD");
//         if (startDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$gte = startDate.toDate();
//         }
//         delete filter.startDate;
//       }

//       // End Date Filter
//       if (filter.endDate) {
//         let endDate = moment(filter.endDate, "YYYY-MM-DD");
//         if (endDate.isValid()) {
//           filterObj.declaration_time = filterObj.declaration_time || {};
//           filterObj.declaration_time.$lte = endDate.toDate();
//         }
//         delete filter.endDate;
//       }
//       // Add additional filters based on query parameters
//       if (filter.result_name && filter.result_name != "-") {
//         filterObj.result_name = filter.result_name;
//         delete filter.result_name;
//       }
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type) {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }

//         if (filter.branch) {
//           filterObj.branch = filter.branch;
//           delete filter.branch;
//         }

//         if (filter.batch) {
//           filterObj.batch = filter.batch;
//           delete filter.batch;
//         }

//         if (filter.test) {
//           filterObj.test = filter.test;
//           delete filter.test;
//         }

//         // Add more filters as needed
//       }
//     }
//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//     for (var a = 0; a < results.length; a++) {
//       let result = results[a];
//       let subjectWise = {};

//       for (var i = 0; i < result.marked.length; i++) {
//         if (result.marked[i].subject in subjectWise) {
//           if (result.marked[i].attempted)
//             subjectWise[result.marked[i].subject].attempted += 1;
//           if (result.marked[i].correctly_marked)
//             subjectWise[result.marked[i].subject].correctly_marked += 1;
//           if (result.marked[i].time_allotted > 0)
//             subjectWise[result.marked[i].subject].time_allotted +=
//               result.marked[i].time_allotted;
//         } else {
//           subjectWise[result.marked[i].subject] = {
//             attempted: result.marked[i].attempted ? 1 : 0,
//             correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//             time_allotted: result.marked[i].time_allotted,
//           };
//         }
//       }

//       results[a].subject_wise = subjectWise;
//     }

//     // let testWiseResults = {};

//     // for (let i = 0; i < results.length; i++) {
//     //   const testId = results[i].test;

//     //   if (!(testId in testWiseResults)) {
//     //     testWiseResults[testId] = [];
//     //   }

//     //   testWiseResults[testId].push(results[i]);
//     // }

//     // ret.data = testWiseResults;

//     // let batchWiseResults = {};

//     // for (let i = 0; i < results.length; i++) {
//     //   const batchId = results[i].batch._id;

//     //   if (!(batchId in batchWiseResults)) {
//     //     batchWiseResults[batchId] = [];
//     //   }

//     //   batchWiseResults[batchId].push(results[i]);
//     // }

//     let testWiseResults = [];

// // Group results by testId using reduce
// const groupedResults = results.reduce((acc, result) => {
//   const testId = result.test;
//   if (!acc[testId]) {
//     acc[testId] = [];
//   }
//   acc[testId].push(result);
//   return acc;
// }, {});

// // Convert groupedResults object to array
// for (const [testId, resultsArray] of Object.entries(groupedResults)) {
//   testWiseResults.push({
//     testId: testId,
//     results: resultsArray,
//   });
// }


//     // ret.data = batchWiseResults;
//     ret.data = testWiseResults;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("Some error occurred: " + err);
//     ret.message = "Some error occurred";
//   }

//   res.status(200).json(ret);
// });

// this is right third code

// const mongoose = require("mongoose");

//golu
// router.get("/results_filter_third", async (req, res) => {
//   let ownerId = req.user._id;
//   let testId = req.params.test_Id;
//   let filter = req.query;
//   let permission = "academic_desk_create";

//   let ret = {
//     message: "Sorry, you are not allowed to perform this task. Permission denied.",
//     status: "failed",
//   };

//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {};

//     if (filter) {
//       // Start Date Filter
//       if (filter.startDate) {
//         filterObj.declaration_time = filterObj.declaration_time || {};
//         filterObj.declaration_time.$gte =new Date(filter.startDate);
//         delete filter.startDate;
//       }

//       // End Date Filter
//       if (filter.endDate) {
//         filterObj.declaration_time = filterObj.declaration_time || {};
//         filterObj.declaration_time.$lte = new Date(filter.endDate);
//         delete filter.endDate;
//       }

//       // Add additional filters based on query parameters
//       if (filter.result_name && filter.result_name !== "-") {
//         filterObj.result_name = filter.result_name;
//         delete filter.result_name;
//       }
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type) {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }

//         if (filter.branch) {
//           filterObj.branch = filter.branch;
//           delete filter.branch;
//         }

//         if (filter.batch) {
//           filterObj.batch = filter.batch;
//           delete filter.batch;
//         }

//         if (filter.test) {
//           filterObj.test = filter.test;
//           delete filter.test;
//         }
      
//       // Add more filters as needed
//     }
//   }
//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//       for (var a = 0; a < results.length; a++) {
//         let result = results[a];
//         let subjectWise = {};
  
//         for (var i = 0; i < result.marked.length; i++) {
//           if (result.marked[i].subject in subjectWise) {
//             if (result.marked[i].attempted)
//               subjectWise[result.marked[i].subject].attempted += 1;
//             if (result.marked[i].correctly_marked)
//               subjectWise[result.marked[i].subject].correctly_marked += 1;
//             if (result.marked[i].time_allotted > 0)
//               subjectWise[result.marked[i].subject].time_allotted +=
//                 result.marked[i].time_allotted;
//           } else {
//             subjectWise[result.marked[i].subject] = {
//               attempted: result.marked[i].attempted ? 1 : 0,
//               correctly_marked: result.marked[i].correctly_marked ? 1 : 0,
//               time_allotted: result.marked[i].time_allotted,
//             };
//           }
//         }
  
//         results[a].subject_wise = subjectWise;
//       }
//     // Your existing logic for processing results

//     let testWiseResults = [];

//     // Group results by testId using reduce
//     const groupedResults = results.reduce((acc, result) => {
//       const testId = result.test;
//       if (!acc[testId]) {
//         acc[testId] = [];
//       }
//       acc[testId].push(result);
//       return acc;
//     }, {});

//     // Convert groupedResults object to array
//     for (const [testId, resultsArray] of Object.entries(groupedResults)) {
//       testWiseResults.push({
//         testId: testId,
//         results: resultsArray,
//       });
//     }

//     ret.data = testWiseResults;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("Some error occurred: " + err);
//     ret.message = "Some error occurred";
//   }

//   res.status(200).json(ret);
// });
//golu

//golu-new-result

router.get("/results_filter_third", async (req, res) => {
  let ownerId = req.user._id;
  let testId = req.params.test_Id;
  let filter = req.query;
  let permission = "academic_desk_create";

  let ret = {
    message: "Sorry, you are not allowed to perform this task. Permission denied.",
    status: "failed",
  };

  if (!checkForPermission(req.user, permission)) {
    res.status(200).json(ret);
    return;
  }

  try {
    let filterObj = {};

    if (filter) {
      // Start Date Filter
      if (filter.startDate) {
        filterObj.declaration_time = filterObj.declaration_time || {};
        filterObj.declaration_time.$gte =new Date(filter.startDate);
        delete filter.startDate;
      }

      // End Date Filter
      if (filter.endDate) {
        filterObj.declaration_time = filterObj.declaration_time || {};
        filterObj.declaration_time.$lte = new Date(filter.endDate);
        delete filter.endDate;
      }

      // Add additional filters based on query parameters
      if (filter.result_name && filter.result_name !== "-") {
        filterObj.result_name = filter.result_name;
        delete filter.result_name;
      }
      if (filter._id) {
        filterObj._id = filter._id;
        delete filter._id;
      } else {
        if (filter.result_type) {
          filterObj.result_type = filter.result_type;
          delete filter.result_type;
        }

        if (filter.branch) {
          filterObj.branch = filter.branch;
          delete filter.branch;
        }

        if (filter.batch) {
          filterObj.batch = filter.batch;
          delete filter.batch;
        }

        if (filter.test) {
          filterObj.test = filter.test;
          delete filter.test;
        }
      
      // Add more filters as needed
    }
  }
    let results = await Results.find(filterObj)
      .populate(["student"])
      .populate(["batch"])
      .populate(["branch"])
      .lean();

    results.forEach((result, index) => {
      let subjectWise = {};

      result.marked.forEach((mark) => {
        if (mark.subject in subjectWise) {
          if (mark.attempted)
            subjectWise[mark.subject].attempted += 1;
          if (mark.correctly_marked)
            subjectWise[mark.subject].correctly_marked += 1;
          if (mark.time_allotted > 0)
            subjectWise[mark.subject].time_allotted += mark.time_allotted;
        } else {
          subjectWise[mark.subject] = {
            attempted: mark.attempted ? 1 : 0,
            correctly_marked: mark.correctly_marked ? 1 : 0,
            time_allotted: mark.time_allotted,
          };
        }
      });

      results[index].subject_wise = subjectWise;
    });

    // Group results by testId using reduce
    const groupedResults = results.reduce((acc, result) => {
      const testId = result.test;
      if (!acc[testId]) {
        acc[testId] = [];
      }
      acc[testId].push(result);
      return acc;
    }, {});

    // Convert groupedResults object to array using map
    const testWiseResults = Object.entries(groupedResults).map(([testId, resultsArray]) => ({
      testId,
      results: resultsArray,
    }));

    ret.data = testWiseResults;
    ret.message = "done";
    ret.status = "success";
  } catch (err) {
    console.log("Some error occurred: " + err);
    ret.message = "Some error occurred";
  }

  res.status(200).json(ret);
});




// router.get("/results_filter_second", async (req, res) => {
//   let ownerId = req.user._id;
//   let testId = req.params.test_Id;
//   let filter = req.query;
//   let permission = "academic_desk_create";

//   let ret = {
//     message:
//       "Sorry, you are not allowed to perform this task; permission denied.",
//     status: "failed",
//   };
//   if (!checkForPermission(req.user, permission)) {
//     res.status(200).json(ret);
//     return;
//   }

//   try {
//     let filterObj = {};
//     if (filter) {
//       if (filter._id) {
//         filterObj._id = filter._id;
//         delete filter._id;
//       } else {
//         if (filter.result_type && filter.result_type != "-") {
//           filterObj.result_type = filter.result_type;
//           delete filter.result_type;
//         }
//         if (filter.batch && filter.batch != "-") {
//           filterObj.batch = filter.batch;
//           delete filter.batch;
//         }
//         if (filter.branch && filter.branch != "-") {
//           filterObj.branch = filter.branch;
//           delete filter.branch;
//         }
//         if (filter.test && filter.test != "-") {
//           filterObj.test = filter.test;
//           delete filter.test;
//         }
//       }
//     }

//     let results = await Results.find(filterObj)
//       .populate(["student"])
//       .populate(["batch"])
//       .populate(["branch"])
//       .lean();

//     let total_test_results = [];

//     const uniqueTestIds = new Set(); // Create a set to store unique test values

//     for (let i = 0; i < results.length; i++) {
//       if (results[i].test !== " ") {
//         // Check if the test_id is already in the set
//         if (!uniqueTestIds.has(results[i].test)) {
//           // If it's not in the set, add it to both the set and the total_test_results array
//           uniqueTestIds.add(results[i].test);
//           total_test_results.push(results[i]);
//         }
//       }
//     }

//     ret.data = total_test_results;
//     ret.message = "done";
//     ret.status = "success";
//   } catch (err) {
//     console.log("Some error occurred: " + err);
//     ret.message = "Some error occurred";
//   }
//   res.status(200).json(ret);
// });


// router.get("/batches",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "academic_desk_read";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {

//         filterObj = filter
//     }
//     console.log(filterObj);
//     Batches.find(filterObj).exec(function(err,batches){
//         if (err)
//         {
//           console.log("some error occured:"+err);
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=batches;
//             ret.status ="success";
//             ret.message = 'done';
//         }
//         res.status(200).json(ret);
//     });
// });

// router.get("/batch_get/:batch_id",async (req, res, next) => {
//     let batch_id = req.params.batch_id;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     try{
//         let batch = await Batches.findById(batch_id).populate([{path:"faculties",populate:['subject','stream']},"stream","branch","students",{path:"modules",populate:[{path:"subject"}]},{path:"files",populate:[{path:'file'},'subject','chapter']},{path:"lectures",populate:["subject","chapter",{path:"files",populate:['file','subject','chapter']}]},{path:"tests",select:{structure:0,questions:0}},{path:"modules",populate:["chapters"]}]).lean();
//         let doubts = await Doubts.find({batch:batch_id});
//         batch.doubts = doubts;
//         ret.status = "success";
//         ret.message = 'done';
//         ret.data = batch;

//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.get("/student_batch/:batch_id",async (req, res, next) => {
//     let batch_id = req.params.batch_id;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     try{
//         let batch = await Batches.findById(batch_id).populate(["stream","branch","students","modules",{path:"files",populate:[{path:'file'},'subject','chapter']},{path:"lectures",populate:[{path:"files",populate:['file','subject','chapter']}]},{path:"tests",select:{structure:0,questions:0}},{path:"modules",populate:["chapters"]}]);

//         let lecture_subjects = await getLectureSubjects(batch_id);
//         batch.lecture_subjects = lecture_subjects;

//         let files_subjects = await getFilesSubjects(batch_id);
//         batch.files_subjects=files_subjects;

//         let module_subjects = await getMouleSubjects(batch_id);
//         batch.module_subjects = module_subjects;

//         ret.status = "success";
//         ret.message = 'done';
//         ret.data = batch;
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.get("/student_batches/:student_id", async (req, res, next) => {
//     let studentId = req.params.student_id;
//     let permission = "academic_desk_read";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
//         try{

//             let batches = await Batches.find({students:studentId}).populate(['stream','branch']);
//             ret.status = "success";
//             ret.message = "done";
//             // let batchesId = batches.map(b=>b._id);
//             ret.data = batches;
//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= err.message;
//         }

//         res.status(200).json(ret);
// });

// router.get("/faculty_batches/:faculty_id", async (req, res, next) => {
//     let studentId = req.params.faculty_id;
//     let permission = "academic_desk_read";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
//         try{

//             let batches = await Batches.find({faculties:faculty_id}).populate(['stream','branch']);
//             ret.status = "success";
//             ret.message = "done";
//             // let batchesId = batches.map(b=>b._id);
//             ret.data = batches;
//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= err.message;
//         }

//         res.status(200).json(ret);
// });

// router.get("/student_batches_ids/:student_id", async (req, res, next) => {
//     let studentId = req.params.student_id;
//     let permission = "academic_desk_read";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
//         try{

//             let batches = await Batches.find({students:studentId});
//             ret.status = "success";
//             ret.message = "done";
//             let batchesId = batches.map(b=>b._id);
//             // consol.log(bacthesId);
//             ret.data = batchesId;
//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= err.message;
//         }

//         res.status(200).json(ret);
// });

// router.get("/my_batches", async (req, res, next) => {

//     let userId = req.user._id;
//     let role = req.user.role;

//     let filter = {};
//     if(role=="user"){
//         filter.students = userId;
//     }
//     else if(role == "faculty"){
//         filter.faculties = userId;
//     }
//     let permission = "academic_desk_read";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
//         try{

//             let batches = await Batches.find(filter).populate(["branch","stream","students","tests","lectures","files"]);
//             ret.status = "success";
//             ret.message = "done";
//             // let batchesId = batches.map(b=>b._id);
//             // consol.log(bacthesId);
//             ret.data = batches;
//         }
//         catch(err){
//             console.log("some error occured:"+err);
//             ret.message= err.message;
//         }

//         res.status(200).json(ret);
// });

// router.get("/student_compatible/:student_id",async (req, res, next) => {
//     let studentId = req.params.student_id;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     try{
//         let student = await Students.findById(studentId);
//         let filter = {};
//         if(student.stream){
//             filter.stream=student.stream;
//         }
//         if(student.class_number){
//             filter.class_number=student.class_number;
//         }
//         if(student.branch){
//             filter.branch=student.branch;
//         }

//         let batches = await Batches.find(filter).populate(['stream',"branch"]);
//         console.log(batches);
//         ret.status = "success";
//         ret.message = "done";
//         ret.data = batches;
//     }
//     catch(err){
//         console.log("some error occured:"+err);
//         ret.message= err.message;
//     }

//     res.status(200).json(ret);

// });

// //////// Lecture Routes ///////////
// router.post("/lecture_create", async (req, res, next) => {
//     let lecture=req.body;
//     // let batchId = req.params.batch_id;
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }

//     try{
//         let f=new Lectures(lecture);
//         await f.save();
//         //await Batches.addLecture(batchId,f._id);
//         console.log("no error occured");
//         ret.message="done";
//         ret.status="success";
//     }
//     catch(err){
//         ret.message= "some error occured";
//         console.log(err);
//     }
//     res.status(200).json(ret);
// });

// router.post("/lecture_edit/:lecture_id", (req, res, next) => {
//     let ownerId=req.user._id;
//     let lecture=req.body;
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let lecture_id = req.params.lecture_id;
//     Lectures.findOneAndUpdate({_id:lecture_id},lecture,function(err){
//             if (err)
//             {
//               console.log("some error occured:"+err);
//               ret.message="some error occured";
//             }
//             else{
//                 ret.status="success";
//                 ret.message = "done";
//             }
//             res.status(200).json(ret);
//         });
// });

// router.post("/lecture_delete/:lecture_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let lectureId = req.params.lecture_id;

//     try{
//         await Lectures.deleteOne({_id:lectureId});
//         // await Batches.removeLecture(batchId,lectureId);
//         ret.status = "success";
//         ret.message = "done";
//     }
//     catch(err){
//         console.log(err.message);
//         ret.message = err.message;

//     }
//     res.status(200).json(ret);
//     // Lectures.findOneAndDelete({_id:lecture_id},function(err,lecture){
//     //         if (err)
//     //         {
//     //           console.log("some error occured:"+err);
//     //           ret.message= "some error occured";
//     //         }
//     //         else{
//     //             ret.status="success";
//     //             ret.lecture=lecture;
//     //             ret.message = "done";
//     //         }
//     //         res.status(200).json(ret);
//     //     });
// });

// // router.get("/lectures",(req, res, next) => {
// //     let ownerId=req.user._id;
// //     let permission = "academic_desk_read";
// //     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
// //     if(!checkForPermission(req.user,permission))
// //     {
// //         res.status(200).json(ret);
// //     }
// //     let filter = req.query;
// //     let filterObj = {};
// //     if(filter)
// //     {
// //         filterObj = filter
// //     }
// //     console.log(filterObj);
// //     Lectures.find(filterObj).exec(function(err,lecturees){
// //         if (err)
// //         {
// //           console.log("some error occured:"+err);
// //           ret.message= "some error occured";
// //         }
// //         else{
// //             ret.data=lecturees;
// //             ret.status ="success";
// //             ret.message = 'done';
// //         }
// //         res.status(200).json(ret);
// //     });
// // });

// router.get("/lectures",(req, res, next) => {
//     let ownerId=req.user._id;
//     let skip=req.query.skip || 0;
//     let limit = req.query.limit || 50;
//     let permission = "academic_desk_read";

//     console.log(skip+"<-skip,limit-> "+limit);

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
//         filterObj = filter;
//         if(filterObj.skip)
//         delete filterObj.skip;

//         if(filterObj.limit)
//         delete filterObj.limit;

//     // }
//     // console.log(filterObj);

//         if(filter.subject && filter.subject != "-")
//         {
//             filterObj.subjects={$in:[filter.subject]};
//             // filterObj.subjects = filter.subject;
//             delete filterObj.subject;
//             // delete filter.subject;
//         }
//         if(filter.question_type=="-")
//         {
//             // filterObj.question_type = filter.question;
//             delete filterObj.question_type;
//         }

//         if(filter.stream)
//         {
//             filterObj.streams = filter.stream;
//             delete filterObj.stream;
//         }

//     }
//     console.log(filterObj);
//     Lectures.find(filterObj).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,lecturees){
//         if (err)
//         {
//           console.log("some error occured:"+err);
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=lecturees;
//             ret.status ="success";
//             ret.message = 'done';
//         }
//         res.status(200).json(ret);
//     });
// });

// router.get("/lecture_get/:lecture_id",(req, res, next) => {
//     let lecture_id = req.params.lecture_id;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     Lectures.findById(lecture_id).populate(["subject","chapter",{path:"files",populate:['file','subject','chapter']}]).exec(function(err,lecture){
//         if (err)
//         {
//             console.log("some error occured:"+err);
//             ret.message= "some error occured";
//         }
//         else{
//             console.log(lecture);
//             ret.data=lecture;
//             ret.message = "done";
//             ret.status ="success";
//         }
//         res.status(200).json(ret);
//     });
// });

// router.post("/batch_add_lecture/:batch_id/:lecture_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let lectureId = req.params.lecture_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await Lectures.exists({_id:lectureId}))){
//             throw {message:"Lecture not found, please check the Id provided."};
//         }
//         if(await Batches.addLecture(batchId,lectureId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add lecture into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_lecture/:batch_id/:lecture_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let lectureId = req.params.lecture_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(await Batches.removeLecture(batchId,lectureId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove lecture from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_add_test/:batch_id/:test_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let testId = req.params.test_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await Tests.exists({_id:testId}))){
//             throw {message:"Test not found, please check the Id provided."};
//         }
//         if(await Batches.addTest(batchId,testId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add test into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_test/:batch_id/:test_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let testId = req.params.test_id;
//     let batchId = req.params.batch_id;
//     try{

//         if(await Batches.removeTest(batchId,testId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove test from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_add_student/:batch_id/:student_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let studentId = req.params.student_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await Students.exists({_id:studentId}))){
//             throw {message:"Student not found, please check the Id provided."};
//         }
//         if(await Batches.addStudent(batchId,studentId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add student into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_student/:batch_id/:student_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let studentId = req.params.student_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(await Batches.removeStudent(batchId,studentId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove student from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_add_file/:batch_id/:file_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let fileId = req.params.file_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await AcademicFiles.exists({_id:fileId}))){
//             throw {message:"File not found, please check the Id provided."};
//         }
//         if(await Batches.addFile(batchId,fileId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add file into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_file/:batch_id/:file_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let fileId = req.params.file_id;
//     let batchId = req.params.batch_id;
//     try{

//         if(await Batches.removeFile(batchId,fileId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove file from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_add_module/:batch_id/:module_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let moduleId = req.params.module_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await Modules.exists({_id:moduleId}))){
//             throw {message:"Module not found, please check the Id provided."};
//         }
//         if(await Batches.addModule(batchId,moduleId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add file into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_module/:batch_id/:module_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let moduleId = req.params.module_id;
//     let batchId = req.params.batch_id;
//     try{

//         if(await Batches.removeModule(batchId,moduleId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove file from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_add_faculty/:batch_id/:faculty_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let facultyId = req.params.faculty_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(!(await Faculties.exists({_id:facultyId}))){
//             throw {message:"Student not found, please check the Id provided."};
//         }
//         if(await Batches.addFaculty(batchId,facultyId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add student into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/batch_remove_faculty/:batch_id/:faculty_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let facultyId = req.params.faculty_id;
//     let batchId = req.params.batch_id;
//     try{
//         if(await Batches.removeFaculty(batchId,facultyId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove student from the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/lecture_add_file/:lecture_id/:file_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let fileId = req.params.file_id;
//     let lectureId = req.params.lecture_id;
//     try{
//         if(!(await AcademicFiles.exists({_id:fileId}))){
//             throw {message:"File not found, please check the Id provided."};
//         }
//         if(await Lectures.addFile(lectureId,fileId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not add file into the batch"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.post("/lecture_remove_file/:lecture_id/:file_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     ret.message="Server Problem";
//     let fileId = req.params.file_id;
//     let lectureId = req.params.lecture_id;
//     try{
//         if(await Lectures.removeFile(lectureId,fileId)){
//             ret.status = "success";
//             ret.message = "done";
//         }
//         else{
//             throw {message:"Could not remove file from the lecture"};
//         }
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

// router.get("/lecture_subjects/:batch_id",async (req, res, next) => {
//     let query = req.query;
//     let permission = "academic_desk_read";
//     let batchId = req.params.batch_id;
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     ret.message="Server Problem";
//     let subjects = await Lectures.batchLectureSubjects(batchId);
//     if(subjects){
//         ret.status = "success";
//         ret.data = subjects;
//     }
//     res.status(200).json(ret);
// });

// router.get("/lecture_subject_chapters/:batch_id/:subject_id",async (req, res, next) => {
//     // let query = req.query;
//     let permission = "academic_desk_read";
//     let batchId = req.params.batch_id;
//     let subjectId = req.params.subject_id;
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     ret.message="Server Problem";
//     let chapters = await Lectures.lectureSubjectChapters(batchId,subjectId);
//     if(chapters){
//         ret.status = "success";
//         ret.data = chapters;
//     }
//     res.status(200).json(ret);
// });

// router.get("/lectures_specific/:batch_id/:subject_id/:chapter_id",async (req, res, next) => {
//     // let query = req.query;
//     let permission = "academic_desk_read";
//     let batchId = req.params.batch_id;
//     let subjectId = req.params.subject_id;
//     let chapterId = req.params.chapter_id;
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let lectures = await Lectures.getSpecificLectures(batchId,subjectId,chapterId);
//     if(lectures){
//         ret.status = "success";
//         ret.data = lectures;
//     }
//     res.status(200).json(ret);

// });

module.exports = router;
