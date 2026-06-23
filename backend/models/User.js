const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    key: Number,
    user_id: String,
    date_created: String,
    firstname: String,
    lastname: String,
    nickname: String,
    profile_pic: String,
    username: {type: String, unique: true}, 
    password: String,
    dob: String,
    email: {type: String, unique: true}, 
    bio: String,
    followers: [String], 
    following: [String],
    private: Boolean
});
module.exports = mongoose.model('User', UserSchema);