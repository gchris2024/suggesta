import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <header className="mb-8 text-left md:mb-12 md:text-center">
      <h1 className="m-0 text-4xl font-bold leading-none md:text-6xl">Suggesta</h1>
      <p className="mb-5 mt-3 text-lg text-neutral-500 md:mb-7 md:mt-4 md:text-2xl">Find your next movie in minutes.</p>
      <div className="flex flex-col gap-3 md:flex-row md:justify-center">
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:opacity-95 md:text-base"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-stone-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:-translate-y-px hover:opacity-95 md:text-base"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
