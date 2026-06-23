import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../profile/profile.module.css";
import { handleDeleteComment, getOnePost, getAllUserPosts, getUser, handlePostComment, handlePostLike } from "../../functions/functions";
import SidePanel from "../../components/sidePanel";
import { handleFollow } from "../../functions/functions";

export default function ViewOtherProfile(){
    // const viewUserUsername = localStorage.getItem('viewUserUsername');
    const {username} = useParams();

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState(null);

    const [showBigPostWindow, setShowBigPostWindow] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentBody, setCommentBody] = useState("");

    const [viewUser, setViewUser] = useState(null);

    //CHECK IF LOGGED IN
    useEffect(() => {
        const getUserPosts = async (session) => {
            const posts = await getAllUserPosts(session.user_id);
            // console.log(posts);
            setUserPosts(posts);
        }
        //GET CURRENT USER LOGGED IN
        const session = localStorage.getItem('session');
        //GET THE USER WHO'S PROFILE WE ARE TRYING TO VIEW
        const viewOtherUser = localStorage.getItem('viewUser');

        if (!session || !viewOtherUser) navigate("/");

        //SESSION USER EXISTS, STORE IT IN 'USER'
        setUser(JSON.parse(session));
        //GET OTHER USER POSTS YOU ARE TRYING TO VIEW
        getUserPosts(JSON.parse(viewOtherUser));
        setViewUser(JSON.parse(viewOtherUser));
        
        
    }, [username, userPosts]);

    //OPEN BIG POST WINDOW
    const handleBigPostWindow = (post) => {
        setSelectedPost(post);
        setShowBigPostWindow(true);
    };

    //HANDLE LIKE/DISLIKE OF POST
    const handleLike = async () => {
        if(selectedPost?.users_liked.includes(user?.user_id)){
            const updatedPost = await handlePostLike(selectedPost?.key, "DISLIKE", user?.user_id);
            setSelectedPost(updatedPost);

            const updatedPosts = await getAllUserPosts(user?.user_id);
            setUserPosts(updatedPosts);
        } else {
            const updatedPost = await handlePostLike(selectedPost?.key, "LIKE", user?.user_id);
            setSelectedPost(updatedPost);

            const updatedPosts = await getAllUserPosts(user?.user_id);
            setUserPosts(updatedPosts);
        }
    };

    //HANDLE POSTING COMMENTS
    const postComment = async () => {
        if (commentBody === "") return console.log("Comment must have substance");
        const updatedPost = await handlePostComment(selectedPost?.key, "COMMENTS", user?.user_id, user?.nickname, commentBody);
        setSelectedPost(updatedPost);
        setCommentBody("");

        const posts = await getAllUserPosts(userPosts?.user_id);
        setUserPosts(posts);
    };

    //FUNCTION TO FOLLOW/UNFOLLOW USER
    const checkFollowing = async () => {
        // console.log("check following")
        const protocol = user?.following?.includes(viewUser?.user_id) ? "UNFOLLOW" : "FOLLOW";
        await handleFollow(user?.key, protocol, viewUser?.user_id);

        const x = await getUser(viewUser?.key);
        const t = await getUser(user?.key);
        localStorage.setItem("viewUser",JSON.stringify(x));
        localStorage.setItem("session",JSON.stringify(t));
        setUser(t);
        setViewUser(x);
    };

    //DELETE COMMENT
    const deleteComment = async (key, id) => {
        await handleDeleteComment(key, id);
        const post = await getOnePost(key);
        if(post === undefined || post === null || !post) return console.log("failed to delete comment");
        setSelectedPost(post);
    };


    return(
        <div className={styles.page}>
            <SidePanel />
            <div className={styles.pageContent}>
                <div className={styles.profileContainer}>
                    <img src="/profile.png" alt="img" />
                    <div className={styles.profileInnerContainer}>
                        <h1>{viewUser?.username}</h1>
                        <p>{viewUser?.nickname}</p>
                        <div style={{display: "flex", gap: "10px"}}>
                            <p style={{cursor: "pointer"}}>{viewUser?.followers.length} followers</p>
                            <p style={{cursor: "pointer"}}>{viewUser?.following.length} following</p>
                            <button onClick={() => checkFollowing()}>{user?.following?.includes(viewUser?.user_id) ? "unfollow" : "follow"}</button>
                        </div>
                        <p>Bio: {viewUser?.bio}</p>
                        {/* <button onClick={() => setShowSettings(true)}>Edit profile</button> */}
                    </div>
                </div>

                <h2 style={{textDecoration: "underline"}}>Posts</h2>

                {/* MAP OF THE USER'S POSTS */}
                <div className={styles.postsMapContainer}>
                    {userPosts !== null && ([...userPosts].sort((a, b) => b.key - a.key).map((posts, i) => (
                        <div key={i} onClick={() => handleBigPostWindow(posts)}>
                            <h3>{posts?.image_id}</h3>
                            <p>{posts?.description}</p>
                        </div>
                    )))}
                </div>
                {showBigPostWindow && (
                    <div onClick={() => setShowBigPostWindow(false)} className={styles.bigPostWindowWrapper}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.bigPostWindow}>
                            <h2>{selectedPost?.image_id}</h2>
                            <p>{selectedPost?.description}</p>
                            <div className={styles.spacer}/>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", marginBottom: "16px"}}>
                                <p style={{margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--text-primary)"}}>{selectedPost?.users_liked.length} likes</p>
                                <button onClick={() => handleLike()}>{selectedPost?.users_liked.includes(user?.user_id) ? "Dislike" : "Like"}</button>
                            </div>

                            <div className={styles.spacer}/>

                            <div className={styles.commentsArea}>
                                {selectedPost?.comments?.length > 0 && ([...selectedPost.comments].sort((a, b) => b.key - a.key).map((comment, i) => (
                                    <div key={i}>
                                        <p><img src="/profile.png" alt="profile"/>{comment?.nickname}</p>
                                        <p>{comment?.body}</p>
                                        {comment?.user_id === user?.user_id && (
                                            <p className={styles.deleteComment} 
                                                style={{fontSize: "12px"}} 
                                                onClick={() => deleteComment(selectedPost?.key, comment?.key)}>Delete Comment</p>
                                        )}
                                    </div>
                                )))}
                            </div>
                            
                            <form className={styles.commentInputField} onSubmit={(e) => {e.preventDefault(); postComment()}}>
                                <input value={commentBody} type="text" placeholder="Add a comment..." onChange={(e) => setCommentBody(e.target.value)}/>
                                <button type="submit">Post</button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};