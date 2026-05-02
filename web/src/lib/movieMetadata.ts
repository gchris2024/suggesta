const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TMDB_GENRE_LABELS: Record<number, string> = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Sci-Fi",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

export function getMoviePosterUrl(posterPath: string) {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : "";
}

export function getReleaseYear(releaseDate: string) {
  return releaseDate ? releaseDate.split("-")[0] : "TBA";
}

export function getGenreLabels(genreIds?: number[]) {
  if (!genreIds || genreIds.length === 0) {
    return ["Uncategorized"];
  }

  return genreIds
    .map((genreId) => TMDB_GENRE_LABELS[genreId])
    .filter((genreLabel): genreLabel is string => Boolean(genreLabel))
    .slice(0, 3);
}