import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppPageLayout from "@/components/app/AppPageLayout";
import MovieCard from "@/components/shared/MovieCard";
import SelectedMovieCard from "@/components/recommendations/SelectedMovieCard";
import type { Movie } from "@/lib/types";

type RecommendationsPageState = {
  recommendations?: Movie[];
  selectedMovieIds?: number[];
  selectedMovies?: Movie[];
};

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RecommendationsPageState | null;
  const recommendations = state?.recommendations ?? [];
  const selectedMovies = state?.selectedMovies ?? [];
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState<
    number[]
  >([]);

  function handleToggleRecommendation(tmdbId: number) {
    setSelectedRecommendationIds((currentIds) =>
      currentIds.includes(tmdbId)
        ? currentIds.filter((currentId) => currentId !== tmdbId)
        : [...currentIds, tmdbId],
    );
  }

  function handleSaveSelectedMovies() {
    if (selectedRecommendationIds.length === 0) {
      return;
    }

    const pendingMovies = selectedRecommendationIds.flatMap((tmdbId) => {
      const selectedRecommendation = recommendations.find(
        (movie) => movie.tmdbId === tmdbId,
      );

      return selectedRecommendation ? [selectedRecommendation] : [];
    });

    navigate("/saved", {
      state: {
        pendingMovies,
      },
    });
  }

  // Scroll to top on "Generate Recommendations" click from Home
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AppPageLayout>
      <div className="space-y-12">
        <section className="space-y-6">
          <div className="space-y-3">
            <h1 className="m-0 text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">
              You Selected:
            </h1>
          </div>

          {selectedMovies.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {selectedMovies.map((movie) => (
                  <SelectedMovieCard key={movie.tmdbId} movie={movie} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-4xl border border-dashed border-stone-300 px-6 py-12 text-center text-stone-600">
              No selected movies were carried over. Go back to Home, search for
              movies, and check the ones you like first.
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="m-0 text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">
              Based on your selection{selectedMovies.length === 1 ? "" : "s"},
              we recommend:
            </h2>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.tmdbId}
                    movie={movie}
                    isToggleable
                    isSelected={selectedRecommendationIds.includes(
                      movie.tmdbId,
                    )}
                    onToggle={handleToggleRecommendation}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSaveSelectedMovies}
                  disabled={selectedRecommendationIds.length === 0}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-stone-900 px-8 py-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Save Selected to My Lists
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-4xl border border-dashed border-stone-300 px-6 py-12 text-center text-stone-600">
              No recommendations yet. Go back to Home, search for movies, check
              the ones you like, and generate recommendations from there.
            </div>
          )}
        </section>
      </div>
    </AppPageLayout>
  );
}
