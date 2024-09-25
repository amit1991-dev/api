const { Subjects,Chapters } = require("../../databases/student_center/academics");
const { Batches, Lectures } = require("../../databases/student_center/batches");
const Questions = require("../../databases/student_center/questions");

// const Tests = require("../../databases/student_center/tests");

async function getMouleSubjects(batchId){
    let batch = await Batches.findById(batchId).populate([{path:"modules"}]);
        let moduleSubjects = batch.modules.map(m=>m.subject);
        let subjectIds = [...new Set(moduleSubjects)];
        let subjects = [];

        for(var i in subjectIds){
            subjects.push(await Subjects.findById(subjectIds[i]));
        }
        return subjects;
}

// async function getTestSubjects(batchId){
//     let batch = await Batches.findById(batchId).populate([{path:"modules"}]);
//         let testSubjects = batch.modules.map(m=>m.subject);
//         let subjectIds = [...new Set(moduleSubjects)];
//         let subjects = [];

//         for(var i in subjectIds){
//             subjects.push(await Subjects.findById(i));
//         }
//         return subjects;
// }

async function getLectureSubjects(batchId){
    let batch = await Batches.findById(batchId).populate([{path:"lectures"}]);
        let lectureSubjects = batch.modules.map(m=>m.subject);
        let subjectIds = [...new Set(lectureSubjects)];
        let subjects = [];

        for(var i in subjectIds){
            subjects.push(await Subjects.findById(subjectIds[i]));
        }
        return subjects;
}


async function getFilesSubjects(batchId){
    let batch = await Batches.findById(batchId).populate([{path:"files"}]);

    let files=[];
    for(var i=0;i<batch.files.length;i++){
        if(batch.files[i].file_type=="academic"){
            files.push(batch.files[i]);
        }
        
    }
    let fileSubjects = files.map(m=>m.metadata.subject);
    let subjectIds = [...new Set(fileSubjects)];
    let subjects = [];
        

    for(var i in subjectIds){
        subjects.push(await Subjects.findById(subjectIds[i]));
    }
    return subjects;
}

async function getPreviousYearExamSubjects(examId){
    let questions = await Questions.find({exam:examId});
    let fileSubjects = questions.map(m=>m.subject);
    let subjectIds = [...new Set(fileSubjects)];
    let subjects = [];
    for(var i in subjectIds){
        subjects.push(await Subjects.findById(subjectIds[i]));
    }
    return subjects;
}

async function getPreviousYearTopicsForASubject(examId,subjectId){
    let questions = await Questions.find({exam:examId,subject:subjectId});
    let questionChapters = questions.map(m=>m.chapter);
    let chapterIds = [...new Set(chapters)];
    let chapters = [];
    for(var i in chapterIds){
        chapters.push(await Chapters.findById(chapterIds[i]));
    }
    return chapters;
}

async function getPreviousYearQuestionsForAChapter(examId,subjectId,chapterId){
    let questions = await Questions.find({exam:examId,subject:subjectId,chapter:capterId});
    return questions;
}

async function getPreviousYearQuestionsForAnExam(examId){
    let questions = await Questions.find({exam:{$ne: null},exam:examId});
    return questions;
}



module.exports ={
    getMouleSubjects,
    getLectureSubjects,
    getFilesSubjects,
    getPreviousYearExamSubjects,
    getPreviousYearTopicsForASubject, 
    getPreviousYearQuestionsForAChapter,
    getPreviousYearQuestionsForAnExam,
}