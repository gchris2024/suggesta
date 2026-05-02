import MoviePoster from "@/components/shared/MoviePoster";
import { getReleaseYear } from "@/lib/movieMetadata";
import type { Movie } from "@/lib/types";

export default function PopularMovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="flex-none min-w-44 space-y-3 sm:min-w-48">
      <MoviePoster movie={movie} posterHeightClass="h-64" />

      <div>
        <h3 className="m-0 text-base font-semibold italic text-stone-950 sm:text-lg">
          {movie.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-stone-500">
          {getReleaseYear(movie.releaseDate)}
        </p>
      </div>
    </article>
  );
}