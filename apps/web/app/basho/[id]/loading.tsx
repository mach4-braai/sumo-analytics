import { Loading } from "@/components/ui/loading";

export default function BashoDetailLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-surface-700 bg-surface-900"
          />
        ))}
      </div>
      <Loading />
    </div>
  );
}
