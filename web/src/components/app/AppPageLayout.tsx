import type { ReactNode } from "react";

import AppNavbar from "./AppNavbar";

type AppPageLayoutProps = {
  children: ReactNode;
};

export default function AppPageLayout({ children }: AppPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-stone-950">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-8">{children}</main>
    </div>
  );
}