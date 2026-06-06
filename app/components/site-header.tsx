"use client";

import Link from "next/link";
import { useAccess } from "./access-gate";
import { LogoMark } from "./logo-mark";

type SiteHeaderProps = {
  activePath?: "/" | "/resume-match" | "/interview-questions" | "/star-builder";
};

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const { logout } = useAccess();

  const linkClass = (path: string) =>
    path === activePath
      ? "text-sm font-medium text-brand-600"
      : "text-sm font-medium text-slate-600 transition-colors hover:text-slate-900";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark />
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Career Companion AI
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How it works
          </Link>
          <Link href="/resume-match" className={linkClass("/resume-match")}>
            Resume Match
          </Link>
          <Link
            href="/interview-questions"
            className={linkClass("/interview-questions")}
          >
            Interview Questions
          </Link>
          <Link href="/star-builder" className={linkClass("/star-builder")}>
            STAR Builder
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/resume-match"
            className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:inline-flex"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
