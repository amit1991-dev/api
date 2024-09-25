const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Mixed=mongoose.Schema.Types.Mixed;

const CourseSch = new mongoose.Schema(
    {
        //Data memebers
        title:{type:String,required:true},
        description:{type:String,required:true},
        start_time:{type:Date,required:true},
        price:{type:Number,required:true},
        teacher:{type:ObjectId,ref:"users"},

        //Lists
        notifications:[{type:String}],
        lectures:[{type:ObjectId,ref:"lectures"}],
        files:[{type:ObjectId,ref:"files"}],
        feedback:[{type:ObjectId,ref:'ratings'}],
	},
    { strict: false,minimize:false, timestamps:true }
);
// module.exports = Products = mongoose.model("products", ProductSch);

Courses = mongoose.model("courses", CourseSch);

Courses.getCourses=async function()
{
    try{
        let p=await Courses.find({});
        return p;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}


Courses.addLecture=async function(course_id,lecture_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$push:{lectures:lecture_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.removeLecture=async function(course_id,lecture_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$pull:{lectures:lecture_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.addFile=async function(course_id,file_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$push:{files:file_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.addNotification=async function(course_id,notification)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$push:{notifications:notification}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.addRating=async function(course_id,rating_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$push:{ratings:rating_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}


Courses.clearNotifications=async function(course_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$set:{notifications:[]}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.removefile=async function(course_id,file_id)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$pull:{files:file_id}});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Courses.updateCourse=async function(course_id,changes)
{
    try{
        await Courses.findOneAndUpdate({_id:course_id},{$set:changes});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}



//Admin
Courses.getCourse=async function(course_id)
{
    try{
        let p=await Courses.findOne({_id:course_id}).populate("users");
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Courses.createCourse=async function(course)
{
    try{
        let p=new Courses(course);
        await p.save();
        return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


Courses.delete=async function(course_id)
{
    try{
        await Courses.findOneAndDelete({_id:course_id});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}






module.exports=Courses;