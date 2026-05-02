import PopularMovieCard from "./PopularMovieCard";
import type { Movie } from "@/lib/types";

export default function PopularMoviesCarousel({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-hidden pb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="min-w-44 animate-pulse space-y-3 sm:min-w-48"
          >
            <div className="h-64 rounded-4xl bg-stone-200" />
            <div className="h-5 w-3/4 rounded-full bg-stone-200" />
            <div className="h-4 w-1/3 rounded-full bg-stone-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="movie-carousel pb-4">
      <div className="movie-carousel-track">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 gap-5 pr-5"
            aria-hidden={copyIndex === 1}
          >
            {movies.map((movie) => (
              <PopularMovieCard
                key={`${copyIndex}-${movie.tmdbId}`}
                movie={movie}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
