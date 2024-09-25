const express = require("express");
const router = express.Router();
const Users = require("../../databases/system/users");
const Staff = require("../../databases/staff/staff");
const Students = require("../../databases/student_center/students");
const Addresses = require("../../databases/system/addresses");
const Files = require("../../databases/system/files");
const Questions = require("../../databases/student_center/questions");
const DppQuestions = require("../../databases/student_center/dpp_question");
const Results = require("../../databases/student_center/results");
const {Batches,Lectures} = require("../../databases/student_center/batches");
const Comprehensions = require("../../databases/student_center/comprehensions");
const DppComprehensions = require("../../databases/student_center/dpp_comprehensions");
const {Topics,SubTopics,Chapters,Categories,Branches,Streams,Subjects,MarkingShemes,Packages,Instructions} = require("../../databases/student_center/academics");
const Tests = require("../../databases/student_center/tests");
const DppTests = require("../../databases/student_center/dpp_tests");
const { Fees, Installments } = require("../../databases/student_center/fees");


const examsRoute = require("./exams");
const batchesRoute = require("./batches");
const feesRoute = require("./fees");
const modulesRoute = require("./modules");
const instituteFilesRoute = require("./institute_files");
const instructionsRoute = require("./instructions");
const doubtsRoute = require("./doubts");
const facultiesRoute = require("./faculties");
const resultsRoute = require("./results");
const promotionsRoute = require("./promotions");

router.use("/results",resultsRoute);
router.use("/faculties",facultiesRoute);
router.use("/doubts",doubtsRoute);
router.use("/instructions",instructionsRoute);
router.use("/institute_files",instituteFilesRoute);
router.use("/modules",modulesRoute);
router.use("/fees",feesRoute);
router.use("/exams",examsRoute);
router.use("/batches",batchesRoute);
router.use("/promotions",promotionsRoute);

function checkForPermission(user,permission)
{
    console.log("checking status");
    console.log(user);
    console.log(permission);
	return true;
}


router.get("/files",async (req,res)=>{
    let ret={message:"-",status:"failed"};
    let permission = "staff_read";
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    try{
        let files = await Files.find().lean();
        ret.status= "success";
        ret.message = "done";
        ret.data = files;
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/staff_members", (req, res, next) => {
    var result=[];
    let permission = "staff_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    console.log("yes:"+req.user._id);
    Staff.find({},'_id username email role permissions created_at',function(err,users){
        if (err)
        {
          console.log("some error occured:"+err);
        }
        else{
            ret.status="success";
            
            users = users.map((el)=>{
                let elm= el.toObject();
                // if(elm.role=="admin")
                // {
                //     elm.permissions = ["ALL PERMISSIONS"];
                // }
                return elm;
            });

            ret.data=users;
            ret.message = "done";
            // ret.user = req.user;
            // delete ret.user.password;
            res.status(200).json(ret);
        } 
    });
});

router.post("/staff_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let username=req.body.username;
    let role=req.body.role;
    let phone=req.body.phone;
    let email=req.body.email;
    let password=req.body.password;
    let permissions = req.body.permissions;
    let permission = "staff_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); 
        return;
    }
    // console.log(req.body);
    if(!phone)
    {
        ret.message = "Phone is not provided";
    	res.status(200).json(ret); return;
    }

    let user;
    if(await Users.exists({phone:phone})){
        user = await Users.findOne({phone:phone});
    }
    else{
        
        user = new Users({phone:phone});
        await user.save();
    }

    let d=new Staff({user:user._id,username:username,name:username,role:role,email:email,password:password,permissions:permissions});
    if(req.user.role == "admin")
    {
        d.save((err)=>{
        if (err){
        	if(err.code=11000)
        	{
        		ret.message="email already exists";
        	}
        	else
        	{
        		ret.message="Some error occured, please check the values sent in the form";
        	}
            
            console.log(err);
        } 
        else {

            // console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=d._id;
            // res.redirect("/directories");
        }
        res.status(200).json(ret);

    });
    }
    else
    {
        res.status(200).json(ret);
    }
});

router.post("/staff_delete/:staffId", (req, res, next) => {
    let ownerId=req.user._id;
    // let name=req.body.name;
    let permission = "staff_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    let staffId = req.params.staffId;
    // console.log(req.user.role);

    // console.log(req.user.role);
    Staff.deleteOne({_id:staffId},function(err,user){
        if (err)
        {
          console.log("some error occured:"+err);
          ret.message="some error occured";
        }
        else{
            ret.status="success";
            ret.staff_removed=user;
            ret.message="removed successfully";
            // ret.user = req.user;
            // delete ret.user.password;    
        }
    res.status(200).json(ret);
    });
});

router.get("/staff_get/:staffId", (req, res, next) => {
    var result=[];
    console.log("yes:");
    let permission = "staff_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let staffId = req.params.staffId;
    // Staff.findOne({_id:staffId},'_id username email role created_at',function(err,user){
    Staff.findById(staffId,'_id username email role permissions',function(err,user){
        if (err)
        {
          console.log("some error occured:"+err);  
        }
        else{
            let elm= user.toObject();
            console.log(elm);
            if(!elm.permissions)
            {
                elm.permissions=[];
            }
            ret.data=elm;

                
                
            ret.status ="success";
            ret.message = "done";
            res.status(200).json(ret);
        } 
    });
});

router.post("/staff_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let staff=req.body;

    let permission = "staff_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
        return;
    }

    let staffId = staff._id;
    console.log(staff);
    
    try{
        let y=await Staff.updateOne({_id:staffId},{$set:staff});
        console.log(y);
        ret.status="success";
        console.log("staff is");
        
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }
       
});


