const usersRoute = require('./users');
const {loginCheck, passHash} = require('../functions/functions');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.send('The login route');
});

//POST REQUEST FOR LOGIN
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) return res.status(404).json({success: false, message: "Wrong username or password"});
    //VERIFY PASSWORD
    const isPass = await loginCheck(password, user);
    if(isPass) return res.status(200).json(user);
    return res.status(400).json({success: false, message: "Wrong username or password"});
});
//CHANGE HARD INFO
router.put('/login', async (req, res) => {
    const {protocol, user_id, username, oldPassword, newPassword} = req.body;
    const user = await User.findOne({user_id: user_id});
    if (!user) return res.status(404).json({success: false, error: "User does not exist"});

    //PROTOCOL = "USERNAME"
    if(protocol === "USERNAME"){
        if(username && username !== user.username){
            //CHECK FOR USERNAME DUPLICATES
            const usernameDuplicates = await User.findOne({ username, user_id: { $ne: user.user_id } });
            if(usernameDuplicates) return res.status(400).json({success: false, message: "Username already exists"});
            user.username = username;
            await user.save();
            return res.status(200).json(user);
        }
    }
    //PROTOCOL = "PASSWORD"
    //VERIFY PASSWORD
    if(protocol === "PASSWORD"){
        if(oldPassword === undefined && oldPassword === null && oldPassword === "") return res.status(404).json({error: "old password is undefined or null"})
        const isPass = await loginCheck(oldPassword, user);
        //CHANGE PASSWORD
        if(!isPass) return res.status(400).json({success: false, message: "Wrong"});
        if(newPassword !== null && newPassword !== undefined && newPassword !== ""){
            //HASH THE NEW PASSWORD
            const newPass = await passHash(newPassword)
            if(newPassword) user.password = newPass;

            await user.save();
            return res.status(200).json(user);
        }
    }
});

module.exports = router;