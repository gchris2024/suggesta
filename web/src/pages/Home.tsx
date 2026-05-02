import { startTransition, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AppPageLayout from "@/components/app/AppPageLayout";
import PopularMoviesCarousel from "@/components/home/PopularMoviesCarousel";
import MovieCard from "@/components/shared/MovieCard";
import SearchResultsSkeleton from "@/components/home/SearchResultsSkeleton";
import {
  requestPopularMovies,
  requestRecommendations,
  requestSearchMovies,
} from "@/lib/movieApi";
import type { Movie } from "@/lib/types";

function formatErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function Home() {
  const navigate = useNavigate();

  // Router and page state.
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovieIds, setSelectedMovieIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("query")?.trim() ?? "",
  );
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const requestedQuery = searchParams.get("query")?.trim() ?? "";

  // Load the popular movies when the page opens.
  useEffect(() => {
    let isCancelled = false;

    async function loadPopularMovies() {
      setIsLoadingPopular(true);
      setError("");

      try {
        const movies = await requestPopularMovies();

        if (!isCancelled) {
          setPopularMovies(movies);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(
            formatErrorMessage(
              loadError,
              "Unable to load popular movies right now.",
            ),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingPopular(false);
        }
      }
    }

    void loadPopularMovies();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Keep the page in sync with the search query in the URL.
  useEffect(() => {
    if (!requestedQuery) {
      startTransition(() => {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedMovieIds([]);
        setError("");
        setIsSearching(false);
      });
      return;
    }

    let isCancelled = false;

    startTransition(() => {
      setSearchQuery(requestedQuery);
      setSelectedMovieIds([]);
    });

    async function loadSearchResults() {
      setIsSearching(true);
      setError("");

      try {
        const movies = await requestSearchMovies(requestedQuery);

        if (!isCancelled) {
          setSearchResults(movies);
        }
      } catch (searchError) {
        if (!isCancelled) {
          setSearchResults([]);
          setError(
            formatErrorMessage(
              searchError,
              "Unable to search movies right now.",
            ),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }

    void loadSearchResults();

    return () => {
      isCancelled = true;
    };
  }, [requestedQuery]);

  // Search and selection actions.
  function handleSearchSubmit() {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ query: normalizedQuery });
  }

  function handleClearSearch() {
    setSearchParams({});
  }

  function handleToggleSelection(tmdbId: number) {
    setSelectedMovieIds((currentIds) =>
      currentIds.includes(tmdbId)
        ? currentIds.filter((currentId) => currentId !== tmdbId)
        : [...currentIds, tmdbId],
    );
  }

  async function handleGenerateRecommendations() {
    if (selectedMovieIds.length === 0) {
      return;
    }

    setIsGeneratingRecommendations(true);
    setError("");

    try {
      const selectedMovies = selectedMovieIds.flatMap((tmdbId) => {
        const selectedMovie = searchResults.find(
          (movie) => movie.tmdbId === tmdbId,
        );

        return selectedMovie ? [selectedMovie] : [];
      });

      const recommendations = await requestRecommendations(selectedMovieIds);

      navigate("/recommendations", {
        state: {
          recommendations,
          selectedMovieIds,
          selectedMovies,
        },
      });
    } catch (recommendationsError) {
      setError(
        formatErrorMessage(
          recommendationsError,
          "Unable to generate recommendations right now.",
        ),
      );
    } finally {
      setIsGeneratingRecommendations(false);
    }
  }

  // Decide which main view to show.
  const isShowingSearchResults = Boolean(requestedQuery);

  // Render the search state or the default popular state.
  return (
    <AppPageLayout
      navbarSearch={{
        value: searchQuery,
        onChange: setSearchQuery,
        onSubmit: handleSearchSubmit,
        placeholder: "SEARCH MOVIES...",
        isBusy: isSearching,
      }}
    >
      <div className="space-y-8">
        {/* Error banner */}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Search results view or default popular movies view */}
        {isShowingSearchResults ? (
          <section className="space-y-6">
            {/* Search heading and back to Popular Movies */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="m-0 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
                  Search Results
                </p>
                <h1 className="m-0 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                  {requestedQuery}
                </h1>
                <p className="m-0 text-base leading-7 text-stone-600">
                  Select movies from this list to refine the recommendations you
                  want to generate next.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-900"
              >
                Back to Popular Movies
              </button>
            </div>

            {/* Loading state, populated results, or empty search state */}
            {isSearching ? (
              <SearchResultsSkeleton />
            ) : searchResults.length > 0 ? (
              <div className="space-y-10">
                {/* Search result cards with selection controls */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.tmdbId}
                      movie={movie}
                      isToggleable
                      isSelected={selectedMovieIds.includes(movie.tmdbId)}
                      onToggle={handleToggleSelection}
                    />
                  ))}
                </div>

                {/* Generate recommendations action */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGenerateRecommendations}
                    disabled={
                      selectedMovieIds.length === 0 ||
                      isGeneratingRecommendations
                    }
                    className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-stone-900 px-8 py-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isGeneratingRecommendations
                      ? "Generating Recommendations..."
                      : "Generate Recommendations"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-4xl border border-dashed border-stone-300 px-6 py-12 text-center text-stone-600">
                No movies matched that search. Try a different title.
              </div>
            )}
          </section>
        ) : (
          <section className="flex min-h-[calc(100vh-11rem)] flex-col justify-center gap-6 text-center">
            {/* Popular Movies Copy + Carousel*/}
            <div className="mx-auto max-w-3xl space-y-3">
              <h1 className="m-0 mb-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Popular Movies
              </h1>
              <p className="m-0 text-base leading-7 text-stone-600">
                See what&apos;s trending right now, then use the search bar to
                dive into recommendations tailored to your taste.
              </p>
            </div>

            <div className="w-full">
              <PopularMoviesCarousel
                movies={popularMovies}
                isLoading={isLoadingPopular}
              />
            </div>
          </section>
        )}
      </div>
    </AppPageLayout>
  );
}
