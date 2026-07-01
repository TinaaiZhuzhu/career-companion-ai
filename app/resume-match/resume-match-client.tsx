"use client";

import { useState } from "react";
import { DocxUpload } from "@/app/components/docx-upload";
import {
  ResumeMatchResultsTabs,
  type ResultTab,
} from "@/app/components/resume-match-results-tabs";
import { SiteHeader } from "@/app/components/site-header";

type AnalyseResponse = {
  status: string;
  match_analysis: string;
  cover_letter: string;
  optimised_resume?: string;
};

const steps = [
  { number: 1, title: "Upload Resume" },
  { number: 2, title: "Paste Job Description" },
  { number: 3, title: "Generate Results" },
  { number: 4, title: "Review Outputs" },
] as const;

function LoadingIndicator() {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3"
      role="status"
      aria-live="polite"
      aria-label="Generating results"
    >
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-brand-700">
        Analysing your resume and generating results…
      </p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
}

function StepIndicator({
  currentStep,
  hasResults,
  hasResume,
  hasJobDescription,
}: {
  currentStep: number;
  hasResults: boolean;
  hasResume: boolean;
  hasJobDescription: boolean;
}) {
  function stepStatus(step: number) {
    if (step === 1) return hasResume ? "complete" : currentStep === 1 ? "active" : "upcoming";
    if (step === 2)
      return hasJobDescription
        ? "complete"
        : currentStep === 2
          ? "active"
          : "upcoming";
    if (step === 3) return hasResults ? "complete" : currentStep === 3 ? "active" : "upcoming";
    return hasResults ? "active" : "upcoming";
  }

  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      {steps.map((step, index) => {
        const status = stepStatus(step.number);
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.number}
            className={`flex items-center gap-3 sm:flex-1 ${!isLast ? "sm:min-w-0" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  status === "complete"
                    ? "bg-brand-600 text-white"
                    : status === "active"
                      ? "border-2 border-brand-600 bg-brand-50 text-brand-600"
                      : "border border-slate-300 bg-white text-slate-400"
                }`}
              >
                {status === "complete" ? "✓" : step.number}
              </span>
              <span
                className={`truncate text-sm font-medium ${
                  status === "active" || status === "complete"
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {!isLast && (
              <div
                className="hidden h-px flex-1 bg-slate-200 sm:block"
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Step {step}
        </p>
        <h2 className="mt-1 text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ResumeMatchClient() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchAnalysis, setMatchAnalysis] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [optimisedResume, setOptimisedResume] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>("optimised_resume");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const hasResults = Boolean(
    matchAnalysis && coverLetter && optimisedResume && !isLoading,
  );
  const hasResume = Boolean(resumeText.trim());
  const hasJobDescription = Boolean(jobDescription.trim());

  const currentStep = hasResults
    ? 4
    : isLoading
      ? 3
      : hasResume && hasJobDescription
        ? 3
        : hasResume
          ? 2
          : 1;

  function handleResumeExtracted(text: string) {
    setResumeText(text);
    setValidationError(null);
  }

  function handleResumeReplace() {
    setResumeText("");
  }

  async function handleAnalyse() {
    if (!resumeText.trim()) {
      setValidationError("Please upload your resume before generating.");
      return;
    }

    if (!jobDescription.trim()) {
      setValidationError("Please enter a job description before generating.");
      return;
    }

    setValidationError(null);
    setRequestError(null);
    setMatchAnalysis(null);
    setCoverLetter(null);
    setOptimisedResume(null);
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

      if (
        data.status !== "success" ||
        !data.match_analysis ||
        !data.cover_letter ||
        !data.optimised_resume
      ) {
        setRequestError(
          "The analysis service returned an unexpected response. Please try again.",
        );
        return;
      }

      setMatchAnalysis(data.match_analysis);
      setCoverLetter(data.cover_letter);
      setOptimisedResume(data.optimised_resume);
      setActiveTab("optimised_resume");
    } catch {
      setRequestError(
        "Unable to connect to the analysis service. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const textareaClass =
    "min-h-[160px] w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-slate-900">
      <SiteHeader activePath="/resume-match" />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <p className="text-sm font-medium text-brand-600">Resume Match</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Resume Match & Cover Letter
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Upload your resume, paste the job description, and get tailored
              application materials in minutes.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
            <StepIndicator
              currentStep={currentStep}
              hasResults={hasResults}
              hasResume={hasResume}
              hasJobDescription={hasJobDescription}
            />
          </div>

          <StepSection
            step={1}
            title="Upload Resume"
            description="Upload your resume as a Word document (.docx)."
          >
            <DocxUpload
              onExtracted={handleResumeExtracted}
              onReplace={handleResumeReplace}
              disabled={isLoading}
            />
          </StepSection>

          <StepSection
            step={2}
            title="Paste Job Description"
            description="Paste the job ad or role description you are applying for."
          >
            <textarea
              id="job-description"
              name="job-description"
              className={textareaClass}
              placeholder="e.g. Role title, responsibilities, requirements, company details…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
            />
          </StepSection>

          <StepSection
            step={3}
            title="Generate Results"
            description="Run the analysis to produce your match report, cover letter, and optimised resume."
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAnalyse}
                disabled={isLoading}
                className="w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:w-auto"
              >
                {isLoading ? "Generating…" : "Generate"}
              </button>
              {validationError && (
                <p className="text-sm text-red-600" role="alert">
                  {validationError}
                </p>
              )}
            </div>
            {isLoading && (
              <div className="mt-4">
                <LoadingIndicator />
              </div>
            )}
            {requestError && (
              <div className="mt-4">
                <ErrorBanner message={requestError} />
              </div>
            )}
          </StepSection>

          {hasResults && matchAnalysis && coverLetter && optimisedResume && (
            <StepSection
              step={4}
              title="Review Outputs"
              description="Switch between tabs to review, copy, or download your results."
            >
              <ResumeMatchResultsTabs
                matchAnalysis={matchAnalysis}
                coverLetter={coverLetter}
                optimisedResume={optimisedResume}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </StepSection>
          )}
        </section>
      </main>
    </div>
  );
}
