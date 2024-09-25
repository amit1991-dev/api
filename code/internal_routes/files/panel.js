const multer = require("multer");
const path = require('path');
const {Batches} = require("../../databases/student_center/batches");
const Students = require("../../databases/student_center/students");
const {Fees} = require("../../databases/student_center/fees");

const express = require("express");

const Files = require("../../databases/system/files");

const multerS3 = require("multer-s3");
const awsSdk = require("aws-sdk");

const reader = require('xlsx');


require("dotenv").config();

awsSdk.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region:process.env.AWS_S3_REGION
});

// const path = require('path');
// const express = require("express");

const router = express.Router();

const multerStorageFile = multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log(req.originalUrl);
      var destination = "../../../content/files/";
      req.destination=path.join(__dirname, destination);
      // console.log(req);
      cb(null, req.destination);
        
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];

      
        var name = `${Date.now()}.${ext}`;
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

 // route : {root}/shopping/

// router.post("/student_bulk_upload",uploadFiles.single('file'), async (req, res, next) => {
//     console.log('amit');
//     let ownerId = req.user._id;
//     var url = "/home/amit/api-server/content/files/" + req.name;
    

//     const file = reader.readFile(url);
  
//     let data = []
  
//     const sheets = file.SheetNames
  
//     for(let i = 0; i < sheets.length; i++)
//     {
//       const temp = reader.utils.sheet_to_json(
//             file.Sheets[file.SheetNames[i]])
//       temp.forEach((res) => {
//           data.push(res)
//       })
//     }
//     let errors=[];
//     try{
//       //console.log(data);
//       //TODO: Create students document and return responses.
//       for(var i =0 ; i<data.length;i++){
//         let student = data[i];
//         let t,f;
//         let message="";
//         try{
          
//           if(!(await Users.exists({phone:student.phone}))){
//             t = new Users({phone:student.phone});
//             await t.save();
//           }
//           else{
//             t=await Users.findOne({phone:student.phone});
//           }
//           if(!(await Students.exists({user:t._id}))){
            
//             student.user = t._id;
            
            
//             delete student.fees;
//             // console.log(student);
//             student.staff = ownerId;
//             if(student.gender){
//               student.gender=student.gender.trim();
//               student.gender=student.gender.toLowerCase();
//             }
//             f=new Students({stream:student.stream_id,branch:student.branch_id,gravity_student:true,name:student.name,user:t._id,phone:student.phone,email:student.email,guardian_name:student.guardian_name,guardian_phone:student.guardian_phone});
//             await f.save();
//             let fees = new Fees({student:f._id,amount:0});
//             await fees.save();
//             if(student.batch_id){
//               console.log("attempting to add student into the batch");
//                 await Batches.addStudent(student.batch_id,f._id);
//             }
//             message="Added new student successfully";
//           }else{
//             message = "Student Already Exists";
//           }
          
          
          
//           errors.push({serial_number:i+1,status:"success",error:"None",message:message});
//         }
//         catch(err){
//           errors.push({serial_number:i+1,status:"failed",message:err.message});
//         }
        
//       }
//       res.status(200).json({status:"success",data:errors});
//     }
//     catch(e)
//     {
//       console.log(e.message);
//       res.status(200).json({status:"failed",message:e.message});

//     }
// });

router.post("/student_bulk_upload", uploadFiles.single('file'), async (req, res, next) => {
  console.log('amit');
  let ownerId = req.user._id;
  // var url = "/home/amit/api-server/content/files/" + req.name;
  // var url = "/home/amit/api/content/files/" + req.name;
  var url = "/home/ubuntu/api/content/files/" + req.name;


  const file = reader.readFile(url);

  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
          data.push(res);
      });
  }

  let errors = [];

  try {
      for (var i = 0; i < data.length; i++) {
          let student = data[i];
          let t, f;
          let message = "";

          try {
              if (!(await Users.exists({ phone: student.phone })) ){
                  t = new Users({ phone: student.phone });
                  await t.save();
              } else {
                  t = await Users.findOne({ phone: student.phone });
              }

              if (await Students.exists({ user: t._id })) {
                  // Update the existing student's information
                  const existingStudent = await Students.findOne({ user: t._id });

                  const updatedStudentData = {
                      stream: student.stream_id,
                      branch: student.branch_id,
                      gravity_student: true,
                      name: student.name,
                      user: t._id,
                      phone: student.phone,
                      email: student.email,
                      guardian_name: student.guardian_name,
                      guardian_phone: student.guardian_phone,
                      // Add any other fields you want to update
                  };

                  await existingStudent.updateOne(updatedStudentData);

                  if (student.batch_id) {
                      await Batches.addStudent(student.batch_id, existingStudent._id);
                  }

                  message = "Updated student successfully";
              } else {
                  // Create a new student record
                  student.user = t._id;
                  f = new Students({
                      stream: student.stream_id,
                      branch: student.branch_id,
                      gravity_student: true,
                      name: student.name,
                      user: t._id,
                      phone: student.phone,
                      email: student.email,
                      guardian_name: student.guardian_name,
                      guardian_phone: student.guardian_phone
                      // Add any other fields you want to set for a new student
                  });
                  await f.save();

                  let fees = new Fees({ student: f._id, amount: 0 });
                  await fees.save();

                  if (student.batch_id) {
                      await Batches.addStudent(student.batch_id, f._id);
                  }

                  message = "Added new student successfully";
              }

              errors.push({ serial_number: i + 1, status: "success", error: "None", message: message });
          } catch (err) {
              errors.push({ serial_number: i + 1, status: "failed", message: err.message });
          }
      }

      res.status(200).json({ status: "success", data: errors });
  } catch (e) {
      console.log(e.message);
      res.status(200).json({ status: "failed", message: e.message });
  }
});


