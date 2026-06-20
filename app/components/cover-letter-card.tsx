"use client";

import { useState } from "react";
import { downloadCoverLetterDocx } from "@/app/lib/download-cover-letter-docx";

type CoverLetterCardProps = {
  coverLetter: string | null;
  isLoading: boolean;
};

function ResultPlaceholder({ message }: { message: string }) {
  return (
    <p className="text-sm leading-6 text-slate-500">{message}</p>
  );
}

const actionButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:text-sm";

export function CoverLetterCard({
  coverLetter,
  isLoading,
}: CoverLetterCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const showCoverLetter = Boolean(coverLetter && !isLoading);
  const actionsDisabled = isLoading || isDownloading;

  async function handleCopy() {
    if (!coverLetter) return;

    setActionError(null);

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setActionError("Unable to copy to clipboard. Please select and copy manually.");
    }
  }

  async function handleDownload() {
    if (!coverLetter) return;

    setActionError(null);
    setIsDownloading(true);

    try {
      await downloadCoverLetterDocx(coverLetter);
    } catch {
      setActionError("Unable to download the cover letter. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section
      aria-labelledby="cover-letter-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="cover-letter-heading"
          className="text-lg font-semibold text-slate-900"
        >
          Cover Letter
        </h2>

        {showCoverLetter && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={actionsDisabled}
              className={actionButtonClass}
            >
              <span aria-hidden>📋</span>
              {copySuccess ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={actionsDisabled}
              className={actionButtonClass}
            >
              <span aria-hidden>⬇</span>
              {isDownloading ? "Downloading…" : "Download DOCX"}
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {actionError}
        </p>
      )}

      {showCoverLetter ? (
        <div className="mt-6 select-text whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {coverLetter}
        </div>
      ) : (
        <div className="mt-4">
          <ResultPlaceholder message="Your tailored cover letter will appear here after you click Generate." />
        </div>
      )}
    </section>
  );
}
