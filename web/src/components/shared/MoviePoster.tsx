import { getMoviePosterUrl } from "@/lib/movieMetadata";
import type { Movie } from "@/lib/types";

type MoviePosterProps = {
  movie: Movie;
  posterHeightClass: string;
};

export default function MoviePoster({
  movie,
  posterHeightClass,
}: MoviePosterProps) {
  const posterUrl = getMoviePosterUrl(movie.posterPath);

  if (!posterUrl) {
    return (
      <div
        className={`flex ${posterHeightClass} items-center justify-center rounded-4xl bg-stone-200 text-center text-sm font-semibold uppercase tracking-[0.3em] text-stone-500`}
      >
        No Poster
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={`${movie.title} poster`}
      className={`${posterHeightClass} w-full rounded-4xl object-cover shadow-sm`}
      loading="lazy"
    />
  );
}