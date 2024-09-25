const express = require("express");
const router = express.Router();
const passport = require("passport");

const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
const bcrypt = require("bcrypt");
const Inquiries = require("../../databases/inquiry");
const sendMessage = require('../../utility/connectivity_functions');
const {performValidationPanel} = require("../../utility/authentication_functions");

const tags = {'reiki':'drsurabhi.reiki@gmail.com',
                'neoned71':'neoned71@gmail.com',
                'ztech':'ashukla20000',
                'winsor':'singhkirat50@gmail.com'}

router.get("/",async function(req,res,next){
    let ret = { status:"success",message:'Welcome to Inquiry api root!',content:[{path:"/new",method:"post",arguments:['name','message','phone','email'],parameters:[],authentication:"None"},
                                                                                 {path:"/all",method:"get",arguments:[],parameters:[],authentication:"panel"},
                                                                                 {path:"/one",method:"get",arguments:[],parameters:['inquiry_id'],authentication:"panel"}  ] };
    res.status(200).json(ret);
});


router.post("/new",async function(req,res,next){
    let ret = { status:"failed",message:'Failed due to incomplete data' };
	//console.log(req.body);
    try{
        let name = req.body.name;
        let phone = req.body.phone;
        let message = req.body.message;
        let email = req.body.email;
        let tag = req.body.tag;
        if(tag==null || !tags[tag])
        {
            ret.message="Please check the tag";
            ret.status="failed";
            res.json(ret);
            return;
        }
        let i = await Inquiries.Inquiry({name,phone,message,email,tag});
        //console.log(i);
	if(i){
        	await sendMessage(tags[tag],{subject:"You Have recieved a new inquiry",text:"From: "+name+"\nPhone:"+phone+"\nEmail: "+email+"\nMessaage: "+message},'email');
        	ret.status = "success";
        	ret.message = "inquiry added to the system";
	}
	else{
	//	console.log(i);
	}
    }
    catch(err){
        //console.log(err);
        message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/all", performValidationPanel,async function(req,res,next){
    let ret = { status:"failed",message:'Failed to aquire data from database' };
    try{
        
        let inquiries = await Inquiries.getInquiries();
        ret.status = "success";
        ret.data=inquiries;
        ret.message = "done";

        }
    catch(err){
        console.log(err);
        message = err.message;
    }
    res.status(200).json(ret);
});

router.get("/one/:inquiry_id",performValidationPanel,async function(req,res,next){

    let ret = { status:"failed",message:'Failed to aquire data from database' };
    try{
        let inquiry_id = req.params.inquiry_id;
        if(!inquiry_id)
        {
            throw "No inquiry id present!";
        }
        let inquiry = await Inquiries.getInquiry(inquiry_id);
        if(!inquiry)
        {
            throw "No inquiry present!";
        }
        ret.status = "success";
        ret.data=inquiry;
        ret.message = "done";

        }
    catch(err){
        console.log(err);
        message = err;
    }
    res.status(200).json(ret);
});
module.exports = router;
