import { Loading } from "@/components/ui/loading";

export default function RikishiLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-surface-800" />
      <Loading />
    </div>
  );
}
