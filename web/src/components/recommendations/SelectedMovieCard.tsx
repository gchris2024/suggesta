import MoviePoster from "@/components/shared/MoviePoster";
import type { Movie } from "@/lib/types";

export default function SelectedMovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="space-y-3">
      <MoviePoster movie={movie} posterHeightClass="h-52" />

      <h2 className="m-0 text-xl font-semibold italic tracking-tight text-stone-950">
        {movie.title}
      </h2>
    </article>
  );
}