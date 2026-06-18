"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h2 className="mb-2 text-xl font-bold text-white">
        Something went wrong
      </h2>
      <p className="mb-6 text-sm text-slate-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
