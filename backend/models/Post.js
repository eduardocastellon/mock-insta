const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    key: Number,
    post_id: {type: String, unique: true},
    date_created: String,
    created_by: String,
    image_id: String,
    likes: {type: Number, default: 0},
    users_liked: {type: [String], default: []},
    description: String,
    comments: [
        {
            key: Number,
            user_id: String,
            nickname: String,
            body: String,
        }
    ]
}, {timestamps: true});
module.exports = mongoose.model('Post', PostSchema);
