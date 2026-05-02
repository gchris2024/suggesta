import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppPageLayout from "@/components/app/AppPageLayout";
import MovieCard from "@/components/shared/MovieCard";
import SelectedMovieCard from "@/components/recommendations/SelectedMovieCard";
import type { Movie } from "@/lib/types";

type RecommendationsPageState = {
  recommendations?: Movie[];
  selectedMovieIds?: number[];
  selectedMovies?: Movie[];
  sourceQuery?: string;
};

export default function Recommendations() {
  const location = useLocation();
  const state = location.state as RecommendationsPageState | null;
  const recommendations = state?.recommendations ?? [];
  const selectedMovies = state?.selectedMovies ?? [];
  const sourceQuery = state?.sourceQuery ?? "";

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

              {sourceQuery && (
                <p className="m-0 text-base leading-7 text-stone-600">
                  From your search for "{sourceQuery}".
                </p>
              )}
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {recommendations.map((movie) => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))}
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
