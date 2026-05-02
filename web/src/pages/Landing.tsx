import FeatureSection from "@/components/landing/FeatureSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-10 pt-14 md:pb-14 md:pt-16">
      <HeroSection />

      <div className="mb-8 h-52 w-full rounded-2xl bg-gray-300 md:mb-12 md:h-120" aria-hidden="true" />

      <FeatureSection
        title="Compelling Headline"
        description="Description"
        buttonLabel="Call to action"
        buttonTo="/register"
        desktopLayout="text-left"
      />

      <FeatureSection
        title="Another Compelling Headline"
        description="Description"
        buttonLabel="Another call to action"
        buttonTo="/login"
        desktopLayout="text-right"
      />

      <LandingFooter />
    </main>
  );
}
