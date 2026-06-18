import { getDb, getKimariteStats } from "@sumo/db";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { KimariteChart } from "@/components/charts/kimarite-chart";

export default async function KimaritePage() {
  const db = getDb();
  const rawStats = await getKimariteStats(db);
  const stats = rawStats.map((s) => ({
    kimarite: s.kimarite,
    count: Number(s.count),
  }));

  const totalTechniques = stats.length;
  const topTechnique = stats[0];

  return (
    <>
      <Header title="Kimarite" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        <StatCard label="Unique Techniques" value={totalTechniques} />
        <StatCard
          label="Most Common"
          value={topTechnique ? `${topTechnique.kimarite} (${topTechnique.count})` : "—"}
        />
      </div>

      <KimariteChart
        data={stats.slice(0, 20)}
        title="Top 20 Winning Techniques"
      />
    </>
  );
}
