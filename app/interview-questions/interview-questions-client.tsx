"use client";

import { useState } from "react";
import { SiteHeader } from "@/app/components/site-header";

const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior"] as const;

type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

type GenerateResponse = {
  status: string;
  experience_level: string;
  interview_questions: string;
};

function LoadingIndicator() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-200 bg-brand-50/50 px-6 py-12"
      role="status"
      aria-live="polite"
      aria-label="Generating interview questions"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-brand-700">
        Generating your interview questions…
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

function formatQuestions(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const numbered = lines.filter((line) => /^\d+[\.\)]\s/.test(line));

  if (numbered.length >= 2) {
    return (
      <ol className="list-decimal space-y-4 pl-5 text-sm leading-7 text-slate-700">
        {numbered.map((line) => (
          <li key={line} className="pl-1">
            {line.replace(/^\d+[\.\)]\s*/, "")}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
      {text}
    </div>
  );
}

export function InterviewQuestionsClient() {
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Mid");
  const [isLoading, setIsLoading] = useState(false);
  const [resultExperienceLevel, setResultExperienceLevel] = useState<
    string | null
  >(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const hasResults = Boolean(resultExperienceLevel && interviewQuestions);

  async function handleGenerate() {
    if (!jobDescription.trim()) {
      setValidationError(
        "Please enter a job description before generating questions.",
      );
      return;
    }

    setValidationError(null);
    setRequestError(null);
    setResultExperienceLevel(null);
    setInterviewQuestions(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          experience_level: experienceLevel,
        }),
      });

      const data: GenerateResponse & { error?: string } =
        await response.json();

      if (!response.ok) {
        setRequestError(
          data.error ??
            "Something went wrong while generating questions. Please try again.",
        );
        return;
      }

      if (
        data.status !== "success" ||
        !data.experience_level ||
        !data.interview_questions
      ) {
        setRequestError(
          "The question generator returned an unexpected response. Please try again.",
        );
        return;
      }

      setResultExperienceLevel(data.experience_level);
      setInterviewQuestions(data.interview_questions);
    } catch {
      setRequestError(
        "Unable to connect to the question generator. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const textareaClass =
    "min-h-[220px] w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  const selectClass =
    "mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-slate-900">
      <SiteHeader activePath="/interview-questions" />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-medium text-brand-600">
              Interview Prep
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Interview Questions Generator
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Generate interview questions based on a job description and
              experience level.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              <label
                htmlFor="job-description"
                className="block text-sm font-semibold text-slate-900"
              >
                Job Description
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Paste the job ad or role description you are preparing for.
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

            <div>
              <label
                htmlFor="experience-level"
                className="block text-sm font-semibold text-slate-900"
              >
                Experience Level
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Select the seniority level for tailored questions.
              </p>
              <select
                id="experience-level"
                name="experience-level"
                className={selectClass}
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as ExperienceLevel)
                }
                disabled={isLoading}
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {isLoading ? "Generating…" : "Generate Questions"}
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

          <section
            aria-labelledby="results-heading"
            className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2
              id="results-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Interview Questions
            </h2>

            {hasResults && !isLoading ? (
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Experience level:
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {resultExperienceLevel}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
                  {formatQuestions(interviewQuestions!)}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <ResultPlaceholder message="Your interview questions will appear here after you click Generate Questions." />
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
