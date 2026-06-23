//A FILE FOR STORING ROUTES FOR PAGES
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard/dashboard";
import Messages from "./pages/messages/Messages";
import Profile from "./pages/profile/profile";
import Settings from "./pages/settings/settings";
import ViewOtherProfile from "./pages/viewOtherProfile/viewOtherProfile";

export default function PageRoutes(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile/:username" element={<ViewOtherProfile />} />
            </Routes>
        </Router>
    );
};