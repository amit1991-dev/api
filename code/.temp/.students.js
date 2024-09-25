const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
// const subSchema = new mongoose.Schema({
//               id:{
//                 type:ObjectId,
//                 ref:'tests',
//               },
//               result:{
//                 type:ObjectId,
//                 ref:'results'
//               }
//             },{ _id : false }
// );
const StudentSch = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        token: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        pincode:{
          type:Number,
          required:true
        },
        phone:{
            type:String,    
            required:true
        },
        phone_verified:{// maybe we will need to verify the phone number!
            type:Boolean,    
            default:false
        },
        gender:{
            type:String,
            enum:['male','female','other'],
            required:true
        },
        password_hash: {
            type: String,
            default: false
        },
        password: {
            type: String,
            default: false,
            required:true
        },
        login_time:{
            type:Date
        },
        class_number:{
          type:Number,
          required:true,
        },
        institute:{
          type:String,
          required:true
        },
        stream:{
          type:String,
          enum:['medical','engineering','school'],
          required:true
        },
        profilePicture: {
          type: String,
          default: "/content/images/blank.jpg",
        },
        city: {
          type: String,
          max: 50,
        },
        state: {
          type: String,
          max: 50,
        }
      },
        
        { strict: false,minimize:false,timestamp:true });


module.exports = Students = mongoose.model("students", StudentSch);
