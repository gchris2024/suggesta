export default function LandingFooter() {
  return (
    <footer className="mt-2 flex flex-col items-start gap-3 py-2 md:mt-3 md:flex-row md:items-center md:gap-10">
      <div className="inline-flex items-center gap-3 text-base font-bold text-stone-900 md:text-xl">
        <span
          className="inline-flex h-6 w-6 items-center justify-center text-3xl leading-none"
          aria-hidden="true"
        >
          *
        </span>
        <span className="hidden md:inline">Suggesta</span>
        <span className="md:hidden">Suggesta</span>
      </div>
      <nav
        aria-label="Footer links"
        className="flex flex-col gap-3 md:flex-row md:gap-10"
      >
        <a
          href="#"
          className="text-sm font-medium text-neutral-500 no-underline md:text-lg"
        >
          Features
        </a>
        <a
          href="https://github.com/gchris2024/suggesta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-500 no-underline md:text-lg"
        >
          Learn more
        </a>
        <a
          href="https://github.com/gchris2024"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-500 no-underline md:text-lg"
        >
          Support
        </a>
      </nav>
    </footer>
  );
}
