const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const CompSch = new mongoose.Schema(
    {
        // _id:{type:ObjectId,unique:true}
        name: {
            type: String,
            required:true
        },
        content: {
            type: String,
            required:true
        },
    },
    { strict: false,minimize:false,timestamp:true }
);

let Comprehensions = mongoose.model("comprehensions", CompSch);
module.exports = Comprehensions;