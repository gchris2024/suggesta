import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppPageLayout from "@/components/app/AppPageLayout";
import MoviePoster from "@/components/shared/MoviePoster";
import SelectedMovieCard from "@/components/recommendations/SelectedMovieCard";
import {
  appendToSavedList,
  createSavedList,
  requestSavedLists,
} from "@/lib/savedApi";
import type { Movie, SavedList } from "@/lib/types";

type SavedPageLocationState = {
  pendingMovies?: Movie[];
};

function formatErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function Saved() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SavedPageLocationState | null;

  // Page state for carried-over movies, saved lists, and UI feedback.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState<SavedList[]>([]);
  const [pendingMovies, setPendingMovies] = useState<Movie[]>(
    () => state?.pendingMovies ?? [],
  );

  // Load the user's saved lists when this page opens.
  useEffect(() => {
    let isCancelled = false;

    async function loadSavedLists() {
      setIsLoadingLists(true);
      setError("");

      try {
        const nextLists = await requestSavedLists();

        if (!isCancelled) {
          setLists(nextLists);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(
            formatErrorMessage(
              loadError,
              "Unable to load your saved lists right now.",
            ),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingLists(false);
        }
      }
    }

    void loadSavedLists();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Refresh the saved lists after a create or append action.
  async function refreshSavedLists() {
    const nextLists = await requestSavedLists();
    setLists(nextLists);
  }

  // Create a brand new list with the movies carried over from Recommendations.
  async function handleCreateList() {
    const normalizedName = newListName.trim();

    if (!normalizedName || pendingMovies.length === 0) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await createSavedList(normalizedName, pendingMovies);
      await refreshSavedLists();
      setPendingMovies([]);
      setNewListName("");
      setSuccessMessage(`Created "${normalizedName}" and saved your movies.`);
    } catch (saveError) {
      setError(
        formatErrorMessage(
          saveError,
          "Unable to create the saved list right now.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  // Add the carried-over movies into one of the user's existing lists.
  async function handleAddToExistingList(list: SavedList) {
    if (pendingMovies.length === 0) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await appendToSavedList(list._id, pendingMovies);
      await refreshSavedLists();
      setPendingMovies([]);
      setSuccessMessage(`Added your selected movies to "${list.name}".`);
    } catch (saveError) {
      setError(
        formatErrorMessage(
          saveError,
          "Unable to update the saved list right now.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppPageLayout>
      <div className="space-y-10">
        {/* Page heading and Back to Home action */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <h1 className="m-0 mb-3 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
              My Saved Lists
            </h1>

            <p className="m-0 max-w-3xl text-base leading-7 text-stone-600">
              Review the lists you&apos;ve saved so far, or save the selected
              recommendations into a new or existing list.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-300 px-5 py-3 text-base font-medium text-stone-900 transition hover:border-stone-900"
          >
            Back to Home
          </button>
        </section>

        {/* Error and success feedback */}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* Movies passed in from Recommendations, plus the create-new-list form */}
        {pendingMovies.length > 0 && (
          <section className="space-y-6 rounded-4xl border border-stone-200 bg-white/70 p-6 shadow-sm">
            <div className="space-y-3">
              <h2 className="m-0 text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">
                Movies Ready to Save
              </h2>

              <p className="m-0 max-w-3xl text-base leading-7 text-stone-600">
                Create a new list with these recommendations, or add them to one
                of the saved lists below.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {pendingMovies.map((movie) => (
                <SelectedMovieCard key={movie.tmdbId} movie={movie} />
              ))}
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="new-list-name"
                  className="block text-sm font-semibold uppercase tracking-[0.18em] text-stone-500"
                >
                  New List Name
                </label>

                <input
                  id="new-list-name"
                  type="text"
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                  placeholder="Weekend Favorites"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base font-medium text-stone-900 outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateList}
                disabled={!newListName.trim() || isSaving}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-900 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSaving ? "Saving..." : "Create New List"}
              </button>
            </div>
          </section>
        )}

        {/* Existing saved lists, loading state, or empty state */}
        <section className="space-y-6">
          {isLoadingLists ? (
            <div className="rounded-4xl border border-dashed border-stone-300 px-6 py-12 text-center text-stone-600">
              Loading your saved lists...
            </div>
          ) : lists.length > 0 ? (
            <div className="space-y-8">
              {lists.map((list) => (
                <article
                  key={list._id}
                  className="space-y-5 rounded-4xl border border-stone-200 bg-white/70 p-6 shadow-sm"
                >
                  {/* List header and optional add-to-existing action */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="m-0 text-2xl font-semibold tracking-tight text-stone-950">
                        {list.name}
                      </h2>

                      <p className="m-0 text-sm font-medium text-stone-500">
                        {list.movies.length} saved movie
                        {list.movies.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    {pendingMovies.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAddToExistingList(list)}
                        disabled={isSaving}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-900 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Add Selected Here
                      </button>
                    )}
                  </div>

                  {/* Movie preview grid or per-list empty state */}
                  {list.movies.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {list.movies.slice(0, 5).map((movie) => (
                          <article
                            key={`${list._id}-${movie.tmdbId}`}
                            className="space-y-3"
                          >
                            <MoviePoster
                              movie={movie}
                              posterHeightClass="h-52"
                            />

                            <h3 className="m-0 text-xl font-semibold italic tracking-tight text-stone-950">
                              {movie.title}
                            </h3>
                          </article>
                        ))}
                      </div>

                      {list.movies.length > 5 && (
                        <p className="m-0 text-sm font-medium text-stone-500">
                          +{list.movies.length - 5} more movie
                          {list.movies.length - 5 === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-stone-300 px-5 py-8 text-center text-stone-600">
                      This list does not have any movies yet.
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-4xl border border-dashed border-stone-300 px-6 py-12 text-center text-stone-600">
              {pendingMovies.length > 0
                ? "Create your first list with the selected recommendations above."
                : "You do not have any saved lists yet. Go to Recommendations and save a few movies to get started."}
            </div>
          )}
        </section>
      </div>
    </AppPageLayout>
  );
}
