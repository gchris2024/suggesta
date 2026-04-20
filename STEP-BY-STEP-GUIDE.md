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
