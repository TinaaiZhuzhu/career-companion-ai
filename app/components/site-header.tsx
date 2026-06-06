import Link from "next/link";
import { LogoMark } from "./logo-mark";

type SiteHeaderProps = {
  activePath?: "/" | "/resume-match" | "/interview-questions" | "/star-builder";
};

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const linkClass = (path: string) =>
    path === activePath
      ? "text-sm font-medium text-brand-600"
      : "text-sm font-medium text-slate-600 transition-colors hover:text-slate-900";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Career Companion AI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
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

        <Link
          href="/resume-match"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Get started
        </Link>
      </nav>
    </header>
  );
}
