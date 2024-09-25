const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const UserSch = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        token: {
            type: String
        },
        email: {
            type: String,
        },
        phone:{type:String,
            maxlength:10,
            minlength:10,
            unique:true,
            required:true
        },
        password: {
            type: String,
        },
        enabled_as_administrator:{
            type:Boolean,
            default:false,
            required:true,
        },
        last_login_time:{
            type:Date
        },
        display_picture:{type:String},
        enabled:{
            type:Boolean,
            default:true,
            required:true,
        },
        firebase_id:{type:String},//for notifications
    },
    { strict: false,timestamps: {createdAt: 'created_at',updatedAt: 'updated_at'}, }
);

Users = mongoose.model("users", UserSch);

Users.notify=async function(user_id,notification_id)
{
    try{
        await Users.updateOne({_id:user_id},{$push:{notifications:notification_id}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;

    }
}

Users.clearNotifications=async function(user_id)
{
    try{
        await Users.updateOne({_id:user_id},{$set:{notifications:[]}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;

    }
}



module.exports=Users;