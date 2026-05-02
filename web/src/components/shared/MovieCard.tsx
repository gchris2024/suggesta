import MoviePoster from "@/components/shared/MoviePoster";
import { getGenreLabels, getReleaseYear } from "@/lib/movieMetadata";
import type { Movie } from "@/lib/types";

type MovieCardProps = {
  movie: Movie;
  isToggleable?: boolean;
  isSelected?: boolean;
  onToggle?: (tmdbId: number) => void;
};

export default function MovieCard({
  movie,
  isToggleable = false,
  isSelected = false,
  onToggle,
}: MovieCardProps) {
  const genreLabels = getGenreLabels(movie.genreIds);
  const shouldRenderToggle = isToggleable && Boolean(onToggle);

  return (
    <article className="rounded-4xl border border-stone-200 bg-white/85 p-4 shadow-sm">
      <div className={shouldRenderToggle ? "relative" : undefined}>
        <MoviePoster movie={movie} posterHeightClass="h-80" />

        {shouldRenderToggle && onToggle && (
          <label className="absolute bottom-4 right-4 flex cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(movie.tmdbId)}
              className="peer sr-only"
              aria-label={`Select ${movie.title}`}
            />

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/95 text-lg font-black text-stone-900 shadow-sm transition peer-checked:bg-stone-900 peer-checked:text-white">
              {isSelected ? "✓" : ""}
            </span>
          </label>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <h3 className="m-0 text-xl font-semibold italic tracking-tight text-stone-950">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-stone-700">
            <span>{getReleaseYear(movie.releaseDate)}</span>
            {genreLabels.map((genreLabel) => (
              <span key={genreLabel}>{genreLabel}</span>
            ))}
          </div>
        </div>

        <p className="m-0 text-sm leading-6 text-stone-700">
          {movie.overview?.trim()
            ? movie.overview
            : "No synopsis is available for this movie yet."}
        </p>
      </div>
    </article>
  );
}
