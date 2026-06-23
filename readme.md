# Mock Instagram

A full-stack Instagram-style social media app: a Node.js/Express/MongoDB backend and a React/Vite frontend, in a single repository (merged from previously separate frontend/backend repos).

## Architecture

```
new-project/
├── backend/    Node.js + Express REST API, MongoDB (Mongoose)
└── frontend/   React 19 + Vite single-page app, React Router
```

The frontend talks to the backend exclusively over HTTP/JSON via `fetch` calls defined in [frontend/src/functions/functions.js](frontend/src/functions/functions.js). There is no server-side rendering or shared code between the two — they are independently deployable services.

## Backend

**Stack:** Express 5, Mongoose 9 (MongoDB), Argon2 (password hashing), CORS, dotenv.

**Entry point:** [backend/server.js](backend/server.js) — connects to MongoDB via [backend/db.js](backend/db.js), then mounts all route modules at `/`.

**Models** ([backend/models/](backend/models/)):

| Model | Key fields |
|---|---|
| `User` | `user_id`, `username` (unique), `email` (unique), `password` (hashed), `firstname`, `lastname`, `nickname`, `dob`, `bio`, `profile_pic`, `followers[]`, `following[]`, `private` |
| `Post` | `post_id`, `created_by`, `image_id`, `description`, `likes`, `users_liked[]`, `comments[]` |
| `Story` | `story_id`, `created_by`, `description`, `likes`, `users_liked[]` |
| `Message` | `from`, `to`, `text`, `createdAt` |

Deleting a `User` cascades to delete that user's `Post`s and `Story`s.

### API Routes

All routes are mounted at the server root (no `/api` prefix). Default base URL: `http://localhost:5051`.

**Users** ([backend/routes/users.js](backend/routes/users.js))
| Method | Path | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/users/:key` | Get one user |
| POST | `/users` | Create (register) a user |
| PUT | `/users/:key` | Update user — body `protocol`: `CHANGE_USER` (edit profile fields), `FOLLOW`, `UNFOLLOW` |
| DELETE | `/users/:key` | Delete user (cascades to their posts/stories) |

**Login** ([backend/routes/login.js](backend/routes/login.js))
| Method | Path | Description |
|---|---|---|
| POST | `/login` | Authenticate with username/password (Argon2 verify) |
| PUT | `/login` | Change credentials — body `protocol`: `USERNAME` or `PASSWORD` |

**Posts** ([backend/routes/posts.js](backend/routes/posts.js))
| Method | Path | Description |
|---|---|---|
| GET | `/posts` | List all posts |
| GET | `/posts/:key` | Get one post |
| POST | `/posts` | Create a post, or look up a user's posts — body `protocol`: `FIND_USER_POSTS` |
| PUT | `/posts/:key` | Update — body `protocol`: `DESCRIPTION`, `LIKE`, `DISLIKE`, `COMMENTS` |
| DELETE | `/posts/:key` | Delete a post |
| DELETE | `/posts/:key/comments/:id` | Delete a comment from a post |

**Stories** ([backend/routes/stories.js](backend/routes/stories.js))
| Method | Path | Description |
|---|---|---|
| GET | `/stories` | List all stories |
| GET | `/stories/:key` | Get one story |
| POST | `/stories` | Create a story |
| PUT | `/stories/:key` | Update — body `protocol`: `LIKE`, `DISLIKE` |
| DELETE | `/stories/:key` | Delete a story |

**Messages** ([backend/routes/messages.js](backend/routes/messages.js))
| Method | Path | Description |
|---|---|---|
| GET | `/messages/:userId/:otherUserId` | Get conversation between two users, oldest first |
| POST | `/messages` | Send a message — body `{ from, to, text }` |

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
PORT=5051        # optional, defaults to 5051
```

Run it:

```bash
npm run dev    # nodemon, auto-reload
npm start      # production
```

Or with Docker:

```bash
cd backend
docker build -t instagram-backend .
docker run --env-file .env -p 5051:5051 instagram-backend
```

## Frontend

**Stack:** React 19, React Router 7, Vite (rolldown-vite).

**Entry point:** [frontend/src/main.jsx](frontend/src/main.jsx) → [frontend/src/routes.jsx](frontend/src/routes.jsx)

**Pages/routes** ([frontend/src/routes.jsx](frontend/src/routes.jsx)):

| Path | Page |
|---|---|
| `/` | [pages/login.jsx](frontend/src/pages/login.jsx) — login & registration |
| `/dashboard` | [pages/dashboard/dashboard.jsx](frontend/src/pages/dashboard/dashboard.jsx) — main feed |
| `/messages` | [pages/messages/Messages.jsx](frontend/src/pages/messages/Messages.jsx) — direct messages |
| `/profile` | [pages/profile/profile.jsx](frontend/src/pages/profile/profile.jsx) — own profile |
| `/profile/:username` | [pages/viewOtherProfile/viewOtherProfile.jsx](frontend/src/pages/viewOtherProfile/viewOtherProfile.jsx) — view another user's profile |
| `/settings` | [pages/settings/settings.jsx](frontend/src/pages/settings/settings.jsx) — account settings |

Reusable UI lives in [frontend/src/components/](frontend/src/components/) (e.g. `PostCard`, `Stories`, `StoryViewer`, `RightSidebar`, `sidePanel`, `LoadingSkeleton`).

All backend calls are centralized in [frontend/src/functions/functions.js](frontend/src/functions/functions.js), which wraps `fetch` for every route above. The logged-in user session is persisted to `localStorage` under the key `"session"`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev       # starts Vite dev server, default http://localhost:5173
npm run build     # production build
npm run preview   # preview the production build
```

### Configuration

The backend URL is hardcoded in [frontend/src/functions/functions.js](frontend/src/functions/functions.js):

```js
// const backend_url = "http://localhost:5051";
const backend_url = "https://mock-instagram-backend-production.up.railway.app";
```

Update `backend_url` to point at wherever your backend is running (e.g. uncomment the localhost line for local development), or swap it for an environment variable.

## Running the full stack locally

```bash
# terminal 1
cd backend && npm install && npm run dev

# terminal 2
cd frontend && npm install && npm run dev
```

Then point the frontend at `http://localhost:5051` as described above, and open the Vite dev server URL (printed in terminal 2, default `http://localhost:5173`).

## Authentication

Passwords are hashed with Argon2 ([backend/functions/functions.js](backend/functions/functions.js): `passHash`, `loginCheck`). There is no token/session-based auth on the backend — the frontend simply stores the returned user object in `localStorage` after a successful `POST /login` and uses it as the active session.
