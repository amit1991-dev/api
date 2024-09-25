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
            required: true,
            unique: true
        },

        phone:{type:String,maxlength:15,minlength:10},

        password: {
            type: String,
            required: true
        },
        last_login_time:{
            type:Date
        },
        display_picture:{type:String},
        

        //arrays
        events:[{type:ObjectId,ref:"events"}],   
        notifications:[{type:ObjectId,ref:"notifications"}], 
    },
    { strict: false,timestamps: {createdAt: 'created_at',updatedAt: 'updated_at'}, }
);

Users = mongoose.model("users", UserSch);


Users.changePassword=async function(user_id,new_password)
{
    try{
        await Users.updateOne({_id:user_id},{$set:{password:new_password}});
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;

    }
}

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
