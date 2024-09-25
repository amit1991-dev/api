const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const DppTestSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        test_type:{     //please provide more values to be filled here
          type:String,
          enum:['general','iit-mains','iit-advanced','neet'],
          required:true
        },
        attempts:{
          type:Number, default:0,min:0,max:100,required:true// 0 means infinite test attempts!
        },
        duration:{ // minutes
          type:Number,
          required:true
        },
        instructions: { //url to instructions file/api
          type: String,
        },
        questions:{
          type:mongoose.Mixed,
          required:true
        },
        structure:{
          type:mongoose.Mixed,
          required:true
        },
        subject:{
          type:ObjectId,
          ref:"subjects",
          required:true,
        },
        chapter:{
            type:ObjectId,
            ref:"chapters",
            required:true,
        },
        subjects:{
          type:[{type:ObjectId,ref:"subjects"}],
          default:[],
          required:true
        },
        streams:{
          type:[{type:ObjectId,ref:"streams"}],
          default:[],
          required:true
        },
        // batch:{
        //   type:[{type:ObjectId,ref:"batches"}],
        //   default:[],
        //   //required:true
        // },
        packages:{
          type:[{type:ObjectId,
          ref:"packages"}],
          default:[],
          // required:true
        },
        enabled:{
          type:Boolean,
          default:true,
          required:true
        },
        owner:{
          type:ObjectId,
          required:true,
          ref:"staff"
        },
        start_time:{
          type:Date,
          default:null,
        },
        end_time:{
          type:Date,
          default:null,
        },
        permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},

    },
    { strict: false,minimize:false,timestamp:true }
);

module.exports  = mongoose.model("dpp_tests", DppTestSch);
