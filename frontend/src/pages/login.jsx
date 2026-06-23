import styles from "./login.module.css";
import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { createAccount, login } from "../functions/functions";

export default function Login(){
    const navigate = useNavigate();
    const [session, setSession] = useState(null);

    const [showSignIn, setShowSignIn] = useState(true);
    //SIGN IN/REGISTER
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //REGISTER
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");

    const changeView = () => {
        setShowSignIn(!showSignIn);
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        setDob("");
        setEmail("");
        setNickname("");
    };

    //CALL THE BACKEND FUNCTIONS
    const register = async () => {
        const user = await createAccount(username, password, firstname, lastname, dob, email, nickname);
        if (user && user !== undefined && user !== null){
            setSession(user);
            localStorage.setItem("session",JSON.stringify(user));
            navigate("/dashboard");
        }
    };
    const signin = async () => {
        const user = await login(username, password);
        if (user) setSession(user);
        if (user?.success === false) return;
        localStorage.setItem("session",JSON.stringify(user));
        navigate("/dashboard");
    }

    //FUNCTION TO CHECK IF USER IS LOGGED IN, IF SO, REROUTE
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) navigate("/dashboard");
    }, []);


    return(
        <div className={styles.page}>
            {showSignIn ? (
                <form className={styles.signInContainer} onSubmit={(e) => {e.preventDefault(); signin();}}>
                    <h1 style={{textAlign: "center"}}>Sign In</h1>
                    <input value={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                    <input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Sign In</button>

                    <div style={{display: "flex", gap: "7px"}}>
                        <p>Don't have an account?</p>
                        <p onClick={() => changeView()} style={{textDecoration: "underline", cursor: "pointer"}}>Sign Up</p>
                    </div>
                </form>
            ) : (
                <form className={styles.signUpContainer} onSubmit={(e) => {e.preventDefault(); register();}}>
                    <h1 style={{textAlign: "center"}}>Register</h1>
                    <input value={firstname} type="text" placeholder="First Name" onChange={(e) => setFirstname(e.target.value)} required />
                    <input value={lastname} type="text" placeholder="Last Name" onChange={(e) => setLastname(e.target.value)} required />
                    <input value={nickname} type="text" placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} required />
                    <input value={dob} type="text" placeholder="Date of Birth (mm-dd-yyyy)" onChange={(e) => setDob(e.target.value)} required />
                    <input value={email} type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input value={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                    <input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Sign Up</button>

                    <div style={{display: "flex", gap: "7px"}}>
                        <p>Already have an account?</p>
                        <p onClick={() => changeView()} style={{textDecoration: "underline", cursor: "pointer"}}>Sign In</p>
                    </div>
                </form>
            )}
            
        </div>
    );
};