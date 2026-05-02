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
  const movieMetadataStyle =
    "inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1";
  const overview = movie.overview?.trim()
    ? movie.overview
    : "No synopsis is available for this movie yet.";

  return (
    <article className="flex h-full flex-col rounded-4xl border border-stone-200 bg-white/85 p-3 shadow-sm">
      <div className={shouldRenderToggle ? "relative" : undefined}>
        <MoviePoster movie={movie} posterHeightClass="h-72" />

        {shouldRenderToggle && onToggle && (
          <label className="absolute bottom-4 right-4 flex cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(movie.tmdbId)}
              className="peer sr-only"
              aria-label={`Select ${movie.title}`}
            />

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-base font-black text-stone-900 shadow-sm transition peer-checked:bg-stone-900 peer-checked:text-white">
              {isSelected ? "✓" : ""}
            </span>
          </label>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <h3 className="m-0 text-lg font-semibold italic tracking-tight text-stone-950">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
            <span className={movieMetadataStyle}>
              {getReleaseYear(movie.releaseDate)}
            </span>
            {genreLabels.map((genreLabel) => (
              <span key={genreLabel} className={movieMetadataStyle}>
                {genreLabel}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="m-0 overflow-hidden text-sm leading-6 text-stone-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
            {overview}
          </p>
        </div>
      </div>
    </article>
  );
}
