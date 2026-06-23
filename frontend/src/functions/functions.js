//BACKEND URLS
// const backend_url = "http://localhost:5051";

const backend_url = "https://mock-instagram-backend-production.up.railway.app";

//_____________________________________________________________________________________________________________________________________________________________________________________________________
//FUNCTIONS TO HANDLE CREATING ACCOUNT OR LOGIN
export const createAccount = async (username, password, firstname, lastname, dob, email, nickname) => {
    try {
        const res = await fetch(`${backend_url}/users`, 
            {method: "POST", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username,
                password: password, firstname: firstname,
                lastname: lastname, dob: dob,
                email: email, nickname: nickname})});

        const user = await res.json();
        console.log(user);
        return user;
    } catch(e){
        console.log("Unable to reach backend");
    }
};
//HANDLE LOGIN
export const login = async (username, password) => {
    try {
        const res = await fetch(`${backend_url}/login`, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: username, password: password})});
        const user = await res.json();
        // console.log(user);
        return user;
    } catch(e){
        console.log("Unable to reach backend");
    }
};
//CHANGE PASSWORD/USERNAME
export const changeUserPass = async (protocol, user_id, username, oldPassword, newPassword) => {
    try {
        const res = await fetch(`${backend_url}/login`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: protocol, user_id: user_id, username: username, oldPassword: oldPassword, newPassword: newPassword})});
        const user = await res.json();
        return user;
    } catch(e){
        console.log("Unable to reach backend");
    }
}

//_____________________________________________________________________________________________________________________________________________________________________________________________________
//USERS
//GET ONE USER
export const getUser = async (key) => {
    try {
        const res = await fetch(`${backend_url}/users/${encodeURIComponent(Number(key))}`, {method: "GET", headers: {'Content-Type': 'application/json'}});
        // console.log("User retrieved successfully")
        if (!res.ok) throw new Error(res.status);
        const users = await res.json();
        return users;
    } catch(e){
        console.log("Unable to reach backend");
        return null;
    }
};
//GET ALL USERS
export const getUsers = async () => {
    try {
        const res = await fetch(`${backend_url}/users`, {method: "GET", headers: {'Content-Type': 'application/json'}});
        console.log("Users retrieved successfully")
        if (!res.ok) throw new Error(res.status);
        const users = await res.json();
        return users;
    } catch(e){
        console.log("Unable to reach backend");
        return null;
    }
};
//HANDLE FOLLOW
//protocol = CHANGE_USER
export const changeUser = async (key, protocol, firstname, lastname, bio, nickname) => {
    try {
        const res = await fetch(`${backend_url}/users/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: protocol, firstname: firstname, lastname: lastname, bio: bio, nickname: nickname})});
        console.log("Follow handled created successfully")
        const updatedUser = await res.json();
        return updatedUser;
    } catch(e){
        console.log("Unable to reach backend");
    }
};
//protocol = FOLLOW
//protocol = UNFOLLOW
export const handleFollow = async (key, protocol, user_id_to_follow) => {
    try {
        await fetch(`${backend_url}/users/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: protocol, user_id_to_follow: user_id_to_follow})});
        console.log("Follow handled successfully")
    } catch(e){
        console.log("Unable to reach backend");
    }
};
export const deleteUser = async (key) => {
    try{
        const res = await fetch(`${backend_url}/users/${encodeURIComponent(Number(key))}`, {method: "DELETE", headers: {'Content-Type': 'application/json'}});
        const deleted = await res.json();
        return deleted;
    } catch(e){
        console.log("Post created successfully");
    }
};
//_____________________________________________________________________________________________________________________________________________________________________________________________________
//FUNCTIONS FOR MAKING NEW POST AND UPDATING POSTS
export const createNewPost = async (user_identifier, image_id, description) => {
    try{
        await fetch(`${backend_url}/posts`, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({created_by: user_identifier, image_id: image_id, description: description})});
        console.log("Post created successfully");
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//UPDATE POST DESCRIPTION
//protocol = "DESCRIPTION"
export const updatePostDescription = async (key, protocol, description) => {
    try{
        await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: protocol, description: description})});
        console.log("Post created successfully")
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//HANDLE POST LIKES
//protocol = "LIKE" or protocol = "DISLIKE"
export const handlePostLike = async (key, protocol, user_identifier) => {
    try{
        const res = await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user_identifier, protocol: protocol})});
        console.log("Post liked successfully")
        const updatedPost = await res.json();
        return updatedPost;
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//HANDLE POST COMMMENTS
//protocol = "COMMENTS"
export const handlePostComment = async (key, protocol, user_identifier, nickname, body) => {
    try{
        const res = await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: protocol, comments: {user_id: user_identifier, nickname: nickname, body: body} })});
        const updatedPost = await res.json();
        // console.log("Comment created successfully", updatedPost);
        return updatedPost;
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//DELETE A COMMENT FROM A POST
export const handleDeleteComment = async (key, id) => {
    try{
        await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}/comments/${encodeURIComponent(Number(id))}`, {method: "DELETE", headers: {'Content-Type': 'application/json'}});
    } catch(e){
        console.log("Post created successfully");
    }
}
//GET ONE POST
export const getOnePost = async (key) => {
    try{
        const res = await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}`, {method: "GET", headers: {'Content-Type': 'application/json'}});
        const post = await res.json();
        return post;
    } catch(e){
        console.log("Post created successfully");
    }
}
//DELETE A POST
export const handleDeletePost = async (key) => {
    try{
        const res = await fetch(`${backend_url}/posts/${encodeURIComponent(Number(key))}`, {method: "DELETE", headers: {'Content-Type': 'application/json'}});
    } catch(e){
        console.log("Post created successfully");
    }
}
//GET A SET OF POSTS FROM USER
export const getAllUserPosts = async (user_identifier) => {
    try{
        const res = await fetch(`${backend_url}/posts`, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({created_by: user_identifier, protocol: "FIND_USER_POSTS"})});
        const posts = await res.json();
        return posts;
    }catch(e){
        console.log("Unable to reach backend");
    }
};

//GET ALL POSTS (for feed)
export const getAllPosts = async () => {
    try{
        const res = await fetch(`${backend_url}/posts`, {method: "GET", headers: {'Content-Type': 'application/json'}});
        if (!res.ok) throw new Error(res.status);
        const posts = await res.json();
        return posts;
    }catch(e){
        console.log("Unable to reach backend");
        return null;
    }
};
//_____________________________________________________________________________________________________________________________________________________________________________________________________
//STORIES

//CREATE A STORY
export const createStory = async (user_identifier, description) => {
    try{
        const res = await fetch(`${backend_url}/stories`, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({created_by: user_identifier, description: description})});
        const story = await res.json();
        return story;
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//LIKE A STORY
export const likeStory = async (key, user_identifier) => {
    try{
        const res = await fetch(`${backend_url}/stories/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: "LIKE", user_id: user_identifier})});
        const updatedStory = await res.json();
        return updatedStory;
    }catch(e){
        console.log("Unable to reach backend");
    }
};
//DISLIKE A STORY
export const dislikeStory = async (key, user_identifier) => {
    try{
        const res = await fetch(`${backend_url}/stories/${encodeURIComponent(Number(key))}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({protocol: "LIKE", user_id: user_identifier})});
        const updatedStory = await res.json();
        return updatedStory;
    }catch(e){
        console.log("Unable to reach backend");
    }
};