const s3 = new awsSdk.S3();

var s3Upload = multer({
  storage: multerS3({
      s3: s3,
      acl: 'public-read',
      contentType:multerS3.AUTO_CONTENT_TYPE,
      bucket: process.env.AWS_S3_BUCKET,
      key: function (req, file, cb) {
          console.log(file);
          cb(null, Date.now()+"_"+file.originalname); //use Date.now() for unique file keys
      }
  })
});

// const router = express.Router();


router.post('/single_file_upload', s3Upload.single('g_file'), async function (req, res, next) {
  console.log(req.file);
  
    // 0|test_series_api  |   fieldname: 'g_file',
    // 0|test_series_api  |   originalname: 'Untitled circuit.qasm',
    // 0|test_series_api  |   encoding: '7bit',
    // 0|test_series_api  |   mimetype: 'application/octet-stream',
    // 0|test_series_api  |   size: 89,
    // 0|test_series_api  |   bucket: 'gravity-files',
    // 0|test_series_api  |   key: '1686302857777_Untitled circuit.qasm',
    // 0|test_series_api  |   acl: 'private',
    // 0|test_series_api  |   contentType: 'application/octet-stream',
    // 0|test_series_api  |   contentDisposition: null,
    // 0|test_series_api  |   contentEncoding: null,
    // 0|test_series_api  |   storageClass: 'STANDARD',
    // 0|test_series_api  |   serverSideEncryption: null,
    // 0|test_series_api  |   metadata: null,
    // 0|test_series_api  |   location: 'https://gravity-files.s3.us-east-2.amazonaws.com/1686302857777_Untitled%20circuit.qasm',
    // 0|test_series_api  |   etag: '"41299be4e4ef5838193a858ea0b24f72"',
    // 0|test_series_api  |   versionId: undefined
    // 0|test_series_api  | }
    
  let owner = req.user._id;
  let url = req.file.location;
  let ret = {status:"failed",message:"done"};
  try{
    let f = new Files({url:url,owner:owner,name:req.file.originalname,key:req.file.key,size:req.file.size,content_type:req.file.contentType,information:{}});
    await f.save();
    ret.status="success";
  }
  catch(err){
    ret.message = err.message;
  }
  res.status(200).json(ret);
  res.end();
});

// router.post('/academic_file_upload', s3Upload.single('g_file'), async function (req, res, next) {
//   console.log(req.file);
  
//     // 0|test_series_api  |   fieldname: 'g_file',
//     // 0|test_series_api  |   originalname: 'Untitled circuit.qasm',
//     // 0|test_series_api  |   encoding: '7bit',
//     // 0|test_series_api  |   mimetype: 'application/octet-stream',
//     // 0|test_series_api  |   size: 89,
//     // 0|test_series_api  |   bucket: 'gravity-files',
//     // 0|test_series_api  |   key: '1686302857777_Untitled circuit.qasm',
//     // 0|test_series_api  |   acl: 'private',
//     // 0|test_series_api  |   contentType: 'application/octet-stream',
//     // 0|test_series_api  |   contentDisposition: null,
//     // 0|test_series_api  |   contentEncoding: null,
//     // 0|test_series_api  |   storageClass: 'STANDARD',
//     // 0|test_series_api  |   serverSideEncryption: null,
//     // 0|test_series_api  |   metadata: null,
//     // 0|test_series_api  |   location: 'https://gravity-files.s3.us-east-2.amazonaws.com/1686302857777_Untitled%20circuit.qasm',
//     // 0|test_series_api  |   etag: '"41299be4e4ef5838193a858ea0b24f72"',
//     // 0|test_series_api  |   versionId: undefined
//     // 0|test_series_api  | }
    
//   let owner = req.user._id;
//   let url = req.file.location;
//   let ret = {status:"failed",message:"done"};
//   try{
//     let f = new Files({url:url,owner:owner,name:req.file.originalname,key:req.file.key});
//     await f.save();
//     ret.status="success";
//   }
//   catch(err){
//     ret.message = err.message;
//   }
//   res.status(200).json(ret);
//   // res.end();
// });



router.get('/all', async function (req, res, next) {
  let ret = {status:"failed",message:"done"};
  try{
    let files = await Files.find({}).sort({createdAt:-1});
    // await f.save();
    ret.status="success";
    ret.data = files;
  }
  catch(err){
    ret.message = err.message;
  }
  res.status(200).json(ret);
});

router.get('/single/:file_id', async function (req, res, next) {
  let fileId = req.params.file_id;
  let ret = {status:"failed",message:"done"};
  try{
    let file = await Files.findById(fileId).lean();
    ret.status="success";
    ret.data = file;
  }
  catch(err){
    ret.message = err.message;
  }
  res.status(200).json(ret);
});

router.get('/remove/:file_id', async function (req, res, next) {
  let fileId = req.params.file_id;
  let ret = {status:"failed",message:"done"};
  try{
    let file = await Files.findById(fileId).lean();
    let key = file.key;
    console.log(key);
    if(key){
      s3.deleteObject({
        Bucket:process.env.AWS_S3_BUCKET,
        Key:key
      });
    }
    await Files.deleteOne({_id:fileId});
    ret.status="success";
  }
  catch(err){
    ret.message = err.message;
  }
  res.status(200).json(ret);
});

module.exports = router;

 

