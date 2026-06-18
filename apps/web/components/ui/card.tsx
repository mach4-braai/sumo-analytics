import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-700 bg-surface-900 p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
