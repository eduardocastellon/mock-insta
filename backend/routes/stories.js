const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const Story = require("../models/Story");

//GET ALL STORIES
router.get('/stories', async (req, res) => {
    const stories = await Story.find();
    return res.status(200).json(stories); 
});

//GET ONE STORY
router.get('/stories/:key', async (req, res) => {
    const story = await Story.findOne({key: Number(req.params.key)});
    if(!story) return res.status(404).json({error: "Story not found"});
    return res.status(404).json(story);
});

//CREATE A STORY
router.post('/stories', async (req, res) => {
    const {created_by, description} = req.body;

    //RETRIEVE THE CURRENT STORY FOR THE LATEST KEY NUMBER
    const currentStory = await Story.findOne().sort({key: -1});

    //GENERATE NEW UNIQUE STORY ID
    const story_id = crypto.randomUUID();

    if(description === null || description === undefined || description === "") return res.status(400).json({error: "Description must have substance"});

    //CREATE NEW STORY
    const story = new Story({
        key: currentStory ? currentStory.key + 1 : 1,
        story_id,
        date_created: new Date().toISOString().split('T')[0],
        created_by,
        likes: 0,
        users_liked: [],
        description
    });
    await story.save();
    res.status(201).json(story);
});

//UPDATE STORY
router.put('/stories/:key', async (req, res) => {
    //CHECK IF STORY EXISTS
    const story = await Story.findOne({key: Number(req.params.key)});
    if(!story) return res.status(404).json({error: "Story not found"});

    //IF STORY EXISTS, CHECK PROTOCOL
    const {protocol, user_id} = req.body;

    //PROTOCOL = "LIKE"
    if(protocol === "LIKE" && !story.users_liked.includes(user_id)){
        story.users_liked.push(user_id);
        story.likes += 1; //UPDATE AMOUNT OF LIKES
    }
    //PROTOCOL = "DISLIKE"
    else if(story.users_liked.includes(user_id) && protocol === "DISLIKE"){
        story.users_liked = story.users_liked.filter(x => x !== user_id);
        story.likes -= 1;
        if (story.likes < 0) story.likes = 0;
    }
    await story.save();
    res.status(201).json(story);
});

//DELETE A STORY
router.delete('/stories/:key', async (req, res) => {
    const story = await Story.findOne({key: Number(req.params.key)});
    if(!story) return res.status(404).json({error: "Story not found"});
    await Story.deleteOne({key: Number(req.params.key)});
    return res.status(200).json({message: `Story deleted`});
});


//THIS FUNCTION IS AUTOMATICALLY CALLED WHEN A USER IS DELETED
//DELETE ALL POSTS ASSOCIATED TO A USER
async function deleteAllStories(created_by){
    const stories = await Story.find({created_by});
    if (stories.length === 0) return false;
    await Story.deleteMany({created_by});
    return true;
}

module.exports = router;
module.exports.deleteAllStories = deleteAllStories;