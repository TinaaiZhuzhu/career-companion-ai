"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "./logo-mark";

const ACCESS_STORAGE_KEY = "access_granted";
const ACCESS_CODE = "Jobapplication2026";

type AccessContextValue = {
  logout: () => void;
};

const AccessContext = createContext<AccessContextValue | null>(null);

export function useAccess() {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess must be used within AccessGate");
  }
  return context;
}

function AccessCodePage({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (code === ACCESS_CODE) {
      localStorage.setItem(ACCESS_STORAGE_KEY, "true");
      onSuccess();
      return;
    }

    setError("Invalid access code");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 font-sans text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.18),transparent)]"
        aria-hidden
      />

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMark />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Career Companion AI
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="access-code"
            className="block text-sm font-semibold text-slate-900"
          >
            Access Code
          </label>
          <input
            id="access-code"
            name="access-code"
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />

          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export function AccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    setIsGranted(localStorage.getItem(ACCESS_STORAGE_KEY) === "true");
  }, []);

  const grantAccess = useCallback(() => {
    setIsGranted(true);
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    setIsGranted(false);
    router.push("/");
  }, [router]);

  if (isGranted === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isGranted) {
    return <AccessCodePage onSuccess={grantAccess} />;
  }

  return (
    <AccessContext.Provider value={{ logout }}>{children}</AccessContext.Provider>
  );
}
