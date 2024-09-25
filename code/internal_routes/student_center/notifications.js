const express = require("express");
const router = express.Router();
// const {Doubts}=require("../../databases/student_center/doubts")
const Notifications = require("../../databases/system/notifications");
const Students = require("../../databases/student_center/students");
const Faculties = require("../../databases/student_center/faculties");

// // Define a route for creating a doubt
// router.post("/create", async (req, res) => {
//   let ret = { message: "", status: "failed" };
//   const doubt = req.body;
//   if (await Doubts.create(doubt)) {
//     ret.status = "success";
//     ret.message = "done";
//   } else {
//     console.error(err);
//     ret.message = err.message;
//   }
//   console.log(ret);
//   res.status(200).json(ret);
// });

// Define a route for retrieving all doubts
router.get('/students', async (req, res) => {
  let ret = { message: "", status: "failed" };

  let studentId = req.user._id;
  
  try {
    let student = await Students.findById(studentId);
    let notifications =[];
    console.log({user:student.user.toString(),role:"student"});
    if(student){
      notifications = await Notifications.find({user:student.user.toString(),role:"student"}).sort({createdAt:-1});
      console.log(notifications);
    }
    ret.status = "success";
    ret.data = notifications;
    ret.message = 'done'; 
  } catch (err) {
    console.error(err);
    ret.message = err.message;
  }
    console.log(ret);
    res.status(200).json(ret);
});

router.get('/faculties', async (req, res) => {
  let ret = { message: "", status: "failed" };

  let facultyId = req.user._id;
  
  try {
    let faculty = await Faculties.findById(facultyId);
    let notifiactions =[]
    if(faculty){
       notifiactions = await Notifications.find({user:faculty.user.toString(),role:"faculty"}).sort({createdAt:-1});

    }
    ret.status = "success";
    ret.data = notifiactions;
    ret.message = 'done'; 
  } catch (err) {
    console.error(err);
    ret.message = err.message;
  }
    console.log(ret);
    res.status(200).json(ret);
});


// // Define a route for retrieving students doubts within a batch
// router.get('/student_batch_doubts/:batch_id', async (req, res) => {
//   let ret = { message: "", status: "failed" };
//   let batchId = req.params.batch_id;
//   let studentId= req.user._id;
//   try {
//     // Find all Doubt documents
//     const doubts = await Doubts.find({batch:batchId,student:studentId}).populate(["subject","question"]);
//     ret.status = "success";
//     ret.data = doubts;
//     ret.message = 'done'; 
//   } catch (err) {
//     console.error(err);
//     ret.message = err.message;
//   }
//     console.log(ret);
//     res.status(200).json(ret);
// });

// // Define a route for retrieving all doubts
// router.get('/faculty_batch_doubts/:batch_id', async (req, res) => {
//   let ret = { message: "", status: "failed" };
//   let batchId = req.params.batch_id;
//   let facultyId = req.user._id;
  
//   try {
//     let faculty= await Faculties.findById(facultyId);
//     let facultySubjectId = faculty.subject;
//     // Find all Doubt documents
//     const doubts = await Doubts.find({batch:batchId,subject:facultySubjectId}).populate(["subject","question"]);
//     ret.status = "success";
//     ret.data = doubts;
//     ret.message = 'done'; 
//   } catch (err) {
//     console.error(err);
//     ret.message = err.message;
//   }
//     console.log(ret);
//     res.status(200).json(ret);
// });



// // Define a route for retrieving doubt information
// router.get('/single/:doubt_id', async (req, res) => {
//   let ret = { message: "", status: "failed" };

//   try {
//     const doubtId = req.params.doubt_id; // Extract the doubtId from the request parameters

//     // Find the Doubt document with the specified doubtId
//     const doubt = await Doubts.findOne({ _id: doubtId }).populate(["subject","question"]);

//     ret.status = "success";
//     ret.data = doubt;
//     ret.message = 'done'; 
//   } catch (err) {
//     console.error(err);
//     ret.message = err.message;
//   }
//     console.log(ret);
//     res.status(200).json(ret);
// });

// // Define a route for adding a response to a doubt
// router.post("/add_response/:doubt_id", async (req, res) => {
//   let ret = { message: "", status: "failed" };
//   const doubtId = req.params.doubt_id;
//   const responseObj = req.body;
//   if (await Doubts.addResponse(doubtId,responseObj)) {
//     ret.status = "success";
//     ret.message = "done";
//   } else {
//     console.error(err);
//     ret.message = err.message;
//   }
//   console.log(ret);
//   res.status(200).json(ret);
// });

// // Define a route for deleting a response from a doubt
// router.post("/delete_response/:doubt_id/:response_id", async (req, res) => {
//   let ret = { message: "", status: "failed" };
//   const doubtId = req.params.doubt_id;
//   const responseId = req.params.response_id;
//   if (await Doubts.deleteResponse(doubtId,responseId)) {
//     ret.status = "success";
//     ret.message = "done";
//   } else {
//     console.error(err);
//     ret.message = err.message;
//   }
//   console.log(ret);
//   res.status(200).json(ret);
// });

// Define a route for changing the status of a doubt
router.post("/create", async (req, res) => {
  let ret = { message: "", status: "failed" };
  // const doubtId = req.params.doubt_id;
  const notification = req.body.status;
  try{
    let n = Notifications(notification);
    await n.save();
    ret.status = "success";
    ret.message="done";
  }
  catch(err){
    ret.message=err.message;
  }
  console.log(ret);
  res.status(200).json(ret);
});

module.exports = router;

