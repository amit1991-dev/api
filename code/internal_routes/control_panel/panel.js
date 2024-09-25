 const express = require("express");
const router = express.Router();

const Directories = require("../node_models/directories.js");
const Files = require("../node_models/files.js");

const Users = require("../node_models/users");
const Students = require("../node_models/students");
const Questions = require("../node_models/questions");
const Results = require("../node_models/results");
const {Topics,SubTopics,Chapters} = require("../node_models/academics");
const {Events,News} = require("../node_models/news_events");
const Notifications = require("../node_models/notifications");

const mongoose = require("mongoose");
// const passport = require("passport");


function checkForPermission(user,permission)
{
	if(user)
	{
		if(user.role =="admin")
		{
			return true;
		}
		else if(user.permissions.includes(permission))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

//staff functions for admin
router.get("/feed",async (req, res, next) => {
    let ret={message:"Sorry, feed not found.",status:"failed"};
    try{
        let news = await News.find({}).sort({timestamp:-1}).limit(10);
        let events = await News.find({}).sort({timestamp:-1}).limit(10);
        let data=[];
        news.map(function(obj){
            data.push({data:obj,timestamp:obj.timestamp,type:"news"});
        });
        events.map(function(obj){
            data.push({data:obj,timestamp:obj.timestamp,type:"event"});
        });
        console.log(data);
        ret.message="done";
        ret.status = "success";
        ret.data = data;
    }
    catch(err)
    {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/news/:id",async (req, res, next) => {
    let ret={message:"Sorry, feed not found.",status:"failed"};
    let id = req.params.id;
    try{
        let news = await News.find({_id:id});
        
        console.log(data);
        ret.message="done";
        ret.status = "success";
        ret.data=news;
    }
    catch(err)
    {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/event/:id",async (req, res, next) => {
    let ret={message:"Sorry, feed not found.",status:"failed"};
    let id = req.params.id;
    try{
        let events = await Events.find({_id:id});
        
        console.log(data);
        ret.message="done";
        ret.status = "success";
        ret.events=news;
    }
    catch(err)
    {
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.post("/event_create", async (req, res, next) => {
    let id=req.params.id;
    let event=req.body.event;
    let ret={message:"Some problem occured.",status:"failed"};

    try{
        let d=new Events(event);
        await d.save();
        ret.message="done";
        ret.status = "success";
        
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});


router.post("/news_create", async (req, res, next) => {
    let id=req.params.id;
    let news=req.body.news;
    let ret={message:"Some problem occured.",status:"failed"};

    try{
        let d=new News(news);
        await d.save();
        ret.message="done";
        ret.status = "success";
        
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});

router.post("/news_delete/:id", (req, res, next) => {


    let newsId = req.params.id;
    // console.log(req.user.role);

    // console.log(req.user.role);
    News.findOneAndDelete({_id:newsId},function(err,user){
        if (err)
        {
          console.log("some error occured:"+err);
          ret.message="some error occured";
        }
        else{
            ret.status="success";
            // ret.staff_removed=user;
            ret.message="removed successfully";
            // ret.user = req.user;
            // delete ret.user.password;    
        }
    res.status(200).json(ret);
    });
});

router.post("/event_delete/:id", (req, res, next) => {


    let eventId = req.params.id;
    // console.log(req.user.role);

    // console.log(req.user.role);
    Events.findOneAndDelete({_id:eventId},function(err,user){
        if (err)
        {
          console.log("some error occured:"+err);
          ret.message="some error occured";
        }
        else{
            ret.status="success";
            // ret.staff_removed=user;
            ret.message="removed successfully";
            // ret.user = req.user;
            // delete ret.user.password;    
        }
    res.status(200).json(ret);
    });
});




// //question functions for everyone
// router.post("/question_create", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let question=req.body;
//     question.owner = ownerId;

//     let permission = "question_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     question.id = await Questions.find().count()+1;
//     let f=new Questions(question);
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

// router.post("/question_delete/:questionId", (req, res, next) => {
//     // let ret={message:"",status:"failed"};
//     let questionId = req.params.questionId;

//     let permission = "question_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
// 	Questions.findOneAndDelete({_id:questionId},function(err,question){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.question_removed=question;
// 	            ret.message = "done";
	            
// 	        }
//             res.status(200).json(ret);
// 	    });
// });

// router.post("/question_edit/", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let question=req.body;
//     // question.owner = ownerId;

//     let permission = "question_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }


//     let questionId = question._id;
//     delete question._id;
//     delete question.__v;
//     var result = await Questions.replaceOne({_id:questionId},question);

//     if(result.ok == 1)
//     {
//         ret.status="success";
//         ret.message="";
//         ret.question_removed=question;

        
//     }
//     else
//     {
//         console.log(result);
//     }
//     res.status(200).json(ret);
       
// });



// router.get("/questions",(req, res, next) => {
//     let ownerId=req.user._id;
//     // let ret={message:"",status:"failed"};

//     let permission = "question_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     //this is base64
//     let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
//     	filterObj = filter;
//         // let filterJSON=Buffer.from(filter, 'base64').toString('ascii');
//         // filterObj = JSON.parse(filterJSON);
//     }

//     // let name=req.body.name;

//     Questions.find(filterObj,function(err,questions){
//         if (err)
//         {
//           console.log("some error occured:"+err); 
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=questions;
//             ret.status ="success";
//             ret.message = "done";
            
//         }
//         res.status(200).json(ret);
//     });

// });

// router.get("/question_get/:questionId",(req, res, next) => {
//     // let ownerId=req.user._id;
//     // let filter = req.query.filter;
//     let questionId = req.params.questionId;
//     // let name=req.body.name;
//     let permission = "question_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//      Questions.findById(questionId,function(err,question){
//         if (err)
//         {
//           console.log("some error occured:"+err); 
//           ret.message= "some error occured"; 
//         }
//         else{
//             ret.data=question;
//             ret.status ="success";
//             ret.message = "done";
//         }
//         res.status(200).json(ret);
//     });

// });

// //test functions for everyone
// router.post("/test_create", (req, res, next) => {
//     let ownerId=req.user._id;
//     let test=req.body;
//     test.owner=ownerId;

//     let permission = "test_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     //make sure to make subject is derived from on the questions submitted for the paper!
//     let f=new Test(test);
//     f.save((err)=>{
//         if (err) {
//            	console.log("error: "+err.message);
//             ret.message= "error: "+err.message;
            
//     }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.status(200).json(ret);
//     });
// });

// router.post("/test_edit/", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let test=req.body;
//     // question.owner = ownerId;

//     let permission = "question_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     let testId = test._id;
//     // delete test._id;
//     delete test.__v;
//     var result = await Tests.replaceOne({_id:testId},test);

//     if(result.ok == 1)
//     {
//         ret.status="success";
//         ret.message="done";
//         // ret.question_removed=test;

        
//     }
//     else
//     {
//         console.log(result);
//     }
//     res.status(200).json(ret);
       
// });

// router.post("/test_delete/:testId", (req, res, next) => {
//     let permission = "test_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     let testId = req.params.testId;
// 	Questions.findOneAndDelete({_id:testId},function(err,test){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.test_removed=test;
// 	            ret.message = "done";
// 	            // res.status(200).json(ret);
// 	        } 
//             res.status(200).json(ret);
// 	    });
// });



// router.get("/tests",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "test_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     //this is base64
//     let filter = req.query.filter;
//     let filterObj = {};
//     if(filter)
//     {
//         let filterJSON=Buffer.from(filter, 'base64').toString('ascii');
//         filterObj = JSON.parse(filterJSON);
//     }

//     // let name=req.body.name;

//     Test.find(filterObj,function(err,tests){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=tests;
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });

// router.get("/test_get/:testId",(req, res, next) => {
//     // let ownerId=req.user._id;
//     // let filter = req.query.filter;
//     // console.log("test get");
//     let testId = req.params.testId;
//     // let name=req.body.name;
//     let permission = "test_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//      Test.findById(testId,function(err,test){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=test;
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// //Topics api
// router.post("/topic_create/:chapterId", (req, res, next) => {
//     let ownerId=req.user._id;
//     let topic=req.body;
//     let chapterId = req.params.chapterId;
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     topic.chapter = chapterId;
//     let f=new Topics(topic);
//     f.save((err)=>{
//         if (err) {
//             ret.message= "some error occured";
//             console.log(err);
//     }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.status(200).json(ret);
//     });
// });
// router.post("/topic_edit/", (req, res, next) => {
//     let ownerId=req.user._id;
//     let topic=req.body;
//     // let chapterId = 
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     Topics.findOneAndUpdate({_id:topic._id},topic,function(err){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.message = "done";
// 	            // ret.chapter_removed=chapter;
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });

// router.post("/topic_delete/:topicId", (req, res, next) => {
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     let topicId = req.params.topicId;
// 	Topics.findOneAndDelete({_id:topicId},function(err,topic){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.topic_removed=topic;
// 	            ret.message = "done";
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });





// router.get("/topics/:chapterId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "academic_desk_read";


//     let chapterId = req.params.chapterId;

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     //this is base64
    
//     let filterObj = {chapter:chapterId};

//     Topics.find(filterObj,function(err,topics){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=topics;
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });

// router.get("/topic_get/:topicId",(req, res, next) => {
//     // let ownerId=req.user._id;
//     // let filter = req.query.filter;
//     let topicId = req.params.topicId;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     // let name=req.body.name;

//      Topics.findById(topicId,function(err,topic){
//         if (err)
//         {
//           console.log("some error occured:"+err); 
//           ret.message= "some error occured"; 
//         }
//         else{
//             ret.data=topic;
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// //Subtopic api
// router.post("/subtopic_create/:topicId", (req, res, next) => {
//     let ownerId=req.user._id;
//     let subtopic=req.body;
//     let topicId = req.params.topicId;
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     subtopic.topic=topicId;

//     let f=new SubTopics(subtopic);
//     f.save((err)=>{
//         if (err) {
//             ret.message= "some error occured";
//             console.log(err);
//     }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.status(200).json(ret);
//     });
// });

// router.post("/subtopic_edit/", (req, res, next) => {
//     let ownerId=req.user._id;
//     let subtopic=req.body;
//     // let chapterId = 
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     SubTopics.findOneAndUpdate({_id:subtopic._id},subtopic,function(err){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.message = "done";
// 	            // ret.chapter_removed=chapter;
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });

// router.post("/subtopic_delete/:subtopicId", (req, res, next) => {
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     let subtopicId = req.params.subtopicId;
// 	SubTopics.findOneAndDelete({_id:subtopicId},function(err,subtopic){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.subtopic_removed=subtopic;
// 	            ret.message = "done";
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });



// router.get("/subtopics/:topicId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let topicId = req.params.topicId;
//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     //this is base64
//     // let filter = req.query;
//     let filterObj = {topic:topicId};
   

//     // let name=req.body.name;

//     SubTopics.find(filterObj,function(err,subtopics){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=subtopics;
//             ret.message = "done";
//             ret.status ="success";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });

// router.get("/subtopic_get/:subtopicId",(req, res, next) => {
//     // let ownerId=req.user._id;
//     // let filter = req.query.filter;
//     let subtopicId = req.params.subtopicId;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     // let name=req.body.name;

//      SubTopics.findById(subtopicId).populate('topics').exec(function(err,chapter){
//         if (err)
//         {
//           console.log("some error occured:"+err); 
//           ret.message= "some error occured"; 
//         }
//         else{
//             ret.data=chapter;
//             ret.status ="success";
//             ret.message = "done";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// //Chapter api
// router.post("/chapter_create", (req, res, next) => {
//     let ownerId=req.user._id;
//     let chapter=req.body;
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     let f=new Chapters(chapter);
//     f.save((err)=>{
//         if (err) {
//             ret.message= "some error occured";
//             console.log(err);
//     }
//         else {
//             console.log("no error occured");
//             ret.message="done";
//             ret.status="success";
//             // ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.status(200).json(ret);
//     });
// });
// router.post("/chapter_edit/", (req, res, next) => {
//     let ownerId=req.user._id;
//     let chapter=req.body;
//     // let chapterId = 
//     // console.log(topic);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     Chapters.findOneAndUpdate({_id:chapter._id},chapter,function(err){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.message = "done";
// 	            // ret.chapter_removed=chapter;
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });


