import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./StoryViewer.module.css";

export default function StoryViewer({ stories, currentIndex, onClose, currentUser }) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex || 0);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef(null);
    const currentStory = stories[currentStoryIndex];

    const handleNext = useCallback(() => {
        setCurrentStoryIndex(prev => {
            if (prev < stories.length - 1) {
                setProgress(0);
                return prev + 1;
            } else {
                // Close if last story
                onClose();
                return prev;
            }
        });
    }, [stories.length, onClose]);

    const handlePrevious = useCallback(() => {
        setCurrentStoryIndex(prev => {
            if (prev > 0) {
                setProgress(0);
                return prev - 1;
            } else {
                onClose();
                return prev;
            }
        });
    }, [onClose]);

    const handleClose = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        onClose();
    }, [onClose]);

    useEffect(() => {
        // Reset progress when story changes
        setProgress(0);
        
        // Start progress animation (5 seconds per story)
        const startProgress = () => {
            progressIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        // Move to next story
                        handleNext();
                        return 0;
                    }
                    return prev + 2; // Increment by 2% every 100ms (5 seconds total)
                });
            }, 100);
        };

        startProgress();

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [currentStoryIndex, handleNext]);

    // Pause progress on mouse enter, resume on mouse leave
    const handleMouseEnter = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    };

    const handleMouseLeave = () => {
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 2;
            });
        }, 100);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                handleNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                handlePrevious();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNext, handlePrevious, handleClose]);

    if (!currentStory) return null;

    return (
        <div className={styles.storyViewerOverlay} onClick={handleClose}>
            <div className={styles.storyViewer} onClick={(e) => e.stopPropagation()}>
                {/* Progress Bar */}
                <div className={styles.progressBarContainer}>
                    {stories.map((_, index) => (
                        <div key={index} className={styles.progressBarWrapper}>
                            <div 
                                className={styles.progressBar}
                                style={{
                                    width: index < currentStoryIndex 
                                        ? '100%' 
                                        : index === currentStoryIndex 
                                            ? `${progress}%` 
                                            : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Story Header */}
                <div className={styles.storyHeader}>
                    <div className={styles.storyHeaderUser}>
                        <img 
                            src="/profile.png" 
                            alt={currentStory.username}
                            className={styles.storyHeaderImage}
                        />
                        <span className={styles.storyHeaderUsername}>
                            {currentStory.nickname || currentStory.username}
                        </span>
                        <span className={styles.storyHeaderTime}>2h</span>
                    </div>
                    <button 
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close story"
                    >
                        ✕
                    </button>
                </div>

                {/* Story Content */}
                <div 
                    className={styles.storyContent}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div 
                        className={styles.storyClickAreaLeft}
                        onClick={handlePrevious}
                    />
                    <div className={styles.storyImageContainer}>
                        <div className={styles.storyPlaceholder}>
                            <p>{currentStory.image_id || "Story Image"}</p>
                            <p className={styles.storyPlaceholderSubtext}>
                                Story from {currentStory.nickname || currentStory.username}
                            </p>
                        </div>
                    </div>
                    <div 
                        className={styles.storyClickAreaRight}
                        onClick={handleNext}
                    />

                    {/* Navigation Arrows */}
                    {currentStoryIndex > 0 && (
                        <button 
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={handlePrevious}
                            aria-label="Previous story"
                        >
                            ‹
                        </button>
                    )}
                    {currentStoryIndex < stories.length - 1 && (
                        <button 
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={handleNext}
                            aria-label="Next story"
                        >
                            ›
                        </button>
                    )}
                </div>

                {/* Story Footer (for future: reply, like, etc.) */}
                <div className={styles.storyFooter}>
                    <input 
                        type="text" 
                        placeholder="Send message"
                        className={styles.storyInput}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}

