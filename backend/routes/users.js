const { GenerateUniqueId, passHash } = require('../functions/functions');
const { deleteAllPosts } = require('./posts');
const { deleteAllStories } = require("./stories");
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');


//RETRIEVE ALL USERS
router.get('/users', async (req, res) => {
    const users = await User.find();
    return res.status(200).json(users); 
});

//RETRIEVE DATA ON ONE USER
router.get('/users/:key', async (req, res) => {
    const user = await User.findOne({key: Number(req.params.key)});
    if(!user) return res.status(404).json({error: "User does not exist"});
    return res.status(200).json(user);
});

//CREATE USER
router.post('/users', async (req, res) => {
    const {nickname, username, password, firstname, lastname, dob, email} = req.body;

    //CHECK UNIQUENESS OF USERNAME AND EMAIL
    const usernameExists = await User.findOne({username});
    const emailExists = await User.findOne({email});

    if (emailExists || usernameExists) return res.status(400).json({error: 'Username exists or email already exists'});

    //GENERATE NEW UNIQUE USER ID
    const user_id = crypto.randomUUID();

    //HASH THE NEW PASSWORD
    const newHash = await passHash(password);

    //RETRIEVE THE CURRENT USER FOR THE LATEST KEY NUMBER
    const currentUser = await User.findOne().sort({key: -1});

    //CREATE NEW USER
    const user = new User({
        key: currentUser ? currentUser.key + 1 : 1,
        user_id,
        date_created: new Date().toISOString().split('T')[0],
        firstname, 
        lastname, 
        nickname,
        username, 
        profile_pic: "/profile.png",
        password: newHash, 
        dob, 
        email, 
        bio: "",
        followers: [], 
        following: [], 
        private: false
    });
    await user.save();
    res.status(201).json(user);
});

//UPDATE USER
router.put('/users/:key', async (req, res) => {
    const {protocol, user_id_to_follow, password, firstname, lastname, bio, nickname} = req.body;
    const user = await User.findOne({key: Number(req.params.key)});
    if (!user) return res.status(404).json({error: 'User does not exist'});

    //CHECK PROTOCOL
    if(protocol === "CHANGE_USER"){
        // if(password) user.password = await passHash(password);
        if(firstname) user.firstname = firstname;
        if(lastname) user.lastname = lastname;
        if(bio) user.bio = bio;
        else if(!bio) user.bio = "";
        if(nickname) user.nickname = nickname;
    } else if(protocol === "FOLLOW"){
        const userToFollow = await User.findOne({user_id: user_id_to_follow});
        if(!userToFollow) return res.status(404).json({error: 'User to follow does not exist'});
        //CHECK IF YOU ARE FOLLOWING THE USER
        if(userToFollow.followers.includes(user.user_id)) return res.status(200).json({message: 'You are already following this user'});
        userToFollow.followers.push(user.user_id);
        user.following.push(user_id_to_follow);

        await userToFollow.save();
    } else if(protocol === "UNFOLLOW"){
        const userToUnfollow = await User.findOne({user_id: user_id_to_follow});
        if(!userToUnfollow) return res.status(404).json({error: 'User to unfollow does not exist'});
        //CHECK IF YOU ARE NOT FOLLOWING THE USER
        if(!userToUnfollow.followers.includes(user.user_id)) return res.status(200).json({message: 'You are already not following this user'});
        userToUnfollow.followers = userToUnfollow.followers.filter(x => x !== user.user_id);
        user.following = user.following.filter(x => x !== user_id_to_follow)

        await userToUnfollow.save();
    }

    await user.save();
    res.json(user);
});

//DELETE A USER
router.delete('/users/:key', async (req, res) => {
    const user = await User.findOne({key: Number(req.params.key)});
    if(!user) return res.status(404).json({error: "User does not exist"});

    //DELETE ALL POSTS ASSOCIATED TO THIS USER
    const x = await deleteAllPosts(user.user_id);
    if(x) console.log("All posts made by this user were deleted");
    else console.log("No posts found");

    //DELETE ALL STORIES ASSOCIATED TO THIS USER
    const s = await deleteAllStories(user.user_id);
    if(s) console.log("All stories made by this user were deleted");
    else console.log("No stories found");

    //DELETE USER
    await User.deleteOne({key: Number(req.params.key)});

    return res.status(200).json({success: true, message: `user deleted`});
});

module.exports = router;