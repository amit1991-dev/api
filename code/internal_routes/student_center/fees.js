const express = require("express");
const router = express.Router();
const {Fees,Installments} = require("../../databases/student_center/fees");
// const Questions = require("../../databases/student_center/questions");


function checkForPermission(){
    return true;
}
//Fees api

router.get("/",async (req, res, next) => {
    let query = req.query;
    let permission = "academic_desk_read";
    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let fees = await Fees.find(query).populate(["student"]);
        console.log(fees);
        ret.data=fees;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.get("/single/:student_id",async(req, res, next) => {
    let query = req.query;
    let studentId = req.params.student_id;
    let permission = "academic_desk_read";

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        let fees = await Fees.findOne({student:studentId}).populate(["student"]).lean();
        let installments = await Installments.find({fee:fees._id});
        fees.installments = installments;
        console.log(fees);
        ret.data=fees;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.post("/installments/create/:fees_id",async (req, res, next) => {
    let query = req.query;
    let feesId = req.params.fees_id;
    let permission = "academic_financial_write";
    let installment = req.body;// {amount, timestamp}
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        if(!installment){
            throw {message:"Installment missing..."};
        }
        installment.installment_status = {received:false,payment_mode:"",payment_reference_number:"",timestamp:"",receipt_number:""};
        installment.fees = feesId;
        let i =new Installments(installment);
        await i.save();
        console.log(i);
        ret.data=i;
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.post("/installments/delete/:installment_id",async (req, res, next) => {
    let query = req.query;
    let installmentId = req.params.installment_id;
    let permission = "academic_financial_write";
    // let installment = req.body;// {amount, timestamp}
    

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
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.post("/installments/mark_receive/:installment_id",async (req, res, next) => {
    let query = req.query;
    let staff = req.user._id;
    let installmentId = req.params.installment_id;
    let permission = "academic_financial_write";
    // let installment = req.body;// {amount, timestamp}
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        
        await Installments.updateOne({_id:installmentId},{$set:{installment_status:{received:true,timestamp:Date.now(),staff:staff}}});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

router.post("/installments/edit/:installment_id",async (req, res, next) => {
    let query = req.query;
    let staff = req.user._id;
    let installmentId = req.params.installment_id;
    let permission = "academic_financial_write";
    let installment = req.body;
    

    let ret={message:"Sorry you are not allowed to perform this task, permission denied.",status:"failed"};
    if(!checkForPermission(req.user,permission))
    {
        res.status(200).json(ret);
    }

    try{
        delete installment.installment_status;
        delete installment._id;
        delete installment.fees;
        await Installments.updateOne({_id:installmentId},{$set:installment});
        ret.message = "done";
        ret.status ="success";
    }
    catch(err){
        console.log("some error occured:"+err); 
        ret.message= err.message ; 
    }
    res.status(200).json(ret);
});

module.exports=router;