const express = require("express");
const router = express.Router();
const Exams = require("../../databases/student_center/exams");
const Questions = require("../../databases/student_center/questions");
const {Chapters,Subjects} = require("../../databases/student_center/academics");

function checkForPermission(){
    return true;
}

router.get("/",async function(req,res){
	let user = req.user._id;
	let role = req.user.role;
	let query = req.query;
	let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

	try{
		let exams = await Exams.find(query);
		ret.message = "done";
		ret.status = "success";
		ret.data = exams;

	}
	catch(err){
		ret.message = err.message;
		
	}

	res.status(200).json(ret);
});

router.get("/questions/:exam_id",async function(req,res){
	let user = req.user._id;
	let role = req.user.role;
	let query = req.query;
	let examId = req.params.exam_id;
	let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

	try{
		let questions = await Questions.find({exam:examId});
		ret.message = "done";
		ret.status = "success";
		ret.data = questions;
	}
	catch(err){
		ret.message = err.message;
	}

	res.status(200).json(ret);
});

router.get("/single/:exam_id",async function(req,res){
	let user = req.user._id;
	let role = req.user.role;
	let examId = req.params.exam_id;
	// let query = req.query;
	let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

	try{
		let exam = await Exams.findById(examId).lean();
		let questions = await Questions.find({exam:examId}).lean();
		console.log(questions);
		exam.questions = questions;
		ret.message = "done";
		ret.status = "success";
		ret.data = exam;

	}
	catch(err){
		ret.message = err.message;
		
	}

	res.status(200).json(ret);
});



router.get("/exam_questions/:exam_id",async function(req,res){
	let user = req.user._id;
	let role = req.user.role;
	let query = req.query;
	let examId = req.params.exam_id;
	let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

	try{
		let questions = await Questions.find({exam:examId});
		ret.message = "done";
		ret.status = "success";
		ret.data = questions;

	}
	catch(err){
		ret.message = err.message;
		
	}

	res.status(200).json(ret);
});

router.get("/year_questions/:year",async function(req,res){
	let user = req.user._id;
	let role = req.user.role;
	let query = req.query;
	let year = req.params.year;
	let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

	try{
		
		let exams = await Exams.find({year},{_id:true});
		let questions = await Questions.find({exam:exams});
		ret.message = "done";
		ret.status = "success";
		ret.data = questions;
		ret.exams = exams;

	}
	catch(err){
		ret.message = err.message;
		
	}

	res.status(200).json(ret);
});


router.post("/create", async (req, res, next) => {
    let ownerId=req.user._id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
	let body = req.body;
    console.log(body);
    
    try{
        let exam=new Exams(body);
        console.log(exam);
		await exam.save();
        ret.status="success";
		ret.message="done";
		ret.data = exam._id;
    }
    catch(err)
    {
        ret.message = err.message;
    }
	res.status(200).json(ret);
});

router.post("/delete/:exam_id", async (req, res, next) => {
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
	let examId = req.params.exam_id;
    
    try{
        await Exams.deleteOne({_id:examId});
        ret.status="success";
		ret.message="done";
    }
    catch(err)
    {
        ret.message = err.message;
    }
	res.status(200).json(ret);
});


router.post("/update/:exam_id", async (req, res, next) => {
    let ownerId=req.user._id;
	let examId = req.params.exam_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
	let body = req.body;
    console.log(body);
    
    try{
		await Exams.updateOne({_id:examId},{$set:body});
        ret.status="success";
		ret.message="done";
		// ret.data = exam._id;
    }
    catch(err)
    {
        ret.message = err.message;
    }
	res.status(200).json(ret);
});



router.get("/previous_year_questions_subjects/:exam_id",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let examId = req.params.exam_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
	ret.message="Server Problem";
    try{
		let questions = await Questions.find({exam:examId}).lean();
		let subjectIds = questions.map(function(q){
			if(q.subject){
				console.log(q.subject);
				return q.subject.toString();
			}
			else if(q.subjects && q.subjects.length>0){
				console.log(q.subjects[0]);
				return q.subjects[0].toString();
			}
		});
		subjectIds = [...new Set(subjectIds.filter(s=>s!=null))];
		let subjects =[];
		for(var i in subjectIds ){
			subjects.push(await Subjects.findById(subjectIds[i]));
		}
		console.log("subjects");
		console.log(subjects);
		ret.status="success";
		ret.data = subjects;
	}
	catch(err){
		ret.message = err.message;
	}

    res.status(200).json(ret);
});

router.get("/previous_year_questions_subject_chapters/:exam_id/:subject_id",async (req, res, next) => {
    let permission = "academic_desk_read";
    let examId = req.params.exam_id;
    let subjectId = req.params.subject_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    ret.message="Server Problem";
    
    try{
		let questions = await Questions.find({exam:examId,subject:subjectId}).lean();
		let chapterIds = questions.map(function(q){
			if(q.chapter)
				return q.chapter.toString();
			else{
				return null;
			}
		});
		chapterIds = [...new Set(chapterIds.filter(c=>c!=null))];
		let chapters =[];
		for(var i in chapterIds ){
			console.log(chapterIds[i]);
			chapters.push(await Chapters.findById(chapterIds[i]));
		}
		console.log(chapters);
		ret.status="success";
		ret.data = chapters;
	}
	catch(err){
		ret.message = err.message;
	}

    res.status(200).json(ret);
});

router.get("/previous_year_questions_specific/:exam_id/:subject_id/:chapter_id",async (req, res, next) => {
    let permission = "academic_desk_read";
    let examId = req.params.exam_id;
    let subjectId = req.params.subject_id;
    let chapterId = req.params.chapter_id;
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
	ret.message="Server Problem";
	try{
		let questions = await Questions.find({exam:examId,subject:subjectId,chapter:chapterId}).lean();
		ret.data = questions;
		ret.status = "success";
	}
	catch(err){
		ret.message = err.message;
	}
    res.status(200).json(ret);
});

module.exports=router;
