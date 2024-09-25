const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;

const DppCompSch = new mongoose.Schema(
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

let DppComprehensions = mongoose.model("dpp_comprehensions", DppCompSch);
module.exports = DppComprehensions;