import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidePanel from "../../components/sidePanel";
import RightSidebar from "../../components/RightSidebar";
import Stories from "../../components/Stories";
import PostCard from "../../components/PostCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { getAllPosts, getUsers } from "../../functions/functions";
import styles from "./dashboard.module.css";

export default function Dashboard(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [feedPosts, setFeedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    //CHECK IF LOGGED IN
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            navigate("/");
            return;
        }

        //SESSION USER EXISTS, STORE IT IN 'USER'
        const sessionUser = JSON.parse(session);
        setUser(sessionUser);
        loadFeed(sessionUser);
    }, [navigate]);

    const loadFeed = async (currentUser) => {
        try {
            setLoading(true);
            
            // Get all posts
            const allPosts = await getAllPosts();
            if (!allPosts) {
                setLoading(false);
                return;
            }

            // Get all users to map user info to posts
            const allUsers = await getUsers();
            if (!allUsers) {
                setLoading(false);
                return;
            }

            // Create a map of user_id to user info
            const userMap = {};
            allUsers.forEach(u => {
                userMap[u.user_id] = u;
            });

            // Filter posts to only show posts from users the current user follows
            // Also include current user's own posts
            const followingIds = currentUser.following || [];
            const filteredPosts = allPosts.filter(post => 
                post.created_by === currentUser.user_id || 
                followingIds.includes(post.created_by)
            );

            // Sort by date (newest first) and add user info to each post
            const postsWithUserInfo = filteredPosts
                .sort((a, b) => {
                    // Sort by key (higher key = newer post) or by date_created
                    if (b.key && a.key) return b.key - a.key;
                    if (b.date_created && a.date_created) {
                        return new Date(b.date_created) - new Date(a.date_created);
                    }
                    return 0;
                })
                .map(post => ({
                    ...post,
                    username: userMap[post.created_by]?.username || post.created_by,
                    nickname: userMap[post.created_by]?.nickname || post.created_by,
                }));

            setFeedPosts(postsWithUserInfo);
        } catch (error) {
            console.error("Error loading feed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostUpdate = (updatedPost) => {
        // Update the post in the feed
        setFeedPosts(prevPosts => 
            prevPosts.map(post => 
                post.key === updatedPost.key ? { ...updatedPost, username: post.username, nickname: post.nickname } : post
            )
        );
    };

    return(
        <div className={styles.page}>
            <SidePanel />
            <div className={styles.pageContent}>
                {/* Stories Section */}
                {user && <Stories currentUser={user} />}

                {/* Feed Posts */}
                {loading ? (
                    <div className={styles.feedContainer}>
                        <LoadingSkeleton type="post" />
                        <LoadingSkeleton type="post" />
                        <LoadingSkeleton type="post" />
                    </div>
                ) : feedPosts.length > 0 ? (
                    <div className={styles.feedContainer}>
                        {feedPosts.map((post) => (
                            <PostCard 
                                key={post.key || post.post_id} 
                                post={post} 
                                currentUser={user}
                                onUpdate={handlePostUpdate}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyFeed}>
                        <h2>Welcome to Instagram!</h2>
                        <p>Follow users to see their posts in your feed.</p>
                        <p>Your feed is empty. Start following people to see their posts here!</p>
                    </div>
                )}
            </div>
            <RightSidebar currentUser={user} />
        </div>
    );
};