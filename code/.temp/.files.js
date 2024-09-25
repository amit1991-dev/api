const mongoose = require("mongoose");
const FilesSch = new mongoose.Schema(
    {
        name: {
            type: String
        },
        url: {
            type: String,
            required: true,
            
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            required: true,
            
        },
    },
    { strict: false,timestamps:true }
);

// module.exports = FilesSch;
FilesSch.index({directory:1,name:1},{unique:true});
module.exports = Files = mongoose.model("files", FilesSch);
