

const express = require("express");
const router = express.Router();

const {Events} = require("../databases/events/events.js");
const Users = require("../databases/system/users.js");
const Bookings = require("../databases/events/bookings.js");
const {performValidationPanel} = require('../utility/authentication_functions.js');

const studentCenterPanelRoute = require("./student_center/panel");
const filesRoute = require("./files/panel");

router.use("/files",performValidationPanel,filesRoute);
router.use("/",performValidationPanel,studentCenterPanelRoute);

// router.get("/dashboard",performValidationPanel, async (req, res, next) => {
//     let user_id=req.user._id;
//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed",code:0};
//     if(req.user.role!="administrator"){
//         res.status(200).json(ret);
//         return;
//     }
//     console.log("here reached");

//     try{
//         let finalPackage=new Object();

//         let events = await Events.find({}).sort({createdAt:-1}).limit(5);
//         // events=events.map(function(element){
//         //     element= element.toObject();
//         //     return element;
//         // });
//         finalPackage.events = events;

//         let bookings = await Bookings.find({}).populate([{path:"user"},{path:"host"},{path:"event",populate:["host","medias"]},{path:"tickets"},{path:"transaction"}]).sort({createdAt:-1}).limit(5);
//         finalPackage.bookings = bookings;
//         console.log(bookings.length);

//         let users = await Users.find({}).sort({createdAt:-1}).limit(5);
//         finalPackage.users = users;

        

//         // let profile = await Users.findOne({"_id":user_id});
//         // profile=profile.toObject();
//         // delete profile.password;
        
//         // finalPackage.profile = profile;

//         ret.status = "success";
//         ret.message="done";
//         ret.data=finalPackage;
//     }
    
//     catch(err){
//         console.log(err);
//         ret.message=err.message;
        
//     }
//     res.status(200).json(ret);
// });



// router.get("/search/:pattern",performValidationPanel,async (req, res, next) => {
//     let user_id=req.user._id;
//     let pattern = req.params.pattern;
    
//     let ret={message:"Sorry you are allowed to perform this task, permission denied.",status:"failed",code:0};
    
//     if(pattern.length==24)
//     {
//         try{
            
//             let finalPackage=new Object();

//             let events = await Events.find({'_id':pattern});
            
//             finalPackage.events = events;

//             let bookings = await Bookings.find({'_id':pattern}).populate("user").populate("host").populate("event");
//             finalPackage.bookings = bookings;

//             let users = await Users.find({'_id':pattern});
//             finalPackage.users = users;

//             // let profile = await Users.findOne({"_id":user_id});
//             // profile=profile.toObject();
//             // delete profile.password;
            
//             // finalPackage.profile = profile;

//             ret.status = "success";
//             ret.message="done";
//             ret.data=finalPackage;
//         }

        
//         catch(err){
//             console.log(err);
//             ret.message=err.message;
//             // res.status(200).json(ret)
//         }
//         res.status(200).json(ret);
//     }
//     else
//     {
//         try{
//             pattern = new RegExp('.*'+pattern+'.*','i');
//             let finalPackage=new Object();

//             let events = await Events.find({$or:[{'name':pattern},{'venue_address':pattern},{'event_status':pattern}]}).sort({created_at:-1}).limit(10);
            
//             finalPackage.events = events;

//             let bookings = await Bookings.find({user:{$in:(await Users.find({name:pattern}))}}).populate("user").populate("host").populate("event").sort({created_at:-1}).limit(10);
//             finalPackage.bookings = bookings;

//             let users = await Users.find({$or:[{'name':pattern},{'email':pattern},{'phone':pattern}]}).sort({created_at:-1}).limit(10);
//             finalPackage.users = users;

//             // let profile = await Users.findOne({"_id":user_id});
//             // profile=profile.toObject();
//             // delete profile.password;
           
//             // finalPackage.profile = profile;

//             ret.status = "success";
//             ret.message="done";
//             ret.data=finalPackage;
//             // return;
//         }
        
//         catch(err){
//             console.log(err);
//             ret.message=err.message;
            
//         }
//         res.status(200).json(ret);
//     }
//     // let resultId = req.params.resultId;
// });



module.exports = router;