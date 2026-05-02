import type { ReactNode } from "react";

import AppNavbar, { type AppNavbarSearchProps } from "./AppNavbar";

type AppPageLayoutProps = {
  children: ReactNode;
  navbarSearch?: AppNavbarSearchProps;
};

export default function AppPageLayout({
  children,
  navbarSearch,
}: AppPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-stone-950">
      <AppNavbar search={navbarSearch} />
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-8">
        {children}
      </main>
    </div>
  );
}
