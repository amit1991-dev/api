const mongoose = require("mongoose");
// const notifications = require("./notifications.js");
const ObjectId=mongoose.Schema.ObjectId;

const Mixed=mongoose.Schema.Types.Mixed;
const TemplateSch = new mongoose.Schema(
    {
        name:{type:String,required:true,unique:true},
        description:{type:String,required:true},
        color:{type:String,default:"red"},//theme
        enabled:{type:Boolean,default:true,required:true},
        logo:{type:String,default:"-",required:true},

	},
    { strict: false,minimize:false,timestamps: { createdAt: 'timestamp', updatedAt: 'updated_at' } }
);
// module.exports = Templates = mongoose.model("templates", TemplateSch);

var Templates = mongoose.model("templates", TemplateSch);

Templates.getTemplate=async function(template_id)
{
    try{
        p=await Templates.findOne({_id:template_id});
    return p;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

Templates.listing=async function(filters)
{
    var t= await Templates.find(filters).sort({'timestamp':-1}).exec();
    return t;
}

Templates.delete=async function(template_id)
{
    try{
        await Templates.findOneAndDelete({_id:template_id});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }
}

Templates.updateTemplate=async function(templpate_id,modified_obj)
{
    // console.log(modified_obj);
    try{
        if(!mongoose.Types.ObjectId.isValid(templpate_id))
        {
            // console.log("rejected");
            return false;
        }
        await Templates.updateOne({_id:templpate_id},{$set:modified_obj});
        return true;
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }   
}


module.exports = Templates;