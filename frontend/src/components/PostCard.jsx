import { useState } from "react";
import styles from "./PostCard.module.css";
import { handlePostLike, handlePostComment } from "../functions/functions";

export default function PostCard({ post, currentUser, onUpdate }) {
    const [showComments, setShowComments] = useState(false);
    const [commentBody, setCommentBody] = useState("");
    const [isLiked, setIsLiked] = useState(post?.users_liked?.includes(currentUser?.user_id) || false);
    const [likesCount, setLikesCount] = useState(post?.likes || 0);

    const handleLike = async () => {
        const protocol = isLiked ? "DISLIKE" : "LIKE";
        const updatedPost = await handlePostLike(post?.key, protocol, currentUser?.user_id);
        if (updatedPost) {
            setIsLiked(updatedPost.users_liked.includes(currentUser?.user_id));
            setLikesCount(updatedPost.likes);
            if (onUpdate) onUpdate(updatedPost);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentBody.trim() === "") return;
        
        const updatedPost = await handlePostComment(
            post?.key,
            "COMMENTS",
            currentUser?.user_id,
            currentUser?.nickname || currentUser?.username,
            commentBody
        );
        
        if (updatedPost) {
            setCommentBody("");
            setShowComments(true);
            if (onUpdate) onUpdate(updatedPost);
        }
    };

    return (
        <div className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
                <div className={styles.postHeaderUser}>
                    <img src="/profile.png" alt="profile" className={styles.profilePic} />
                    <span className={styles.username}>{post?.nickname || post?.username || post?.created_by || "User"}</span>
                </div>
            </div>

            {/* Post Image/Content */}
            <div className={styles.postImage}>
                <div className={styles.imagePlaceholder}>
                    <p>{post?.image_id || "Post Image"}</p>
                </div>
            </div>

            {/* Post Actions */}
            <div className={styles.postActions}>
                <button 
                    className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? "❤️" : "🤍"} {likesCount > 0 && <span>{likesCount}</span>}
                </button>
                <button 
                    className={styles.actionButton}
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 {post?.comments?.length > 0 && <span>{post.comments.length}</span>}
                </button>
            </div>

            {/* Post Description */}
            {post?.description && (
                <div className={styles.postDescription}>
                    <span className={styles.descriptionUsername}>{post?.nickname || post?.username || post?.created_by || "User"}</span>
                    <span>{post.description}</span>
                </div>
            )}

            {/* Comments Section */}
            {showComments && (
                <div className={styles.commentsSection}>
                    {post?.comments && post.comments.length > 0 && (
                        <div className={styles.commentsList}>
                            {[...post.comments].sort((a, b) => b.key - a.key).map((comment, i) => (
                                <div key={i} className={styles.comment}>
                                    <span className={styles.commentUsername}>{comment.nickname}</span>
                                    <span>{comment.body}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentBody}
                            onChange={(e) => setCommentBody(e.target.value)}
                            className={styles.commentInput}
                        />
                        <button type="submit" className={styles.commentButton}>Post</button>
                    </form>
                </div>
            )}
        </div>
    );
}

