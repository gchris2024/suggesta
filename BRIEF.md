# BRIEF.md

## Project name
Suggesta — Smart Movie Recommendation App

---

## The problem it solves
Users often spend too much time scrolling through streaming platforms without knowing what to watch. Suggesta helps users quickly find relevant movies by generating recommendations based on a few movies they already like.

---

## Feature List
- Search for movies using TMDB API
- View popular movies in a carousel
- Select 3–5 movies to define user taste
- Generate personalized recommendations based on selected movies
- Save and manage recommendation lists

---

## Data model

### Users
- _id  
- email  
- passwordHash  

### SavedLists
- _id  
- userId  
- inputMovies: [{ tmdbId, title, posterPath }]  
- recommendedMovies: [{ tmdbId, title, posterPath }]  
- createdAt  

---

## API endpoint table

### Authentication
- `POST /auth/register` — create a new user  
- `POST /auth/login` — authenticate user and return JWT  

### Movies (TMDB proxy)
- `GET /movies/popular` — fetch popular movies  
- `GET /movies/search?q=` — search movies by query  

### Recommendations
- `POST /recommendations` — generate recommendations from selected movies  

### Saved Lists
- `POST /saved` — save a recommendation list  
- `GET /saved` — retrieve all saved lists for the logged-in user  
- `DELETE /saved/:id` — delete a saved list  

---

## Authentication
Users need authentication to save and manage their personal recommendation lists.