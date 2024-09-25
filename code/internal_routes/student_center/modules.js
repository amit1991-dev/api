const express = require("express");
const router = express.Router();
const {Subjects,Modules, ModuleChapters} = require("../../databases/student_center/academics");

const Questions= require("../../databases/student_center/questions");

const {Batches} = require("../../databases/student_center/batches");
const Files = require("../../databases/system/files");
const questions = require("../../databases/student_center/questions");

function checkForPermission(){
    return true;
}

router.get("/",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let modules =  await Modules.find(query).populate(["subject"]);
        console.log(modules);
       ret.data=modules;
       ret.message = "done";
       ret.status ="success";
   
   }
   catch(err){
       console.log("some error occured:"+err); 
       ret.message= "some error occured" ; 
   }
   res.status(200).json(ret);
});

router.get("/single/:module_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let moduleId = req.params.module_id;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let module =  await Modules.findById(moduleId).populate([{path:"chapters",populate:['chapter']},"subject"]);
        // console.log(module);
       ret.data=module;
       ret.message = "done";
       ret.status ="success";
   
   }
   catch(err){
       console.log("some error occured:"+err); 
       ret.message= "some error occured" ; 
   }
   res.status(200).json(ret);
});

router.get("/subjects/:batch_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let batch = await Batches.findById(batchId).populate([{path:"modules"}]);
        let moduleSubjects = batch.modules.map(function(m){
            if(m.subject){
                console.log(m.subject);
                return m.subject.toString();
            }
            
        });
        let subjectIds = [...new Set(moduleSubjects.filter(m=>m!=null))];
        console.log(subjectIds);
        let subjects = [];

        for(var i in subjectIds){
            console.log(i);
            subjects.push(await Subjects.findById(subjectIds[i]));
        }
       ret.data=subjects;
       ret.message = "done";
       ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= "some error occured" ; 
    }
   res.status(200).json(ret);
});

router.get("/for_subject/:batch_id/:subject_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let batchId = req.params.batch_id;
    let subjectId = req.params.subject_id;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        // console.log("qwertyuiop");
        let batch = await Batches.findById(batchId).populate([{path:"modules",populate:['chapters']}]).lean();

        let batchModules = batch.modules;
        let relevantModules = [];

        for(var i in batchModules){
            // console.log("qwertyuiop");
            if(batchModules[i].subject == subjectId){
                // console.log("qwertyuiop");
                relevantModules.push(batchModules[i]);
            }
        }
        // let moduleChapter =  await ModuleChapters.find({subject:subjectId,module:moduleId});
        // console.log(moduleChapter);
        ret.data=relevantModules;
        ret.message = "done";
        ret.status ="success";
   
   }
   catch(err){
       console.log("some error occured:"+err); 
       ret.message= "some error occured" ; 
   }
   res.status(200).json(ret);
});



router.post("/module_create", async (req, res, next) => {
    let module=req.body;
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let m=new Modules(module);
        await m.save();
        ret.message="done";
        ret.status="success";
    }
    catch(err){
        ret.message=err.message;
        console.log(err);
    }
    res.status(200).json(ret);
});

router.post("/module_edit/:module_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let gModule=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    delete gModule.chapters;
    try{
        await Modules.updateOne({_id:moduleId},{$set:gModule});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/module_delete/:module_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    try{
        await Modules.deleteOne({_id:moduleId});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/module_add_chapter/:module_id/:module_chapter_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    let moduleChapterId = req.params.module_chapter_id;
    try{
        if(!(await Modules.exists({_id:moduleId}) && await ModuleChapters.exists({_id:moduleChapterId}))){
            console.log("m or mc not existing");
            throw {message:"module or module chapter not found, please check the Id provided."};
        }
        if(await Modules.addModuleChapter(moduleId,moduleChapterId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add lecture into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/module_remove_chapter/:module_id/:module_chapter_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    let moduleChapterId = req.params.module_chapter_id;
    try{
        if(await Modules.removeModuleChapter(moduleId,moduleChapterId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove Module Chapter from the Module"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

/////////////////////// Module Chapters ////////////////////////////
router.get("/module_chapter/:module_chapter_id", async (req, res, next) => {
    let moduleChapterId = req.params.module_chapter_id;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let mcs = await ModuleChapters.findById(moduleChapterId).populate(["level_1","level_2","level_3","chapter"]).lean();
        ret.data=mcs;
        ret.message = "done";
        ret.status ="success";
   }
   catch(err){
       console.log("some error occured:"+err); 
       ret.message= "some error occured" ; 
   }
   res.status(200).json(ret);
});


router.post("/module_chapter_create", async (req, res, next) => {
    let mc=req.body;
    // let batchId = req.params.batch_id;
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let f=new ModuleChapters(mc);
        await f.save();
        console.log("no error occured");
        ret.message="done";
        ret.status="success";
    }
    catch(err){
        ret.message= "some error occured";
        console.log(err);
    }
    res.status(200).json(ret);
});


router.post("/module_chapter_edit/:module_chapter_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let moduleChapter=req.body;
    delete moduleChapter.level_1;
    delete moduleChapter.level_2;
    delete moduleChapter.level_3;
    let moduleChapterId = req.params.module_chapter_id;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        await ModuleChapters.updateOne({_id:moduleChapterId},moduleChapter);
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log(err);  
        ret.message=err.message;
    }
    res.status(200).json(ret);
});

router.post("/module_chapter_delete/:module_chapter_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleChapterId = req.params.module_chapter_id;
    try{
        await ModuleChapters.deleteOne({_id:moduleChapterId});
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        console.log(err.message);
        ret.message = err.message;

    }
    res.status(200).json(ret);
});

router.get("/module_chapters",async (req, res, next) => {
    let ownerId=req.user._id;
    // let moduleId = req.params.module_id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let filter = req.query;
    let filterObj = {};
    if(filter)
    {
        filterObj = filter
    }
    try{
        let modulechapters = await ModuleChapters.find({}).populate(["chapter"]).sort({createdAt:-1}).lean();
        ret.data = modulechapters;
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        console.log(err.message);
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.post("/module_chapter_add_question/:module_chapter_id/:question_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let query = req.query;
    let level = req.body.level;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleChapterId = req.params.module_chapter_id;
    let questionId = req.params.question_id;
    try{
        if(!(await Questions.exists({_id:questionId}) && await ModuleChapters.exists({_id:moduleChapterId}))){
            throw {message:"Question not found, please check the Id provided."};
        }
        
        if(await ModuleChapters.addQuestion(moduleChapterId,questionId,level)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add Question into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});



router.post("/module_chapter_remove_question/:module_chapter_id/:question_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let level = req.query.level;
    let moduleChapterId = req.params.module_chapter_id;
    let questionId = req.params.question_id;
    try{
        if(await ModuleChapters.removeQuestion(moduleChapterId,questionId,level)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove Question from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

module.exports=router;