export type Movie = {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  overview?: string;
  genreIds?: number[];
  voteAverage?: number;
};

export type SavedList = {
  _id: string;
  name: string;
  movies: Movie[];
  createdAt: string;
};

export type MoviesResponse = {
  movies?: Movie[];
  error?: string;
};

export type RecommendationsResponse = {
  recommendations?: Movie[];
  error?: string;
};

export type SavedListsResponse = {
  lists?: SavedList[];
  error?: string;
};

export type SavedListResponse = {
  list?: SavedList;
  error?: string;
};