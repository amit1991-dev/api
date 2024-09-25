const express = require("express");
const router = express.Router();
// const {Batches,Lectures} = require("../../databases/student_center/batches");
const Files = require("../../databases/system/files");
const {AcademicFiles,OfficialFiles} = require("../../databases/student_center/institute_files");
// const { getLectureSubjects, getMouleSubjects,getFilesSubjects } = require("./_functions");
// const Questions = require("../../databases/student_center/questions");


function checkForPermission(){
    return true;
}
//Batches api

router.get("/all_academic",(req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    AcademicFiles.find(query).populate(["file"]).exec(function(err,files){
        if (err)
        {
            console.log("some error occured:"+err); 
            ret.message= "some error occured" ; 
        }
        else{
            console.log(files);
            ret.data=files;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});

router.get("/single_academic/:file_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let fileId = req.params.file_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let file=await AcademicFiles.findById(fileId).populate(["file"]);
        ret.data=file;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log(err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.get("/single_official/:file_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let fileId = req.params.file_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let file=await OfficialFiles.findById(fileId).populate(["file"]);
        ret.data=file;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log(err); 
        ret.message= err.message; 
    }
    res.status(200).json(ret);
});


router.get("/all_official",(req, res, next) => {
    let query = req.query;
    let permission = "official_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    OfficialFiles.find(query).populate(["file"]).exec(function(err,files){
        if (err)
        {
            console.log("some error occured:"+err); 
            ret.message= "some error occured" ; 
        }
        else{
            console.log(files);
            ret.data=files;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});


router.post("/academic_file_create", (req, res, next) => {
    let ownerId=req.user._id;
    let batch=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    console.log(batch);
    let f=new AcademicFiles(batch);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
        }
        else {
            console.log("no error occured");
            ret.message="done";
            ret.status="success";
        }
        res.status(200).json(ret);
    });
});

router.post("/official_file_create", (req, res, next) => {
    let ownerId=req.user._id;
    let file=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    console.log(batch);
    let f=new OfficialFiles(file);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
        }
        else {
            console.log("no error occured");
            ret.message="done";
            ret.status="success";
        }
        res.status(200).json(ret);
    });
});


router.post("/academic_file_edit/:file_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let file=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    try{
        await AcademicFiles.updateOne({_id:fileId},{$set:file});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/official_file_edit/:file_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let file=req.body;
    let permission = "official_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    try{
        await OfficialFiles.updateOne({_id:fileId},{$set:file});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/official_file_delete/:file_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    try{
        await OfficialFiles.deleteOne({_id:fileId});    
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
              ret.message= "some error occured";
    }
    res.status(200).json(ret);
});

router.post("/academic_file_delete/:file_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    try{
        await AcademicFiles.deleteOne({_id:fileId});    
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
              ret.message= "some error occured";
    }
    res.status(200).json(ret);
});



router.get("/academic_file_subjects/:batch_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    ret.message="Server Problem";
    let subjects = await AcademicFiles.batchFilesSubjects(batchId);
    if(subjects){
        ret.status = "success";
        ret.data = subjects;
    }
    res.status(200).json(ret);
});

router.get("/academic_subject_chapters/:batch_id/:subject_id",async (req, res, next) => {
    // let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let subjectId = req.params.subject_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    ret.message="Server Problem";
    let chapters = await AcademicFiles.filesSubjectChapters(batchId,subjectId);
    if(chapters){
        ret.status = "success";
        ret.data = chapters;
    }
    res.status(200).json(ret);
});

router.get("/academic_files_specific/:batch_id/:subject_id/:chapter_id",async (req, res, next) => {
    // let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let subjectId = req.params.subject_id;
    let chapterId = req.params.chapter_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let files = await AcademicFiles.getFiles(batchId,subjectId,chapterId);
    if(files){
        ret.status = "success";
        ret.data = files;
    }
    res.status(200).json(ret);
   
});

module.exports=router;