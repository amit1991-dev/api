const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const router = express.Router();
const Students = require("../../databases/student_center/students.js");
const Questions = require("../../databases/student_center/questions");
const DppQuestions = require("../../databases/student_center/dpp_question");
const Results = require("../../databases/student_center/results");
const DppResults = require("../../databases/student_center/dpp_results.js");
const Test = require("../../databases/student_center/tests");
const DppTest = require("../../databases/student_center/dpp_tests.js");
const TestStatus = require("../../databases/student_center/student_test_status");
const DppTestStatus = require("../../databases/student_center/dpp_student_test_status");
const Batches = require("../../databases/student_center/batches");
// const examsRoute = require("./exams");
const examsRoute = require("./exams");
const batchesRoute = require("./batches");
const feesRoute = require("./fees");
const modulesRoute = require("./modules");
const instituteFilesRoute = require("./institute_files");
const doubtsRoute = require("./doubts");
const notificationsRoute = require("./notifications.js");
const facultiesRoute = require("./faculties");
const promotionsRoute = require("./promotions");
const Verifications = require("../../databases/system/verifications.js");
const {sendOtp} = require("../../utility/connectivity_functions.js");

router.use("/faculties",facultiesRoute);
router.use("/notifications",notificationsRoute);
router.use("/doubts",doubtsRoute);
router.use("/institute_files",instituteFilesRoute);
router.use("/modules",modulesRoute);
router.use("/fees",feesRoute);
router.use("/exams",examsRoute);
router.use("/batches",batchesRoute);
router.use("/promotions",promotionsRoute);

const {Topics,Streams,SubTopics,Branches,Chapters,Categories,MarkingShemes,Subjects} = require("../../databases/student_center/academics");
// const tests = require("../../databases/student_center/tests");
require("dotenv").config();
const ObjectId=mongoose.Types.ObjectId;


const { Configuration, OpenAIApi } = require("openai");
const tests = require("../../databases/student_center/tests");
const Faculties = require("../../databases/student_center/faculties.js");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var testPopulateObject = {path:"test",populate:[
    {path:"structure.sections.questions.question",populate:[{path:"comprehension"},],model:"questions"},
    {path:"structure.sections.questions.subject",model:"subjects"},
    {path:"structure.sections.questions.scheme",model:"marking_schemes"},
    {path:"structure.sections.questions.instructions",model:"instructions"},
]};

var statusPopulateObject = [
    {path:"data.question.question",model:"questions"},
    {path:"data.question.subject",model:"subjects"},
    {path:"data.question.scheme",model:"marking_schemes"},
    {path:"data.question.instructions",model:"instructions"}
];

var dpptestPopulateObject = {path:"test",populate:[
    {path:"structure.sections.questions.question",populate:[{path:"comprehension"},],model:"dpp_questions"},
    {path:"structure.sections.questions.subject",model:"subjects"},
    {path:"structure.sections.questions.scheme",model:"marking_schemes"},
    {path:"structure.sections.questions.instructions",model:"instructions"},
]};

var dppstatusPopulateObject = [
    {path:"data.question.question",model:"dpp_questions"},
    {path:"data.question.subject",model:"subjects"},
    {path:"data.question.scheme",model:"marking_schemes"},
    {path:"data.question.instructions",model:"instructions"}
];

// var studentTestStatePopulateObject = [testPopulateObject,...statusPopulateObject];
var studentTestStatePopulateObject = [testPopulateObject];
var studentDppTestStatePopulateObject = [dpptestPopulateObject];


