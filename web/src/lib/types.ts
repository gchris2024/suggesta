export type Movie = {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  overview?: string;
  genreIds?: number[];
};