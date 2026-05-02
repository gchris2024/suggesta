import type { MoviesResponse, RecommendationsResponse } from "@/lib/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getStoredToken() {
  return (
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token")
  );
}

async function requestMovies(endpoint: string) {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Log in to browse movies.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as MoviesResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to load movies right now.");
  }

  return data.movies ?? [];
}

export async function requestPopularMovies() {
  return requestMovies("/movies/popular");
}

export async function requestSearchMovies(query: string) {
  return requestMovies(`/movies/search?q=${encodeURIComponent(query)}`);
}

export async function requestRecommendations(tmdbIds: number[]) {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Log in to browse movies.");
  }

  const response = await fetch(`${API_BASE_URL}/movies/recommendations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tmdbIds }),
  });

  const data = (await response.json()) as RecommendationsResponse;

  if (!response.ok) {
    throw new Error(
      data.error ?? "Unable to generate recommendations right now.",
    );
  }

  return data.recommendations ?? [];
}
