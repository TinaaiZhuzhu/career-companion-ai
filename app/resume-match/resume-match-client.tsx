"use client";

import { useState } from "react";
import { SiteHeader } from "@/app/components/site-header";

type AnalyseResponse = {
  status: string;
  match_analysis: string;
  cover_letter: string;
};

function LoadingIndicator() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-200 bg-brand-50/50 px-6 py-12"
      role="status"
      aria-live="polite"
      aria-label="Analysing resume and generating cover letter"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-brand-700">
        Analysing your resume and generating your cover letter…
      </p>
    </div>
  );
}

function ResultPlaceholder({ message }: { message: string }) {
  return (
    <p className="text-sm leading-6 text-slate-500">{message}</p>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
}

export function ResumeMatchClient() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchAnalysis, setMatchAnalysis] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const hasResults = Boolean(matchAnalysis && coverLetter);

  async function handleAnalyse() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setValidationError(
        "Please enter both your resume and the job description before analysing.",
      );
      return;
    }

    setValidationError(null);
    setRequestError(null);
    setMatchAnalysis(null);
    setCoverLetter(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      const data: AnalyseResponse & { error?: string } = await response.json();

      if (!response.ok) {
        setRequestError(
          data.error ??
            "Something went wrong while analysing your resume. Please try again.",
        );
        return;
      }

      if (data.status !== "success" || !data.match_analysis || !data.cover_letter) {
        setRequestError(
          "The analysis service returned an unexpected response. Please try again.",
        );
        return;
      }

      setMatchAnalysis(data.match_analysis);
      setCoverLetter(data.cover_letter);
    } catch {
      setRequestError(
        "Unable to connect to the analysis service. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const textareaClass =
    "min-h-[220px] w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-slate-900">
      <SiteHeader activePath="/resume-match" />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-medium text-brand-600">Resume Match</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Resume Match & Cover Letter
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Analyse your resume against a job description and generate a
              tailored cover letter.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="resume-text"
                className="block text-sm font-semibold text-slate-900"
              >
                Resume Text
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Paste the full text of your resume.
              </p>
              <textarea
                id="resume-text"
                name="resume-text"
                className={`${textareaClass} mt-3`}
                placeholder="e.g. Professional summary, work history, skills, education…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="block text-sm font-semibold text-slate-900"
              >
                Job Description
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Paste the job ad or role description you are applying for.
              </p>
              <textarea
                id="job-description"
                name="job-description"
                className={`${textareaClass} mt-3`}
                placeholder="e.g. Role title, responsibilities, requirements, company details…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={isLoading}
              className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {isLoading ? "Analysing…" : "Analyse & Generate"}
            </button>
            {validationError && (
              <p className="text-sm text-red-600" role="alert">
                {validationError}
              </p>
            )}
          </div>

          {requestError && <ErrorBanner message={requestError} />}

          {isLoading && (
            <div className="mt-10">
              <LoadingIndicator />
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <section
              aria-labelledby="match-analysis-heading"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2
                id="match-analysis-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Match Analysis
              </h2>

              {hasResults && !isLoading && matchAnalysis ? (
                <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {matchAnalysis}
                </div>
              ) : (
                <div className="mt-4">
                  <ResultPlaceholder message="Your match analysis will appear here after you run Analyse & Generate." />
                </div>
              )}
            </section>

            <section
              aria-labelledby="cover-letter-heading"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2
                id="cover-letter-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Cover Letter
              </h2>

              {hasResults && !isLoading && coverLetter ? (
                <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {coverLetter}
                </div>
              ) : (
                <div className="mt-4">
                  <ResultPlaceholder message="Your tailored cover letter will appear here after you run Analyse & Generate." />
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
