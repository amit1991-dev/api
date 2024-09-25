const express = require("express");
const router = express.Router();

const Directories = require("../node_models/directories.js");
const Files = require("../node_models/files.js");

const mongoose = require("mongoose");
// const passport = require("passport");

router.get("/", (req, res, next) => {
    var result=[];
    let ret={message:"",status:"failed"};
    console.log("yes:"+req.user._id);
    Directories.find({owner:req.user._id},function(err,dir){
        if (err)
        {
          console.log("some error occured:"+err);  
        }
        else{
            ret.status="success";
            ret.directories=dir;
            ret.user = req.user;
            delete ret.user.password;
            res.status(200).json(ret);
        } 
    });
});

router.post("/create", (req, res, next) => {
    let ownerId=req.user._id;
    let name=req.body.name;
    let ret={message:"",status:"failed"};
    console.log("name: "+name);

    let d=new Directories({name:name,owner:ownerId});
    d.save((err)=>{
        if (err) ret.message="Name already exists!!";
        else {

            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            // res.redirect("/directories");
        }
        res.status(200).json(ret);

    });

});

router.get("/files/:directory", (req, res, next) => {
    var result=[];
    console.log("yes:");
    let ret={message:"",status:"failed"};;
    Files.find({owner:req.user._id,directory:req.params.directory},function(err,files){
        if (err)
        {
          console.log("some error occured:"+err);  
        }
        else{
            ret.result=files;
            ret.status ="success";
            res.status(200).json(ret);
        } 
    });
});

router.post("/files/create/:directory", (req, res, next) => {
    let ownerId=req.user._id;
    let name=req.body.name;
    let ret={message:"",status:"failed"};

    let f=new Files({name:name,owner:ownerId,directory:req.params.directory,type:"draw"});
    f.save((err)=>{
        if (err) {
            ret.message="error: "+err;
            
    }
        else {
            console.log("no error occured");
            ret.message="Successfully created";
            ret.status="success";
            // res.redirect("/directories/"+req.params.directory);
        }
        res.json(ret);
    });
});


router.get("/files/access/:directory/:file",(req, res, next) => {
    let ownerId=req.user._id;
    // let name=req.body.name;

    Files.findOne({directory:req.params.directory,_id:req.params.file},function(err,file){
        if (err) {
            console.log("some error occured"+err);
            res.end();
        }
        else{
            ret.data={directory:req.params.directory,file:file};
            ret.status="success";
            res.status(200).json(ret);
        }
    });

});

router.post("/files/save/:directory/:file",(req, res, next) => {
    let ownerId=req.user._id;
    let d=JSON.parse(req.body.data);
    let ret={message:"",status:"failed"};
    Files.findOneAndUpdate({directory:req.params.directory,_id:req.params.file},{ $push: { data:d}},function(err){
        if(!err)
        {
            ret.status="success";
            ret.message="saved successfully";
        }
        else
        {
            ret.message="error:"+err;
        }
        
        res.json(ret);
    });

});

//to be tested
router.post("/files/share/:file",async (req, res, next) => {
    let ownerId=req.user._id;
    let email=req.body.email;
    let ret={message:"",status:"failed"};
    try{
    	user=await User.findOne({email:email},{_id:1});
	    var user_id =user._id;
	    console.log("id of the target user : "+user_id._id);
	    file=await Files.findOne({_id:req.params.file});

	    console.log("id of the target file : "+file._id);
	    if(user_id && file)
	    {
	    	var directory_id=await Directories.findOne({name:"Shared",owner:user_id},{"_id":1});
	    	if(directory_id)
	    	{
	    		var newdoc = new Files({name:file.name+Date.now()+"from_"+req.user.name,owner:user_id,data:file.data,directory:directory_id});
	            // newdoc._id = mongoose.Types.ObjectId();
	            // // newdoc__v
	            // newdoc.owner=user_id;
	            // newdoc.directory = directory_id;
	            // delete(newdoc.__v);
	            var t=await newdoc.save();
	            if(t)
	            {
	            	ret.data=t;
	            	ret.status=true;
	            	res.json(ret);
	            }
	            else
		    	{
		    		console.log("1");
		    		res.json(ret);
		    	}
	    	}
	    	else
	    	{
	    		console.log("2");
	    		res.json(ret);
	    	}
	    }
	    else
	    {
	    	console.log("3");
	    	res.json(ret)
	    }
    }
    catch(e){
    	console.log(e);
    	res.json(ret)
    }
    
});

router.get("/files/clear/:directory/:file",(req, res, next) => {
    let ownerId=req.user._id;
    // let d=JSON.parse(req.body.data);
    let ret={message:"",status:"failed"};
    Files.findOneAndUpdate({directory:req.params.directory,_id:req.params.file},{  data:[] },function(err){
        if(!err)
        {
            ret.status="success";
            ret.message="cleared successfully";
        }
        else
        {
            ret.message="error:"+err;
        }
        
        res.json(ret);
    });

});

// router.post("/files/save/:directory/:file",(req, res, next) => {
//     let ownerId=req.user._id;
//     let data=req.body.data;
//     let ret={message:"",status:"failed"};
//     Files.findOneAndUpdate({owner:ownerId,directory:req.params.directory,_id:req.params.file},{data:data},function(err){
//         if(!err)
//         {
//             ret.status="success";
//             ret.message="saved successfully";
//         }      
//         res.json(ret);
//     });
// });



router.get("/files/retrieve/:directory/:file",(req, res, next) => {
    // let ownerId=req.user._id;
    let ret={message:"",status:"failed"};
    Files.findOne({directory:req.params.directory,_id:req.params.file},function(err,file){
        if(!err)
        {
            ret.status="success";
            ret.data=file;
            ret.message="saved successfully";
        }
        
        res.json(ret);
    });

});


