import { Loading } from "@/components/ui/loading";

export default function BashoLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-28 animate-pulse rounded bg-surface-800" />
      <Loading />
    </div>
  );
}
