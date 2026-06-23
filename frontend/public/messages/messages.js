// Use local backend for development, can be switched to production URL
const API_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5051" 
    : "https://mock-instagram-backend-production.up.railway.app";

const userListEl = document.getElementById("user-list");
const chatHeaderEl = document.getElementById("chat-header");
const chatMessagesEl = document.getElementById("chat-messages");
const sendFormEl = document.getElementById("send-form");
const messageInputEl = document.getElementById("message-input");
const backBtn = document.getElementById("back-to-dashboard");

if(backBtn){
    backBtn.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });
}

let currentUser = null;
try{
    currentUser = JSON.parse(localStorage.getItem("session"));
    console.log("Current user from session:", currentUser);
}
catch(e){
    console.error("Failed to parse session:", e);
}

let selectedUser = null;

// FETCH USERS
async function loadUsers(){
    try{
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();

        // Some backends return an array directly, some return { users: [...] }
        const users = Array.isArray(data) ? data : data.users;

        if(!users){
            console.error("Unexpected /users response shape:", data);
            userListEl.innerHTML = "<div>No users found</div>";
            return;
        }

        // Make sure we have a current user
        if(!currentUser || !currentUser.user_id){
            console.warn("No currentUser or user_id in session:", currentUser);
        }

        // get everyone from the list
        const filtered = currentUser && currentUser.user_id? users.filter(u => u.user_id !== currentUser.user_id): users;userListEl.innerHTML = "";

        if(filtered.length === 0){
            userListEl.innerHTML = "<div style='font-size:14px;color:#777;'>no one to message</div>";
            return;
        }

        filtered.forEach(u =>{
            const div = document.createElement("div");
            div.className = "user-item";
            div.textContent = u.nickname || u.username || u.user_id;
            div.onclick = () => selectUser(u);
            userListEl.appendChild(div);
        });
    }
    catch(e){
        userListEl.innerHTML = "<div style='font-size:14px;color:#777;'>cant load users</div>";
    }
}


//choose user
function selectUser(user){
    selectedUser = user;
    chatHeaderEl.textContent = user.nickname || user.username || user.user_id;
    sendFormEl.classList.add("show");
    loadMessages();
}

//load the messages
async function loadMessages(){
    if(!selectedUser){
        return;
    }
    if (!currentUser || !currentUser.user_id) {
        console.error("Missing currentUser.user_id. Check localStorage.session:", currentUser);
        return;
    }
    const res = await fetch(
        `${API_URL}/messages/${currentUser.user_id}/${selectedUser.user_id}`
    );
    const messages = await res.json();
    chatMessagesEl.innerHTML = "";

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message " + (msg.from === currentUser.user_id ? "mine" : "theirs");
        div.textContent = msg.text;
        chatMessagesEl.appendChild(div);
    });
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

//send a message
sendFormEl.addEventListener("submit", async(e) =>{
    e.preventDefault();
    if(!messageInputEl.value.trim() || !selectedUser){
        return;
    }
    const text = messageInputEl.value.trim();
    messageInputEl.value = "";

    await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            from: currentUser.user_id,
            to: selectedUser.user_id,
            text
        })
    });
    loadMessages();
});

loadUsers();