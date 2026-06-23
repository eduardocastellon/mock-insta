import styles from "./sidePanel.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createNewPost, getUser, getUsers, handleFollow } from "../functions/functions";
import { useDarkMode } from "../hooks/useDarkMode";

export default function SidePanel(){
    const navigate = useNavigate();
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    
    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate("/");
    };
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false); //Activates the search users window
    const [showPost, setShowPost] = useState(false);
    const [userList, setUserList] = useState([]); //List of users from the backend
    const [searchInput, setSearchInput] = useState("");
    const inputFilter = userList.filter(u => u.username?.toLowerCase().includes(searchInput.toLowerCase()) && u.key !== user?.key); //A const variable to filter out users for search


    //NEW POST VARIABLES
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    //GET SEARCH USER LIST FROM BACKEND
    useEffect(() => {
        const retrieveUsers = async () =>{
            const x = await getUsers();
            setUserList(x);
        };

        retrieveUsers();
        const session = localStorage.getItem('session');
        if (!session) navigate("/");

        //SESSION USER EXISTS, STORE IT IN 'USER'
        setUser(JSON.parse(session))
    }, []);

    //FUNCTION TO UPDATE THE SESSION
    const updateSession = async () => {
        // console.log("update session")
        //REFRESH LIST OF USERS
        const x = await getUsers();
        setUserList(x);
        //REFRESH USER SESSION
        const t = await getUser(user?.key);
        localStorage.setItem("session",JSON.stringify(t));
        setUser(t);
    };

    //FUNCTION TO FOLLOW/UNFOLLOW USER
    const checkFollowing = async (u) => {
        // console.log("check following")
        const protocol = user?.following?.includes(u?.user_id) ? "UNFOLLOW" : "FOLLOW";
        await handleFollow(user?.key, protocol, u.user_id);

        updateSession();
        
    };

    //FUNCTION TO HANDLE CREATING NEW POST
    const handlePost = async () => {
        if (title === "" || description === "") return;
        await createNewPost(user?.user_id, title, description);
        setTitle("");
        setDescription("");
        setShowPost(false);
        window.location.reload();
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

    return(
        <div>
            {/* SCREEN PANEL */}
            <div className={styles.container}>
                {/* Instagram Logo */}
                <div className={styles.logoContainer}>
                    <Link to="/dashboard" className={styles.logoLink}>
                        <svg className={styles.instagramLogo} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className={styles.logoText}>Instagram</span>
                    </Link>
                </div>
                <Link to="/dashboard" className={styles.linkContainer}>Home</Link>
                <p onClick={() => setShowSearch(true)}>Search</p>
                <Link to="/messages" className={styles.linkContainer}>Messages</Link>
                <Link to="/profile" className={styles.linkContainer}>Profile</Link>
                <p onClick={() => setShowPost(true)}>+ New Post</p>
                <Link to="/settings" className={styles.linkContainer}>Settings</Link>
                <button 
                    className={styles.darkModeToggle}
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDarkMode ? (
                        <svg className={styles.darkModeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg className={styles.darkModeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>
                <button onClick={() => handleLogout()}>Logout</button>
            </div>

            {/* SHOW THE SEARCH WINDOW */}
            {showSearch && (<div onClick={() => {setShowSearch(false); setSearchInput("")}} className={styles.WindowWrapper}>
                <div onClick={(e) => e.stopPropagation()} className={styles.searchWindow}>

                    {/* INPUT TO SEARCH USERS BY USERNAME */}
                    <input type="text" placeholder="Search User" onChange={(e) => setSearchInput(e.target.value)}/>


                    {/* MAP OF USERS TO SHOW AFTER FILTERING */}
                    {searchInput === "" ? (<p>Search by username</p>) : (
                        inputFilter.map((users, i) => (
                            <div key={i} className={styles.searchUserContainer} onClick={() => {viewProfile(users?.key); setShowSearch(false)}}>
                                <img src="/profile.png" alt="profile"/>
                                <p>{users?.username}</p>
                                <button onClick={(e) => {e.stopPropagation(); checkFollowing(users)}}>{user?.following?.includes(users?.user_id) ? "unfollow" : "follow"}</button>
                            </div>
                        ))
                    )}
                </div>
            </div>)}


            {/* SHOW THE CREATE NEW POST WINDOW */}
            {showPost && (
                <div className={styles.WindowWrapper}>
                    <form className={styles.postWindow} onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <button onClick={() => {setShowPost(false); setTitle(""); setDescription("")}}><img src="/trashcan.png" /></button>
                            <button type="submit" onClick={() => handlePost()}><img src="/add.png" /></button>
                        </div>
                        <input type="text" placeholder="title" onChange={(e) => setTitle(e.target.value)} required/>
                        <textarea rows={3} cols={50} type="text" placeholder="description" onChange={(e) => setDescription(e.target.value)} required/>
                    </form>
                </div>
            )}



        </div>
    );
};