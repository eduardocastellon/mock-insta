import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, handleFollow, getUser } from "../functions/functions";
import styles from "./RightSidebar.module.css";
import { useNavigate } from "react-router-dom";

export default function RightSidebar({ currentUser }) {
    const navigate = useNavigate();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSuggestedUsers = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const allUsers = await getUsers();
                if (!allUsers) return;

                // Filter out current user and users already being followed
                const followingIds = currentUser.following || [];
                const suggested = allUsers
                    .filter(user => 
                        user.user_id !== currentUser.user_id && 
                        !followingIds.includes(user.user_id)
                    )
                    .slice(0, 5); // Show max 5 suggestions

                setSuggestedUsers(suggested);
            } catch (error) {
                console.error("Error loading suggested users:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSuggestedUsers();
    }, [currentUser]);

    const handleFollowUser = async (userToFollow) => {
        if (!currentUser) return;
        
        try {
            await handleFollow(currentUser.key, "FOLLOW", userToFollow.user_id);
            // Refresh current user to update following list
            const updatedUser = await getUser(currentUser.key);
            if (updatedUser) {
                // Update localStorage
                localStorage.setItem("session", JSON.stringify(updatedUser));
                // Remove from suggestions
                setSuggestedUsers(prev => 
                    prev.filter(user => user.user_id !== userToFollow.user_id)
                );
                // Reload page to update feed
                window.location.reload();
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };



        //VIEW PROFILE FUNCTION
    const viewProfile = async (key) => {
        const viewUser = await getUser(key);
        if (viewUser !== undefined && viewUser !== null && viewUser?.username){
            // console.log("user found", viewUser);
            localStorage.setItem("viewUser", JSON.stringify(viewUser));
            // localStorage.setItem("viewUserUsername", JSON.stringify(viewUser?.username));

            navigate(`/profile/${viewUser?.username}`);
        }
    };



    if (!currentUser) return null;

    return (
        <div className={styles.rightSidebar}>
            {/* Switch Account Section */}
            <div className={styles.switchAccountSection}>
                <div className={styles.currentUserProfile}>
                    <img 
                        src="/profile.png" 
                        alt={currentUser.username}
                        className={styles.profileImage}
                    />
                    <div className={styles.userInfo}>
                        <Link to="/profile" className={styles.username}>
                            {currentUser.username}
                        </Link>
                        <span className={styles.userNickname}>
                            {currentUser.nickname || currentUser.firstname}
                        </span>
                    </div>
                </div>
                <Link to="/profile" className={styles.switchLink}>
                    Switch
                </Link>
            </div>

            {/* Suggested for You Section */}
            <div className={styles.suggestedSection}>
                <div className={styles.suggestedHeader}>
                    <span className={styles.suggestedTitle}>Suggested for you</span>
                    <Link to="/dashboard" className={styles.seeAllLink}>See All</Link>
                </div>

                {loading ? (
                    <div className={styles.loadingText}>Loading suggestions...</div>
                ) : suggestedUsers.length > 0 ? (
                    <div className={styles.suggestedUsersList}>
                        {suggestedUsers.map((user) => (
                            <div key={user.user_id} className={styles.suggestedUserItem}>
                                <div className={styles.suggestedUserInfo}>
                                    <img 
                                        src="/profile.png" 
                                        alt={user.username}
                                        className={styles.suggestedUserImage}
                                    />
                                    <div style={{gap: "0px"}} className={styles.suggestedUserDetails}>
                                        <p onClick={() => viewProfile(user.key)} className={styles.suggestedUsername} style={{margin: "2px", cursor: "pointer"}}>
                                            {user.username}
                                        </p>
                                        <span className={styles.suggestedUserSubtext}>
                                            Suggested for you
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    className={styles.followButton}
                                    onClick={() => handleFollowUser(user)}
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noSuggestions}>
                        <p>No suggestions available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

