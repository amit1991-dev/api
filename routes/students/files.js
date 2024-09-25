const multer = require("multer");
const path = require('path');

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




const multerStorageFile = multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log(req.originalUrl);
      var destination = "../../content/images/";
      req.destination=path.join(__dirname, destination);
      console.log(req);
      cb(null, req.destination);
        
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];

      
        var name = `${Date.now()}.jpeg`;
      //   var name = "sd.png";
        req.name=name;
        console.log(req.name);
        cb(null, name);
    }
  });

  const multerFilterFile = (req, file, cb) => {
      // console.log("file mimetype:" + file.mimetype);
    cb(null, true);
  };



var uploadFiles = multer({
  storage: multerStorageFile,
  fileFilter: multerFilterFile,
});

const express = require("express");

const router = express.Router(); // route : {root}/shopping/

// router.post("/image_upload",uploads.single('image'), (req, res, next) => {
//     // console.log(1);
//     var url = "/content/images/" + req.name;
//     res.status(200).json({status:"success",data:url});
// });

// router.post("/upload_file",uploadFiles.single('file'), async (req, res, next) => {
//     console.log(1);
//     var url = "/content/files/" + req.name;
//     let permission = "academic_desk_read";


//     try{
//       var file=Files({name:req.name,url:url,owner:req.user._id});
//       await file.save();
//       console.log("file saved in the database");
//       res.status(200).json({status:"success",data:url});
//     }
//     catch(e)
//     {
//       console.log(e.message);
//       res.status(200).json({status:"failed",message:"saving file in the db failed"});

//     }

//     // res.status(200).json({status:"success",data:url});
// });

router.post("/image_upload",uploadFiles.single('image'), async (req, res, next) => {
    console.log(1);
    var url = "/content/images/" + req.name;
    let permission = "academic_desk_read";

    try{
     
      console.log(url);
      res.status(200).json({status:"success",data:url});
    }
    catch(e)
    {
      console.log(e.message);
      res.status(200).json({status:"failed",message:"saving file in the db failed"});

    }

    // res.status(200).json({status:"success",data:url});
});


// router.get("/",(req, res, next) => {
//     let ownerId=req.user._id;
//     let permission = "academic_desk_read";

//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed"};
//     if(!checkForPermission(req.user,permission))
//     {
//       res.status(200).json(ret);
//     }
//     let filter = req.query;
//     let filterObj = {};
//     if(filter)
//     {
//       filterObj = filter;
//     }
//     Files.find(filterObj).sort({'createdAt':-1}).exec(function(err,files){
//         if (err)
//         {
//           console.log("some error occured:"+err);  
//           ret.message= "some error occured";
//         }
//         else{
//             ret.data=files;
//             ret.status ="success";
//             // res.status(200).json(ret);
//         } 
//         res.status(200).json(ret);
//     });
// });


module.exports = router;

