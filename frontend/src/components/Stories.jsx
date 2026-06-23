import { useEffect, useState } from "react";
import { getUser, getUsers } from "../functions/functions";
import StoryViewer from "./StoryViewer";
import styles from "./Stories.module.css";

export default function Stories({ currentUser }) {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
    const [showStoryViewer, setShowStoryViewer] = useState(false);

    useEffect(() => {
        const loadStories = async () => {
            if (!currentUser) return;
            
            try {
                // Get all users (for now, we'll show stories from followed users + current user)
                const allUsers = await getUsers();
                if (!allUsers) return;

                // Filter to show current user and followed users
                const storyUsers = allUsers.filter(user => 
                    user.user_id === currentUser.user_id || 
                    currentUser.following?.includes(user.user_id)
                );

                // For now, create placeholder stories (since backend doesn't have stories yet)
                // In the future, this would fetch actual stories from the backend
                const storiesData = storyUsers.slice(0, 10).map(user => ({
                    user_id: user.user_id,
                    username: user.username,
                    nickname: user.nickname,
                    hasStory: true, // Placeholder - would check if user has active story
                }));

                setStories(storiesData);
            } catch (error) {
                console.error("Error loading stories:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStories();
    }, [currentUser]);

    if (loading) {
        return (
            <div className={styles.storiesContainer}>
                <div className={styles.storiesScroll}>
                    <p>Loading stories...</p>
                </div>
            </div>
        );
    }

    if (stories.length === 0) {
        return null; // Don't show stories section if no stories
    }

    const handleStoryClick = (index) => {
        setSelectedStoryIndex(index);
        setShowStoryViewer(true);
    };

    const handleCloseStoryViewer = () => {
        setShowStoryViewer(false);
        setSelectedStoryIndex(null);
    };

    return (
        <>
            <div className={styles.storiesContainer}>
                <div className={styles.storiesScroll}>
                    {stories.map((story, index) => (
                        <div 
                            key={story.user_id || index} 
                            className={styles.storyItem}
                            onClick={() => handleStoryClick(index)}
                        >
                            <div className={styles.storyCircle}>
                                <img 
                                    src="/profile.png" 
                                    alt={story.username || story.nickname}
                                    className={styles.storyImage}
                                />
                            </div>
                            <p className={styles.storyUsername}>
                                {story.nickname || story.username || "User"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {showStoryViewer && selectedStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    currentIndex={selectedStoryIndex}
                    onClose={handleCloseStoryViewer}
                    currentUser={currentUser}
                />
            )}
        </>
    );
}

