import FeatureSection from "@/components/landing/FeatureSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-10 pt-14 md:pb-14 md:pt-16">
      <HeroSection />

      <div
        className="mb-8 h-52 w-full rounded-2xl bg-gray-300 md:mb-12 md:h-120"
        aria-hidden="true"
      />

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
