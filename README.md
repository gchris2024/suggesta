# Suggesta

Suggesta is a full-stack movie recommendation app built for a web apps course project. Users can register or log in, browse popular movies, search for titles, generate recommendations based on selected movies, and save recommendations into custom lists.

The repository is split into a React + Vite frontend and an Express + MongoDB backend, with planning documents and wireframes at the top level to support the design and build process.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
- Backend: Express, Mongoose, MongoDB, JWT authentication
- Tooling: ESLint, TypeScript, Nodemon

## Project Structure

```text
suggesta/
├── backend/
│   ├── src/
│   │   ├── middleware/   # auth and request middleware
│   │   ├── models/       # Mongoose schemas for users, movies, and saved lists
│   │   ├── routes/       # auth, movie, and saved-list API routes
│   │   └── server.js     # Express app entry point
│   ├── package.json
│   └── .env.example
├── web/
│   ├── docs/             # frontend wireframes and supporting design assets
│   ├── public/           # static public assets
│   ├── src/
│   │   ├── components/   # shared, home, app, and recommendation UI components
│   │   ├── lib/          # API helpers, metadata helpers, and shared types
│   │   ├── pages/        # route-level page components
│   │   ├── App.tsx       # frontend route definitions
│   │   ├── main.tsx      # Vite/React entry point
│   │   └── index.css     # global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── BRAINSTORM.md         # early project ideation notes
├── BRIEF.md              # project brief and scope
├── STEP-BY-STEP-GUIDE.md # backend and frontend setup instructions
├── WIREFRAMES.md         # wireframe overview
└── README.md
```

## Current App Flow

1. Users authenticate through the backend auth routes.
2. The Home page loads popular movies and supports search.
3. Search results can be selected to generate recommendations.
4. Recommended movies can be selected and saved into new or existing lists.
5. The Saved page displays saved lists and supports editing/removing list items.

## Setup

See `STEP-BY-STEP-GUIDE.md` for the full backend and frontend setup instructions, including environment variables and local development commands.

## Obligatory AI Disclaimer

This project was created with the help of generative artifical intelligence. All generated code has been reviewed and refactored.
