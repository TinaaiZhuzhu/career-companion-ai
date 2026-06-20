"use client";

import { useState } from "react";

type MatchAnalysisCardProps = {
  matchAnalysis: string | null;
  isLoading: boolean;
};

function ResultPlaceholder({ message }: { message: string }) {
  return (
    <p className="text-sm leading-6 text-slate-500">{message}</p>
  );
}

const actionButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:text-sm";

export function MatchAnalysisCard({
  matchAnalysis,
  isLoading,
}: MatchAnalysisCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const showMatchAnalysis = Boolean(matchAnalysis && !isLoading);

  async function handleCopy() {
    if (!matchAnalysis) return;

    setActionError(null);

    try {
      await navigator.clipboard.writeText(matchAnalysis);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setActionError("Unable to copy to clipboard. Please select and copy manually.");
    }
  }

  return (
    <section
      aria-labelledby="match-analysis-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="match-analysis-heading"
          className="text-lg font-semibold text-slate-900"
        >
          Match Analysis
        </h2>

        {showMatchAnalysis && (
          <button
            type="button"
            onClick={handleCopy}
            disabled={isLoading}
            className={actionButtonClass}
          >
            <span aria-hidden>📋</span>
            {copySuccess ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {actionError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {actionError}
        </p>
      )}

      {showMatchAnalysis ? (
        <div className="mt-6 select-text whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {matchAnalysis}
        </div>
      ) : (
        <div className="mt-4">
          <ResultPlaceholder message="Your match analysis will appear here after you click Generate." />
        </div>
      )}
    </section>
  );
}
