const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    key: Number,
    story_id: String,
    created_by: String,
    date_created: String,
    description: String,
    likes: {type: Number, default: 0},
    users_liked: {type: [String], default: []}
});
module.exports = mongoose.model('Story', StorySchema);