// router.post("/chapter_delete/:chapterId", (req, res, next) => {
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     let chapterId = req.params.chapterId;
// 	Chapters.findOneAndDelete({_id:chapterId},function(err,chapter){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.chapter_removed=chapter;
// 	            ret.message = "done";
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });



// router.get("/chapters",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     //this is base64
//    	let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
        
//         filterObj = filter
//     }
//     console.log(filterObj);

//     // let name=req.body.name;

//     Chapters.find(filterObj,function(err,chapters){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=chapters;
//             ret.status ="success";
//             ret.message = 'done';
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });

// router.get("/chapter_get/:chapterId",(req, res, next) => {
//     // let ownerId=req.user._id;
//     // let filter = req.query.filter;
//     let chapterId = req.params.chapterId;

//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     // let name=req.body.name;

//     Chapters.findById(chapterId).exec(function(err,chapter){
//         if (err)
//         {
//           console.log("some error occured:"+err); 
//           ret.message= "some error occured"; 
//         }
//         else{
//         	console.log(chapter);
//             ret.data=chapter;
//             ret.message = "done";
//             ret.status ="success";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// //Chapter api
// router.post("/category_create", (req, res, next) => {
//     let ownerId=req.user._id;
//     let category=req.body;
//     console.log(category);
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     let f=new Categories(category);
//     f.save((err)=>{
//         if (err) {
//             ret.message= "some error occured";
//             console.log(err);
//     }
//         else {
//             console.log("no error occured");
//             ret.message="Successfully created";
//             ret.status="success";
//             ret.id=f._id;
//             // res.redirect("/directories/"+req.params.directory);
//         }
//         res.status(200).json(ret);
//     });
// });

