const express = require('express');
const router = express.Router();
// const { PromotionalBanners, PromotionalBatches, PromotionalCourses, PromotionalOurPrograms } = require('../../databases/student_center/promotion');
const { PromotionalBanners , SelectedBanners , PromotionalBatches , SelectedBatches , PromotionalCourses , SelectedCourses , PromotionalPrograms , SelectedPrograms , PromotionalTestimonials , SelectedTestimonials , PromotionalTeams , SelectedTeams , PromotionalGalleries , SelectedGalleries , PromotionalTestSeriess , SelectedTestSeriess } = require('../../databases/student_center/promotion');


// const {Batches,Lectures} = require("../../databases/student_center/batches");
// const {Modules, Subjects} = require("../../databases/student_center/academics");
// const Tests = require("../../databases/student_center/tests");
// const Students = require("../../databases/student_center/students");
// const Doubts = require("../../databases/student_center/doubts");
// const Files = require("../../databases/system/files");
// const {AcademicFiles,OfficialFiles} = require("../../databases/student_center/institute_files");
// const { getLectureSubjects, getMouleSubjects,getFilesSubjects } = require("./_functions");
// const Faculties = require("../../databases/student_center/faculties");
// const Questions = require("../../databases/student_center/questions");

// const {PromotionalBanner} = require("../../databases/student_center/batches");


function checkForPermission(){
    return true;
}
//Pomotional api

