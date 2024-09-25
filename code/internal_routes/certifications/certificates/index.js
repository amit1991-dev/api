
const express = require("express");
const router = express.Router();

const Certificates = require("../../../databases/certifications/certificates");
const CertificateConfigurations = require("../../../databases/certifications/panel.js");
const Users = require("../../../databases/system/users.js");

router.get("/all",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const filters=req.queries || {};
	let certificates = await Certificates.listing(filters);
    

	if(certificates)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = certificates;
	}

	res.status(200).json(ret);
});

router.get("/single/:certificate_id",async function(req,res){
	let ret = {status:"failed",code:-1,message:"failed"};
	const certificateId=req.params.certificate_id;
	let certificate = await Certificates.getCertificate(certificateId);
	if(certificate)
	{
		ret.status="success";
		ret.code=200;
		ret.message="done";
		ret.data = certificate;
	}

	res.status(200).json(ret);
});

router.get("/display/:certificate_id",async function(req,res){
    let ret = {status:"failed",code:-1,message:"failed"};
    const certificateId=req.params.certificate_id;
    let certificate = await Certificates.getCertificate(certificateId,true);
    Certifications
    if(certificate)
    {
        ret.status="success";
        ret.code=200;
        ret.message="done";
        ret.data = certificate;
    }

    res.status(200).json(ret);
});

router.get("/configurations",async function(req,res){
    let ret = {status:"failed",code:-1,message:"failed"};
    const userId=req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role != "administrator")
    {
        res.status(200).json(ret);
        return;
    }

    let configurations = await CertificateConfigurations.get(userId);
    if(configurations)
    {
        ret.status="success";
        ret.code=200;
        ret.message="done";
        ret.data = configurations;
    }

    res.status(200).json(ret);
});

router.post("/configurations/", async(req, res, next) => {
    // let certificateId = req.params.certificate_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
        res.status(200).json(ret);
        return;
    }
    let configurations=req.body;
    

    try{
        if(CertificateConfigurations.update(userId,configurations))
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

router.put("/", async function(req, res, next) {
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role != "administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let certificate=req.body;

    try{
        let d=new Certificates(certificate);
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

router.post("/:certificate_id", async(req, res, next) => {
	let certificateId = req.params.certificate_id;
    let ret={message:"Not authorized",status:"failed"};
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
    	res.status(200).json(ret);
    	return;
    }
    let certificate=req.body;
    

    try{
        if(Certificates.updateCertificateInfo(certificateId,certificate))
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

router.delete("/:certificate_id", async(req, res, next) => {
    let ret={message:"",status:"failed"};

    let certificate_id = req.params.certificate_id;
    let userId = req.user._id;
    let user = await Users.findById(userId);

    if(!user || user.role!="administrator")
    {
        res.status(200).json(ret);
        return;
    }
    Certificates.findOneAndDelete({_id:certificate_id},function(err){
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
