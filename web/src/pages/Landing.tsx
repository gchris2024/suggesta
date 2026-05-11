import FeatureSection from "@/components/landing/FeatureSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import PopularMoviesCarousel from "@/components/home/PopularMoviesCarousel";
import { requestPopularMovies } from "@/lib/movieApi";
import type { Movie } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Landing() {
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadPopularMovies() {
      setIsLoadingPopular(true);

      try {
        const movies = await requestPopularMovies();

        if (!isCancelled) {
          setPopularMovies(movies);
        }
      } catch {
        if (!isCancelled) {
          setPopularMovies([]);
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-10 pt-14 md:pb-14 md:pt-16">
      <HeroSection />

      <div className="mb-8 md:mb-12">
        <PopularMoviesCarousel
          movies={popularMovies}
          isLoading={isLoadingPopular}
        />
      </div>

      <FeatureSection
        title="Get Smarter Movie Recommendations in Seconds"
        description="Search for movies you already love, then let Suggesta help you discover what to watch next. Build a personal taste profile and surface picks that actually match your vibe, from crowd-pleasers to hidden gems."
        buttonLabel="Create your free account"
        buttonTo="/register"
        desktopLayout="text-left"
      />

      <FeatureSection
        title="Save Picks, Compare Ideas, and Plan Your Next Watch"
        description="Keep track of interesting titles in one place so you do not lose great recommendations between sessions. Sign in to revisit your saved movies, refine your list, and come back whenever you need a reliable watchlist."
        buttonLabel="Sign in to your list"
        buttonTo="/login"
        desktopLayout="text-right"
      />

      <LandingFooter />
    </main>
  );
}
