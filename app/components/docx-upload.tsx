"use client";

import { useRef, useState } from "react";
import mammoth from "mammoth";

type DocxUploadProps = {
  onExtracted: (text: string, fileName: string) => void;
  onReplace?: () => void;
  disabled?: boolean;
};

function isDocxFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "docx") {
    return false;
  }

  if (!file.type) {
    return true;
  }

  const validMimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
  ];

  return validMimeTypes.includes(file.type);
}

export function DocxUpload({
  onExtracted,
  onReplace,
  disabled = false,
}: DocxUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  async function processFile(file: File) {
    setUploadError(null);

    if (!isDocxFile(file)) {
      setUploadError("Please upload a .docx file only.");
      return;
    }

    setIsParsing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const extractedText = result.value.trim();

      if (!extractedText) {
        setUploadError("No readable text found in this document.");
        return;
      }

      setUploadedFileName(file.name);
      onExtracted(extractedText, file.name);
    } catch {
      setUploadError("Unable to read this DOCX file. Please try another file.");
    } finally {
      setIsParsing(false);
    }
  }

  function handleReplace() {
    setUploadedFileName(null);
    setUploadError(null);
    onReplace?.();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void processFile(file);
    }
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled && !isParsing) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isParsing) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  }

  function openFilePicker() {
    if (!disabled && !isParsing) {
      inputRef.current?.click();
    }
  }

  const dropzoneClass = [
    "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
    disabled || isParsing
      ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
      : "cursor-pointer",
    isDragging
      ? "border-brand-600 bg-brand-50"
      : "border-slate-300 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/50",
  ].join(" ");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isParsing}
        aria-hidden
      />

      {uploadedFileName && !isParsing ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-800">
                Upload successful
              </p>
              <p className="mt-1 truncate text-sm text-emerald-700">
                {uploadedFileName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReplace}
            disabled={disabled}
            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Replace Resume
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled || isParsing ? -1 : 0}
          onClick={openFilePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={dropzoneClass}
          aria-label="Upload DOCX resume"
        >
          {isParsing ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
              <p className="mt-3 text-sm font-medium text-brand-700">
                Extracting text from your resume…
              </p>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0V6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v3.75M3.75 19.5h16.5A2.25 2.25 0 0 0 22.5 17.25v-6.375a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 8.625v8.625A2.25 2.25 0 0 0 5.25 19.5Z"
                  />
                </svg>
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                Upload Resume (.docx)
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Drag and drop your file here, or click to browse
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      )}
    </div>
  );
}