// router.post("/category_delete/:categoryId", (req, res, next) => {
//     let permission = "academic_desk_create";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     let categoryId = req.params.categoryId;
// 	Categories.findOneAndDelete({_id:categoryId},function(err,category){
// 	        if (err)
// 	        {
// 	          console.log("some error occured:"+err);  
//               ret.message= "some error occured";
// 	        }
// 	        else{
// 	            ret.status="success";
// 	            ret.category_removed=category;
// 	            ret.message = 'done';
// 	            // res.status(200).json(ret);
// 	        } 

//             res.status(200).json(ret);
// 	    });
// });



// router.get("/categories",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     Categories.find({},function(err,categories){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=categories;
//             ret.status ="success";
//             ret.message = 'done';
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// router.get("/students",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "student_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }

//     let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
//     	filterObj = filter;
//     }

//     Students.find(filterObj,function(err,students){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=students;
//             ret.status ="success";
//             ret.message = 'done';
            

//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// router.get("/student/:studentId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let studentId = req.params.studentId;
//     let permission = "student_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     Students.findById(studentId,async function(err,student){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
// 	    	ret.results= await Results.find({student_id:studentId}).populate('test_id');
// 	        ret.data=student;
// 	        ret.message= "done";
// 	        ret.status ="success";
// 	        console.log(ret);
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });

