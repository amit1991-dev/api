const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;

const LectureSch = new mongoose.Schema(
    {
        title:{type:String,required:true},
        description:{type:String,required:true},
        room:{type:ObjectId,ref:"rooms"},
        subject:{type:String,required:true},
        teacher:{type:ObjectId,ref:"users"},
        files:[{type:ObjectId,ref:"files"}],
    },
    { strict: false,minimize:false, timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Lectures = mongoose.model("lectures", LectureSch);

Lectures.getLectures=async function()
{
    try{
        let p=await Lectures.find({});
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

//Admin
Lectures.getLecture=async function(lecture_id)
{
    try{
        let p=await Lectures.findOne({_id:lecture_id}).populate("users");
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Lectures.createLecture=async function(lecture)
{
    try{
        let p=new Lectures(lecture);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Lectures.setRoom=async function(course_id,room_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$set:{room:room_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Lectures.unsetRoom=async function(course_id,room_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$set:{room:null}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

// Courses.removeLecture=async function(course_id,lecture_id)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$pull:{lectures:lecture_id}});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }

// Courses.addFile=async function(course_id,file_id)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$push:{files:file_id}});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }

// Courses.addNotification=async function(course_id,notification)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$push:{notifications:notification}});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }


// Courses.clearNotifications=async function(course_id)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$set:{notifications:[]}});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }

// Courses.removefile=async function(course_id,file_id)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$pull:{files:file_id}});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }

// Courses.updateCourse=async function(course_id,changes)
// {
//     try{
//         await Courses.findOneAndUpdate({_id:course_id},{$set:changes});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }



// //Admin
// Courses.getCourse=async function(course_id)
// {
//     try{
//         let p=await Courses.findOne({_id:course_id}).populate("users");
//         return p;
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }
// }

// Courses.createCourse=async function(course)
// {
//     try{
//         let p=new Courses(course);
//         await p.save();
//         return p;
//     }
//     catch(err)
//     {
//         console.log(err);
//         return false;
//     }
// }


// Courses.delete=async function(course_id)
// {
//     try{
//         await Courses.findOneAndDelete({_id:course_id});
//         return true;
//     }
//     catch(err)
//     {
//         console.log(err.message);
//         return false;
//     }
// }

module.exports=Lectures;