//question functions for everyone
router.post("/question_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let question=req.body;
    question.owner = ownerId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    question.id = await Questions.find().count()+1;
    let f=new Questions(question);
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

router.post("/question_delete/:questionId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let questionId = req.params.questionId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	Questions.findOneAndDelete({_id:questionId},function(err,question){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.question_removed=question;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/question_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let question=req.body;

    console.log("======Question--");
    console.log(question);
    let permission = "question_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let questionId = question._id;
    try{
        console.log(question);
        await Questions.updateOne({_id:questionId},{$set:question});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/questions",async (req, res, next) => {
    let ownerId=req.user._id;
    let skip=req.query.skip || 0;
    let limit = req.query.limit || 50;
    //console.log(skip+"<-skip,limit-> "+limit);
    // let ret={message:"",status:"failed"};

    let permission = "question_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    let filter = req.query;
    let filterObj={};
    if(filter)
    {
    	// filterObj = ;
        //console.log(filterObj);
        if(filter.skip)
            delete filter.skip;

        if(filter.limit)
            delete filter.limit;

        // if(filter.question_id)
        // {
        //     filterObj._id = filter.question_id;
        //     delete filter.question_id;
        // }

        // if(filter.id)
        // {
        //     filterObj.id = filter.id;
        //     delete filter.id;
        // }
     
        if(filter.id){
            if(filter.id.length<=10){
                filterObj.id = filter.id;
                delete filter.id;
            }else  {
                filterObj._id = filter.id;
                delete filter.id;
    
            }
        }





        else{
            if(filter.stream && filter.stream != "-")
            {
               filterObj.stream=filter.stream;
               delete filter.stream
               
                // let subjects = await Subjects.find({streams:filter.stream});

                // filterObj.subject={$in:subjects};
                // filterObj.subject = filter.subject;
                // console.log(filterObj.subject);
                // delete filterObj.subject;
                // delete filter.subject;
            }

            if(filter.subject && filter.subject != "-")
            {
                // filterObj.subject={$in:[filter.subject]};
                filterObj.subject = filter.subject;
                console.log(filterObj.subject);
                delete filter.subject;
                // delete filter.subject;
            }
            if(filter.for_advanced)
            {
                // filterObj.subject={$in:[filter.subject]};
                filterObj.for_advanced = filter.for_advanced;
                
                // delete filter.subject;
            }
            if(filter.question_type && filter.question_type!="-")
            {
                filterObj.question_type = filter.question_type;
                delete filter.question_type;
            }

            if(filter.difficulty && filter.difficulty != "-")
            {
                filterObj.difficulty = filter.difficulty;
                // console.log(filterObj.stream);
                delete filter.difficulty;
                // console.log(filterObj.stream);

            }

            if(filter.chapter && filter.chapter != "-")
            {   
                filterObj.chapter = filter.chapter;
                // console.log(filterObj.chapter);
                delete filter.chapter;
                // console.log(filterObj.chapter);


            }

            if(filter.topic && filter.topic != "-")
            {
                filterObj.topic=filter.topic;
                // console.log(filterObj.topic);
                delete filter.topic;
                // console.log(filterObj.topic);

            }
        }
        // console.log("This")
        // console.log(filterObj);
        // console.log("this")
    };
    console.log("This")

    console.log(filterObj);

    // var query = await Questions.find({subjects:{$exists:true}},{subjects:1});
    // var query = await Questions.find({subjects:{ $elemMatch: {$eq: "6305e5a474bc3546563625d0"}}});
    // var query = await Questions.find({"__v":{$exists:true,$equal:0}});
    // console.log(query.length);

    // let q= await Questions.find();

    // for(let i=0;i<q.length;i++){
    //     await Questions.findOneAndUpdate({_id:q[i]._id},{$set:q[i]});
    // }

    
    var query = Questions.find(filterObj).populate("subjects").populate("streams").sort({"created":-1}).skip(parseInt(skip)).limit(parseInt(limit));
    query.exec(function(err,questions){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured";
        }
        else{
            console.log("no problem occured");
            console.log("This");

            console.log(filterObj);

            ret.data=questions;
            // questions.map(q=> console.log(q.subjects));
            console.log(questions.length);
            ret.status ="success";
            ret.message = "done";
            
        }
        res.status(200).json(ret);
    });

});

