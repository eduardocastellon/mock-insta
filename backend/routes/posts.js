const { GenerateUniqueId } = require('../functions/functions');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//GET ALL POSTS
router.get('/posts', async (req, res) => {
    const posts = await Post.find();
    return res.status(200).json(posts); 
});
//GET ONE POST
router.get('/posts/:key', async (req, res) => {
    const post = await Post.findOne({key: Number(req.params.key)});
    if(!post) return res.status(404).json({error: "User does not exist"});
    return res.status(200).json(post);
});

//CREATE A POST
router.post('/posts', async (req, res) => {
    const {protocol, created_by, image_id, description} = req.body;

    if (protocol === "FIND_USER_POSTS"){
        const userPosts = await Post.find({ created_by: created_by });
        if (!userPosts) return res.status(400).json({message: "This user has not made any posts"});
        return res.status(200).json(userPosts);
    }

    //RETRIEVE THE CURRENT USER FOR THE LATEST KEY NUMBER
    const currentPost = await Post.findOne().sort({key: -1});

    //GENERATE NEW UNIQUE POST ID
    const post_id = crypto.randomUUID();
    

    //CREATE NEW POST
    const post = new Post({
        key: currentPost ? currentPost.key + 1 : 1,
        post_id,
        date_created: new Date().toISOString().split('T')[0],
        created_by,
        image_id,
        likes: 0,
        users_liked: [],
        description,
        comments: []
    });
    await post.save();
    res.status(201).json(post);
});

//UPDATE POST
router.put('/posts/:key', async (req, res) => {
    const {user, description, comments, protocol} = req.body;
    const post = await Post.findOne({key: Number(req.params.key)});
    if (!post) return res.status(404).json({error: 'User does not exist'});

    //CHECK PROTOCOL
    if (protocol === "DESCRIPTION") post.description = description; //EDIT DESCRIPTION
    else if (!post.users_liked.includes(user) && protocol === "LIKE"){
        post.users_liked.push(user);
        post.likes += 1; //UPDATE AMOUNT OF LIKES
    }
    else if (post.users_liked.includes(user) && protocol === "DISLIKE"){
        post.users_liked = post.users_liked.filter(x => x !== user);
        post.likes -= 1;
        if (post.likes < 0) post.likes = 0;
    }
    else if (protocol === "COMMENTS"){ //ADD A COMMENT
        if(!comments.user_id || !comments.nickname || !comments.body) return res.status(404).json({error: "missing required fields"})
        let newKey = 1;
        if (post && post.comments.length > 0){
            const currentComment = post.comments[post.comments.length - 1];
            newKey = currentComment.key + 1;
        };

        post.comments.push({
            key: newKey,
            user_id: comments.user_id,
            nickname: comments.nickname,
            body: comments.body
        });
    }
    
    await post.save();
    return res.status(200).json(post);
});

//DELETE A COMMENT IN A POST
router.delete('/posts/:key/comments/:id', async (req, res) => {
    const post = await Post.findOneAndUpdate(
        {key: Number(req.params.key)},
        {$pull: {comments: {key: Number(req.params.id)}}},
        {new: true}
    );
    if(!post) return res.status(404).json({error: "Post does not exist"});
    return res.status(200).json({message: `comment deleted`});
});

//DELETE A POST
router.delete('/posts/:key', async (req, res) => {
    const post = await Post.findOne({key: Number(req.params.key)});
    if(!post) return res.status(404).json({error: "Post does not exist"});
    await Post.deleteOne({key: Number(req.params.key)});
    return res.status(200).json({message: `post deleted`});
});


//THIS FUNCTION IS AUTOMATICALLY CALLED WHEN A USER IS DELETED
//DELETE ALL POSTS ASSOCIATED TO A USER
async function deleteAllPosts(created_by){
    const posts = await Post.find({created_by});
    if (posts.length === 0) return false;
    await Post.deleteMany({created_by});
    return true;
}
module.exports = router;
module.exports.deleteAllPosts = deleteAllPosts;