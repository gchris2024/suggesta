import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AUTH_STORAGE_KEYS = ["token", "userId", "username"] as const;

export type AppNavbarSearchProps = {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isBusy?: boolean;
};

type AppNavbarProps = {
  search?: AppNavbarSearchProps;
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function AppNavbar({ search }: AppNavbarProps) {
  const navigate = useNavigate();
  const [fallbackQuery, setFallbackQuery] = useState("");
  const isSearchDisabled = search?.isBusy ?? false;
  const searchValue = search?.value ?? fallbackQuery;

  function handleLogout() {
    for (const key of AUTH_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }

    navigate("/");
  }

  function handleSearchSubmit() {
    if (search) {
      search.onSubmit();
      return;
    }

    const normalizedQuery = fallbackQuery.trim();

    if (!normalizedQuery) {
      navigate("/home");
      return;
    }

    navigate(`/home?query=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <header className="border-b border-stone-200/80 bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:gap-6">
        <Link
          to="/home"
          className="text-3xl font-black uppercase tracking-tight text-black no-underline transition hover:opacity-80 sm:text-4xl lg:text-5xl"
        >
          Suggesta
        </Link>

        <form
          className="flex min-w-0 flex-1 items-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearchSubmit();
          }}
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="movie-search" className="sr-only">
              Search movies
            </label>
            <input
              id="movie-search"
              type="search"
              value={searchValue}
              onChange={(event) => {
                if (search) {
                  search.onChange(event.target.value);
                  return;
                }

                setFallbackQuery(event.target.value);
              }}
              placeholder={search?.placeholder ?? "SEARCH..."}
              disabled={isSearchDisabled}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium italic text-stone-900 outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1 sm:px-5"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchDisabled}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent bg-transparent text-black transition hover:border-stone-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Search movies"
          >
            <SearchIcon />
          </button>
        </form>

        <div className="flex items-center gap-3 lg:justify-end">
          <Link
            to="/saved"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-base font-medium text-white no-underline transition hover:opacity-90"
          >
            My Lists
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-300 bg-transparent px-5 py-3 text-base font-medium text-stone-900 transition hover:border-stone-900"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
