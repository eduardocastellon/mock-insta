const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        //the text message
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        //keeps the messages in order
        timestamps: true,
    }
);
module.exports = mongoose.model('Message', MessageSchema);
