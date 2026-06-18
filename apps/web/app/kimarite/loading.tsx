import { Loading } from "@/components/ui/loading";

export default function KimariteLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-36 animate-pulse rounded bg-surface-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        {[1, 2].map((i) => (
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
