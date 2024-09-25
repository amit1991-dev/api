const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const StaffSch = new mongoose.Schema(
    {
        user:{
            type:ObjectId,
            ref:"users",
        },
        phone:{type:String},
        username: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        login_time:{
            type:Date
        },
        role:{
        	type:String,
        	enum:['admin','staff',"faculty"],
        	required: true
        },
        permissions:{// array should contain each individual permission for the resource!
        	type:[String],
            default:["question_read","test_read","student_read","staff_read","academic_desk_read"],//ACADEMICS_CRUD
            required:true,
        },
        enabled:{
            type:Boolean,
            default:true,
        }
    },
    { strict: false,timestamps: {createdAt: 'created_at',updatedAt: 'updated_at'},collection:"staffs"}
);

module.exports = mongoose.model("staff", StaffSch);
