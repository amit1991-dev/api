const express = require("express");
const router = express.Router();
const Directories = require("../../node_models/directories.js");
const Files = require("../../node_models/files.js");

const Student = require("../../node_models/students");

const Questions = require("../../node_models/questions");
const Results = require("../../node_models/results");
const {Topics,SubTopics,Chapters,Categories} = require("../../node_models/academics");
const Test = require("../../node_models/tests");
const mongoose = require("mongoose");
// const passport = require("passport");

//use this validation to get student object in the req object as user!
function performValidation(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("jwt_student", { session: false },/*callback=>*/function(err, user, info) {
        // console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log(info);
            return res.status(400).json({ status:"failed",message:info.message });
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            // console.log("done authenticate");
            // const { password, updated_at,created_at,email_is_verified, ...other } = user._doc;
            return res.status(200).json({ status:"success",message: `logged in ${user.id}`,user_id:user.id,user:user});
        });
    })(req, res, next);
}

// pending tasks
// 3. submit test. => calculate results
// 6. start a single test => mark test done, show results next time the user clicks on the button

//1. tests
router.get("/tests/",async (req, res, next) => {
    let ret={message:"",status:"failed"};

    //this is base64
    let stream  = req.user.stream;
    let test_type = req.query.test_type;
    let category = req.query.category;
    let subject = req.query.subject;
    // let test_type = req.query.test_type;
    let filterObj = {stream};
    if(test_type && test_type!="all")
    {
    	filterObj.test_type=test_type;
    	
    }
    if(category && category!="all")
    {
        
        filterObj.category = category;
        
    }
    if(subject && subject!="all")
    {
        
        filterObj.subjects = subject;
    }
    // console.log(filterObj);

    Test.find(filterObj,async function(err,tests){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            // tests = tests.toObject();
            // console.log(1);
            for(var i =0; i < tests.length; i++ )
            {
                tests[i] = tests[i].toObject();
                // console.log(2);
                const resultExists = await Results.exists({ test_id: tests[i]._id,student_id:req.user._id });
                if(resultExists)
                {
                    // console.log(3);

                    tests[i].submitted = true;
                    let result = await Results.findOne({test_id: tests[i]._id,student_id:req.user._id});

                    tests[i].result = result;
                    // console.log(tests);
                }
                else
                {
                    tests[i].submitted = false;
                }
            }
            ret.data=tests;
            // ret.data = ["A","B","C","D"];
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});



//2. test categories
router.get("/test_categories",(req, res, next) => {
    let ret={message:"No test type sent",status:"failed"};
    let stream  = req.user.stream;

    //this is base64
    let test_type = req.query.test_type;
    let filterObj = {stream};
    if(test_type && test_type!="all")
    {
    	filterObj.test_type=test_type;
    }
    // console.log(filterObj);
    

    Test.find(filterObj).distinct('category',function(err,categories){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            ret.data=categories;
            // ret.data = ['a','b','c','d'];
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});



//3. test category subjects
router.get("/test_category_subjects",(req, res, next) => {
    let ret={message:"No test type sent",status:"failed"};
    let stream  = req.user.stream;
    //this is base64
    let test_type = req.query.test_type;
    let category = req.query.category;
    let filterObj={stream};
    if(!(test_type && category))
    {
    	res.status(200).json(ret);
    	return;
    }
    if(category!="all")
    {
        filterObj.category = category;
    }
    if(test_type!="all")
    {
        filterObj.test_type = test_type;
    }
    console.log(filterObj);
    console.log("tcs check");

    Test.find(filterObj).distinct('subjects',function(err,subjects){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            // subjects.splice(0,0,"all");
            ret.data=subjects;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });
});



//3.5. test types for a given stream
router.get("/test_types",(req, res, next) => {
    let ret={message:"Some error occurred",status:"failed"};
    let stream  = req.user.stream;

    //this is base64
    
    let filterObj={stream};
    
    console.log("inside test types");
    

    Test.find(filterObj).distinct('test_types',function(err,types){
        if (err)
        {
          console.log("some error occurred:"+err);  
          // ret.message= "some error occurred";
        }
        else{
            ret.data=types;
            // ret.data=["hekllo","bello"];
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });
});


router.get("/question_get/:questionId",(req, res, next) => {
    console.log("inside question get");
    let ret={message:"Some error occurred",status:"failed"};
    let questionId = req.params.questionId;
    Questions.findById(questionId,function(err,question){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=question;
            ret.status ="success";
            ret.message = "done";
        }
        res.status(200).json(ret);
    });
});


//4. test result
router.get("/test_result/:testId",async (req, res, next) => {
    let ret={message:"No Test Id",status:"failed"};
    let studentId = req.user._id;
    let testId = req.params.testId;
    var test;
    let filterObj = {};
    if(testId && studentId)
    {
    	filterObj = {test_id:testId,student_id:studentId};
    	// filterObj.category = category;
    }
    else
    {
    	res.status(200).json(ret);
    	return;
    }
    console.log(filterObj);

    if(Tests.exists({_id:testId}))
    {
    	test = await Test.findById(testId);
    }
    else
    {
    	ret.message = "Test not found";
    	res.status(200).json(ret);
    	return;

    }
    

    
    Results.findOne(filterObj,function(err,result){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{ 
            if(result){
            	console.log(test.duration);
                result = result.toObject();
            	result.duration = test.duration;
                ret.data=result;
                ret.message = "done";
                ret.status ="success";
            }
            else{
                ret.message = "no result found";
            }
            
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });
});


//5. get single test
router.get("/test/:testId",(req, res, next) => {
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


    
    Test.findOne(filterObj).populate("questions",{solution:0,solution_image:0,correct_answer:0,topic:0,difficulty:0}).exec(function(err,test){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            ret.data=test;
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

//6. get single test with solutions and answers
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

//6. test result
router.post("/test_marking/:testId",async (req, res, next) => {
    let ret={message:"TestId missing",status:"failed"};
    let studentId = req.user._id;
    let testId = req.params.testId;
    let marking = req.body;
    let test;
    // array is the body

    let filterObj = {};
    if(testId)
    {
        const testExists = await Test.exists({ _id: testId });
        if(!testExists)
        {
            ret.message = "test not found";
            res.status(200).json(ret);
            return;
        }
        test = await Test.findOne({ _id: testId }).lean().populate("questions").exec();
        // console.log(test);
    }
    else
    {
        res.status(200).json(ret);
        return;
    }
    ///populate the marking object with marks obtained
    if(marking.length != test.questions.length)
    {
        ret.message = "number of questions dont match!";
        res.status(200).json(ret);
        return;
    }

    let total = 0,outOf=0;
    for(var i =0; i<marking.length; i++)
    {
        let qId = marking[i].question;
        let q = await Questions.findOne({_id:qId});
        if(marking[i].attempted)
        {
            
            if(q.correct_answer == marking[i].answer_value)
            {
                marking[i].marks_obtained = q.positive_marks;
                marking[i].correctly_marked = true;
            }
            else
            {
                marking[i].marks_obtained = q.negative_marks?q.negative_marks:0;
                // marking[i].correctly_marked = false;
            }
            total += marking[i].marks_obtained;
            
        }
        else{
            marking[i].marks_obtained = 0;
            total += marking[i].marks_obtained;
        }
        marking[i].subject = q.subject;
        outOf += q.positive_marks;

    }
    // console.log(marking);
    ////population ends here
    // console.log(filterObj);
    let r = new Results({test_id:testId,student_id:studentId,marked:marking,total:total,max_marks:outOf});
    r.save(async function(err, doc) {
      if (err){
      	if(err.code == 11000)
      	{
      		ret.message = "test already submitted";
      	}
        else{
        	ret.message = "Cannot save result in the server, some error has occurred";
        }
        res.status(200).json(ret);
        return;
      }

      // //edit student collection to include submitted test

      // let student = await Student.findOne({ _id: studentId });
      // // console.log("student");
      // // console.log(student);
      // let ta = student.tests_attempted;
      // let taa=ta.filter((tao)=> tao.id == testId );
      // let tao = null;
      // //
      // for(var i = 0 ; i<ta.length;i++)
      // {
      //   if(ta[i].id == testId)
      //   {
      //       tao = ta[i];
      //   }
      // }
      // //
      
      // if(tao)
      // {
      	
      //     	ret.message = "Test already attempted";
      //     	ret.result_id = tao.result_id;
      //       ret.status = "failed";
      //       res.status(200).json(ret);
      //       return;
      // }
      // else
      // {
      // 	ret.message = "Test never started still saving it in the db";
      // 	ret.result_id = r._id;
      //   ret.status = "success";
      //   student.tests_attempted.push({id:testId,result:r._id});
      // 	await student.save();
        
      //   res.status(200).json(ret);
      //   return;
      // }
      
      // //end
      ret.status ="success";
      ret.message = "saved";
      ret.result_id= r._id;
      res.status(200).json(ret);
      // console.log("Document inserted succussfully!");
    });
});


//useless function for now!
router.get("/test_start/:testId",async (req, res, next) => {
    let ret={message:"TestId missing",status:"failed"};
    let studentId = req.user._id;
    let testId = req.params.testId;
    let student = await Student.findOne({ _id: studentId });
    let ta = student.tests_attempted;
    let taa=ta.filter((tao)=> tao.id == testId );
	  let tao ;
	  if(taa.length>0)
	  {
	  	tao = taa[0];
	  	if(tao.result_id)
	      {
	      	ret.message = "Test already attempted!";
	      }
	      else
	      {
	      	ret.message = "Test already started!";
	      }
	  	ret.result_id = tao.result_id;
	    res.status(200).json(ret);
	    return;
	  }
	  else{


	  	ta.push({id:testId});
	  	// await student.save();
	  	ret.message = "Test started";
	  	ret.status = "success";
      	// ret.result_id = tao.result_id;
        res.status(200).json(ret);
	    return;
	  }
});


//Topics api
router.post("/topic_create", (req, res, next) => {
    let ownerId=req.user._id;
    let topic=req.body;
    console.log(topic);
    let ret={message:"",status:"failed"};

    let f=new Topics(topic);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occurred";
            console.log(err);
    }
        else {
            console.log("no error occurred");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/topic_delete/:topicId", (req, res, next) => {
    let ret={message:"",status:"failed"};
    let topicId = req.params.topicId;
	Topics.findOneAndDelete({_id:topicId},function(err,topic){
	        if (err)
	        {
	          console.log("some error occurred:"+err);  
              ret.message= "some error occurred";
	        }
	        else{
	            ret.status="success";
	            ret.topic_removed=topic;
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



router.get("/topics",(req, res, next) => {
    let ownerId=req.user._id;


    //this is base64
    let filter = req.query.filter;
    let filterObj = {};
    if(filter)
    {
        let filterJSON=Buffer.from(filter, 'base64').toString('ascii');
        filterObj = JSON.parse(filterJSON);
    }
    let ret={message:"",status:"failed"};

    // let name=req.body.name;

    Topics.find(filterObj,function(err,topics){
        if (err)
        {
          console.log("some error occurred:"+err);  
          ret.message= "some error occurred";
        }
        else{
            ret.data=topics;
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/topic_get/:topicId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let topicId = req.params.topicId;
    let ret={message:"",status:"failed"};
    // let name=req.body.name;

     Topics.findById(topicId,function(err,topic){
        if (err)
        {
          console.log("some error occurred:"+err); 
          ret.message= "some error occurred"; 
        }
        else{
            ret.data=topic;
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

module.exports=router;
