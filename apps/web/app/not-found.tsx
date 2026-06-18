import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h2 className="mb-2 text-xl font-bold text-white">Not Found</h2>
      <p className="mb-6 text-sm text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
