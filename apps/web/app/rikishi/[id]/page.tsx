import { getDb, rikishi, getRankOverTime, getWinLossByBasho, getTechniqueDistribution } from "@sumo/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { RankChart } from "@/components/charts/rank-chart";
import { WinLossChart } from "@/components/charts/win-loss-chart";
import { KimariteChart } from "@/components/charts/kimarite-chart";

export default async function RikishiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rikishiId = parseInt(id);
  if (isNaN(rikishiId)) notFound();

  const db = getDb();

  const [wrestler] = await db
    .select()
    .from(rikishi)
    .where(eq(rikishi.id, rikishiId));

  if (!wrestler) notFound();

  const [rankData, winLossData, techniqueData] = await Promise.all([
    getRankOverTime(db, rikishiId),
    getWinLossByBasho(db, rikishiId),
    getTechniqueDistribution(db, rikishiId),
  ]);

  const parsed = winLossData.map((d) => ({
    bashoId: d.bashoId,
    wins: Number(d.wins),
    losses: Number(d.losses),
  }));
  const totalWins = parsed.reduce((sum, d) => sum + d.wins, 0);
  const totalLosses = parsed.reduce((sum, d) => sum + d.losses, 0);

  return (
    <>
      <Header title={wrestler.name} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Origin" value={wrestler.origin ?? "—"} />
        <StatCard label="Career Wins" value={totalWins} />
        <StatCard label="Career Losses" value={totalLosses} />
      </div>

      <div className="space-y-6">
        <RankChart data={rankData} />
        <WinLossChart data={parsed} />
        <KimariteChart
          data={techniqueData.slice(0, 15).map((t) => ({
            kimarite: t.kimarite,
            count: Number(t.count),
          }))}
          title="Top Winning Techniques"
        />
      </div>
    </>
  );
}