async function get_students_profile(studentId){
    if(!studentId)
    {
        return false;
    }

    try{
        let results = await Results.find({student:studentId}).populate("test").lean();
        let student = await Students.findById(studentId).lean();
        //console.log(student);
        return {student,results};
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

router.use("/exams",examsRoute);

router.post("/query_ai",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let query = req.body.query;
    let max_tokens=req.body.max_tokens==null?100:req.body.max_tokens;
    // let student = await Students.findById(req.user._id);
    try{
        if(query==null)
        {
            throw {message:"the query is empty or null"};
        }
        
        let data = {model: "text-davinci-003", prompt: query, temperature: 0, max_tokens: max_tokens};
        let queryResponse="Sorry, No Response";
        console.log(data);
        const response = await openai.createCompletion(data);
        console.log("data complete");
        if(response.status==200){
            console.log("The response came back 200 OK");
            if(response.data.choices.length>0){
                console.log("Choices are there!");
                queryResponse = response.data.choices[0].text;
                console.log(queryResponse);
            }
            else
            {
                throw {message:"Something from OpenAI went wrong!!"};
            }
        }
        else{
            throw {message:"Something went wrong!!"};
        }
        // ret.data=data;
        ret.data = queryResponse;
        ret.status ="success";
        ret.message = 'done';     
    }
    catch(err){
        console.log("Error from catch in query ai:");
        console.log(err.message);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

// router.get("/student", async (req, res) => {
//     try {
//       const student = await Students.findById(req.user._id).lean();
//       if (!student) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.json(student);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });

router.get("/student", async (req, res) => {
    try {
      const student = await Students.findById(req.user._id)
        .populate('stream')
        .populate('branch')
        .lean();
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
//   router.get("/test_report/:test_id",async (req, res, next) => {




 

  router.post("/student_delete", passport.authenticate('otp-strategy', { session: false }), async (req, res, next) => {
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    // Check if the authenticated user is a student
    if(req.user.role !== "user") {
        return res.status(403).json(ret);
    }

    try{
        // Delete the student
        console.log("req.user._id")
        console.log(req.user);
        console.log(req.user._id);
        await Students.deleteOne({_id: req.user._id});
        ret.status="success";
        ret.message = "Student deleted successfully";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message= err.message;
    }
    res.status(200).json(ret);
});

router.post("/student_update", passport.authenticate('otp-strategy', { session: false }), async (req, res, next) => {
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    let student = req.body.student;
    // Check if the authenticated user is a student
    if(req.user.role !== "user") {
        return res.status(403).json(ret);
    }

    try{
        // Update the student
        console.log("req.user._id")
        console.log(req.user);
        console.log(req.user._id);
        await Students.updateOne({_id: req.user._id}, {$set:student});
        ret.status="success";
        ret.message = "Student updated successfully";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message= err.message;
    }
    res.status(200).json(ret);
});

router.get("/streams",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    // let student = await Students.findById(req.user._id);
    try{
        let streams = await Streams.find();
        ret.data=streams;
        ret.status ="success";
        ret.message = 'done';     
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/branches",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    // let student = await Students.findById(req.user._id);
    try{
        let branches = await Branches.find();
        ret.data=branches;
        ret.status ="success";
        ret.message = 'done';     
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/batches",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    // let student = await Students.findById(req.user._id);
    try{
        let batches = await Batches.find();
        ret.data=batches;
        ret.status ="success";
        ret.message = 'done';     
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/stream_tests/:stream_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let streamId = req.params.stream_id;
    try{
        let tests = await Test.find({streams:streamId},{structure:0,questions:0});
        console.log(tests);
        ret.data=tests;
        ret.status ="success";
        ret.message = 'done';
        res.status(200).json(ret);
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
        res.status(200).json(ret);
    }
    
    // console.log("sent results back");
});



router.get("/test_report/:test_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let role = req.user.role;
    let studentId;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }

    
    try{
        let test = await Test.findById(testId,{structure:0,questions:0});
        let test_states = await TestStatus.find({test:testId,student:studentId,test_state_status:{$ne:"finished"}}).populate({path:"test",select:{structure:0,questions:0}});
        let test_results = await Results.find({test: testId,student:studentId});//only testId is needed so no population!
        console.log(test_states);
        ret.data={test_states,test_results,test};
        ret.status ="success";
        ret.message = 'done';
           
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/dpp_test_report/:test_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let role = req.user.role;
    let studentId;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }

    
    try{
        let test = await DppTest.findById(testId,{structure:0,questions:0});
        let test_states = await DppTestStatus.find({test:testId,student:studentId,test_state_status:{$ne:"finished"}}).populate({path:"test",select:{structure:0,questions:0}});
        let test_results = await DppResults.find({test: testId,student:studentId});//only testId is needed so no population!
        console.log(test_states);
        ret.data={test_states,test_results,test};
        ret.status ="success";
        ret.message = 'done';
           
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/resume_test_attempt/:test_state_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let testStateId = req.params.test_state_id;
    let studentId;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    // let attemptNumber = req.query.attempt==null?1:req.query.attempt;
    try{
        // await TestStatus.updateOne({_id:testStateId},{$set:{test_state_status:"running"}});
        let testStatus =  await TestStatus.findOne({_id:testStateId,student:req.user._id}).populate(studentTestStatePopulateObject);
        testStatus.test_status="running";
        await testStatus.save();
        ret.data=testStatus;
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});
router.post("/pause_test_attempt/:test_state_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let testStateId = req.params.test_state_id;
    let studentId = req.user._id;
    let role = req.user.role;
    let body = req.body;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    try{
        let testStatus =  await TestStatus.findOne({_id:testStateId,student:req.user._id});
        testStatus.test_status="paused";
        await testStatus.save();
        ret.data=testStatus;
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/create_test_attempt/:test_id",async (req, res, next) => {
    console.log("create_test_attempt");
    console.log("create_test_attempt");
    console.log("create_test_attempt");
    console.log("create_test_attempt");
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let batchId  = req.body.batch_id;
    let branchId = req.body.branch_id;
    console.log("test Id" ,testId );
    console.log("batch Id" ,batchId );
    console.log("branch Id" ,branchId );
    // let testStateId = req.params.test_state_id;
    let studentId = req.user._id;
    let attemptNumber=1;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }

    // let attemptNumber = req.query.attempt==null?1:req.query.attempt;
    try{
        let attemptNumbers = await TestStatus.find({test:testId,student:studentId,batch:batchId},{attempt_number:1}).sort({attempt_number:-1});
        if(attemptNumbers.length != 0)
        {
            attemptNumber=attemptNumbers[0].attempt_number+1;
        }
        let test = await Test.findById(testId);
        
        if(!test)
        {
            throw {message:"Test Not found"};
        }

        console.log("attemptNumber");
        console.log(attemptNumber);
        console.log('golu');
        console.log('batchId:' + batchId);
        console.log('branchId:' + branchId);

        console.log('golu');
        
        if(test.attempts!=0 && attemptNumber > test.attempts)
        {
            console.log("allowed attemped:"+test.attempts.toString());
            throw {message:"Maximum attempts reached"};
        }
        let timeLeft=test.duration;

        if(test.start_time){
            console.log("start time: "+test.start_time);
            if((test.start_time.getTime() - new Date().getTime())>0){
                throw {message:"Test cannot be started before it's scheduled time"};
            }
        }

        if(test.end_time){
            let timeLeftBeforeEnd = Math.floor((test.end_time.getTime() - new Date().getTime())/1000/60);
            console.log("timeLeftBeforeEnd: "+timeLeftBeforeEnd);
            if(timeLeftBeforeEnd < 0){
                throw {message:"no time left for the test!"};
            }
            timeLeft = Math.min(test.duration,timeLeftBeforeEnd);
        }

        let testStatus = new TestStatus({test:testId,student:studentId,attempt_number:attemptNumber,time_left:timeLeft*60,batch:batchId,branch:branchId});
        await testStatus.save();
        let data = await TestStatus.findById(testStatus._id).populate(studentTestStatePopulateObject).lean();
        ret.data=data._id;
        console.log("ret.data",ret.data);
        ret.status ="success";
        ret.message = 'done'; 

    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/create_dpp_test_attempt/:test_id",async (req, res, next) => {
    console.log("create_dpp_test_attempt");
    console.log("create_dpp_test_attempt");
    console.log("create_dpp_test_attempt");
    console.log("create_dpp_test_attempt");
    let ret={message:"",status:"failed"};
    let testId = req.params.test_id;
    let batchId  = req.body.batch_id;
    let branchId = req.body.branch_id;
    console.log("test Id" ,testId );
    console.log("batch Id" ,batchId );
    console.log("branch Id" ,branchId );
    // let testStateId = req.params.test_state_id;
    let studentId = req.user._id;
    console.log("studentId" ,studentId );
    let attemptNumber=1;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    console.log("role" , role );

    // let attemptNumber = req.query.attempt==null?1:req.query.attempt;
    try{
        let attemptNumbers = await DppTestStatus.find({test:testId,student:studentId,batch:batchId},{attempt_number:1}).sort({attempt_number:-1});
        if(attemptNumbers.length != 0)
        {
            attemptNumber=attemptNumbers[0].attempt_number+1;
        }
        let test = await DppTest.findById(testId);
        
        if(!test)
        {
            throw {message:"Test Not found"};
        }

        console.log("attemptNumber");
        console.log(attemptNumber);
        console.log('golu');
        console.log('batchId:' + batchId);
        console.log('branchId:' + branchId);

        console.log('golu');
        
        if(test.attempts!=0 && attemptNumber > test.attempts)
        {
            console.log("allowed attemped:"+test.attempts.toString());
            throw {message:"Maximum attempts reached"};
        }
        let timeLeft=test.duration;

        if(test.start_time){
            console.log("start time: "+test.start_time);
            if((test.start_time.getTime() - new Date().getTime())>0){
                throw {message:"Test cannot be started before it's scheduled time"};
            }
        }

        if(test.end_time){
            let timeLeftBeforeEnd = Math.floor((test.end_time.getTime() - new Date().getTime())/1000/60);
            console.log("timeLeftBeforeEnd: "+timeLeftBeforeEnd);
            if(timeLeftBeforeEnd < 0){
                throw {message:"no time left for the test!"};
            }
            timeLeft = Math.min(test.duration,timeLeftBeforeEnd);
        }
        console.log("create_dpp_test_attempt1");
        let testStatus = new DppTestStatus({test:testId,student:studentId,attempt_number:attemptNumber,time_left:timeLeft*60,batch:batchId,branch:branchId});
        console.log("create_dpp_test_attempt2");
        await testStatus.save();
        console.log("create_dpp_test_attempt3");
        let data = await DppTestStatus.findById(testStatus._id).populate(studentDppTestStatePopulateObject).lean();
        console.log("create_dpp_test_attempt4");
        ret.data=data._id;
        console.log("create_dpp_test_attempt5");
        console.log("ret.data",ret.data);
        console.log("create_dpp_test_attempt6");
        ret.status ="success";
        console.log("create_dpp_test_attempt7");
        ret.message = 'done'; 
        console.log("create_dpp_test_attempt8");

    }
    catch(err){
        console.log("create_dpp_test_attempt9");
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});



router.post("/update_test_state/:test_state_id",async (req, res, next) => {
    let ret={message:"Cannot update Test state",status:"failed"};
    let data  = req.body.data;
    let time_left  = req.body.time_left;
    let testStateId = req.params.test_state_id;
    let studentId;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    try{
        let testState = await TestStatus.findById(testStateId).populate("test");
        let test = testState.test;
        let timeLeft = time_left;
        if(test.end_time){
            let timeLeftBeforeEnd = Math.floor((test.end_time.getTime() - new Date().getTime())/1000/60);
            console.log("timeLeftBeforeEnd: "+timeLeftBeforeEnd);
            if(timeLeftBeforeEnd < 0){
                timeLeft = 0;
            }
            else{
                timeLeft = Math.floor(Math.min(time_left/60,timeLeftBeforeEnd)*60);
            }
        }
        await TestStatus.updateOne({_id:testStateId,student:studentId},{$set:{data:data,time_left:timeLeft,test_state_status:"running"}});
        ret.status ="success";
        ret.data = timeLeft;
        ret.message = "done";
    }
    catch(err)
    {
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/update_dpp_test_state/:test_state_id",async (req, res, next) => {
    console.log("update_dpp_test_state");
    let ret={message:"Cannot update Test state",status:"failed"};
    let data  = req.body.data;
    let time_left  = req.body.time_left;
    let testStateId = req.params.test_state_id;
    let studentId;
    let role = req.user.role;
    console.log("update_dpp_test_state");
    console.log("update_dpp_test_state role and all" , role , testStateId , data , time_left , studentId);
    if(role=="user"){
        studentId = req.user._id;
        console.log("update_dpp_test_state");
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
        console.log("update_dpp_test_state");
    }
    try{
        let testState = await DppTestStatus.findById(testStateId).populate("test");
        let test = testState.test;
        let timeLeft = time_left;
        if(test.end_time){
            let timeLeftBeforeEnd = Math.floor((test.end_time.getTime() - new Date().getTime())/1000/60);
            console.log("timeLeftBeforeEnd: "+timeLeftBeforeEnd);
            if(timeLeftBeforeEnd < 0){
                timeLeft = 0;
            }
            else{
                timeLeft = Math.floor(Math.min(time_left/60,timeLeftBeforeEnd)*60);
            }
        }
        await DppTestStatus.updateOne({_id:testStateId,student:studentId},{$set:{data:data,time_left:timeLeft,test_state_status:"running"}});
        ret.status ="success";
        ret.data = timeLeft;
        ret.message = "done";
        console.log("ret.data update_dpp_test_state data",ret.data);
    }
    catch(err)
    {
        console.log(err);
        ret.message = err.message;
        console.log("ret.data update_dpp_test_state error",ret.data);
    }
    res.status(200).json(ret);
});

router.get("/test_state/:test_state_id",async (req, res, next) => {
    let ret={message:"Cannot get Test state",status:"failed"};
    let testStateId = req.params.test_state_id;
    try{
        console.log(studentTestStatePopulateObject);
        let data=await TestStatus.findOne({_id:testStateId}).populate(studentTestStatePopulateObject);
        ret.status ="success";
        ret.data=data;
        ret.message = "done";
    }
    catch(err)
    {
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/dpp_test_state/:test_state_id",async (req, res, next) => {
    console.log("dpp_test_state");
    let ret={message:"Cannot get Test state",status:"failed"};
    let testStateId = req.params.test_state_id;
    console.log("testStateId",testStateId);
    try{
        console.log(studentDppTestStatePopulateObject);
        let data=await DppTestStatus.findOne({_id:testStateId}).populate(studentDppTestStatePopulateObject);
        ret.status ="success";
        ret.data=data;
        ret.message = "done";
        console.log("ret.data  dpp_test_state data",ret.data);
        console.log("dpp_test_state2");
    }
    catch(err)
    {
        console.log("dpp_test_state3");
        console.log(err);
        ret.message = err.message;
        console.log("ret.data dpp_test_state error",ret.data);
        console.log("dpp_test_state4");
    }
    console.log("dpp_test_state5");
    console.log("ret.data dpp_test_state",ret.data);
    res.status(200).json(ret);
    console.log("dpp_test_state5");
});

router.get("/results_filter/:test_Id", async (req, res) => {
    console.log("Getting Results");
    console.log("Getting Results");
    console.log("Getting Results");
    console.log("Getting Results");
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
    // if (!checkForPermission(req.user, permission)) {
    //   res.status(200).json(ret);
    //   return;
    // }
    // if(role=="user"){
    //     studentId = req.user._id;
    // }
    // else if(role=="faculty"){
    //     let facultyId = req.user._id;
    //     let faculty = await Faculties.findById(facultyId);
    //     studentId = faculty.student;
    // }
  
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
        .sort({ total: -1 })
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

router.get("/profile",async function(req,res){
    console.log("Getting Profile");
    let ret={message:"",status:"failed"};
    let studentId;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    try{
        ret.data = await get_students_profile(student_id);
	    if(ret.data)
        {
            ret.status="success";
        }
    }
    catch(err){
        console.log(err);
        ret.message="some server error, reported to the server console.";
    }
    res.status(200).json(ret);
});

router.get("/subjects",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let studentId;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    let student = await Students.findById(studentId);

    Subjects.find({streams:{$in:student.stream}}).populate("streams").exec(function(err,subjects){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=subjects;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });

});



//1. tests
router.get("/tests/",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    console.log("Aquiring Tests");
    let studentId;
    let role = req.user.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    let s = await Students.findById(studentId);
    let packages= s.packages;
    let filterObj = {packages:{$in:packages}}; 
    console.log(filterObj);
    Test.find(filterObj,async function(err,tests){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            console.log(tests.length);
            for(var i =0; i < tests.length; i++ )
            {
                tests[i] = tests[i].toObject();
                // console.log(2);
                const resultExists = await Results.exists({ test: tests[i]._id,student:req.user._id });
                if(resultExists)
                {
                    tests[i].submitted = true;
                    let result = await Results.findOne({test: tests[i]._id,student:req.user._id});
                    tests[i].result = result;
                }
                else
                {
                    tests[i].submitted = false;
                }
            }
            ret.data=tests;
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });

});




// //3.5. test types for a given stream
// router.get("/test_types",(req, res, next) => {
//     let ret={message:"Some error occurred",status:"failed"};
//     let stream  = req.user.stream;

//     //this is base64
    
//     let filterObj={stream};
    
//     console.log("inside test types");
    

//     Test.find(filterObj).distinct('test_types',function(err,types){
//         if (err)
//         {
//           console.log("some error occurred:"+err);  
//           // ret.message= "some error occurred";
//         }
//         else{
//             ret.data=types;
//             // ret.data=["hekllo","bello"];
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });
// });


router.get("/question_get/:questionId",async (req, res, next) => {
    console.log("inside question get");
    let ret={message:"Some error occurred",status:"failed"};
    let questionId = req.params.questionId;

    try{
        let q = await Questions.findById(questionId).populate(["document"]).populate("comprehension").lean();
        ret.data=q;
        ret.status ="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message; 
    }
    res.status(200).json(ret);

    // Questions.findById(questionId,function(err,question){
    //     if (err)
    //     {
    //     }
    //     else{
    //     }
    // });

});

router.get("/dpp_question_get/:questionId",async (req, res, next) => {
    console.log("inside question get");
    let ret={message:"Some error occurred",status:"failed"};
    let questionId = req.params.questionId;

    try{
        let q = await DppQuestions.findById(questionId).populate(["document"]).populate("comprehension").lean();
        ret.data=q;
        ret.status ="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message; 
    }
    res.status(200).json(ret);

    // Questions.findById(questionId,function(err,question){
    //     if (err)
    //     {
    //     }
    //     else{
    //     }
    // });

});

//4. test result
router.get("/test_result/:result_id",async (req, res, next) => {
    let ret={message:"No Test Id",status:"failed"};
    let resultId = req.params.result_id;
    let result;
    if(await Results.exists({_id:resultId}))
    {
    	result = await Results.findById(resultId).exec();
        ret.status = "success";
        ret.message = "done receiving the results";
        ret.data = result;
        //console.log(result);
    }
    else
    {
    	ret.message = "Test not found";
    	res.status(200).json(ret);
    	return;
    }
    res.status(200).json(ret);
});

router.get("/test_result_dpp/:result_id",async (req, res, next) => {
    let ret={message:"No Test Id",status:"failed"};
    let resultId = req.params.result_id;
    let result;
    if(await DppResults.exists({_id:resultId}))
    {
    	result = await DppResults.findById(resultId).exec();
        ret.status = "success";
        ret.message = "done receiving the results";
        ret.data = result;
        //console.log(result);
    }
    else
    {
    	ret.message = "Test not found";
    	res.status(200).json(ret);
    	return;
    }
    res.status(200).json(ret);
});

router.get("/test_result_with_questions/:result_id",async (req, res, next) => {
    let ret={message:"No Test Id",status:"failed"};
    let resultId = req.params.result_id;
    let result;
    console.log("s");
    if(await Results.exists({_id:resultId}))
    {
    	result = await Results.findById(resultId).populate({path:"marked.question.question",model:"questions"}).exec();
        ret.status = "success";
        ret.message = "done receiving the results";
        ret.data = result;
        console.log(result);
    }
    else
    {
    	ret.message = "Test not found";
    	res.status(200).json(ret);
    	return;

    }
    res.status(200).json(ret);
});

router.get("/dpp_test_result_with_questions/:result_id",async (req, res, next) => {
    console.log("dpp_test_result_with_questions");
    console.log("dpp_test_result_with_questions");
    console.log("dpp_test_result_with_questions");
    console.log("dpp_test_result_with_questions");
    let ret={message:"No Test Id",status:"failed"};
    let resultId = req.params.result_id;
    let result;
    console.log("s");
    console.log("dpp_test_result_with_questions resultId ", resultId );
    if(await DppResults.exists({_id:resultId}))
    {
        console.log("dpp_test_result_with_questions 1");
    	result = await DppResults.findById(resultId).populate({path:"marked.question.question",model:"dpp_questions"}).exec();
        ret.status = "success";
        ret.message = "done receiving the results";
        ret.data = result;
        console.log("dpp_test_result_with_questions 2");
        console.log(result);
    }
    else
    {
    	ret.message = "Test not found";
    	res.status(200).json(ret);
    	return;

    }
    res.status(200).json(ret);
});

//5. get single test
router.get("/test/:testId",async (req, res, next) => {
    let ret={message:"No Test Id sent",status:"failed"};
    // let studentId = req.user._id;
    let testId = req.params.testId;
    let query = req.query;
    
    let filterObj = {};
    if(testId)
    {
    	filterObj = {_id:testId};
    }
    else
    {
    	res.status(200).json(ret);
    	return;
    }
    console.log(filterObj);
    try{
            let test = await Test.findOne(filterObj);
            ret.data=test;
            ret.status ="success";
            ret.message = "done receiving the single test";

        }
    catch(err){
        ret.message = err.emessage;
    }
    res.status(200).json(ret);

});

//same as above!
router.get("/test_solution/:testId",(req, res, next) => {
    let ret={message:"No Test Id sent",status:"failed"};
    // let studentId = req.user._id;
    let testId = req.params.testId;

    let filterObj = {};
    if(testId)
    {
    	filterObj = {_id:testId};
    	// filterObj.category = category;
    }
    else
    {
    	res.status(200).json(ret);
    	return;
    }
    console.log(filterObj);
    Test.findOne(filterObj).populate("questions").exec(function(err,test){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            ret.data=test;
            ret.message="done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.post("/test_submit_general/:test_state_id",async (req, res, next) => {
    let ret={message:"TestId missing",status:"failed"};
    let role = req.user.role;
    let studentId;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }

    let testStateId = req.params.test_state_id;
    let testState;
    let test,marking;
    

    try{        
        testState = await TestStatus.findOne({_id:testStateId}).populate(testPopulateObject).lean();
        if(testState.test_state_status=="finished"){
            let result = await Results.findOne({test_state:testStateId});
            console.log("result found");

            if(result)
            {
                // console.log(result);
                ret.data=result._id;
                ret.status="success";
                ret.message= "Result was already saved";
                res.status(200).json(ret);
                return;
            }
            else{
                console.log("result not found");
            }
        }
        marking = testState.data;
        if(marking==null || marking.length==0){
            console.log("Empty Test State: "+testState._id);
            throw {message:"Error: marking not found"};
        }
        // console.log(marking);
        test = testState.test;
        
    }
    catch(err)
    {
        console.log("error");
        console.log(err);
        ret.message=err.message;
        res.status(200).json(ret);
        return;
    }

    var total=0,outOf=0,o=null;
    let sections = test.structure.sections;
    let section,data;
    let section_wise={};
    // let subject_wise=[];
    console.log("starting the for loop");
    for(var i=0;i<sections.length;i++)
    {
        // console.log("Section:"+i);
        section = sections[i];
        // console.log(section.section_type);
        
        if(section.section_type == "optional-jee" || section.section_type == "optional-neet")
        {
            
            data = await calculateOptionalSection(section,marking);
        }
        else
        {
            data = await calculateMandatorySection(section,marking);
            // console.log(data);
        }
        section_wise[section.name] = data;

        if(!data)
        {
            console.log("Section error");
            ret.message = "Some Problem occured calculating results";
            res.status(200).json(ret);
            return;
        }
        total+=data.total;
        outOf+=data.outOf;
        console.log("calculated marks:"+total+"/"+outOf);
    }
    console.log("ending the for loop");
   try{
    await TestStatus.updateOne({_id:testStateId},{$set:{test_state_status:"finished"}});
    
    console.log("Saving result");
    let result;

    if(!(await Results.exists({test:test._id,student:studentId,attempt_number:testState.attempt_number,batch:testState.batch,branch:testState.branch}))){
        console.log("Creating result");
        result = new Results({test:test._id,batch:testState.batch,branch:testState.branch,declaration_time:test.end_time,duration:test.duration,attempt_number:testState.attempt_number,student:studentId,marked:marking,total:total,max_marks:outOf,test_state:testStateId,section_wise:section_wise,is_competing:testState.is_competing,result_name:test.name,result_type:test.test_type});
        await result.save();
    }
    else{
        result = await Results.findOne({test:test._id,student:studentId,attempt_number:testState.attempt_number});
    }
    
    console.log("done saving test status after the results");


    ret.status = "success";
    ret.message = "done saving test result";
    ret.data = result._id;
    
   }
   catch(err){
    console.log(err.message);
    console.log("Error message from last catch");
    ret.message = err.message;
    ret.message=err.message;
   }
   res.status(200).json(ret);
      
      
});

router.post("/test_submit_dpp/:test_state_id",async (req, res, next) => {
    console.log("test_submit_dpp ");
    console.log("test_submit_dpp ");
    console.log("test_submit_dpp ");
    console.log("test_submit_dpp ");
    console.log("test_submit_dpp ");
    let ret={message:"TestId missing",status:"failed"};
    let role = req.user.role;
    let studentId;
    console.log("test_submit_dpp 2" );
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }

    let testStateId = req.params.test_state_id;
    let testState;
    let test,marking;
    console.log("test_submit_dpp 3" );

    try{ 
        console.log("test_submit_dpp 4" );       
        testState = await DppTestStatus.findOne({_id:testStateId}).populate(dpptestPopulateObject).lean();
        console.log("test_submit_dpp 5" );
        if(testState.test_state_status=="finished"){
            let result = await DppResults.findOne({test_state:testStateId});
            console.log("result found");

            if(result)
            {
                console.log("test_submit_dpp 6" );
                ret.data=result._id;
                ret.status="success";
                ret.message= "Result was already saved";
                res.status(200).json(ret);
                console.log("test_submit_dpp 7" );
                return;
            }
            else{
                console.log("result not found");
            }
            console.log("test_submit_dpp 7" );
        }
        console.log("test_submit_dpp 8");
        marking = testState.data;
        console.log("test_submit_dpp 9");
        if(marking==null || marking.length==0){
            console.log("Empty Test State: "+testState._id);
            throw {message:"Error: marking not found"};
        }
        // console.log(marking);
        test = testState.test;
        console.log("test_submit_dpp 10");
    }
    catch(err)
    {
        console.log("error");
        console.log(err);
        ret.message=err.message;
        res.status(200).json(ret);
        return;
    }
    console.log("test_submit_dpp 11");
    var total=0,outOf=0,o=null;
    let sections = test.structure.sections;
    let section,data;
    let section_wise={};
    // let subject_wise=[];
    console.log("test_submit_dpp 12");
    console.log("starting the for loop");
    for(var i=0;i<sections.length;i++)
    {
        // console.log("Section:"+i);
        section = sections[i];
        // console.log(section.section_type);
        
        if(section.section_type == "optional-jee" || section.section_type == "optional-neet")
        {
            
            data = await calculateOptionalSection(section,marking);
        }
        else
        {
            data = await calculateMandatorySection(section,marking);
            // console.log(data);
        }
        section_wise[section.name] = data;

        if(!data)
        {
            console.log("Section error");
            ret.message = "Some Problem occured calculating results";
            res.status(200).json(ret);
            return;
        }
        total+=data.total;
        outOf+=data.outOf;
        console.log("calculated marks:"+total+"/"+outOf);
    }
    console.log("ending the for loop");
   try{
    await DppTestStatus.updateOne({_id:testStateId},{$set:{test_state_status:"finished"}});
    
    console.log("Saving result");
    let result;

    if(!(await DppResults.exists({test:test._id,student:studentId,attempt_number:testState.attempt_number,batch:testState.batch,branch:testState.branch}))){
        console.log("Creating result");
        result = new DppResults({test:test._id,batch:testState.batch,branch:testState.branch,declaration_time:test.end_time,duration:test.duration,attempt_number:testState.attempt_number,student:studentId,marked:marking,total:total,max_marks:outOf,test_state:testStateId,section_wise:section_wise,is_competing:testState.is_competing,result_name:test.name,result_type:test.test_type});
        await result.save();
    }
    else{
        result = await DppResults.findOne({test:test._id,student:studentId,attempt_number:testState.attempt_number});
    }
    
    console.log("done saving test status after the results");


    ret.status = "success";
    ret.message = "done saving test result";
    ret.data = result._id;
    
   }
   catch(err){
    console.log(err.message);
    console.log("Error message from last catch");
    ret.message = err.message;
    ret.message=err.message;
   }
   res.status(200).json(ret);
      
      
});

//Academics api
//Chapter api
router.get("/chapters",async (req, res, next) => {
    // let ownerId=req.user._id;
    let studentId;
    let role = req.role;
    if(role=="user"){
        studentId = req.user._id;
    }
    else if(role=="faculty"){
        let facultyId = req.user._id;
        let faculty = await Faculties.findById(facultyId);
        studentId = faculty.student;
    }
    let student = await Students.findById(studentId);
    let classNumber = student.class_number;
    let subject = req.query.subject;
	//console.log(req.user);
    let ret={message:".",status:"failed"};
    let filterObj = {};
    if(subject)
    {
        filterObj.subject=subject;
    }
    filterObj.class_number= classNumber;
    let randomize = req.query.randomize;
        try{
            let chapters=await Chapters.find(filterObj).sort({sequence:1}).lean();
            if(randomize)
            {
                shuffleArray(chapters);
            }
            ret.data=chapters;
            ret.status ="success";
            ret.message = 'done';
        } 
        catch(err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        finally{
            res.status(200).json(ret);
        }
});

router.get("/chapter/:chapterId",async (req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let chapterId = req.params.chapterId;
    let ret={message:".",status:"failed"};
    try{
        let chapter=await Chapters.findById(chapterId).populate("files").lean();
        let topics = await Topics.find({chapter:chapterId}).lean();
        console.log(chapter);
        chapter.topics=topics;
        ret.data=chapter;
        ret.status ="success";
        ret.message = 'done';
    } 
    catch(err)
    {
      console.log("some error occured:"+err);  
      ret.message= "some error occured";
    }
    finally{
        res.status(200).json(ret);
    }
});

router.get("/topic_get/:topicId",async (req, res, next) => {
    let topicId = req.params.topicId;

    let ret={message:".",status:"failed"};

    try{
        let topic=await Topics.findById(topicId).lean();
        let subtopics=await SubTopics.find({topic_id:topicId}).lean();
        topic.subtopics=subtopics;
        ret.data=topic;
        ret.status ="success";
        ret.message = "done";
    }   
    catch(err)
    {
      console.log("some error occured:"+err);  
      ret.message= "some error occured";
    }
    finally{
        res.status(200).json(ret);
    }

});

router.get("/subtopics/:topic_id",async (req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let topicId = req.params.topic_id;
    let ret={message:".",status:"failed"};
    try{
        let subtopics=await SubTopics.find({topic:topicId}).lean();
        ret.data=subtopics;

        ret.status ="success";
        ret.message = "done";
    } 
    catch(err)
    {
      console.log("some error occured:"+err);  
      ret.message= "some error occured";
    }
    finally{
        console.log("response sent");
        res.status(200).json(ret);
    }
});



//============================Result Calculations============================//
let markingMap = {
                    'scq':calculateQuestionScq,
                    'integer':calculateQuestionInteger,
                    'comprehension':calculateQuestionComprehension,
                    'mcq':calculateQuestionMCQ,
                    "matrix":calculateQuestionMatrix,
                };

function calculateQuestionScq(question,scheme,marked_answer)
{
    let marks_obtained=0,correctly_marked=false;
    if(question.correct_answer == marked_answer)
    {
        marks_obtained = scheme.positive_marks;
        correctly_marked = true;
    }
    else
    {
        marks_obtained = (-1)*(scheme.negative_marks?scheme.negative_marks:0);
        correctly_marked = false;
    }

    return {marks_obtained,correctly_marked};
}

function calculateQuestionInteger(question,scheme,marked_answer)
{
    let marks_obtained=0,correctly_marked=false;
    if(question.subtype && question.subtype=="range")
    {
        let a=Number(question.correct_answer.split("::")[0]);
        let b=Number(question.correct_answer.split("::")[1]);
        if(a<= Number(question.correct_answer) && b>= Number(question.correct_answer))
        {
            marks_obtained = scheme.positive_marks;
            correctly_marked = true;
        }
        else
        {
            marks_obtained = (-1)*(scheme.negative_marks?scheme.negative_marks:0);
            correctly_marked = false;
        }
    }
    else
    { 
        if(Number.parseInt(question.correct_answer) == Number.parseInt(marked_answer.trim()))
        {
            console.log("yes correct");
            marks_obtained = scheme.positive_marks;
            correctly_marked = true;
        }
        else
        {
            console.log("no not correct");
            marks_obtained = (-1)*(scheme.negative_marks?scheme.negative_marks:0);
            correctly_marked = false;
        }
        
    }

    return {marks_obtained,correctly_marked};
}


// function calculateQuestionMCQ(question,scheme,marked_answer)
// {
//     //marked_answer = ['A','B']
//     //correct answer = ['A','B','C']
//     let correct_answer = JSON.parse(question.correct_answer);
//     marked_answer = JSON.parse(marked_answer);
//     let marks_obtained=0,correctly_marked=false;
//     let failed=false;
//     for(var i=0;i<marked_answer.length;i++){
//         let index =correct_answer.indexOf(marked_answer[i]);
//         if(index<0){
//             failed = true;
//             break;
//         }
//         else{
//             correct_answer.splice(index,1);
//         }
//     }
//     if(!failed && (correct_answer.length>0 && question.subtype!="partial")){
//         marks_obtained = Math.floor(scheme.positive_marks/2);
//         correctly_marked = false;
//     }
//     else if(failed){
//         marks_obtained = (-1)*scheme.negative_marks;
//         correctly_marked = false;
//     }
//     else
//     {
//         marks_obtained = scheme.positive_marks;
//         correctly_marked = true;
//     }
//     return {marks_obtained,correctly_marked};
// }



// function calculateQuestionMCQ(question,scheme,marked_answer)
// {
//     let correct_answer = question.correct_answer;
//     marked_answer = marked_answer;
//     let marks_obtained=0,correctly_marked=false;
//     let failed=false;
//     let matchedAnswers = 0;
//     for(var i=0;i<marked_answer.length;i++){
//         let index = correct_answer.indexOf(marked_answer[i]);
//         if(index<0){
//             failed = true;
//             break;
//         }
//         else{
//             matchedAnswers++;
//             correct_answer.splice(index,1);
//         }
//     }

//     if(!failed && (correct_answer.length>0 && question.subtype=="partial")){

//         // marks_obtained = Math.floor(scheme.positive_marks/2);
//         marks_obtained = matchedAnswers;
//         correctly_marked = false;
//     }
//     else if(failed){
//         marks_obtained = (-1)*scheme.negative_marks;
//         correctly_marked = false;
//     }
//     else
//     {
//         marks_obtained = scheme.positive_marks;
//         correctly_marked = true;
//     }
//     return {marks_obtained,correctly_marked};
// }


//golu mcq

function calculateQuestionMCQ(question, scheme, marked_answer) {
    let correct_answer = question.correct_answer;
    let marks_obtained = 0,
      correctly_marked = false;
    let markedAnswerCount = marked_answer ? marked_answer.length : 0; // Handle cases where marked_answer might be undefined
  
    // Sort answers for easier comparison later
    correct_answer.sort();
    marked_answer && marked_answer.sort(); // Only sort if marked_answer is defined
  
    // Check if all marked answers are correct
    let allMarkedCorrect =
      marked_answer &&
      marked_answer.every((answer) => correct_answer.includes(answer));
  
    if (markedAnswerCount === 0) {
      // Zero marks if none chosen
      marks_obtained = 0;
    } else if (allMarkedCorrect) {
      if (markedAnswerCount === correct_answer.length) {
        // Full marks if all correct options are chosen
        marks_obtained = scheme.positive_marks;
        correctly_marked = true;
      } else {
        // Partial marks based on how many correct options were chosen
        switch (markedAnswerCount) {
          case 1:
            marks_obtained = 1;
            break;
          case 2:
            marks_obtained = 2;
            break;
          case 3:
            marks_obtained = 3;
            break;
        }
      }
    } else {
      // Negative marks if any incorrect option is chosen
      marks_obtained = -1 * scheme.negative_marks;
    }
  
    return { marks_obtained, correctly_marked };
  }
  
  
//golu mcq


function calculateQuestionComprehension(question,scheme,marked_answer)
{
    
    if(question.question_subtype == "scq"){
        return calculateQuestionScq(question,scheme,marked_answer);
    }
    else if(question.question_subtype == "mcq"){
        return calculateQuestionMCQ(question,scheme,marked_answer);
    }
    else{
        return {marks_obtained:0,correctly_marked:false};
    }
}

function calculateQuestionMatrix(question,scheme,marked_answer)
{
    
    return calculateQuestionScq(question,scheme,marked_answer);
}


async function findMarkingScheme(schemeId)//full marking scheme object!
{
    try{
        let marking=await MarkingShemes.findById(schemeId);
        return marking.toObject();
    }
    catch(err)
    {
        return {name:"Plcaeholder Scheme",positive_marks:4,negative_marks:1};
    }
}
    
async function calculateOptionalSection(section,marking){
    let outOf=0,total=0;
    let correct=0,incorrect=0,attempted=0;
    let optionalLimitCount = section.numberCompulsoryQuestions;
    let questions = section.questions;
    let oc=0;
    try{
        for(var index=0;(index < questions.length) && (oc<optionalLimitCount); index++)
        {
            let question =questions[index].question;//already populated
            // console.log(question._id);
            let subject =questions[index].subject.name;//assuming that the subject is populated!!
            let scheme = questions[index].scheme;
            let mark = marking.filter(m=>{
                // console.log("m.question");
                // console.log(m);
                return m.question.question.toString()==question._id.toString();
            })[0];
            console.log(marking.length);
            let i=0;
            
            if(mark && mark.attempted)
            {
                attempted++;

                // console.log(question.question);
                let {marks_obtained,correctly_marked}=markingMap[question.question_type](question,scheme,mark.answer_value);
                mark.marks_obtained = marks_obtained;
                mark.correctly_marked = correctly_marked;
                if(correctly_marked){
                    correct++;
                }
                else{
                    incorrect++;
                }
                total += mark.marks_obtained;
                mark.contribution = true;
                oc++;
                
            }
            else{
                mark.marks_obtained = 0;
                mark.contribution = false;
            }
            
            
            mark.is_optional=true;
            mark.subject = subject;
            outOf += scheme.positive_marks;
        
        }
    }
    catch(err){
        console.log("optional section failed");
        console.log(err.message);
        return false;
    }

        return {total,outOf,correct,incorrect,attempted};

}

async function calculateMandatorySection(section,marking){
    let outOf=0,total=0;
    let correct=0,incorrect=0,attempted=0;
    let questions = section.questions;
    try{
        for(var index=0; (index < questions.length); index++)
        {
            console.log("Questions loop");
            console.log(index);
            let question =questions[index].question;
            let subject =questions[index].subject.name;//assuming that the subject is populated!!
            let scheme = await findMarkingScheme(questions[index].scheme);
            console.log(marking);
            console.log(marking.length);
            console.log("mar");
            let mark = marking.filter(m=>{
                console.log("m.question");
                console.log(m.question);
                console.log("m.question.question");
                console.log(m.question.question);
                console.log(question._id);
                if(m.question.question.toString()==question._id){
                   console.log(m.question.question.toString());
                   console.log(question);
                   console.log("m.question2");
                    return true; 
                }
                else{
                    console.log("m.question error");
                    return false;
                }
                
                
            })[0];  
            console.log("mark4");
            console.log(mark);
            let i=0;
            
            if(mark && mark.attempted)
            {
                attempted++;
                let {marks_obtained,correctly_marked}=markingMap[question.question_type](question,scheme,mark.answer_value);
                console.log("marks_obtained 1");
                console.log(marks_obtained);
                mark.marks_obtained = marks_obtained;
                mark.correctly_marked = correctly_marked;
                console.log("marks_obtained 2");
                if(correctly_marked){
                    correct++;
                    console.log("marks_obtained 3");
                }
                else{
                    incorrect++;
                    console.log("marks_obtained 4");
                }
                total += mark.marks_obtained;
                mark.contribution = true;
            }
            else{
                console.log("marks_obtained 5");
                mark.marks_obtained = 0;
                mark.contribution = false;
            }
            console.log("marks_obtained 6");
            mark.is_optional=false;
            mark.subject = subject;
            outOf += scheme.positive_marks;
            console.log("marks_obtained 7");
        
        }
        console.log("marks_obtained 8");
    }
    catch(err){
        console.log("Mandatory section failed");
        console.log("calculateQuestionManadatory:"+err.message);
        return false;
    }
    // console.log({total,outOf});
    return {total,outOf,correct,incorrect,attempted};
}

module.exports=router;

