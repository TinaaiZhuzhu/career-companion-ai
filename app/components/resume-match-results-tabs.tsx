"use client";

import { useState } from "react";
import {
  downloadCoverLetterDocx,
  downloadOptimisedResumeDocx,
} from "@/app/lib/download-cover-letter-docx";

type ResultTab = "optimised_resume" | "cover_letter" | "match_analysis";

type ResumeMatchResultsTabsProps = {
  matchAnalysis: string;
  coverLetter: string;
  optimisedResume: string;
  activeTab: ResultTab;
  onTabChange: (tab: ResultTab) => void;
};

const actionButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:text-sm";

const tabs: { id: ResultTab; label: string }[] = [
  { id: "optimised_resume", label: "Optimised Resume" },
  { id: "cover_letter", label: "Cover Letter" },
  { id: "match_analysis", label: "Match Analysis" },
];

export function ResumeMatchResultsTabs({
  matchAnalysis,
  coverLetter,
  optimisedResume,
  activeTab,
  onTabChange,
}: ResumeMatchResultsTabsProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const activeContent =
    activeTab === "match_analysis"
      ? matchAnalysis
      : activeTab === "cover_letter"
        ? coverLetter
        : optimisedResume;

  const showDownload =
    activeTab === "cover_letter" || activeTab === "optimised_resume";

  async function handleCopy() {
    setActionError(null);

    try {
      await navigator.clipboard.writeText(activeContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setActionError(
        "Unable to copy to clipboard. Please select and copy manually.",
      );
    }
  }

  async function handleDownload() {
    setActionError(null);
    setIsDownloading(true);

    try {
      if (activeTab === "cover_letter") {
        await downloadCoverLetterDocx(coverLetter);
      } else if (activeTab === "optimised_resume") {
        await downloadOptimisedResumeDocx(optimisedResume);
      }
    } catch {
      setActionError("Unable to download the file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  function handleTabChange(tab: ResultTab) {
    setActionError(null);
    setCopySuccess(false);
    onTabChange(tab);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="-mb-px flex gap-1 overflow-x-auto"
            role="tablist"
            aria-label="Resume match results"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 rounded-t-lg px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                  activeTab === tab.id
                    ? "border-b-2 border-brand-600 text-brand-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 pb-4 sm:pb-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={isDownloading}
              className={actionButtonClass}
            >
              <span aria-hidden>📋</span>
              {copySuccess ? "Copied!" : "Copy"}
            </button>
            {showDownload && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className={actionButtonClass}
              >
                <span aria-hidden>⬇</span>
                {isDownloading ? "Downloading…" : "Download DOCX"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6" role="tabpanel">
        {actionError && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {actionError}
          </p>
        )}
        <div className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6">
          <div className="select-text whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {activeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ResultTab };
