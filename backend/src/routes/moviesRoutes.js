import express from "express";

const router = express.Router();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbHeaders = () => ({
  Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
});

const formatMovie = ({
  id,
  title,
  poster_path,
  overview,
  release_date,
  genre_ids,
  vote_average,
}) => ({
  tmdbId: id,
  title,
  posterPath: poster_path,
  overview,
  releaseDate: release_date,
  genreIds: genre_ids,
  voteAverage: vote_average,
});

// GET /api/movies/popular
router.get("/popular", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`,
      {
        headers: tmdbHeaders(),
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch popular movies" });
    }

    const data = await response.json();
    res.json({ movies: data.results.map(formatMovie) });
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/movies/search?q=
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`,
      { headers: tmdbHeaders() },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to search movies" });
    }

    const data = await response.json();
    res.json({
      movies: data.results.map(formatMovie), // TODO: Paginate results
      totalResults: data.total_results,
      page: data.page,
      totalPages: data.total_pages,
    });
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/movies/recommendations
// Body: { tmdbIds: [123, 456, ...] }  (Movie IDs the user selected)
router.post("/recommendations", async (req, res) => {
  const { tmdbIds } = req.body;

  if (!Array.isArray(tmdbIds) || tmdbIds.length === 0) {
    return res
      .status(400)
      .json({ error: "'tmdbIds' must be a non-empty array" });
  }

  try {
    // Include provided movies to not recommend them
    const seenIds = new Set(tmdbIds.map(Number));
    const recommendations = [];

    // Fetch recommendations for each provided movie ID in parallel
    const results = await Promise.all(
      tmdbIds.map((id) =>
        fetch(
          `${TMDB_BASE_URL}/movie/${id}/recommendations?language=en-US&page=1`,
          {
            headers: tmdbHeaders(),
          },
        ).then((res) => (res.ok ? res.json() : null)),
      ),
    );

    // Combine and deduplicate recommendations
    for (const data of results) {
      if (!data) continue;
      for (const movie of data.results) {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          recommendations.push(formatMovie(movie));
        }
      }
    }

    // Sort by most highly voted
    recommendations.sort((a, b) => b.voteAverage - a.voteAverage);

    res.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
