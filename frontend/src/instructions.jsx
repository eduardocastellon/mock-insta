//THIS IS HOW TO CALL THE BACKEND FUNCTIONS

import { changeUser, handleFollow, createNewPost, updatePostDescription, handlePostLike, handlePostComment } from "./functions/functions"

//When you set user, you will have a bunch of metadata. For example:
user: {
    key, //THIS IS TO IDENTIFY YOURSELF. THIS VARIABLE WILL ALWAYS BE USED
    bio,
    date_created,
    email,
    dob,
    firstname,
    lastname,
    followers, //this is a string array that contains all "user_id"s of the users who are following you
    following, //this is a string array that contains all "user_id"s of the users who you are following
    nickname,
    password,
    private, //to check whether account is public or private. this value is a boolean
    profile_pic, //ignore this for now.
    user_id, //this is the unique id to identify the user. THIS VARIABLE WILL ALMOST ALWAYS BE USED!!
    username,
}

//TO ACCESS EACH VARIABLE
user?.key,
user?.date_created,
user?.dob,
user?.firstname,
user?.user_id,

...etc



//IF YOU WANT TO FOLLOW ANOTHER USER

//CALL THIS FUNCTION WITH THE VARIABLES IN THIS ORDER:
handleFollow(key, protocol, user_id_to_follow);

//For example: (Must be in this order!)
handleFollow(user1?.key, "FOLLOW", user2.user_id);

//user1 will follow user2

//TO UNFOLLOW
handleFollow(user1?.key, "UNFOLLOW", user2.user_id);

//user1 will unfollow user2

//___________________________________________

//To create a new post

post:{
    key,
    post_id,
    date_created,
    image_id, //treat this as a post title, I will fix the name
    created_by, //stores the user_id who made this post
    likes, //keeps track of a number for likes, cannot go below 0
    users_liked, //keeps track of an array filled with the "user_id"s of those who liked the post
    description,
    comments,
}

//To access posts,
post?.key
post?.post_id

...etc

//To access comments
post?.comments?.key
post?.comments?.user_id //the user who posted the comment
post?.comments?.body //the actual comment


//to make a post
createNewPost(user_identifier, image_id, description)

user_identifier //this is the same as user_id
image_id //Treat this as the post title
description // this is the decription of the post

//For example:
const user;
let title = "my new post";
let description = "this is a post"

createNewPost(user?.user_id, title, description)


//update post description

updatePostDescription(key, protocol, description)

//example:
updatePostDescription(post?.key, "DESCRIPTION", description)

//update post like/dislike

handlePostLike(post?.key, "LIKE", user?.user_id)

//dislike
handlePostLike(post?.key, "DISLIKE", user?.user_id)



//Comment on post
handlePostComment(key, protocol, user_identifier, body)

//For example
let body = "this is a comment for the post"
handlePostComment(post?.key, "COMMENTS", body)