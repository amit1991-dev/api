const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const TopicSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        sequence:{
          type:Number,
        },
        content: {
          type: String,
          required:true,
          default:""
        },
        chapter:{
          type:ObjectId,
          ref:"chapters"
        },
        // questions:[{
        //     topic:{
        //         type:ObjectId,
        //         ref:"questions",
        //     }
        // }],
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);

const PackageSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        stream:{
            type:ObjectId,
            ref:"streams",
        },
        paid:{
            type:Boolean,
            default: false,
            required: true,
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);
const ChapterSch = new mongoose.Schema(
    {
        name: {type: String,required:true},
        subject:{type:ObjectId,ref:"subjects",},
        stream:{type:ObjectId,ref:"streams",},
        // sequence:{type:Number,required:true},
        // files:[{type:ObjectId,ref:"files"}],
        content:{type: String,default:""},
        // streams:{type:[ObjectId],default:[]},
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    
    { strict: false,minimize:false,timestamp:true }
);


const SubTopicSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        sequence:{
          type:Number,
        },
        content: {
          type: String,
          default:""
        },

        topic:{
          type:ObjectId,
          ref:"topics",
          required:true
        },
        // questions:[{
        //     topic:{
        //         type:ObjectId,
        //         ref:"questions",
        //     }
        // }],
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

       
    },
    { strict: false,minimize:false,timestamp:true }
);


const CategoriesSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

       
    },
    { strict: false,minimize:false,timestamps:true }
);

const BranchSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        address:{
          type:String,
        },
        contact: {
          type: String,
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);

const StreamSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        description:{
            type:String,
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);

const ModulesSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        class_number:{
            type:String, 
        },
        subject:{
            type:ObjectId,
            ref:"subjects",
        },
        enabled_online:{type:Boolean, default:false,required:true},
        price:{type:Number,default:0,required:true,min:0},
        chapters:{
            type:[ObjectId],
            ref:"module_chapters",
            required:true,
            default:[],
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    },
    { strict: false,minimize:false,timestamp:true }
);

const ModuleChaptersSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        // module:{
        //     type:ObjectId,
        //     ref:"modules",
        // },
        chapter:{type:ObjectId,ref:"chapters"},
        level_1:{
            type: [ObjectId],
            default:[],
            required:true,
            ref:"questions",
        },
        level_2:{
            type: [ObjectId],
            default:[],
            required:true,
            ref:"questions",
        },
        level_3:{
            type: [ObjectId],
            default:[],
            required:true,
            ref:"questions",
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);

const SubjectSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        streams:[{
            type:ObjectId,
            ref:"streams",
            required:true,
        }],
        // streams:[{
        //     type:ObjectId,
        //     ref:"streams",
        //     required:true,
        // }],
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamps:true }
);

const MarkingShemeSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        positive_marks:{
          type:Number,
          required:true,
        },
        negative_marks: {
          type: Number,
          default:1,
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    },
    { strict: false,minimize:false,timestamps:true }
);

const InstructionsSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        instructions:{
          type:String,
          required:true,
          default:"-"
        },
        
        // permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    },
    { strict: false,minimize:false,timestamps:true }
);

const DoubtSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        student:{
            type:ObjectId,
            ref:"students",
            required:true,
        },

        doubt_status:{
            type:String,
            enum:["open","closed_by_student","closed_by_faculty",],
            default:"open",
            required:true,
          },
        content:{
          type:String,
          required:true,
        },
        batch:{
            type:ObjectId,
            ref:"batches",
            required:true,
        },
        responses:{
            type:[{content:String,sender:String,timestamp:{type:Date, default:Date.now}}],
            required:true,
        },
        permission_id:{
            type:ObjectId,
            default:new mongoose.Types.ObjectId(),
            required:true
        },
    },
    { strict: false,minimize:false,timestamps:true }
);

let Topics = mongoose.model("topics", TopicSch);
let SubTopics = mongoose.model("subtopics", SubTopicSch);
let Chapters = mongoose.model("chapters", ChapterSch);
let Categories = mongoose.model("categories", CategoriesSch);
let Packages = mongoose.model("packages", PackageSch);
let Subjects = mongoose.model("subjects", SubjectSch);
let Streams = mongoose.model("streams", StreamSch);

let ModuleChapters = mongoose.model("module_chapters", ModuleChaptersSch);
let Modules = mongoose.model("modules", ModulesSch);
let MarkingShemes = mongoose.model("marking_schemes", MarkingShemeSch);
let Branches = mongoose.model("branches", BranchSch);
let Instructions = mongoose.model("instructions", InstructionsSch);


Modules.addModuleChapter=async function(moduleId,moduleChapterId){
    try{
        await Modules.updateOne({_id:moduleId},{$addToSet:{chapters:moduleChapterId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

Modules.removeModuleChapter=async function(moduleId,moduleChapterId){
    try{
        await Modules.updateOne({_id:moduleId},{$pull:{chapters:moduleChapterId}});
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

ModuleChapters.addQuestion=async function(moduleChapterId,questionId,level){
    try{
        if(level == "level_1"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$addToSet:{level_1:questionId}});

        }
        else if(level == "level_2"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$addToSet:{level_2:questionId}});

        }
        else if(level == "level_3"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$addToSet:{level_3:questionId}});

        }
        else{
            throw {message:"level is not set"};
        }

        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

ModuleChapters.removeQuestion=async function(moduleChapterId,questionId,level){
    try{
        if(level == "level_1"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$pull:{level_1:questionId}});

        }
        else if(level == "level_2"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$pull:{level_2:questionId}});

        }
        else if(level == "level_3"){
            await ModuleChapters.updateOne({_id:moduleChapterId},{$pull:{level_3:questionId}});

        }
        else{
            throw {message:"level is not set"};
        }
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {Topics,SubTopics,Chapters,Categories,Branches,Streams,Subjects,MarkingShemes,Packages,Instructions,Modules,ModuleChapters};