router.post("/banner_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let banner=req.body;
    banner.owner = ownerId;

    let permission = "banner_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalBanners(banner);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/banner_delete/:bannerId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let bannerId = req.params.bannerId;

    let permission = "banner_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalBanners.findOneAndDelete({_id:bannerId},function(err,banner){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.banner_removed=banner;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/banner_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let banner=req.body;

    console.log("======Banner--");
    console.log(banner);
    let permission = "banner_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let bannerId = banner._id;
    try{
        console.log(banner);
        await PromotionalBanners.updateOne({_id:bannerId},{$set:banner});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/banners",(req, res, next) => {
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
    PromotionalBanners.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,banners){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=banners;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/banner_get/:bannerId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let bannerId = req.params.bannerId;
    // let name=req.body.name;
    let permission = "banner_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalBanners.findById(bannerId).exec(function(err,banner){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=banner;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedBanners", async (req, res, next) => {
    let ownerId = req.user._id;
    let banners = req.body;
    banners.owner = ownerId;

    let permission = "banners_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedBanner = await SelectedBanners.findOne({ owner: ownerId });

        if (selectedBanner) {
            // If a document was found, update it
            selectedBanner.banners = banners.banners;
            await selectedBanner.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newBanner = new SelectedBanners(banners);
            await newBanner.save();
            ret.id = newBanner._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedBanners",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedBanners.find().populate('banners').exec(function(err,banners){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=banners;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


// selected Batches Routes

router.post("/batch_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let batch=req.body;
    batch.owner = ownerId;

    let permission = "batch_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalBatches(batch);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/batch_delete/:batchId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let batchId = req.params.batchId;

    let permission = "batch_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalBatches.findOneAndDelete({_id:batchId},function(err,batch){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.batch_removed=batch;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/batch_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let batch=req.body;

    console.log("======Batch--");
    console.log(batch);
    let permission = "batch_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let batchId = batch._id;
    try{
        console.log(batch);
        await PromotionalBatches.updateOne({_id:batchId},{$set:batch});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/batches",(req, res, next) => {
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
    PromotionalBatches.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,batches){
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


router.get("/batch_get/:batchId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let batchId = req.params.batchId;
    // let name=req.body.name;
    let permission = "batch_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalBatches.findById(batchId).exec(function(err,batch){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=batch;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedBatches", async (req, res, next) => {
    let ownerId = req.user._id;
    let batches = req.body;
    batches.owner = ownerId;

    let permission = "batches_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedBatch = await SelectedBatches.findOne({ owner: ownerId });

        if (selectedBatch) {
            // If a document was found, update it
            selectedBatch.batches = batches.batches;
            await selectedBatch.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newBatch = new SelectedBatches(batches);
            await newBatch.save();
            ret.id = newBatch._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedBatches",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedBatches.find().populate('batches').exec(function(err,batches){
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


// selected Courses Routes

router.post("/course_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let course=req.body;
    course.owner = ownerId;

    let permission = "course_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalCourses(course);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/course_delete/:courseId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let courseId = req.params.courseId;

    let permission = "course_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalCourses.findOneAndDelete({_id:courseId},function(err,course){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.course_removed=course;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/course_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let course=req.body;

    console.log("======Course--");
    console.log(course);
    let permission = "course_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let courseId = course._id;
    try{
        console.log(course);
        await PromotionalCourses.updateOne({_id:courseId},{$set:course});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/courses",(req, res, next) => {
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
    PromotionalCourses.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,courses){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=courses;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/course_get/:courseId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let courseId = req.params.courseId;
    // let name=req.body.name;
    let permission = "course_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalCourses.findById(courseId).exec(function(err,course){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=course;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedCourses", async (req, res, next) => {
    let ownerId = req.user._id;
    let courses = req.body;
    courses.owner = ownerId;

    let permission = "courses_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedCourse = await SelectedCourses.findOne({ owner: ownerId });

        if (selectedCourse) {
            // If a document was found, update it
            selectedCourse.courses = courses.courses;
            await selectedCourse.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newCourse = new SelectedCourses(courses);
            await newCourse.save();
            ret.id = newCourse._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedCourses",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedCourses.find().populate('courses').exec(function(err,courses){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=courses;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


// selected Programs Routes

router.post("/program_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let program=req.body;
    program.owner = ownerId;

    let permission = "program_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalPrograms(program);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/program_delete/:programId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let programId = req.params.programId;

    let permission = "program_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalPrograms.findOneAndDelete({_id:programId},function(err,program){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.program_removed=program;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/program_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let program=req.body;

    console.log("======Program--");
    console.log(program);
    let permission = "program_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let programId = program._id;
    try{
        console.log(program);
        await PromotionalPrograms.updateOne({_id:programId},{$set:program});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/programs",(req, res, next) => {
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
    PromotionalPrograms.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,programs){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=programs;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/program_get/:programId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let programId = req.params.programId;
    // let name=req.body.name;
    let permission = "program_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalPrograms.findById(programId).exec(function(err,program){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=program;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedPrograms", async (req, res, next) => {
    let ownerId = req.user._id;
    let programs = req.body;
    programs.owner = ownerId;

    let permission = "programs_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedProgram = await SelectedPrograms.findOne({ owner: ownerId });

        if (selectedProgram) {
            // If a document was found, update it
            selectedProgram.programs = programs.programs;
            await selectedProgram.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newProgram = new SelectedPrograms(programs);
            await newProgram.save();
            ret.id = newProgram._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedPrograms",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedPrograms.find().populate('programs').exec(function(err,programs){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=programs;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


// selected Testimonials Routes

router.post("/testimonial_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let testimonial=req.body;
    testimonial.owner = ownerId;

    let permission = "testimonial_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalTestimonials(testimonial);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/testimonial_delete/:testimonialId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let testimonialId = req.params.testimonialId;

    let permission = "testimonial_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalTestimonials.findOneAndDelete({_id:testimonialId},function(err,testimonial){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.testimonial_removed=testimonial;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/testimonial_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let testimonial=req.body;

    console.log("======Testimonial--");
    console.log(testimonial);
    let permission = "testimonial_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let testimonialId = testimonial._id;
    try{
        console.log(testimonial);
        await PromotionalTestimonials.updateOne({_id:testimonialId},{$set:testimonial});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/testimonials",(req, res, next) => {
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
    PromotionalTestimonials.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,testimonials){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=testimonials;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/testimonial_get/:testimonialId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let testimonialId = req.params.testimonialId;
    // let name=req.body.name;
    let permission = "testimonial_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalTestimonials.findById(testimonialId).exec(function(err,testimonial){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=testimonial;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedTestimonials", async (req, res, next) => {
    let ownerId = req.user._id;
    let testimonials = req.body;
    testimonials.owner = ownerId;

    let permission = "testimonials_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedTestimonial = await SelectedTestimonials.findOne({ owner: ownerId });

        if (selectedTestimonial) {
            // If a document was found, update it
            selectedTestimonial.testimonials = testimonials.testimonials;
            await selectedTestimonial.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newTestimonial = new SelectedTestimonials(testimonials);
            await newTestimonial.save();
            ret.id = newTestimonial._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedTestimonials",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedTestimonials.find().populate('testimonials').exec(function(err,testimonials){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=testimonials;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});

// selected Teams Routes

router.post("/team_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let team=req.body;
    team.owner = ownerId;

    let permission = "team_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalTeams(team);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/team_delete/:teamId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let teamId = req.params.teamId;

    let permission = "team_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalTeams.findOneAndDelete({_id:teamId},function(err,team){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.team_removed=team;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/team_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let team=req.body;

    console.log("======Team--");
    console.log(team);
    let permission = "team_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let teamId = team._id;
    try{
        console.log(team);
        await PromotionalTeams.updateOne({_id:teamId},{$set:team});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/teams",(req, res, next) => {
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
    PromotionalTeams.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,teams){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=teams;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/team_get/:teamId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let teamId = req.params.teamId;
    // let name=req.body.name;
    let permission = "team_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalTeams.findById(teamId).exec(function(err,team){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=team;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedTeams", async (req, res, next) => {
    let ownerId = req.user._id;
    let teams = req.body;
    teams.owner = ownerId;

    let permission = "teams_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedTeam = await SelectedTeams.findOne({ owner: ownerId });

        if (selectedTeam) {
            // If a document was found, update it
            selectedTeam.teams = teams.teams;
            await selectedTeam.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newTeam = new SelectedTeams(teams);
            await newTeam.save();
            ret.id = newTeam._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedTeams",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedTeams.find().populate('teams').exec(function(err,teams){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=teams;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


// selected Galleries Routes

router.post("/gallery_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let gallery=req.body;
    gallery.owner = ownerId;

    let permission = "gallery_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalGalleries(gallery);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/gallery_delete/:galleryId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let galleryId = req.params.galleryId;

    let permission = "gallery_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalGalleries.findOneAndDelete({_id:galleryId},function(err,gallery){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.gallery_removed=gallery;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/gallery_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let gallery=req.body;

    console.log("======Gallery--");
    console.log(gallery);
    let permission = "gallery_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let galleryId = gallery._id;
    try{
        console.log(gallery);
        await PromotionalGalleries.updateOne({_id:galleryId},{$set:gallery});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/galleries",(req, res, next) => {
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
    PromotionalGalleries.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,galleries){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=galleries;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/gallery_get/:galleryId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let galleryId = req.params.galleryId;
    // let name=req.body.name;
    let permission = "gallery_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalGalleries.findById(galleryId).exec(function(err,gallery){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=gallery;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedGalleries", async (req, res, next) => {
    let ownerId = req.user._id;
    let galleries = req.body;
    galleries.owner = ownerId;

    let permission = "galleries_create";

    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }

    try {
        // Find a SelectedBanners document with the ownerId
        let selectedGallery = await SelectedGalleries.findOne({ owner: ownerId });

        if (selectedGallery) {
            // If a document was found, update it
            selectedGallery.galleries = galleries.galleries;
            await selectedGallery.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newGallery = new SelectedGalleries(galleries);
            await newGallery.save();
            ret.id = newGallery._id;
            ret.message = "Successfully created";
        }

        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }

    res.json(ret);
});

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId = req.user._id;
//     let banners = req.body.banners; // assuming banners is an array
//     let updateData = { banners: banners };

//     let permission = "banners_create";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         res.status(200).json(ret);
//         return;
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         let result = await SelectedBanners.updateMany({}, { $set: updateData });

//         // If no documents were updated, create a new one
//         if (result.nModified === 0) {
//             let newBanner = new SelectedBanners(updateData);
//             await newBanner.save();
//             ret.id = newBanner._id;
//         }

//         ret.message = "Successfully updated";
//         ret.status = "success";
//     } catch (err) {
//         console.log("error: " + err);
//         ret.message = "error: " + err;
//     }

//     res.json(ret);
// });

router.get("/selectedGalleries",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedGalleries.find().populate('galleries').exec(function(err,galleries){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=galleries;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


// selected TestSeriess Routes

router.post("/testseries_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let testseries=req.body;
    testseries.owner = ownerId;

    let permission = "testseries_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // question.id = await Questions.find().count()+1;
    let f=new PromotionalTestSeriess(testseries);
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
            }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});





router.post("/testseries_delete/:testseriesId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let testseriesId = req.params.testseriesId;

    let permission = "testseries_delete";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	PromotionalTestSeriess.findOneAndDelete({_id:testseriesId},function(err,testseries){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.testseries_removed=testseries;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/testseries_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let testseries=req.body;

    console.log("======TestSeries--");
    console.log(testseries);
    let permission = "testseries_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let testseriesId = testseries._id;
    try{
        console.log(testseries);
        await PromotionalTestSeriess.updateOne({_id:testseriesId},{$set:testseries});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/testseriess",(req, res, next) => {
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
    PromotionalTestSeriess.find(filterObj).sort({timestamp:-1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err,testseriess){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=testseriess;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});


router.get("/testseries_get/:testseriesId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let testseriesId = req.params.testseriesId;
    // let name=req.body.name;
    let permission = "testseries_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    PromotionalTestSeriess.findById(testseriesId).exec(function(err,testseries){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=testseries;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });

});

// router.post("/selectedBanners", async (req, res, next) => {
//     let bannerIds = req.body;
//     let permission = "academic_desk_write";

//     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
//     if (!checkForPermission(req.user, permission)) {
//         return res.status(200).json(ret);
//     }

//     try {
//         // Update all SelectedBanners documents with the new banners
//         await SelectedBanners.updateMany({}, { banners: bannerIds });

//         // Retrieve all updated documents
//         let selectedBanners = await SelectedBanners.find({});

//         ret.data = selectedBanners;
//         ret.message = "done";
//         ret.status = "success";
//     } catch (err) {
//         console.log("some error occurred:" + err);
//         ret.message = "some error occurred";
//     }

//     res.status(200).json(ret);
// });

// router.post("/selectedBanners", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let banners=req.body;
//     banners.owner = ownerId;

//     let permission = "banners_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     // question.id = await SelectedBanners.find().count()+1;
//     let f=new SelectedBanners(banners);
//     f.save((err)=>{
//         if (err) {
//             ret.message="error: "+err;
            
//             }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.json(ret);
//     });
// });

router.post("/selectedTestSeriess", async (req, res, next) => {
    let ownerId = req.user._id;
    let testseriess = req.body;
    testseriess.owner = ownerId;
  
    let permission = "testseriess_create";
  
    let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
    if (!checkForPermission(req.user, permission)) {
        res.status(200).json(ret);
        return;
    }
  
    try {
        // Find a SelectedBanners document with the ownerId
        let selectedTestSeries = await SelectedTestSeriess.findOne({ owner: ownerId });
  
        if (selectedTestSeries) {
            // If a document was found, update it
            selectedTestSeries.testseriess = testseriess.testseriess;
            await selectedTestSeries.save();
            ret.message = "Successfully updated";
        } else {
            // If no document was found, create a new one
            let newTestSeries = new SelectedTestSeriess(testseriess);
            await newTestSeries.save();
            ret.id = newTestSeries._id;
            ret.message = "Successfully created";
        }
  
        ret.status = "success";
    } catch (err) {
        console.log("error: " + err);
        ret.message = "error: " + err;
    }
  
    res.json(ret);
  });
  
  // router.post("/selectedBanners", async (req, res, next) => {
  //     let ownerId = req.user._id;
  //     let banners = req.body.banners; // assuming banners is an array
  //     let updateData = { banners: banners };
  
  //     let permission = "banners_create";
  
  //     let ret = { message: "Sorry you are not allowed to perform this task, permission denied.", status: "failed" };
  //     if (!checkForPermission(req.user, permission)) {
  //         res.status(200).json(ret);
  //         return;
  //     }
  
  //     try {
  //         // Update all SelectedBanners documents with the new banners
  //         let result = await SelectedBanners.updateMany({}, { $set: updateData });
  
  //         // If no documents were updated, create a new one
  //         if (result.nModified === 0) {
  //             let newBanner = new SelectedBanners(updateData);
  //             await newBanner.save();
  //             ret.id = newBanner._id;
  //         }
  
  //         ret.message = "Successfully updated";
  //         ret.status = "success";
  //     } catch (err) {
  //         console.log("error: " + err);
  //         ret.message = "error: " + err;
  //     }
  
  //     res.json(ret);
  // });
  
  router.get("/selectedTestSeriess",(req, res, next) => {
    // let ownerId=req.user._id;
    let permission = "academic_desk_read";
    
  
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    
    SelectedTestSeriess.find().populate('testseriess').exec(function(err,testseriess){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=testseriess;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
  });



module.exports=router;