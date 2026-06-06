"use client";

import { useState } from "react";
import { SiteHeader } from "@/app/components/site-header";

const ANSWER_LENGTHS = ["Short", "Medium", "Detailed"] as const;
const OUTPUT_STYLES = ["Spoken", "Professional", "Executive"] as const;

type AnswerLength = (typeof ANSWER_LENGTHS)[number];
type OutputStyle = (typeof OUTPUT_STYLES)[number];

type GenerateResponse = {
  status: string;
  star_answer: string;
};

function LoadingIndicator() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-200 bg-brand-50/50 px-6 py-12"
      role="status"
      aria-live="polite"
      aria-label="Generating STAR answer"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-brand-700">
        Building your STAR answer…
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

export function StarBuilderClient() {
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [userExample, setUserExample] = useState("");
  const [answerLength, setAnswerLength] = useState<AnswerLength>("Medium");
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("Professional");
  const [isLoading, setIsLoading] = useState(false);
  const [starAnswer, setStarAnswer] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const hasResults = Boolean(starAnswer);

  async function handleGenerate() {
    if (!interviewQuestion.trim() || !userExample.trim()) {
      setValidationError(
        "Please enter both an interview question and your example notes before generating.",
      );
      return;
    }

    setValidationError(null);
    setRequestError(null);
    setCopySuccess(false);
    setStarAnswer(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/star-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview_question: interviewQuestion,
          user_example: userExample,
          answer_length: answerLength,
          output_style: outputStyle,
        }),
      });

      const data: GenerateResponse & { error?: string } = await response.json();

      if (!response.ok) {
        setRequestError(
          data.error ??
            "Something went wrong while generating your STAR answer. Please try again.",
        );
        return;
      }

      if (data.status !== "success" || !data.star_answer) {
        setRequestError(
          "The STAR answer builder returned an unexpected response. Please try again.",
        );
        return;
      }

      setStarAnswer(data.star_answer);
    } catch {
      setRequestError(
        "Unable to connect to the STAR answer builder. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!starAnswer) return;

    try {
      await navigator.clipboard.writeText(starAnswer);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setRequestError("Unable to copy to clipboard. Please select and copy manually.");
    }
  }

  const textareaClass =
    "min-h-[180px] w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  const selectClass =
    "mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-slate-900">
      <SiteHeader activePath="/star-builder" />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-medium text-brand-600">Interview Prep</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              STAR Answer Builder
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Transform rough interview examples into polished STAR answers
              tailored to your preferred style.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="interview-question"
                className="block text-sm font-semibold text-slate-900"
              >
                Interview Question
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Paste the question you need to prepare for.
              </p>
              <textarea
                id="interview-question"
                name="interview-question"
                className={`${textareaClass} mt-3`}
                placeholder="Paste the interview question here..."
                value={interviewQuestion}
                onChange={(e) => setInterviewQuestion(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="user-example"
                className="block text-sm font-semibold text-slate-900"
              >
                Your Example / Notes
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Share your experience — rough notes are fine.
              </p>
              <textarea
                id="user-example"
                name="user-example"
                className={`${textareaClass} mt-3`}
                placeholder="Describe what happened, even if it is rough notes..."
                value={userExample}
                onChange={(e) => setUserExample(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="answer-length"
                className="block text-sm font-semibold text-slate-900"
              >
                Answer Length
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Choose how detailed the response should be.
              </p>
              <select
                id="answer-length"
                name="answer-length"
                className={selectClass}
                value={answerLength}
                onChange={(e) =>
                  setAnswerLength(e.target.value as AnswerLength)
                }
                disabled={isLoading}
              >
                {ANSWER_LENGTHS.map((length) => (
                  <option key={length} value={length}>
                    {length}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="output-style"
                className="block text-sm font-semibold text-slate-900"
              >
                Output Style
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Pick the tone that fits your interview.
              </p>
              <select
                id="output-style"
                name="output-style"
                className={selectClass}
                value={outputStyle}
                onChange={(e) =>
                  setOutputStyle(e.target.value as OutputStyle)
                }
                disabled={isLoading}
              >
                {OUTPUT_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
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
              {isLoading ? "Generating…" : "Generate STAR Answer"}
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
            aria-labelledby="star-answer-heading"
            className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2
                id="star-answer-heading"
                className="text-lg font-semibold text-slate-900"
              >
                STAR Answer
              </h2>
              {hasResults && !isLoading && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {copySuccess ? "Copied!" : "Copy Answer"}
                </button>
              )}
            </div>

            {hasResults && !isLoading ? (
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Answer length:
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {answerLength}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    Output style:
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {outputStyle}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
                  <div className="select-text whitespace-pre-wrap text-sm leading-8 text-slate-700">
                    {starAnswer}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <ResultPlaceholder message="Your STAR answer will appear here after you click Generate STAR Answer." />
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