// });


// // router.get("/results/:studentId",(req, res, next) => {
// //     let ownerId=req.user._id;
// //     let studentId = req.params.studentId;
// //     let permission = "student_read";

// //     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
// //     if(!checkForPermission(req.user,permission))
// //     {
// //     	res.status(200).json(ret);
// //     }
// //     Results.find({student_id:studentId},function(err,results){
// //         if (err)
// //         {
// //           console.log("some error occured:"+err);  
// //           ret.message= "some error occured";
// //         }
// //         else{
// //             ret.data=results;
// //             ret.message= "done";
// //             ret.status ="success";
// //             // res.status(200).json(ret);
// //         } 
// //         res.status(200).json(ret);
// //     });
// // });

// router.get("/result/:resultId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let resultId = req.params.resultId;
//     let permission = "student_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     Results.findById(resultId,function(err,result){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=result;
//             ret.message= "done";
//             ret.status ="success";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });
// });

// router.post("/result_delete/:resultId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let resultId = req.params.resultId;
//     let permission = "student_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     Results.findOneAndDelete({_id:resultId},function(err){
//         if (err)
//         {
//           console.log("some error occured:"+err);
//           ret.message="some error occured";
//         }
//         else{
//             ret.status="success";
//             ret.message="removed successfully";
//         }
//     res.status(200).json(ret);
//     });
// });

module.exports=router;