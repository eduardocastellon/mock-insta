import styles from "./LoadingSkeleton.module.css";

export default function LoadingSkeleton({ type = "post" }) {
    if (type === "post") {
        return (
            <div className={styles.postSkeleton}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeletonCircle} skeleton`}></div>
                    <div className={`${styles.skeletonLine} skeleton`}></div>
                </div>
                <div className={`${styles.skeletonImage} skeleton`}></div>
                <div className={styles.skeletonActions}>
                    <div className={`${styles.skeletonIcon} skeleton`}></div>
                    <div className={`${styles.skeletonIcon} skeleton`}></div>
                </div>
                <div className={styles.skeletonText}>
                    <div className={`${styles.skeletonLine} skeleton`}></div>
                    <div className={`${styles.skeletonLineShort} skeleton`}></div>
                </div>
            </div>
        );
    }

    if (type === "story") {
        return (
            <div className={styles.storySkeleton}>
                <div className={`${styles.skeletonStoryCircle} skeleton`}></div>
                <div className={`${styles.skeletonStoryLine} skeleton`}></div>
            </div>
        );
    }

    return null;
}

