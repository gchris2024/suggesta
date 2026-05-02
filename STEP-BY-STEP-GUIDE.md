# Backend Setup Guide

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

# Frontend Setup Guide

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
VITE_API_URL=http://localhost:3000/api
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
