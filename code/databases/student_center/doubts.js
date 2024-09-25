const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const doubtSch = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    doubt_status:{
      type:String,
      enum:["open","closed_by_student","closed_by_faculty"],
      default:"open",
      required:true,
    },

    batch: {
      type: ObjectId,
      ref: "batches",
    },

    student: {
      type: ObjectId,
      ref: "students",
      required: true,
    },

    subject: {
      type: ObjectId,
      ref: "subjects",
      required:true,
    },

    question: {
      type: ObjectId,
      ref: "questions",
    },

    content: {
      type: String,
      required: true,
    },


    responses:{
      type:[{
        sender:{type:String,required:true},
        response:{type:String,required:true},
        timestamp:{
          type:Date,
          default:Date.now,
          required:true
        }

      }],
      default:[],
    },

    permission_id: { type: ObjectId, default: new mongoose.Types.ObjectId() },
  },
  { strict: false, minimize: false, timestamp: true }
);

let Doubts = mongoose.model("Doubts", doubtSch);

Doubts.create = async function(doubt){
  try{
    let d = new Doubts(doubt);
    await d.save();
    return true;

  }catch(err){
    console.log(err.message);
    return false;
  }
}

Doubts.addResponse = async function(doubtId,responseObj){
  try{
    await Doubts.updateOne({_id:doubtId},{$push:{responses:responseObj}});
    return true;

  }catch(err){
    console.log(err.message);
    return false;
  }
}

Doubts.deleteResponse = async function(doubtId,responseId){
  try{
    await Doubts.updateOne({_id:doubtId},{$pull:{responses:{_id:responseId}}});
    return true;

  }catch(err){
    console.log(err.message);
    return false;
  }
}

Doubts.changeStatus = async function(doubtId,status){
  try{
    await Doubts.updateOne({_id:doubtId},{$set:{doubt_status:status}});
    return true;

  }catch(err){
    console.log(err.message);
    return false;
  }
}

module.exports = Doubts;