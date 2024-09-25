const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Faculties = require("../../databases/student_center/faculties.js");

const Students = require("../../databases/student_center/students");


// const examsRoute = require("./exams");
const examsRoute = require("./exams");
const batchesRoute = require("./batches");
const modulesRoute = require("./modules");
const instituteFilesRoute = require("./institute_files");
const doubtsRoute = require("./doubts");
const notificationsRoute = require("./notifications.js");

router.use("/notifications",notificationsRoute);
router.use("/doubts",doubtsRoute);
router.use("/institute_files",instituteFilesRoute);
router.use("/modules",modulesRoute);
router.use("/exams",examsRoute);
router.use("/batches",batchesRoute);

router.get("/",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    // let student = await Students.findById(req.user._id);
    try{
        let faculties = await Faculties.find().populate(['stream','subject']);
        ret.data=faculties;
        ret.status ="success";
        ret.message = 'done';
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/single/:faculty_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let facultyId = req.params.faculty_id;
    try{
        let faculty = await Faculties.findById(facultyId).populate(['stream','subject']);;
        ret.data=faculty;
        ret.status ="success";
        ret.message = 'done';
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.post("/create",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let faculty = req.body;

    try{
        if(!faculty.phone){
            throw {message:"phone number is not defined!"};
        }
        
        let u;
        if(!(await Users.exists({phone:faculty.phone}))){
            console.log("user did not exist");
            u = Users({phone:faculty.phone});
            await u.save();
        }
        else{
            console.log("user does exist");
            u=await Users.findOne({phone:faculty.phone});
            let facultyStudent={};
            if(!(await Students.exists({user:u._id}))){
                facultyStudent = new Students({user:u._id,phone:faculty.phone});
                await facultyStudent.save();
            }
            else{
                facultyStudent = await Students.findOne({user:u._id});
            }

            faculty.student = facultyStudent._id;
        }
        faculty.user=u._id;

        console.log(faculty);
        let f = Faculties(faculty);
        await f.save();
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }

    res.status(200).json(ret);
});

router.post("/update/:faculty_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let faculty = req.body;
    let facultyId = req.params.faculty_id;

    try{
        delete faculty._id;
        delete faculty.__v;
        delete faculty.user;
        console.log(faculty);
        await Faculties.updateOne({_id:facultyId},{$set:faculty});
        // await f.save();
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }

    res.status(200).json(ret);
});

router.post("/update_phone/:faculty_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    let facultyPhone = req.body.phone;
    let facultyId = req.params.faculty_id;

    try{
        let f = Faculties.findById(facultyId);
        let userId = f.user;

        await Users.updateOne({_id:userId},{$set:{phone:facultyPhone}});
        // await Faculties.updateOne({_id:facultyId},{$set:{phone:facultyPhone}});
        f.phone = facultyPhone;
        await f.save();
        
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }

    res.status(200).json(ret);
});

router.post("/delete/:faculty_id",async (req, res, next) => {
    let ret={message:"",status:"failed"};
    // let faculty = req.body;
    let facultyId = req.params.faculty_id;

    try{
        await Faculties.deleteOne({_id:facultyId});
        ret.status ="success";
        ret.message = 'done';    
    }
    catch(err){
        console.log(err);
        ret.message = err.message;
    }
    
    res.status(200).json(ret);
});
module.exports=router;

