const mongoose = require("mongoose");
const RoomSch = new mongoose.Schema(
    {
        name: {
            type: String
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            required: true,
            
        },
        blacklist: {
            type: [],
            
        },
        whitelist: {
            type: [],
            
        },
        date_created: {
            type: Date,
            default: Date.now
        }
    },
    { strict: false }
);

module.exports = Room = mongoose.model("rooms", RoomSch);
