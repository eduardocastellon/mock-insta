import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidePanel from "../../components/sidePanel";

export default function Messages() {
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 769);

    useEffect(() => {
        const session = localStorage.getItem("session");
        if (!session) {
            navigate("/");
        }

        // Handle window resize
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 769);
        };
        window.addEventListener("resize", handleResize);

        //take off scroll bar
        const prevHtmlOverflow = document.documentElement.style.overflow;
        const prevBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        
        return () => {
            window.removeEventListener("resize", handleResize);
            document.documentElement.style.overflow = prevHtmlOverflow;
            document.body.style.overflow = prevBodyOverflow;
        };
    }, [navigate]);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", position: "relative" }}>
            <SidePanel />
            <div style={{ 
                flex: 1, 
                marginLeft: isDesktop ? "244px" : "0",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: "#FAFAFA"
            }}>
                <iframe
                    title="messages"
                    src="/messages/messages.html"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "block",
                        overflow: "hidden",
                    }}
                />
            </div>
        </div>
    );
}
