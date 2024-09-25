const express = require("express");
const router = express.Router();
const {Instructions} = require("../../databases/student_center/academics");

function checkForPermission(){
    return true;
}

router.get("/",(req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    Instructions.find(query).exec(function(err,instructions){
        if (err)
        {
            console.log("some error occured:"+err); 
            ret.message= "some error occured" ; 
        }
        else{
            // console.log(batches);
            ret.data=instructions;
            ret.message = "done";
            ret.status ="success";
        } 
        res.status(200).json(ret);
    });
});


router.post("/create", (req, res, next) => {
    let ownerId=req.user._id;
    let instructions=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    console.log(instructions);
    let f=new Instructions(instructions);
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


router.post("/edit/:instruction_id", async (req, res, next) => {
    let ownerId=req.user._id;
    let instructions=req.body;
    let permission = "academic_desk_create";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let instruction_id = req.params.instruction_id;
    try{
        await Instructions.updateOne({_id:instruction_id},{$set:instructions});
        ret.status="success";
        ret.message = "done";
    }
    catch(err){
        console.log("some error occured:"+err);  
        ret.message="some error occured";
    }
    res.status(200).json(ret);
});

router.post("/delete/:instruction_id", (req, res, next) => {
    let permission = "academic_desk_create";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    let instruction_id = req.params.instruction_id;
    Instructions.deleteOne({_id:instruction_id},function(err,batch){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "some error occured";
            }
            else{
                ret.status="success";
                // ret.batch=batch;
                ret.message = "done";
            } 
            res.status(200).json(ret);
        });
});

router.get("/single/:instruction_id",async (req, res, next) => {
    let instruction_id = req.params.instruction_id;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }
    try{
        let instructions = await Instructions.findById(instruction_id);
        ret.status = "success";
        ret.message = 'done';
        ret.data = instructions;
    }
    catch(err){
        ret.message = err.message;
    }
    res.status(200).json(ret);
});

module.exports=router;