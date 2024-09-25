const express = require("express");
const router = express.Router();
const {Batches,Lectures,BatchSubject,BatchChapter} = require("../../databases/student_center/batches");
const {Modules, Subjects} = require("../../databases/student_center/academics");
const Tests = require("../../databases/student_center/tests");
const DppTests = require("../../databases/student_center/dpp_tests");
const Students = require("../../databases/student_center/students");
const Doubts = require("../../databases/student_center/doubts");
const Files = require("../../databases/system/files");
const {AcademicFiles,OfficialFiles} = require("../../databases/student_center/institute_files");
const { getLectureSubjects, getMouleSubjects,getFilesSubjects } = require("./_functions");
const Faculties = require("../../databases/student_center/faculties");
// const Questions = require("../../databases/student_center/questions");


function checkForPermission(){
    return true;
}
//Batches api

router.get("/",(req, res, next) => {
    let query = req.query;
    let role=req.user.role;
    console.log(role);
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    Batches.find(query).populate(["branch","stream","students","tests","lectures","files",'faculties']).exec(function(err,batches){
        if (err)
        {
            console.log("some error occured:"+err); 
            ret.message= "some error occured" ; 
        }
        else{
            console.log(batches);
            ret.data=batches;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});


router.get("/subjects/:batch_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    try{
        let batch = await Batches.findById(batchId);
        let subjects = await Subjects.find({streams:batch.stream});
        ret.data=subjects;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        ret.message= "some error occured";
    }
    res.status(200).json(ret);
});




router.post("/batch_create", async(req, res, next) => {
    let ownerId=req.user._id;
    let batch=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    console.log(batch);
    for (let i = 0; i < batch.batch_subjects.length; i++) {
        let newSubject = new BatchSubject(batch.batch_subjects[i]);
        let savedSubject = await newSubject.save();
        batch.batch_subjects[i] = savedSubject._id;
    }
    let f=new Batches(batch);
    await f.save((err)=>{
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


router.post("/batch_edit/:batch_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let batch=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let batch_id = req.params.batch_id;
    try{
        await Batches.updateOne({_id:batch_id},{$set:batch});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

// router.post("/batch_delete/:batch_id", (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         res.status(200).json(ret);
//     }
//     let batch_id = req.params.batch_id;
//     Batches.findOneAndDelete({_id:batch_id},function(err,batch){
//             if (err)
//             {
//               console.log("some error occured:"+err);  
//               ret.message= "some error occured";
//             }
//             else{
//                 ret.status="success";
//                 ret.batch=batch;
//                 ret.message = "done";
//             } 
//             res.status(200).json(ret);
//         });
// });

// router.post("/batch_delete/:batch_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         return res.status(200).json(ret);
//     }
//     let batch_id = req.params.batch_id;
//     try {
//         let batch = await Batches.findOne({ _id: batch_id });
//         if (!batch) {
//             ret.message = "Batch not found";
//             return res.status(200).json(ret);
//         }
//         await batch.remove();
//         ret.status="success";
//         ret.batch=batch;
//         ret.message = "done";
//         res.status(200).json(ret);
//     } catch(err) {
//         console.log("some error occured:"+err);  
//         ret.message= "some error occured";
//         res.status(200).json(ret);
//     }
// });

router.post("/batch_delete/:batch_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let batch_id = req.params.batch_id;
    try {
        let batch = await Batches.findOne({ _id: batch_id });
        if (!batch) {
            ret.message = "Batch not found";
            return res.status(200).json(ret);
        }

        // Delete associated BatchSubjects and BatchChapters
        let batchSubjects = await BatchSubject.find({ _id: { $in: batch.batch_subjects } });
        for(let batchSubject of batchSubjects) {
            await BatchChapter.deleteMany({ _id: { $in: batchSubject.chapters } });
            await BatchSubject.deleteOne({ _id: batchSubject._id });
        }

        await Batches.deleteOne({ _id: batch_id });

        ret.status="success";
        ret.batch=batch;
        ret.message = "done";
        res.status(200).json(ret);
    } catch(err) {
        console.log("some error occured:"+err);  
        ret.message= "some error occured";
        res.status(200).json(ret);
    }
});

router.get("/batches",(req, res, next) => {
    let ownerId=req.user._id;
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
    console.log(filterObj);
    Batches.find(filterObj).exec(function(err,batches){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=batches;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});

router.get("/batch_get/:batch_id",async (req, res, next) => {
    let batch_id = req.params.batch_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let batch = await Batches.findById(batch_id).populate([{path:"faculties",populate:['subject','stream']},"stream","branch","students",{path:"modules",populate:[{path:"subject"}]},{path:"files",populate:[{path:'file'},'subject','chapter']},{path:"lectures",populate:["subject","chapter",{path:"files",populate:['file','subject','chapter']}]},{path:"tests",select:{structure:0,questions:0}},{path: 'batch_subjects',populate: {path: 'subjectId'}},{path:"modules",populate:["chapters"]}]).lean();
        let doubts = await Doubts.find({batch:batch_id});
        batch.doubts = doubts;
        ret.status = "success";
        ret.message = 'done';
        ret.data = batch;

    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

// router.get("/batch_get_subject/:batch_id", async (req, res, next) => {
//     let batchId = req.params.batch_id;
//     let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
//     if (!checkForPermission(req.user, "academic_desk_read")) {
//         return res.status(200).json(ret);
//     }
//     try {
//         let batch = await Batches.findById(batchId).populate("batch_subjects").lean();
//         if (!batch) {
//             throw {message: "Batch not found, please check the Id provided."};
//         }
//         ret.status = "success";
//         ret.message = "done";
//         ret.data = batch.batch_subjects;
//     } catch (err) {
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

router.get("/batch_get_subject/:batch_id", async (req, res, next) => {
    let batchId = req.params.batch_id;
    let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
    if (!checkForPermission(req.user, "academic_desk_read")) {
        return res.status(200).json(ret);
    }
    try {
        let batch = await Batches.findById(batchId).populate({
            path: 'batch_subjects',
            populate: {
                path: 'subjectId'
            }
        }).lean();
        if (!batch) {
            throw {message: "Batch not found, please check the Id provided."};
        }
        ret.status = "success";
        ret.message = "done";
        ret.data = batch.batch_subjects;
    } catch (err) {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


// router.get("/subject_get_chapter/:batchSubjectId", async (req, res, next) => {
//     let subjectId = req.params.batchSubjectId;
//     let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
//     if (!checkForPermission(req.user, "academic_desk_read")) {
//         return res.status(200).json(ret);
//     }
//     try {
//         let subject = await BatchSubject.findById(subjectId).populate("chapters").lean();
//         if (!subject) {
//             throw {message: "Subject not found, please check the Id provided."};
//         }
//         ret.status = "success";
//         ret.message = "done";
//         ret.data = subject.chapters;
//     } catch (err) {
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

router.get("/subject_get_chapter/:subject_id", async (req, res, next) => {
    let subjectId = req.params.subject_id;
    let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
    if (!checkForPermission(req.user, "academic_desk_read")) {
        return res.status(200).json(ret);
    }
    try {
        let subject = await BatchSubject.findById(subjectId).populate({
            path: 'chapters',
            model: 'batch_chapters',
            populate: [
                // { path: 'lectures', model: 'lectures' },
                // { path: 'notes', model: 'notes' },
                // { path: 'files', model: 'files' },
                // { path: 'modules', model: 'pdf_modules' },
                { path: 'chapterId', model: 'chapters' }
            ]
        }).lean();
        if (!subject) {
            throw {message: "Subject not found, please check the Id provided."};
        }
        ret.status = "success";
        ret.message = "done";
        ret.data = subject.chapters;
    } catch (err) {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


// router.get("/chapter_get_content/:chapter_id", async (req, res, next) => {
//     let chapterId = req.params.chapter_id;
//     let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
//     if (!checkForPermission(req.user, "academic_desk_read")) {
//         return res.status(200).json(ret);
//     }
//     try {
//         // let chapter = await BatchChapter.findById(chapterId).populate(['lectures', 'notes', 'files', 'modules']).lean();
//         // let chapter = await BatchChapter.findById(chapterId).populate('lectures').lean();
//         let chapter = await BatchChapter.findById(chapterId).populate(['lectures', 'files' , 'module_files']).lean();
//         if (!chapter) {
//             throw {message: "Chapter not found, please check the Id provided."};
//         }
//         ret.status = "success";
//         ret.message = "done";
//         ret.data = chapter;
//     } catch (err) {
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });


router.get("/chapter_get_content/:chapter_id", async (req, res, next) => {
    let chapterId = req.params.chapter_id;
    let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
    if (!checkForPermission(req.user, "academic_desk_read")) {
        return res.status(200).json(ret);
    }
    try {
        let chapter = await BatchChapter.findById(chapterId)
            .populate([
                'lectures', 
                'dpp_tests',
                {
                    path: 'files',
                    populate: {
                        path: 'file',
                        model: 'files'
                    }
                },
                // {
                //     path: 'dpp_tests',
                //     populate: {
                //         path: 'file',
                //         model: 'files'
                //     }
                // },
                {
                    path: 'module_files',
                    populate: {
                        path: 'file',
                        model: 'files'
                    }
                }
            ]).lean();
        if (!chapter) {
            throw {message: "Chapter not found, please check the Id provided."};
        }
        ret.status = "success";
        ret.message = "done";
        ret.data = chapter;
    } catch (err) {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/subject_get_test/:batchSubjectId", async (req, res, next) => {
    
    let subjectId = req.params.batchSubjectId;
    let ret = {message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed"};
    if (!checkForPermission(req.user, "academic_desk_read")) {
        return res.status(200).json(ret);
    }
    try {
        let subject = await BatchSubject.findById(subjectId).populate('chapter_wise_tests').lean();
        if (!subject) {
            throw {message: "Subject not found, please check the Id provided."};
        }
        ret.status = "success";
        ret.message = "done";
        ret.data = {
            chapter_wise_tests: subject.chapter_wise_tests
        };
    } catch (err) {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.get("/student_batch/:batch_id",async (req, res, next) => {
    let batch_id = req.params.batch_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let batch = await Batches.findById(batch_id).populate(["stream","branch","students","modules",{path:"files",populate:[{path:'file'},'subject','chapter']},{path:"lectures",populate:[{path:"files",populate:['file','subject','chapter']}]},{path:"tests",select:{structure:0,questions:0}},{path:"modules",populate:["chapters"]}]);
        
        let lecture_subjects = await getLectureSubjects(batch_id);
        batch.lecture_subjects = lecture_subjects;

        let files_subjects = await getFilesSubjects(batch_id);
        batch.files_subjects=files_subjects;


        let module_subjects = await getMouleSubjects(batch_id);
        batch.module_subjects = module_subjects;
        
        ret.status = "success";
        ret.message = 'done';
        ret.data = batch;
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/student_batches/:student_id", async (req, res, next) => {
    let studentId = req.params.student_id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
        try{
    
            let batches = await Batches.find({students:studentId}).populate(['stream','branch']);
            ret.status = "success";
            ret.message = "done";
            // let batchesId = batches.map(b=>b._id);
            ret.data = batches;
        }
        catch(err){
            console.log("some error occured:"+err); 
            ret.message= err.message; 
        }
        
        res.status(200).json(ret);
});


router.get("/faculty_batches/:faculty_id", async (req, res, next) => {
    let studentId = req.params.faculty_id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
        try{
    
            let batches = await Batches.find({faculties:faculty_id}).populate(['stream','branch']);
            ret.status = "success";
            ret.message = "done";
            // let batchesId = batches.map(b=>b._id);
            ret.data = batches;
        }
        catch(err){
            console.log("some error occured:"+err); 
            ret.message= err.message; 
        }
        
        res.status(200).json(ret);
});

router.get("/student_batches_ids/:student_id", async (req, res, next) => {
    let studentId = req.params.student_id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
        try{
    
            let batches = await Batches.find({students:studentId});
            ret.status = "success";
            ret.message = "done";
            let batchesId = batches.map(b=>b._id);
            // consol.log(bacthesId);
            ret.data = batchesId;
        }
        catch(err){
            console.log("some error occured:"+err); 
            ret.message= err.message; 
        }
        
        res.status(200).json(ret);
});

router.get("/my_batches", async (req, res, next) => {

    let userId = req.user._id;
    let role = req.user.role;

    let filter = {};
    if(role=="user"){
        filter.students = userId;
    }
    else if(role == "faculty"){
        filter.faculties = userId;
    }
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    // Batches.find({students:studentId}).populate(["stream","students",{path:"tests"},"lectures","files"]).exec(function(err,batch){
        try{
    
            let batches = await Batches.find(filter).populate(["branch","stream","students","tests","lectures","files"]);
            ret.status = "success";
            ret.message = "done";
            // let batchesId = batches.map(b=>b._id);
            // consol.log(bacthesId);
            ret.data = batches;
        }
        catch(err){
            console.log("some error occured:"+err); 
            ret.message= err.message; 
        }
        
        res.status(200).json(ret);
});

router.get("/student_compatible/:student_id",async (req, res, next) => {
    let studentId = req.params.student_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let student = await Students.findById(studentId);
        let filter = {};
        if(student.stream){
            filter.stream=student.stream;
        }
        if(student.class_number){
            filter.class_number=student.class_number;
        }
        if(student.branch){
            filter.branch=student.branch;
        }

        let batches = await Batches.find(filter).populate(['stream',"branch"]);
        console.log(batches);
        ret.status = "success";
        ret.message = "done";
        ret.data = batches;
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message; 
    }
    
    res.status(200).json(ret);

});

//////// Lecture Routes ///////////
router.post("/lecture_create", async (req, res, next) => {
    let lecture=req.body;
    // let batchId = req.params.batch_id;
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        if(req.user.role =="faculty")
        {
            let faculty = await Faculties.findById(req.user._id);
            lecture.subject = faculty.subject;
        }
        //lecture should have timestamp subject name!
        let f=new Lectures(lecture);
        await f.save();
        //await Batches.addLecture(batchId,f._id);
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

router.post("/lecture_create_in_batch/:batch_id", async (req, res, next) => {
    let lecture=req.body;
    let batchId = req.params.batch_id;
    // let batchId = req.params.batch_id;
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        if(req.user.role =="faculty")
        {
            let faculty = await Faculties.findById(req.user._id);
            lecture.subject = faculty.subject;
        }
        //lecture should have timestamp subject name!
        lecture.faculties="-";
        lecture.description = "-";
        let f=new Lectures(lecture);
        await f.save();

        await Batches.addLecture(batchId,f._id);
        //await Batches.addLecture(batchId,f._id);
        console.log("no error occured");
        ret.message="done";
        ret.data = f._id;
        ret.status="success";
    }
    catch(err){
        ret.message= "some error occured";
        console.log(err);
    }
    res.status(200).json(ret);
});


router.post("/lecture_edit/:lecture_id", (req, res, next) => {
    let ownerId=req.user._id;
    let lecture=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lecture_id = req.params.lecture_id;
    Lectures.findOneAndUpdate({_id:lecture_id},lecture,function(err){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message="some error occured";
            }
            else{
                ret.status="success";
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});



router.post("/lecture_create_live_input/:lecture_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let lecture_live_link=req.body.youtube_live_link;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    if(await Lectures.createLiveInput(lectureId,lecture_live_link)){
        ret.status="success";
        ret.message = "done";
    }
    else{
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/lecture_start_live/:lecture_id", async (req, res, next) => {
    let ownerId=req.user._id;
    
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    if(await Lectures.enableLiveStreaming(lectureId)){
        ret.status="success";
        ret.message = "done";
    }
    else{
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});


router.post("/lecture_stop_live/:lecture_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let lecture=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    if(await Lectures.disableLiveStreaming(lectureId)){
        ret.status="success";
        ret.message = "done";
    }
    else{
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});



router.post("/lecture_terminate/:lecture_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let lecture=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    if(await Lectures.terminateClass(lectureId)){
        ret.status="success";
        ret.message = "done";
    }
    else{
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/lecture_check_live_status/:lecture_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let currentStatus=req.body.currentStatus;
    console.log(currentStatus);
    
    let lectureId = req.params.lecture_id;
    let matchResult=  await Lectures.matchStatus(lectureId,currentStatus);
    if(matchResult == 0){
        ret.status="success";
        ret.message = "done";
        ret.data = true;
    }
    else if(matchResult == 1){
        ret.status="success";
        ret.message = "done";
        ret.data = false;
    }
    else{
        ret.message = "Some Problem Occured";
        ret.data=false;
    }
    res.status(200).json(ret);
});



router.post("/lecture_delete/:lecture_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;

    try{
        await Lectures.deleteOne({_id:lectureId});
        // await Batches.removeLecture(batchId,lectureId);
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        console.log(err.message);
        ret.message = err.message;

    }
    res.status(200).json(ret);
    // Lectures.findOneAndDelete({_id:lecture_id},function(err,lecture){
    //         if (err)
    //         {
    //           console.log("some error occured:"+err);  
    //           ret.message= "some error occured";
    //         }
    //         else{
    //             ret.status="success";
    //             ret.lecture=lecture;
    //             ret.message = "done";
    //         } 
    //         res.status(200).json(ret);
    //     });
});

// router.get("/lectures",(req, res, next) => {
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
//     Lectures.find(filterObj).exec(function(err,lecturees){
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

router.get("/lectures",(req, res, next) => {
    let ownerId=req.user._id;
    let skip=req.query.skip || 0;
    let limit = req.query.limit || 50;
    let permission = "academic_desk_read";
    
    console.log(skip+"<-skip,limit-> "+limit);

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let filter = req.query;
    let filterObj = {};
    if(filter)
    {
        filterObj = filter;
        if(filterObj.skip)
        delete filterObj.skip;

        if(filterObj.limit)
        delete filterObj.limit;

    // }
    // console.log(filterObj);
    
        // if(filter.subject && filter.subject != "-")
        // {
        //     filterObj.subjects={$in:[filter.subject]};
        //     // filterObj.subjects = filter.subject;
        //     delete filterObj.subject;
        //     // delete filter.subject;
        // }
        // if(filter.question_type=="-")
        // {
        //     // filterObj.question_type = filter.question;
        //     delete filterObj.question_type;
        // }

        // if(filter.stream)
        // {
        //     filterObj.streams = filter.stream;
        //     delete filterObj.stream;
        // }

    }
    console.log(filterObj);
    Lectures.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,lecturees){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=lecturees;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});

router.get("/lecture_get/:lecture_id",(req, res, next) => {
    let lecture_id = req.params.lecture_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    Lectures.findById(lecture_id).populate(["subject","chapter",{path:"files",populate:['file','subject','chapter']}]).exec(function(err,lecture){
        if (err)
        {
            console.log("some error occured:"+err); 
            ret.message= "some error occured"; 
        }
        else{
            console.log(lecture);
            ret.data=lecture;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});


// For you tube live status change
router.post("/lecture_live_status/:lecture_id", async (req, res, next) => {
    let ownerId = req.user._id;
    let permission = "academic_desk_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    let lecture_id = req.params.lecture_id;

    try {
        // Find the lecture with the given ID
        let lecture = await Lectures.findById(lecture_id);

        // If the lecture's live_lecture status is true, set it to false
        if (lecture.live_lecture === true) {
            lecture.live_lecture = false;
            await lecture.save();

            ret.status = "success";
            ret.message = "Live lecture status successfully updated to false";
        } else {
            ret.message = "Live lecture status is already false";
        }
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.status(200).json(ret);
});

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

// router.post("/batch_add_lecture/:batch_id/:lecture_id", async (req, res, next) => {
//     let permission = "academic_desk_create";
//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//         return res.status(200).json(ret);
//     }
//     let lectureId = req.params.lecture_id;
//     let batchId = req.params.batch_id;
//     try{
//         let lecture = await Lectures.findById(lectureId);
//         if(!lecture){
//             throw {message:"Lecture not found, please check the Id provided."};
//         }
//         let batch = await Batches.findById(batchId).populate('batch_subjects');
     
//         if(!batch){
//             throw {message:"Batch not found, please check the Id provided."};
//         }
//         let subjectMatch = batch.batch_subjects.some(batch_subjects => batch_subjects.subjectId.toString() === lecture.subject.toString());
//         if(!subjectMatch){
//             throw {message:"Subject of lecture does not match with any subject in the batch"};
//         }
//         let chapter = await BatchChapter.findOne({chapterId: lecture.chapter});
//         if(chapter){
//             chapter.lectures.push(lectureId);
//             await chapter.save();
//         } else {
//             let newChapter = new BatchChapter({
//                 chapterId: lecture.chapter,
//                 lectures: [lectureId]
//             });
//             await newChapter.save();
//         }
//         ret.status = "success";
//         ret.message = "done";
//     }
//     catch(err){
//         ret.message = err.message;
//     }
//     res.status(200).json(ret);
// });

router.post("/batch_add_lecture/:batch_id/:lecture_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    let batchId = req.params.batch_id;
    try{
        let lecture = await Lectures.findById(lectureId);
        if(!lecture){
            throw {message:"Lecture not found, please check the Id provided."};
        }
        let batch = await Batches.findById(batchId).populate('batch_subjects');
        if(!batch){
            throw {message:"Batch not found, please check the Id provided."};
        }
        let subjectMatch = batch.batch_subjects.find(batch_subject => batch_subject.subjectId.toString() === lecture.subject.toString());
        if(!subjectMatch){
            throw {message:"Subject of lecture does not match with any subject in the batch"};
        }
        let chapter = await BatchChapter.findOne({chapterId: lecture.chapter});
        if(chapter){
            if (!chapter.lectures.includes(lectureId)) {
                chapter.lectures.push(lectureId);
                await chapter.save();
            }
        } else {
            let newChapter = new BatchChapter({
                chapterId: lecture.chapter,
                lectures: [lectureId]
            });
            await newChapter.save();
            chapter = newChapter;
        }
        // Add the chapter to the subject's chapters if it's not already there
        if (!subjectMatch.chapters.includes(chapter._id)) {
            subjectMatch.chapters.push(chapter._id);
            await subjectMatch.save();
        }
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.post("/batch_remove_lecture/:batch_id/:lecture_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let lectureId = req.params.lecture_id;
    let batchId = req.params.batch_id;
    try{
        if(await Batches.removeLecture(batchId,lectureId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove lecture from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});



router.post("/batch_add_test/:batch_id/:test_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let testId = req.params.test_id;
    let batchId = req.params.batch_id;
    try{
        if(!(await Tests.exists({_id:testId}))){
            throw {message:"Test not found, please check the Id provided."};
        }
        if(await Batches.addTest(batchId,testId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add test into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_remove_test/:batch_id/:test_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let testId = req.params.test_id;
    let batchId = req.params.batch_id;
    try{

        if(await Batches.removeTest(batchId,testId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove test from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_add_dpp_test/:batch_id/:dpp_testId", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let testId = req.params.dpp_testId;
    let batchId = req.params.batch_id;
    try{
        let test = await DppTests.findById(testId);
        if(!test){
            throw {message:"Test not found, please check the Id provided."};
        }
        let batch = await Batches.findById(batchId).populate('batch_subjects');
        if(!batch){
            throw {message:"Batch not found, please check the Id provided."};
        }
        let subjectMatch = batch.batch_subjects.find(batch_subject => batch_subject.subjectId.toString() === test.subject.toString());
        if(!subjectMatch){
            throw {message:"Subject of test does not match with any subject in the batch"};
        }
        let chapter = await BatchChapter.findOne({chapterId: test.chapter});
        if(chapter){
            if (!chapter.dpp_tests.includes(testId)) {
                chapter.dpp_tests.push(testId);
                await chapter.save();
            }
        } else {
            let newChapter = new BatchChapter({
                chapterId: test.chapter,
                dpp_tests: [testId]
            });
            await newChapter.save();
            chapter = newChapter;
        }
        // Add the chapter to the subject's chapters if it's not already there
        if (!subjectMatch.chapters.includes(chapter._id)) {
            subjectMatch.chapters.push(chapter._id);
            await subjectMatch.save();
        }
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_add_chapter_test/:batch_id/:chapter_wise_testId", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let testId = req.params.chapter_wise_testId;
    let batchId = req.params.batch_id;
    try{
        let test = await Tests.findById(testId);
        if(!test){
            throw {message:"Test not found, please check the Id provided."};
        }
        let batch = await Batches.findById(batchId).populate('batch_subjects');
        if(!batch){
            throw {message:"Batch not found, please check the Id provided."};
        }
        let subjectMatch = batch.batch_subjects.find(batch_subject => batch_subject.subjectId.toString() === test.subject.toString());
        if(!subjectMatch){
            throw {message:"Subject of test does not match with any subject in the batch"};
        }
        // Add the test to the subject's chapter-wise tests if it's not already there
        if (!subjectMatch.chapter_wise_tests.includes(testId)) {
            subjectMatch.chapter_wise_tests.push(testId);
            await subjectMatch.save();
        }
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_add_student/:batch_id/:student_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let studentId = req.params.student_id;
    let batchId = req.params.batch_id;
    try{
        if(!(await Students.exists({_id:studentId}))){
            throw {message:"Student not found, please check the Id provided."};
        }
        if(await Batches.addStudent(batchId,studentId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add student into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_remove_student/:batch_id/:student_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let studentId = req.params.student_id;
    let batchId = req.params.batch_id;
    try{
        if(await Batches.removeStudent(batchId,studentId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove student from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});



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

router.post("/batch_add_file/:batch_id/:fileId", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let fileId = req.params.fileId;
    let batchId = req.params.batch_id;
    try{
        let file = await AcademicFiles.findById(fileId);
        if(!file){
            throw {message:"File not found, please check the Id provided."};
        }
        let batch = await Batches.findById(batchId).populate('batch_subjects');
        if(!batch){
            throw {message:"Batch not found, please check the Id provided."};
        }
        let subjectMatch = batch.batch_subjects.find(batch_subject => batch_subject.subjectId.toString() === file.subject.toString());
        if(!subjectMatch){
            throw {message:"Subject of file does not match with any subject in the batch"};
        }
        let chapter = await BatchChapter.findOne({chapterId: file.chapter});
        if(chapter){
            if (!chapter.files.includes(fileId)) {
                chapter.files.push(fileId);
                await chapter.save();
            }
        } else {
            let newChapter = new BatchChapter({
                chapterId: file.chapter,
                files: [fileId]
            });
            await newChapter.save();
            chapter = newChapter;
        }
        // Add the chapter to the subject's chapters if it's not already there
        if (!subjectMatch.chapters.includes(chapter._id)) {
            subjectMatch.chapters.push(chapter._id);
            await subjectMatch.save();
        }
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_remove_file/:batch_id/:file_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    let batchId = req.params.batch_id;
    try{
        
        if(await Batches.removeFile(batchId,fileId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove file from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_add_module_file/:batch_id/:module_fileId", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        return res.status(200).json(ret);
    }
    let module_fileId = req.params.module_fileId;
    let batchId = req.params.batch_id;
    try{
        let file = await AcademicFiles.findById(module_fileId);
        if(!file){
            throw {message:"File not found, please check the Id provided."};
        }
        let batch = await Batches.findById(batchId).populate('batch_subjects');
        if(!batch){
            throw {message:"Batch not found, please check the Id provided."};
        }
        let subjectMatch = batch.batch_subjects.find(batch_subjects => batch_subjects.subjectId.toString() === file.subject.toString());
        if(!subjectMatch){
            throw {message:"Subject of file does not match with any module in the batch"};
        }
        let chapter = await BatchChapter.findOne({chapterId: file.chapter});
        if(chapter){
            if (!chapter.module_files.includes(module_fileId)) {
                chapter.module_files.push(module_fileId);
                await chapter.save();
            }
        } else {
            let newChapter = new BatchChapter({
                chapterId: file.chapter,
                module_files: [module_fileId]
            });
            await newChapter.save();
            chapter = newChapter;
        }
         // Add the chapter to the subject's chapters if it's not already there
         if (!subjectMatch.chapters.includes(chapter._id)) {
            subjectMatch.chapters.push(chapter._id);
            await subjectMatch.save();
        }
        ret.status = "success";
        ret.message = "done";
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.post("/batch_add_module/:batch_id/:module_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    let batchId = req.params.batch_id;
    try{
        if(!(await Modules.exists({_id:moduleId}))){
            throw {message:"Module not found, please check the Id provided."};
        }
        if(await Batches.addModule(batchId,moduleId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add file into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_remove_module/:batch_id/:module_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let moduleId = req.params.module_id;
    let batchId = req.params.batch_id;
    try{
        
        if(await Batches.removeModule(batchId,moduleId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove file from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.post("/batch_add_faculty/:batch_id/:faculty_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let facultyId = req.params.faculty_id;
    let batchId = req.params.batch_id;
    try{
        if(!(await Faculties.exists({_id:facultyId}))){
            throw {message:"Student not found, please check the Id provided."};
        }
        if(await Batches.addFaculty(batchId,facultyId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add student into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/batch_remove_faculty/:batch_id/:faculty_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let facultyId = req.params.faculty_id;
    let batchId = req.params.batch_id;
    try{
        if(await Batches.removeFaculty(batchId,facultyId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove student from the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});




router.post("/lecture_add_file/:lecture_id/:file_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let fileId = req.params.file_id;
    let lectureId = req.params.lecture_id;
    try{
        if(!(await AcademicFiles.exists({_id:fileId}))){
            throw {message:"File not found, please check the Id provided."};
        }
        if(await Lectures.addFile(lectureId,fileId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not add file into the batch"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/lecture_remove_file/:lecture_id/:file_id", async (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    ret.message="Server Problem";
    let fileId = req.params.file_id;
    let lectureId = req.params.lecture_id;
    try{
        if(await Lectures.removeFile(lectureId,fileId)){
            ret.status = "success";
            ret.message = "done";
        }
        else{
            throw {message:"Could not remove file from the lecture"};
        }
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});


router.get("/lecture_subjects/:batch_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let batchId = req.params.batch_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    ret.message="Server Problem";
    let subjects = await Lectures.batchLectureSubjects(batchId);
    if(subjects){
        ret.status = "success";
        ret.data = subjects;
    }
    res.status(200).json(ret);
});

router.get("/lecture_subject_chapters/:batch_id/:subject_id",async (req, res, next) => {
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
    let chapters = await Lectures.lectureSubjectChapters(batchId,subjectId);
    if(chapters){
        ret.status = "success";
        ret.data = chapters;
    }
    res.status(200).json(ret);
});

router.get("/lectures_specific/:batch_id/:subject_id/:chapter_id",async (req, res, next) => {
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
    let lectures = await Lectures.getSpecificLectures(batchId,subjectId,chapterId);
    if(lectures){
        ret.status = "success";
        ret.data = lectures;
    }
    res.status(200).json(ret);
   
});

module.exports=router;