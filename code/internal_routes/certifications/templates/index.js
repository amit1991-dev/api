
const express = require("express");
const router = express.Router();

const Users = require("../../../databases/system/users.js");

const Templates = require("../../../databases/certifications/templates.js");

router.get("/all",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const filters=req.queries || {};
	let templates = await Templates.listing(filters);
	if(Templates)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = templates;
	}

	res.status(200).json(ret);
});

router.get("/single/:template_id",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const template_id=req.params.template_id;
	let template = await Templates.getTemplate(template_id);
	if(template)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = template;
	}
	res.status(200).json(ret);
});

router.put("/", async (req, res, next) => {
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role != "administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let template=req.body;

    try{
        let d=new Templates(template);
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

router.post("/:template_id", async (req, res, next) => {
	let template_id = req.params.template_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let template=req.body;
    

    try{
        if(Templates.updateTemplate(template_id,template))
        {
        	ret.message="done";
        	ret.status = "success";
        }
        else
        {
        	ret.message = "some error occured";
        }
        
    }
    catch(err)
    {
        ret.message = err.message;   
    }
    res.status(200).json(ret);
});

router.delete("/:template_id", async(req, res, next) => {
    let ret={message:"",status:"failed"};

    let template_id = req.params.template_id;
    console.log(template_id);
    Templates.findOneAndDelete({_id:template_id},function(err){
            if (err)
            {
              console.log("some error occured:"+err);  
              ret.message= "Reason:"+err.message;
            }
            else{
                ret.status="success";
                ret.message = "done";
            }
            res.status(200).json(ret);
        });
});

module.exports = router;
