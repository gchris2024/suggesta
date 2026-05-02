import type { Movie, SavedListResponse, SavedListsResponse } from "@/lib/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getStoredToken() {
  return (
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token")
  );
}

function getAuthHeaders(contentType = false) {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Log in to manage saved lists.");
  }

  return {
    ...(contentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export async function requestSavedLists() {
  const response = await fetch(`${API_BASE_URL}/saved`, {
    headers: getAuthHeaders(),
  });

  const data = (await response.json()) as SavedListsResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to load saved lists right now.");
  }

  return data.lists ?? [];
}

export async function createSavedList(name: string, movies: Movie[]) {
  const response = await fetch(`${API_BASE_URL}/saved`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ name, movies }),
  });

  const data = (await response.json()) as SavedListResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create a saved list right now.");
  }

  return data.list ?? null;
}

export async function appendToSavedList(listId: string, movies: Movie[]) {
  const response = await fetch(`${API_BASE_URL}/saved/${listId}`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ movies }),
  });

  const data = (await response.json()) as SavedListResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to update the saved list right now.");
  }

  return data.list ?? null;
}
