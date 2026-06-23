import SidePanel from "../../components/sidePanel";
import { changeUser, changeUserPass, deleteUser } from "../../functions/functions";
import styles from "./settings.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    //USER INFO VARIABLES
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    //OPENS WINDOW ASKING IF THE USER IS SURE ABOUT DELETING ACCOUNT
    const [areYouSure, setAreYouSure] = useState(false);

    //CHECK IF LOGGED IN
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) navigate("/");
        const u = JSON.parse(session);
        //SESSION USER EXISTS, STORE IT IN 'USER'
        setUser(u)
        setNickname(u?.nickname);
        setBio(u?.bio);
        setFirstname(u.firstname);
        setLastname(u?.lastname);
        setUsername(u?.username);
    }, []);


    //FUNCTION FOR CHANGING SOFT INFO
    const changeSoftInfo = async () => {
        if((nickname !== null) && (bio !== null) && (firstname !== "" && firstname !== null) && (lastname !== "" && lastname !== null)){
            let tempName = nickname;
            if(nickname === "") tempName = user?.firstname;
            const updatedUser = await changeUser(user?.key, "CHANGE_USER", firstname, lastname, bio, nickname);
            localStorage.setItem("session",JSON.stringify(updatedUser));
            setUser(updatedUser);
            window.location.reload();
        }
    };
    //FUNCTION FOR HARD CHANGES
    const changeHardInfo = async (protocol) => {
        if(protocol === "USERNAME"){
            if(username === "" || username === undefined || username === null || username === user?.username) return console.log("new username must be different from the original and must be unique. Username must have substance");
        }
        else if(protocol === "PASSWORD"){
            if(password === "" || password === undefined || password === null) return console.log("Password must have substance");
            if(oldPassword === "" || oldPassword === undefined || oldPassword === null) return console.log("oldPassword must have substance");
        }

        const updatedUser = await changeUserPass(protocol, user?.user_id, username, oldPassword, password);
        if (updatedUser === undefined || updatedUser === null || !updatedUser) return console.log("user does not exist");

        if(updatedUser.success === false) return console.log("Wrong current password, or username is already taken. Enter the correct password.");

        localStorage.setItem("session",JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.location.reload();
    };

    //FUNCTION TO DELETE USER AND UPDATE LOCAL STORAGE
    const deleteAccount = async () => {
        const response = await deleteUser(user?.key);
        // const response = "this";
        if (response?.success === true){
            localStorage.removeItem('session');
            setUser(null);
            navigate("/");
        } else {
            return console.log("Failed to delete account, try again later");
        }
    };

    return(
        <div className={styles.page}>
            <SidePanel />
            <div className={styles.pageContent}>
                <div>
                    <h2 style={{margin: "0 0 24px 0", fontSize: "20px", fontWeight: "600"}}>Edit Profile</h2>
                    <h3>Display Name</h3>
                    <input value={nickname} type="text" placeholder="Display name" onChange={e => setNickname(e.target.value)}/>
                    <h3>Bio</h3>
                    <textarea value={bio} type="text" rows={5} placeholder="Bio" onChange={e => setBio(e.target.value)}/>
                    <h3>First Name</h3>
                    <input value={firstname} type="text" placeholder="First name" onChange={e => setFirstname(e.target.value)}/>
                    <h3>Last Name</h3>
                    <input value={lastname} type="text" placeholder="Last name" onChange={e => setLastname(e.target.value)}/>
                    <button onClick={() => changeSoftInfo()}>Save Changes</button>
                </div>
                
                <div>
                    <h2 style={{margin: "0 0 24px 0", fontSize: "20px", fontWeight: "600"}}>Account Settings</h2>
                    <h3>Username</h3>
                    <input value={username} type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                    <button onClick={() => changeHardInfo("USERNAME")}>Change Username</button>
                </div>
                
                <div>
                    <h2 style={{margin: "0 0 24px 0", fontSize: "20px", fontWeight: "600"}}>Change Password</h2>
                    <h3>Current Password</h3>
                    <input type="password" placeholder="Current password" onChange={e => setOldPassword(e.target.value)}/>
                    <h3>New Password</h3>
                    <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)}/>
                    <button onClick={() => changeHardInfo("PASSWORD")}>Change Password</button>
                </div>

                <div>
                    <button onClick={() => setAreYouSure(true)} style={{backgroundColor: areYouSure ? "grey" : "red"}}>Delete Account</button>
                    {areYouSure && (
                        <>
                            <h1>Are You Sure?</h1>
                            <button onClick={() => setAreYouSure(false)} style={{backgroundColor: "grey"}}>Keep Account</button>
                            <button onClick={() => deleteAccount(user?.key)} style={{backgroundColor: "red"}}>Yes I am Sure</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}