router.get("/question_get/:questionId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let questionId = req.params.questionId;
    // let name=req.body.name;
    let permission = "question_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

     Questions.findById(questionId).populate("comprehension").exec(function(err,question){
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


// dpp questions

router.post("/dpp_question_create", async (req, res, next) => {
    console.log("dpp question create");
    let ownerId=req.user._id;
    let question=req.body;
    question.owner = ownerId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    question.id = await DppQuestions.find().count()+1;
    let f=new DppQuestions(question);
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

router.post("/dpp_question_delete/:questionId", (req, res, next) => {
    // let ret={message:"",status:"failed"};
    let questionId = req.params.questionId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
	DppQuestions.findOneAndDelete({_id:questionId},function(err,question){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
	        }
	        else{
	            ret.status="success";
	            ret.question_removed=question;
	            ret.message = "done";
	            
	        }
            res.status(200).json(ret);
	    });
});

router.post("/dpp_question_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let question=req.body;

    console.log("======Question--");
    console.log(question);
    let permission = "question_edit";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};

    if(!checkForPermission(req.user,permission))
    {
        console.log(req.user.role);
        console.log(req.user.permissions);
    	res.status(200).json(ret);
        return;
    }

    let questionId = question._id;
    try{
        console.log(question);
        await DppQuestions.updateOne({_id:questionId},{$set:question});
        ret.status="success";   
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }    
});

router.get("/dpp_questions",async (req, res, next) => {
    let ownerId=req.user._id;
    let skip=req.query.skip || 0;
    let limit = req.query.limit || 50;
    //console.log(skip+"<-skip,limit-> "+limit);
    // let ret={message:"",status:"failed"};

    let permission = "question_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    let filter = req.query;
    let filterObj={};
    if(filter)
    {
    	// filterObj = ;
        //console.log(filterObj);
        if(filter.skip)
            delete filter.skip;

        if(filter.limit)
            delete filter.limit;

        // if(filter.question_id)
        // {
        //     filterObj._id = filter.question_id;
        //     delete filter.question_id;
        // }

        // if(filter.id)
        // {
        //     filterObj.id = filter.id;
        //     delete filter.id;
        // }
     
        if(filter.id){
            if(filter.id.length<=10){
                filterObj.id = filter.id;
                delete filter.id;
            }else  {
                filterObj._id = filter.id;
                delete filter.id;
    
            }
        }





        else{
            if(filter.stream && filter.stream != "-")
            {
               filterObj.stream=filter.stream;
               delete filter.stream
               
                // let subjects = await Subjects.find({streams:filter.stream});

                // filterObj.subject={$in:subjects};
                // filterObj.subject = filter.subject;
                // console.log(filterObj.subject);
                // delete filterObj.subject;
                // delete filter.subject;
            }

            if(filter.subject && filter.subject != "-")
            {
                // filterObj.subject={$in:[filter.subject]};
                filterObj.subject = filter.subject;
                console.log(filterObj.subject);
                delete filter.subject;
                // delete filter.subject;
            }
            if(filter.for_advanced)
            {
                // filterObj.subject={$in:[filter.subject]};
                filterObj.for_advanced = filter.for_advanced;
                
                // delete filter.subject;
            }
            if(filter.question_type && filter.question_type!="-")
            {
                filterObj.question_type = filter.question_type;
                delete filter.question_type;
            }

            if(filter.difficulty && filter.difficulty != "-")
            {
                filterObj.difficulty = filter.difficulty;
                // console.log(filterObj.stream);
                delete filter.difficulty;
                // console.log(filterObj.stream);

            }

            if(filter.chapter && filter.chapter != "-")
            {   
                filterObj.chapter = filter.chapter;
                // console.log(filterObj.chapter);
                delete filter.chapter;
                // console.log(filterObj.chapter);


            }

            if(filter.topic && filter.topic != "-")
            {
                filterObj.topic=filter.topic;
                // console.log(filterObj.topic);
                delete filter.topic;
                // console.log(filterObj.topic);

            }
        }
        // console.log("This")
        // console.log(filterObj);
        // console.log("this")
    };
    console.log("This")

    console.log(filterObj);

    // var query = await DppQuestions.find({subjects:{$exists:true}},{subjects:1});
    // var query = await DppQuestions.find({subjects:{ $elemMatch: {$eq: "6305e5a474bc3546563625d0"}}});
    // var query = await DppQuestions.find({"__v":{$exists:true,$equal:0}});
    // console.log(query.length);

    // let q= await DppQuestions.find();

    // for(let i=0;i<q.length;i++){
    //     await DppQuestions.findOneAndUpdate({_id:q[i]._id},{$set:q[i]});
    // }

    
    var query = DppQuestions.find(filterObj).populate("subjects").populate("streams").sort({"created":-1}).skip(parseInt(skip)).limit(parseInt(limit));
    query.exec(function(err,questions){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured";
        }
        else{
            console.log("no problem occured");
            console.log("This");

            console.log(filterObj);

            ret.data=questions;
            // questions.map(q=> console.log(q.subjects));
            console.log(questions.length);
            ret.status ="success";
            ret.message = "done";
            
        }
        res.status(200).json(ret);
    });

});

router.get("/dpp_question_get/:questionId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let questionId = req.params.questionId;
    // let name=req.body.name;
    let permission = "question_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

     DppQuestions.findById(questionId).populate("comprehension").exec(function(err,question){
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



router.get("/func_test",(req, res, next) => {
    
});
//some utility functions for the Test creation!
async function getSubjectForQuestionInTest(questionSubjects,testSubjects){
    let subjectId=null;
    for(var i =0; i<questionSubjects.length;i++)
    {
        if(testSubjects.includes(questionSubjects[i]))
        {
            subjectId= questionSubjects[i];
            break;
        }
    }
    if(subjectId)
    {
        try{
            let subject=await Subjects.findById(subjectId);
            return subject.name;
        }
        catch(err)
        {
            console.log(err.message);
            return "-"
        }
    }
    else
    {
        return "-";
    }
    
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
                

// //test functions for everyone
// router.post("/test_create", async (req, res, next) => {
//     let ownerId=req.user._id;
//     let test=req.body;
//     test.owner=ownerId;

//     let permission = "test_create";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//         return;
//     }
//     console.log(test);
//     //make sure to make subject is derived from on the questions submitted for the paper!

//     //Section wise question adding setting subjects and more related optional data!
//         let questions = [];
//         if(!test.structure.sections)
//         {
//             ret.message = "Empty test structure";
//             res.status(200).json(ret);
//             return;
//         }
//         let sections = test.structure.sections;
//         // console.log(test);
//         for(var i=0;i<sections.length;i++)
//         {
//             let extra;
//             console.log(sections[i]);
//             if(sections[i].section_type=="optional")
//             {
//                 extra=sections[i].numberCompulsoryQuestions+"/"+sections[i].questions.length;
//             }
//             for(var j=0;j<sections[i].questions.length;j++)
//             {
//                 let q=sections[i].questions[j].question;

//                 q.section_type=sections[i].section_type;
//                 q.extra = extra;
//                 q.subject = await getSubjectForQuestionInTest(q.subjects,test.subjects);
//                 q.scheme = await findMarkingScheme(sections[i].questions[j].scheme);//full marking scheme object!
//                 q.section_name = sections[i].name;
                
//                 questions.push(q);
//             }
//         }
//         test.questions = questions;
//     //section wise updates finished
//     let f=new Tests(test);
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


//test functions for everyone
router.post("/test_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let test=req.body;
    test.owner=ownerId;

    let permission = "test_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
        return;
    }
    console.log("golo");
    console.log(test);
    console.log("golo");

    //make sure to make subject is derived from on the questions submitted for the paper!

    //Section wise question adding setting subjects and more related optional data!
        let questions = [];
        if(!test.structure.sections)
        {
            ret.message = "Empty test structure";
            res.status(200).json(ret);
            return;
        }
        let sections = test.structure.sections;
        // console.log(test);
        for(var i=0;i<sections.length;i++)
        {
            let extra;
            console.log(sections[i]);
            if(sections[i].section_type=="optional")
            {
                extra=sections[i].numberCompulsoryQuestions+"/"+sections[i].questions.length;
            }
            for(var j=0;j<sections[i].questions.length;j++)
            {
                console.log('i:', i);
                console.log('j:', j);
                console.log('sections[i]:', sections[i]);
                console.log('sections[i].questions:', sections[i].questions);
                console.log('j:', j);
                console.log('sections[i].questions[j]:', sections[i].questions[j]);
                console.log('sections[i].questions[j].length:', sections[i].questions[j].length);
                let qId=sections[i].questions[j].question;
                let q = await Questions.findById(qId).lean();
                q.section_type=sections[i].section_type;
                q.extra = extra;
                // q.subject = await getSubjectForQuestionInTest(q.subjects,test.subjects);
                q.subject = await Subjects.find({_id:sections[i].questions[j].subject});
                q.scheme = await findMarkingScheme(sections[i].questions[j].scheme);//full marking scheme object!
                q.section_name = sections[i].name;
                
                questions.push(q);
            }
        }
        test.questions = questions;
    //section wise updates finished
    let f=new Tests(test);
    f.save((err)=>{
        if (err) {
           	console.log("error: "+err.message);
            ret.message= "error: "+err.message;
            
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/test_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let test=req.body;
    // question.owner = ownerId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    let testId = test._id;
    // delete test._id;
    // delete test.__v;
    try{
        await Tests.updateOne({_id:testId},{$set:test});
        ret.status="success";
        ret.message="Done updating";
        
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }
    
    // res.status(200).json(ret);
    console.log("golo");
    console.log(test);
    console.log("golo");
       
});

router.post("/test_delete/:testId", (req, res, next) => {
    let permission = "test_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let testId = req.params.testId;
	Tests.deleteOne({_id:testId},function(err,test){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.test_removed=test;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 
            res.status(200).json(ret);
	    });
});



router.get("/tests",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "test_read";
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 50;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let filter = req.query;
    console.log(filter);
    if(filter)
    {
        if(filter.stream && filter.stream != "-")
        {
            filter.streams = {"$in":[filter.stream]};
            delete filter.stream;
        }
        // if(filter.batch && filter.batch != "-")
        // {
        //     filter.batches = {"$in":[filter.batch]};
        //     delete filter.batch;
        // }
        if(filter.subject && filter.subject != "-")
        {
            filter.subjects = {"$in":[filter.subject]};
            delete filter.subject;
        }

        if(filter.skip)
        {
            delete filter.skip;
        }
        if(filter.limit)
        {
            delete filter.limit;
        }
    }

    // let name=req.body.name;
    console.log(filter);

    Tests.find(filter).populate("streams").populate("packages").exec(function(err,tests){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=tests;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/test_get/:testId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    // console.log("test get");
    let testId = req.params.testId;
    // let name=req.body.name;
    let permission = "test_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

     Tests.findById(testId).exec(function(err,test){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=test;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


//Dpptest functions for everyone

router.post("/dpp_test_create", async (req, res, next) => {
   
    let ownerId=req.user._id;
    let test=req.body;
    test.owner=ownerId;
  
    let permission = "test_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
        return;
    }
    console.log("golo");
    console.log(test);
    console.log("golo");

    //make sure to make subject is derived from on the questions submitted for the paper!

    //Section wise question adding setting subjects and more related optional data!
        let questions = [];
     
        if(!test.structure.sections)
        {
            ret.message = "Empty test structure"; 
            res.status(200).json(ret);
            return;
           
        }
        let sections = test.structure.sections;
        // console.log(test);
        for(var i=0;i<sections.length;i++)
        {
            let extra;
            console.log(sections[i]);
            console.log(sections);
            if(sections[i].section_type=="optional")
            {
                extra=sections[i].numberCompulsoryQuestions+"/"+sections[i].questions.length;
            }
            for(var j=0;j<sections[i].questions.length;j++)
            {
                let qId=sections[i].questions[j].question;
                let q = await DppQuestions.findById(qId).lean();
                q.section_type=sections[i].section_type;
                q.extra = extra;
                // q.subject = await getSubjectForQuestionInTest(q.subjects,test.subjects);
                q.subject = await Subjects.find({_id:sections[i].questions[j].subject});
                q.scheme = await findMarkingScheme(sections[i].questions[j].scheme);//full marking scheme object!
                q.section_name = sections[i].name;           
                questions.push(q);
            }
        }
        test.questions = questions;
    //section wise updates finished
    let f=new DppTests(test);
    f.save((err)=>{
        if (err) {
           	console.log("error: "+err.message);
            ret.message= "error: "+err.message;
            
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);

    });
});

router.post("/dpp_test_edit/", async (req, res, next) => {
    let ownerId=req.user._id;
    let test=req.body;
    // question.owner = ownerId;

    let permission = "question_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    let testId = test._id;
    // delete test._id;
    // delete test.__v;
    try{
        await DppTests.updateOne({_id:testId},{$set:test});
        ret.status="success";
        ret.message="Done updating";
        
        res.status(200).json(ret);
    }
    catch(err)
    {
        ret.message = err.message;
        res.status(200).json(ret);
    }
    
    // res.status(200).json(ret);
    console.log("golo");
    console.log(test);
    console.log("golo");
       
});

router.post("/dpp_test_delete/:testId", (req, res, next) => {
    let permission = "test_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let testId = req.params.testId;
	DppTests.deleteOne({_id:testId},function(err,test){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.test_removed=test;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 
            res.status(200).json(ret);
	    });
});



router.get("/dpp_tests",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "test_read";
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 50;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let filter = req.query;
    console.log(filter);
    if(filter)
    {
        if(filter.stream && filter.stream != "-")
        {
            filter.streams = {"$in":[filter.stream]};
            delete filter.stream;
        }
        // if(filter.batch && filter.batch != "-")
        // {
        //     filter.batches = {"$in":[filter.batch]};
        //     delete filter.batch;
        // }
        if(filter.subject && filter.subject != "-")
        {
            filter.subjects = {"$in":[filter.subject]};
            delete filter.subject;
        }

        if(filter.skip)
        {
            delete filter.skip;
        }
        if(filter.limit)
        {
            delete filter.limit;
        }
    }

    // let name=req.body.name;
    console.log(filter);

    DppTests.find(filter).populate("streams").populate("packages").exec(function(err,tests){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=tests;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/dpp_test_get/:testId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    // console.log("test get");
    let testId = req.params.testId;
    // let name=req.body.name;
    let permission = "test_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

     DppTests.findById(testId).exec(function(err,test){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=test;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


//Subtopic api
router.post("/comprehension_create", (req, res, next) => {
    let ownerId=req.user._id;
    let comprehension=req.body;
    // let topicId = req.params.topicId;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    // comprehension.topic=topicId;

    let f=new Comprehensions(comprehension);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/comprehension_edit/:comprehension_id", (req, res, next) => {
    let ownerId=req.user._id;
    let comprehension=req.body;
    let comprehensionId =req.params.comprehension_id;
    // let chapterId = 
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    Comprehensions.findOneAndUpdate({_id:comprehensionId},comprehension,function(err){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.message = "done";
	        } 

            res.status(200).json(ret);
	    });
});

router.post("/comprehension_delete/:comprehension_id", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let comprehensionId = req.params.comprehension_id;
	Comprehensions.findOneAndDelete({_id:comprehensionId},function(err,comprehension){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.comprehension_removed=comprehension;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



router.get("/comprehensions",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let filterObj = req.query;   
    Comprehensions.find(filterObj,function(err,comprehensions){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=comprehensions;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });

});

router.get("/comprehension_get/:comprehension_id",async (req, res, next) => {
    let comprehensionId = req.params.comprehension_id;
    let query=req.query;
    console.log(query);
    
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    try{
        let comprehension = await Comprehensions.findById(comprehensionId).lean();
        if(query.questions){
            let questions = await Questions.find({comprehension:comprehensionId});
            comprehension.questions = questions;
        }
        else{
            comprehension.questions = [];
        }
        ret.status = "success";
        ret.message= "done";
        ret.data = comprehension;
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

// DPP Comprehensions

router.post("/dpp_comprehension_create", (req, res, next) => {
    let ownerId=req.user._id;
    let comprehension=req.body;
    // let topicId = req.params.topicId;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    // comprehension.topic=topicId;

    let f=new DppComprehensions(comprehension);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/dpp_comprehension_edit/:comprehension_id", (req, res, next) => {
    let ownerId=req.user._id;
    let comprehension=req.body;
    let comprehensionId =req.params.comprehension_id;
    // let chapterId = 
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    DppComprehensions.findOneAndUpdate({_id:comprehensionId},comprehension,function(err){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.message = "done";
	        } 

            res.status(200).json(ret);
	    });
});

router.post("/dpp_comprehension_delete/:comprehension_id", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let comprehensionId = req.params.comprehension_id;
	DppComprehensions.findOneAndDelete({_id:comprehensionId},function(err,comprehension){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.comprehension_removed=comprehension;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



router.get("/dpp_comprehensions",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let filterObj = req.query;   
    DppComprehensions.find(filterObj,function(err,comprehensions){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=comprehensions;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });

});

router.get("/dpp_comprehension_get/:comprehension_id",async (req, res, next) => {
    let comprehensionId = req.params.comprehension_id;
    let query=req.query;
    console.log(query);
    
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    try{
        let comprehension = await DppComprehensions.findById(comprehensionId).lean();
        if(query.questions){
            let questions = await Questions.find({comprehension:comprehensionId});
            comprehension.questions = questions;
        }
        else{
            comprehension.questions = [];
        }
        ret.status = "success";
        ret.message= "done";
        ret.data = comprehension;
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});



//Topics api
router.post("/topic_create/:chapterId", (req, res, next) => {
    let ownerId=req.user._id;
    let topic=req.body;
    let chapterId = req.params.chapterId;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    topic.chapter = chapterId;
    let f=new Topics(topic);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

//use this to update the content of the content field!!
router.post("/topic_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let topic=req.body;
    // let chapterId = 
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    Topics.findOneAndUpdate({_id:topic._id},topic,function(err){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.message = "done";
	            // ret.chapter_removed=chapter;
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});

router.post("/topic_delete/:topicId", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let topicId = req.params.topicId;
	Topics.findOneAndDelete({_id:topicId},function(err,topic){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.topic_removed=topic;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});





router.get("/topics/:chapterId",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";


    let chapterId = req.params.chapterId;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    
    let filterObj = {chapter:chapterId};

    Topics.find(filterObj,function(err,topics){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=topics;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    }).sort({name:1});

});

router.get("/topic_get/:topicId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let topicId = req.params.topicId;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // let name=req.body.name;

     Topics.findById(topicId,function(err,topic){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=topic;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


//Subtopic api
router.post("/subtopic_create/:topicId", (req, res, next) => {
    let ownerId=req.user._id;
    let subtopic=req.body;
    let topicId = req.params.topicId;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    subtopic.topic=topicId;

    let f=new SubTopics(subtopic);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/subtopic_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let subtopic=req.body;
    // let chapterId = 
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    SubTopics.findOneAndUpdate({_id:subtopic._id},subtopic,function(err){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.message = "done";
	            // ret.chapter_removed=chapter;
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});

router.post("/subtopic_delete/:subtopicId", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let subtopicId = req.params.subtopicId;
	SubTopics.findOneAndDelete({_id:subtopicId},function(err,subtopic){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.subtopic_removed=subtopic;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



router.get("/subtopics/:topicId",(req, res, next) => {
    let ownerId=req.user._id;
    let topicId = req.params.topicId;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    // let filter = req.query;
    let filterObj = {topic:topicId};
   

    // let name=req.body.name;

    SubTopics.find(filterObj,function(err,subtopics){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=subtopics;
            ret.message = "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/subtopics_fetch/",(req, res, next) => {
    let ownerId=req.user._id;
    let topicId = req.query.topic;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    // let filter = req.query;
    let filterObj = {topic:topicId};
   
    // let name=req.body.name;

    SubTopics.find(filterObj,function(err,subtopics){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=subtopics;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });

});



router.get("/topics_fetch/",(req, res, next) => {
    let ownerId=req.user._id;
    let chapterId = req.query.chapter;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    // let filter = req.query;
    let filterObj = {chapter:chapterId};
   

    // let name=req.body.name;

    SubTopics.find(filterObj,function(err,subtopics){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=subtopics;
            ret.message = "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/chapters_fetch/",(req, res, next) => {
    let ownerId=req.user._id;
    let subjectId = req.query.subject;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    // let filter = req.query;
    let filterObj = {subject:subjectId};
   

    // let name=req.body.name;

    Topics.find(filterObj,function(err,topics){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=topics;
            ret.message = "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });
});

router.get("/subtopic_get/:subtopicId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let subtopicId = req.params.subtopicId;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // let name=req.body.name;

     SubTopics.findById(subtopicId).populate('topics').exec(function(err,chapter){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            ret.data=chapter;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


//Chapter api
router.post("/chapter_create", (req, res, next) => {
    let ownerId=req.user._id;
    let chapter=req.body;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    let f=new Chapters(chapter);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="done";
            ret.status="success";
            // ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});
router.post("/chapter_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let chapter=req.body;
    // let chapterId = 
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    Chapters.findOneAndUpdate({_id:chapter._id},chapter,function(err){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.message = "done";
	            // ret.chapter_removed=chapter;
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});


router.post("/chapter_delete/:chapterId", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let chapterId = req.params.chapterId;
	Chapters.findOneAndDelete({_id:chapterId},function(err,chapter){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.chapter_removed=chapter;
	            ret.message = "done";
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



// router.get("/chapters",(req, res, next) => {
//     let ownerId=req.user._id;
//     // let skip=req.query.skip || 0;
//     // let limit = req.query.limit || 50;
//     let classNumber= req.query.class_number;
//     let permission = "academic_desk_read";
 
//     // console.log(skip+"<-skip,limit-> "+limit);

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }

//     //this is base64
//    	let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
        
//         filterObj = filter;
         

//     }
//     console.log(filterObj);

//     Chapters.find(filterObj).populate("stream").populate("subject").exec(function(err,chapters){
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


router.get("/chapters",(req, res, next) => {
    let ownerId=req.user._id;
    let skip=req.query.skip || 0;
    let limit = req.query.limit || 300;
    let classNumber= req.query.class_number;
    let permission = "academic_desk_read";
 
    console.log(skip+"<-skip,limit-> "+limit);

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
   	let filter = req.query;
    let filterObj = {};
    // let filterObj=filter;

    if(filter)
    {
        
        // filterObj = filter;
        if(filter.skip)
        delete filter.skip;

        if(filter.limit)
        delete filter.limit;
    
        if(filter.subject && filter.subject != "-")
        {
            // filterObj.subjects={$in:[filter.subject]};
            filterObj.subject = filter.subject;
            delete filter.subject;
            // delete filter.subject;
        }
        

        console.log(filterObj);
    }

    
        var query=Chapters.find(filterObj).populate("stream").populate("subject").skip(parseInt(skip)).limit(parseInt(limit));
        query.exec(function(err,chapters){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            console.log("no problem occured");

            ret.data=chapters;

            ret.status ="success";
            ret.message = 'done';
            console.log(chapters.length);
            // console.log(chapters);

            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/chapters/:subjectId",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";


    let subjectId = req.params.subjectId;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    //this is base64
    
    let filterObj = {subject:subjectId};

    Chapters.find(filterObj,function(err,chapters){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=chapters;
            ret.status ="success";
            ret.message = "done";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    }).sort({name:1});

});
router.get("/chapter_get/:chapterId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let chapterId = req.params.chapterId;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    // let name=req.body.name;

    Chapters.findById(chapterId).exec(function(err,chapter){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
        	console.log(chapter);
            ret.data=chapter;
            ret.message = "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


//Chapter api
router.post("/category_create", (req, res, next) => {
    let ownerId=req.user._id;
    let category=req.body;
    console.log(category);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    let f=new Categories(category);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});

router.post("/category_delete/:categoryId", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    let categoryId = req.params.categoryId;
	Categories.findOneAndDelete({_id:categoryId},function(err,category){
	        if (err)
	        {
	          console.log("some error occured:"+err);  
              ret.message= "some error occured";
	        }
	        else{
	            ret.status="success";
	            ret.category_removed=category;
	            ret.message = 'done';
	            // res.status(200).json(ret);
	        } 

            res.status(200).json(ret);
	    });
});



router.get("/categories",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }

    Categories.find({},function(err,categories){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=categories;
            ret.status ="success";
            ret.message = 'done';
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


// router.get("/students",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "student_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
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

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
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


// router.get("/results/:studentId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let studentId = req.params.studentId;
//     let permission = "student_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret);
//     }
//     Results.find({student_id:studentId},function(err,results){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=results;
//             ret.message= "done";
//             ret.status ="success";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });
// });

router.get("/result/:resultId",(req, res, next) => {
    let ownerId=req.user._id;
    let resultId = req.params.resultId;
    let permission = "student_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    Results.findById(resultId,function(err,result){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=result;
            ret.message= "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });
});

// router.get("/result/:testId",(req, res, next) => {
//     let ownerId=req.user._id;
//     let testId = req.params.testId;
//     let permission = "student_read";

//     let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//     	res.status(200).json(ret); return;
//     }
//     Results.findById(testId,function(err,result){
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

router.post("/result_delete/:resultId",(req, res, next) => {
    let ownerId=req.user._id;
    let resultId = req.params.resultId;
    let permission = "student_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
    	res.status(200).json(ret); return;
    }
    Results.findOneAndDelete({_id:resultId},function(err){
        if (err)
        {
          console.log("some error occured:"+err);
          ret.message="some error occured";
        }
        else{
            ret.status="success";
            ret.message="removed successfully";
        }
    res.status(200).json(ret);
    });
});

//Student api
router.post("/student_create", async (req, res, next) => {
    let ownerId=req.user._id;
    let student=req.body;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    if(!student.phone)
    {
        ret.message = "phone not present";
        res.status(200).json(ret);
    }
    try{
        let t = new Users({phone:student.phone});
        await t.save();
        student.user = t._id;
        let fees_temp = student.fees;
        delete student.fees;
        console.log(student);
        student.staff = ownerId;
        let f=new Students({student,gravity_student:true});
        await f.save();
        let fees = new Fees({student:f._id,amount:fees_temp});
        await fees.save();
        if(student.batch){
            await Batches.addStudent(student.batch,f._id);
        }

        if(student.primary_address){
            let pa = new Addresses({user:t._id,address_type:"primary",address:student.primary_address});
            await pa.save();
        }

        if(student.secondary_address){
            let sa = new Addresses({user:t._id,address_type:"secondary",address:student.secondary_address});
            await sa.save();
        }

        console.log("no error occured");
        ret.message="done";
        ret.data=f._id;
        ret.status="success";
    }
    catch(err){
        ret.message= "Error:"+err.message;
            console.log(err.message);
    }
    

    res.status(200).json(ret);
});



router.post("/student_create_bulk", async (req, res, next) => {
    let ownerId=req.user._id;
    let student=req.body;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    if(!student.phone)
    {
        ret.message = "phone not present";
        res.status(200).json(ret);
    }
    try{
        let t = new Users({phone:student.phone});
        await t.save();
        student.user = t._id;
        let fees_temp = student.fees;
        delete student.fees;
        console.log(student);
        student.staff = ownerId;
        let f=new Students({student});
        await f.save();
        let fees = new Fees({student:f._id,amount:fees_temp});
        await fees.save();
        if(student.batch){
            await Batches.addStudent(student.batch,f._id);
        }

        if(student.primary_address){
            let pa = new Addresses({user:t._id,address_type:"primary",address:student.primary_address});
            await pa.save();
        }

        if(student.secondary_address){
            let sa = new Addresses({user:t._id,address_type:"secondary",address:student.secondary_address});
            await sa.save();
        }

        console.log("no error occured");
        ret.message="done";
        ret.data=f._id;
        ret.status="success";
    }
    catch(err){
        ret.message= "Error:"+err.message;
            console.log(err.message);
    }
    

    res.status(200).json(ret);
});




router.post("/student_edit/:student_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let student=req.body;
    let studentId = req.params.student_id;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    let keys = Object.keys(student);
    keys.forEach(key=>{
        if(student[key]=="-")
        {
            delete student[key];
        }
    });
    delete student._id;
    try{
        if(student.phone){
            let u = await Users.findById(student.user);
            u.phone = student.phone;
            await u.save();
        }
        await Students.updateOne({_id:studentId},{$set:student});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        ret.message= err.message;
    }
    res.status(200).json(ret);
    
    // Students.findOneAndUpdate({_id:studentId},{$set:student},function(err){
    //         if (err)
    //         {
    //           console.log("some error occured:"+err);  
    //           ret.message= "Error:"+err.message;
    //         }
    //         else{
    //             ret.status="success";
    //             ret.message = "done";
    //         } 

            
    //     });
});


router.post("/student_delete/:studentId", async (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let studentId = req.params.studentId;
    try{
        await Students.deleteOne({_id:studentId});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message= err.message;
    }
    res.status(200).json(ret);
    
});

router.post("/student_disable/:studentId", async (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let studentId = req.params.studentId;
    try{
        await Students.updateOne({_id:studentId},{$set:{enabled:false}});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message= err.message;
    }
    res.status(200).json(ret);
});


router.post("/student_enable/:studentId", async (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let studentId = req.params.studentId;
    try{
        await Students.updateOne({_id:studentId},{$set:{enabled:true}});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message= err.message;
    }
    res.status(200).json(ret);
});

router.get("/students",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";
    let skip=Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 50;

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    //this is base64
    let filter = req.query;
    let filterObj = {};
    if(filter)
    {
        filterObj = filter;
        //console.log(filterObj);
        if(filterObj.skip)
            delete filterObj.skip;

        if(filterObj.limit)
            delete filterObj.limit;
        // filterObj = filter
    }
    console.log(filterObj);

    // let name=req.body.name;

    Students.find(filterObj).populate(["batch"]).skip(skip).limit(limit).exec(function(err,students){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=students;
            ret.status ="success";
            ret.message = 'done';
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});


router.get("/student/:studentId", async (req, res, next) => {
    let studentId = req.params.studentId;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let student = await Students.findById(studentId).populate(["staff","user","stream","branch","batch"]).lean();
        ret.data=student;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});


router.get("/student_addresses/:studentId", async (req, res, next) => {
    let studentId = req.params.studentId;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let student = await Students.findById(studentId);
        let addresses= await Addresses.find({user:student.user});
        ret.data=addresses;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.get("/student_batches/:studentId", async (req, res, next) => {
    let studentId = req.params.studentId;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        // let student = await Students.findById(studentId);
        let batches= await Batches.find({students:studentId});
        ret.data=batches;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.get("/student_fee/:studentId", async (req, res, next) => {
    let studentId = req.params.studentId;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        // let student = await Students.findById(studentId);
        let fees= await Fees.findOne({student:studentId}).lean();
        if(!fees){
            fees=new Fees({amount:0,student:studentId});
            await fees.save();
            fees = fees.toObject();
        }
        let installments = await Installments.find({fees:fees._id}).lean();
        fees.installments = installments;
        console.log(installments);
        ret.data=fees;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.post("/student_fee_edit/:fees_id", async (req, res, next) => {
    let feesId = req.params.fees_id;
    let amount = req.body.amount;
    delete installment.fees;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        await Fees.updateOne({_id:feesId},{$set:{amount:amount}});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.post("/student_installment_create/:fees_id", async (req, res, next) => {
    let feesId = req.params.fees_id;
    let installment = req.body;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        installment.fees = feesId;
        let i = new Installments(installment);
        await i.save();
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.post("/student_installment_edit/:installment_id", async (req, res, next) => {
    let installmentId = req.params.installment_id;
    let installment = req.body;
    // console.log(installment);
    // delete installment.fees;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        await Installments.updateOne({_id:installmentId},{$set:installment});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.post("/student_installment_receive/:installment_id", async (req, res, next) => {
    let installmentId = req.params.installment_id;

    let body=req.body;

    let payment_mode= body.payment_mode;
    let payment_reference_number= body.payment_reference_number;
    
    // delete installment.fees;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        await Installments.updateOne({_id:installmentId},{$set:{'installment_status.received':true,'installment_status.timestamp':Date.now(),'installment_status.staff':req.user._id,'installment_status.payment_mode':payment_mode,'installment_status.payment_reference_number':payment_reference_number,}});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});

router.post("/student_installment_delete/:installment_id", async (req, res, next) => {
    let installmentId = req.params.installment_id;
    let installment = req.body;
    delete installment.fees;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        await Installments.deleteOne({_id:installmentId});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err)
    {
      console.log("some error occured:"+err); 
      ret.message= "some error occured"; 
    }
    res.status(200).json(ret);
});


router.get("/dashboard",async (req, res, next) => {
    let user_id=req.user._id;
    // let resultId = req.params.resultId;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {

    	res.status(200).json(ret);
    }

    try{
        let finalPackage=new Object();
        console.log("checkpoint 1");
        let students = await Students.find({}).limit(5).sort({created_at:-1});
        students=students.map(function(element){
            element= element.toObject();
            delete element.password;
            delete element.phone;
            delete element.last_login;
            delete element.password_hash;
            delete element.pincode;
            return element;
        });
        finalPackage.students = students;
        console.log("checkpoint 2");
        let tests = await Tests.find({}).populate("streams").limit(5).sort({created_at:-1});
        finalPackage.tests = tests;

        console.log("checkpoint 3");

        let questions = await Questions.find({}).limit(5).sort({created_at:-1});
        finalPackage.questions = questions;


        console.log("checkpoint 4");
        let profile = await Staff.findOne({"_id":user_id});
        profile=profile.toObject();
        delete profile.password;
        if(profile.role="admin")
        {
            profile.permissions = ["Full Permissions"];
        }
        finalPackage.profile = profile;
        console.log("checkpoint done");
        ret.status = "success";
        ret.message="done";
        ret.data=finalPackage;
        res.status(200).json(ret);
        return;
    }
    
    catch(err){
        console.log(err);
        ret.message=err.message;
        res.status(200).json(ret)
    }

});



router.get("/search/:pattern",async (req, res, next) => {
    let user_id=req.user._id;
    let pattern = req.params.pattern;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {

        res.status(200).json(ret);
    }


    if(pattern.length==24)
    {
        try{
            
            let finalPackage=new Object();

            let students = await Students.find({'_id':pattern});
            students=students.map(function(element){
                element= element.toObject();
                delete element.password;
                delete element.phone;
                delete element.last_login;
                delete element.password_hash;
                delete element.pincode;
                return element;
            });
            finalPackage.students = students;

            let tests = await Tests.find({'_id':pattern});
            finalPackage.tests = tests;

            let questions = await Questions.find({'_id':pattern});
            finalPackage.questions = questions;

            let profile = await Staff.findOne({"_id":user_id});
            profile=profile.toObject();
            delete profile.password;
            if(profile.role="admin")
            {
                profile.permissions = ["Full Permissions"];
            }
            finalPackage.profile = profile;

            ret.status = "success";
            ret.message="done";
            ret.data=finalPackage;
            res.status(200).json(ret);
            return;
        }
        
        catch(err){
            console.log(err);
            ret.message=err.message;
            res.status(200).json(ret)
        }
    }
    else
    {
        try{
            pattern = new RegExp('.*'+pattern+'.*','i');
            let finalPackage=new Object();

            let students = await Students.find({$or:[{'name':pattern},{'email':pattern},{'city':pattern},{'state':pattern}]}).limit(10).sort({created_at:-1});
            students=students.map(function(element){
                element= element.toObject();
                delete element.password;
                delete element.phone;
                delete element.last_login;
                delete element.password_hash;
                delete element.pincode;
                return element;
            });
            finalPackage.students = students;

            let tests = await Tests.find({$or:[{'name':pattern},{'test_type':pattern}]}).limit(10).sort({created_at:-1});
            finalPackage.tests = tests;

            let questions = await Questions.find({$or:[{'body':pattern},{'question':pattern},{'passage':pattern},{'question_type':pattern}]}).limit(10).sort({created_at:-1});
            finalPackage.questions = questions;

            let profile = await Staff.findOne({"_id":user_id});
            profile=profile.toObject();
            delete profile.password;
            if(profile.role="admin")
            {
                profile.permissions = ["Full Permissions"];
            }
            finalPackage.profile = profile;

            ret.status = "success";
            ret.message="done";
            ret.data=finalPackage;
            res.status(200).json(ret);
            return;
        }
        
        catch(err){
            console.log(err);
            ret.message=err.message;
            res.status(200).json(ret)
        }
    }
    // let resultId = req.params.resultId;
});


//Marking Scheme api
router.post("/marking_scheme_create", (req, res, next) => {
    let ownerId=req.user._id;
    let scheme=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    let f=new MarkingShemes(scheme);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="done";
            console.log(f);
            ret.status="success";
        }
        res.status(200).json(ret);
    });
});
router.post("/marking_scheme_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let marking_scheme=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    MarkingShemes.findOneAndUpdate({_id:marking_scheme._id},marking_scheme,function(err){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});
router.post("/marking_scheme_delete/:marking_scheme_id", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let marking_scheme_id = req.params.marking_scheme_id;
    MarkingShemes.findOneAndDelete({_id:marking_scheme_id},function(err,marking_scheme){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.scheme_removed=marking_scheme;
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});
router.get("/marking_schemes",(req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    //this is base64
    let filter = req.query;
    let filterObj = {};
    if(filter)
    {
        
        filterObj = filter
    }
    console.log(filterObj);

    MarkingShemes.find(filterObj).exec(function(err,schemes){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=schemes;
            ret.status ="success";
            ret.message = 'done';
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/marking_scheme_get/:marking_scheme_id",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let marking_scheme_id = req.params.marking_scheme_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    // let name=req.body.name;

    MarkingShemes.findById(marking_scheme_id).exec(function(err,scheme){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            console.log(scheme);
            ret.data=scheme;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});

//Streams api
router.post("/stream_create", (req, res, next) => {
    let ownerId=req.user._id;
    let stream=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    let f=new Streams(stream);
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
router.post("/stream_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let stream=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let streamId=stream._id;
    delete stream._id;
    Streams.updateOne({_id:streamId},stream,function(err){
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
router.post("/stream_delete/:stream_id", (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let stream_id = req.params.stream_id;
    Streams.findOneAndDelete({_id:stream_id},function(err,stream){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.stream=stream;
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});
router.get("/streams",(req, res, next) => {
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

    Streams.find(filterObj).exec(function(err,schemes){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=schemes;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });

});

router.get("/streams_and_branches",async (req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let streams=await Streams.find();
        let branches = await Branches.find();
        ret.data = {streams,branches};
        ret.status="success";
        ret.message="done";

    }
    catch(err)
    {
        ret.message=err.message;
    }
    res.status(200).json(ret);

});

// streams_batches_subjects_schemes

router.get("/streams_batches_subjects_schemes",async (req, res, next) => {
    let ownerId=req.user._id;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let streams=await Streams.find();
        let batches = await Batches.find();
        let schemes=await MarkingShemes.find();
        let subjects = await Subjects.find();
        let instructions = await Instructions.find();
        ret.data = {streams,batches,subjects,schemes,instructions};
        ret.status="success";
        ret.message="done";

    }
    catch(err)
    {
        ret.message=err.message;
    }
    res.status(200).json(ret);

});

router.get("/stream_get/:stream_id",(req, res, next) => {
    let stream_id = req.params.stream_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    // let name=req.body.name;

    Streams.findById(stream_id).exec(function(err,stream){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            console.log(stream);
            ret.data=stream;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});

//Subjects api
router.post("/subject_create", (req, res, next) => {
    let ownerId=req.user._id;
    let subject=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    let f=new Subjects(subject);
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

router.post("/subject_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let subject=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    Subjects.findOneAndUpdate({_id:subject._id},subject,function(err){
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

router.post("/subject_delete/:subject_id", (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let subject_id = req.params.subject_id;
    Subjects.findOneAndDelete({_id:subject_id},function(err,subject){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.subject=subject;
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});


router.get("/subjects",(req, res, next) => {
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

    Subjects.find(filterObj).sort({name:1}).populate("streams").exec(function(err,subjects){
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

router.get("/subject_get/:subject_id",(req, res, next) => {
    let subject_id = req.params.subject_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    Subjects.find({_id:subject_id}).populate("streams").exec(function(err,subjects){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            console.log(subjects);
            ret.data=subjects[0];
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});

router.get("/subject_get/:stream_id",(req, res, next) => {
   let ownerId=req.user._id;
   let permission = "academic_desk_read";
   
   let stream_id = req.params.stream_id;

   let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
   if(!checkForPermission(req.user,permission))
   {
       res.status(200).json(ret);
   }
   
    let filterObj = {streams:[stream_id]};
    
   Subjects.find(filterObj).exec(function(err,subjects){
       if (err)
       {
         console.log("some error occured:"+err); 
         ret.message= "some error occured"; 
       }
       else{
           console.log(subjects);
           ret.data=subjects;
           ret.message = "done";
           ret.status ="success";
       } 
       res.status(200).json(ret);
   });
}); 


//Branches api
router.post("/branch_create", (req, res, next) => {
    let ownerId=req.user._id;
    let branch=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let f=new Branches(branch);
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
router.post("/branch_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let branch=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    Branches.findOneAndUpdate({_id:branch._id},branch,function(err){
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
router.post("/branch_delete/:branch_id", (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let branch_id = req.params.branch_id;
    Branches.findOneAndDelete({_id:branch_id},function(err,branch){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.branch=branch;
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});
router.get("/branches",(req, res, next) => {
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

    Branches.find(filterObj).exec(function(err,schemes){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=schemes;
            ret.status ="success";
            ret.message = 'done';
        } 
        res.status(200).json(ret);
    });
});

router.get("/branch_get/:branch_id",(req, res, next) => {
    let branch_id = req.params.branch_id;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    // let name=req.body.name;

    Branches.findById(branch_id).exec(function(err,branch){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            console.log(branch);
            ret.data=branch;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});


//Packages
router.post("/package_create", (req, res, next) => {
    let ownerId=req.user._id;
    let package=req.body;
    // console.log(topic);
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    let f=new Packages(package);
    f.save((err)=>{
        if (err) {
            ret.message= "some error occured";
            console.log(err);
    }
        else {
            console.log("no error occured");
            ret.message="done";
            ret.status="success";
            // ret.id=f._id;
            // res.redirect("/directories/"+req.params.directory);
        }
        res.status(200).json(ret);
    });
});
router.post("/package_edit/", (req, res, next) => {
    let ownerId=req.user._id;
    let package=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    Packages.updateOne({_id:package._id},package,function(err){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.message = "done";
                // ret.package_removed=package;
                // res.status(200).json(ret);
            } 

            res.status(200).json(ret);
        });
});


router.post("/package_delete/:packageId", (req, res, next) => {
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
        return;
    }
    let packageId = req.params.packageId;
    Packages.findOneAndDelete({_id:packageId},function(err,package){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                ret.package_removed=package;
                ret.message = "done";
                // res.status(200).json(ret);
            } 

            res.status(200).json(ret);
        });
});



router.get("/packages",(req, res, next) => {
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    try{
        let ownerId=req.user._id;
    }
    catch(err){
        ret.status="failed";
        ret.message = "user id not found";
        res.status(200).json(ret);
        return;
    }
    let classNumber= req.query.class_number;
    let permission = "academic_desk_read";

    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
        return;
    }

    //this is base64
    let filter = req.query;
    let filterObj = {};
    if(filter)
    {
        
        filterObj = filter;

    }
    console.log(filterObj);

    Packages.find(filterObj).populate("stream").exec(function(err,packages){
        if (err)
        {
          console.log("some error occured:"+err);  
          ret.message= "some error occured";
        }
        else{
            ret.data=packages;
            ret.status ="success";
            ret.message = 'done';
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

router.get("/package_get/:packageId",(req, res, next) => {
    // let ownerId=req.user._id;
    // let filter = req.query.filter;
    let packageId = req.params.packageId;

    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    // let name=req.body.name;

    Packages.findById(packageId).exec(function(err,package){
        if (err)
        {
          console.log("some error occured:"+err); 
          ret.message= "some error occured"; 
        }
        else{
            console.log(package);
            ret.data=package;
            ret.message = "done";
            ret.status ="success";
            // res.status(200).json(ret);
        } 
        res.status(200).json(ret);
    });

});

module.exports=router;
