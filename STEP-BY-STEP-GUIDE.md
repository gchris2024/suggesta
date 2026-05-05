# Backend Setup

## 1) Prerequisites

- Install Node.js 20+ (LTS recommended).
- Install npm (included with Node.js).
- Use a REST client such as Thunder Client (VS Code extension) or Postman.

## 2) Clone the repo and install dependencies

From your terminal:

```bash
git clone https://github.com/gchris2024/suggesta.git
cd suggesta/backend
npm install
```

## 3) Configure environment variables

In `backend/`, copy `.env.example` to `.env`, then update values:

```env
MONGODB_URI=mongodb+srv://user:password@appname.xxxxxxx.mongodb.net/?appName=appname
JWT_SECRET=your-secret-key-change-this-to-something-long-and-random
JWT_EXPIRES_IN=7d
TMDB_READ_ACCESS_TOKEN=your-tmdb-read-access-token
```

## 4) MongoDB Atlas connection string

Create/get your Atlas connection string and set it in `MONGODB_URI`.

Example format:

```text
mongodb+srv://<username>:<password>@<cluster-name>.<id>.mongodb.net/?appName=<app-name>
```

Important:

- URL-encode special characters in your password.
- Whitelist your IP in Atlas Network Access.

## 5) Start the server

Current backend entry file is `src/server.js`.

Run this command from `backend/`:

```bash
npm run dev
```

## 6) Verify server is running

When successful, terminal output should include:

```text
Server is running on port 3000
```

Then open:

```text
http://localhost:3000/
```

Expected JSON response:

```json
{ "message": "Hello from the backend!" }
```

## 7) Test with Thunder Client

Create a request:

- Method: `GET`
- URL: `http://localhost:3000/`

Expected result:

- Status: `200 OK`
- Body: `{ "message": "Hello from the suggesta backend!" }`

# Frontend Setup

## 1) Prerequisites

- Use the same Node.js 20+ and npm prerequisites from the Backend Setup Guide above.
- Make sure the backend is running locally on `http://localhost:3000` before testing frontend-to-backend calls.

## 2) Use the existing Vite project or scaffold a fresh one

This repository already includes the frontend in `web/`.

If you already followed Backend Setup step 2, the repo is already cloned. From the repo root, install the frontend dependencies with:

```bash
cd suggesta/web
npm install
```

If you are setting up the frontend by itself instead of using the checked-in `web/` app, scaffold a fresh Vite React + TypeScript project with:

```bash
npm create vite@latest suggesta-web -- --template react-ts
```

Then install dependencies inside the new folder:

```bash
cd suggesta-web
npm install
```

## 3) Configure frontend environment variables

In `web/`, create a `.env.local` file and add:

```env
VITE_API_URL=http://localhost:3000
```

## 4) Start the frontend dev server

Run this command from `web/`:

```bash
npm run dev
```

Vite should print a local URL similar to:

```text
http://localhost:5173/
```

## 5) Verify the frontend connects to the backend locally

If you already started the backend in Backend Setup step 5, leave it running.

If not, complete the Backend Setup Guide first so the API is available at `http://localhost:3000`.

Then start the frontend from `web/`:

```bash
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:5173/
```

To verify the frontend is talking to the backend:

- Register a new account or log in with an existing one.
- After login, go to Home.
- Confirm that the Popular Movies section loads.
- Try searching for a movie and confirm results appear.

Optional browser check:

- Open DevTools Network tab.
- Confirm requests are being sent to `http://localhost:3000/api/...`.
- Confirm those requests return `200 OK` responses.

# Deployment

## 1) Prerequisites

- A [Railway](https://railway.app) account (free tier works).
- A [GitHub](https://github.com) account with this repository pushed to it.
- The backend environment variables ready (MongoDB URI, JWT secret, TMDB token).

---

## Backend — Deploy to Railway

### 1) Create a new Railway project

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Authorise Railway to access your GitHub account if prompted.
4. Select the repository.

### 2) Set the root directory

Railway will detect the repository root. Because the backend lives in a subdirectory you must tell Railway where it is:

1. Open your service in the Railway dashboard.
2. Go to **Settings → Source** and set **Root Directory** to:

```text
backend
```

Railway will now run all install and start commands from `backend/`.

### 3) Confirm the start command

Railway detects the `start` script in `backend/package.json` automatically:

```bash
node src/server.js
```

If it does not detect it automatically, go to **Settings → Deploy** and set **Start Command** to the above.

### 4) Set environment variables in Railway

Go to your service → **Variables** tab and add each key individually:

| Key                      | Value                        |
| ------------------------ | ---------------------------- |
| `MONGODB_URI`            | Your Atlas connection string |
| `JWT_SECRET`             | A long, random secret string |
| `JWT_EXPIRES_IN`         | `7d`                         |
| `TMDB_READ_ACCESS_TOKEN` | Your TMDB read access token  |

Railway automatically sets a `PORT` environment variable. The backend reads it with `process.env.PORT || 3000`, so no extra configuration is needed.

### 5) Deploy

Click **Deploy** (or push a new commit to `main`). Railway will:

1. Install dependencies with `npm ci`.
2. Start the server with `npm start`.

When the deploy finishes, Railway assigns a public URL such as:

```text
https://xxxx.up.railway.app
```

Copy this URL — you will need it for the frontend step.

### 6) Verify the backend is live

Open the Railway URL in your browser or send a GET request to it:

```text
https://xxxx.up.railway.app/
```

Expected JSON response:

```json
{ "message": "Hello from the backend!" }
```

---

## Frontend — Deploy to GitHub Pages

### 1) Set the production API URL

In `web/`, create (or update) a `.env.production` file:

```env
VITE_API_URL=https://xxxx.up.railway.app
```

### 2) Enable GitHub Pages **on** the repository

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Branch**, select `gh-pages` and click **Save**.

> The `gh-pages` branch is created automatically by the deploy script in the next step. You can skip this step until after step 3 if the branch does not exist yet.

### 3) Run the deploy script

From `web/`:

```bash
npm run deploy
````

This runs the following sequence defined in `package.json`:

1. `predeploy` runs automatically before `deploy`:
   - `npm run build` — compiles TypeScript and bundles the app with Vite.
   - `cp dist/index.html dist/404.html` — copies the index to 404.html so that GitHub Pages serves the React app for unknown routes (required for client-side routing using React Router).
2. `gh-pages -d dist` — pushes the `dist/` folder to the `gh-pages` branch.

### 4) Verify the frontend is live

After the script completes (allow ~1 minute for GitHub Pages to publish), open:

```text
https://<your-username>.github.io/suggesta/
```

To confirm it is talking to the backend:

- Register a new account or log in.
- Go to Home and confirm the Popular Movies section loads.
- Search for a movie and confirm results appear.

---

## CORS Configuration

The backend in `src/server.js` already allows requests from the GitHub Pages origin:

```js
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://<your-username>.github.io",
];
```

No extra CORS changes are needed for this setup. If you deploy the frontend to a different domain in the future, add that origin to the `ALLOWED_ORIGINS` array and redeploy the backend.
