import { getDb, rikishi, basho, torikumi } from "@sumo/db";
import { count, desc } from "drizzle-orm";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { formatBashoId } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const db = getDb();

  const [rikishiCount] = await db
    .select({ count: count() })
    .from(rikishi);

  const [matchCount] = await db
    .select({ count: count() })
    .from(torikumi);

  const [bashoCount] = await db
    .select({ count: count() })
    .from(basho);

  const recentBasho = await db
    .select({
      id: basho.id,
      city: basho.city,
      winnerId: basho.winnerId,
    })
    .from(basho)
    .orderBy(desc(basho.id))
    .limit(6);

  const recentWinnerIds = recentBasho
    .map((b) => b.winnerId)
    .filter((id): id is number => id !== null);

  const winners =
    recentWinnerIds.length > 0
      ? await db
          .select({ id: rikishi.id, name: rikishi.name })
          .from(rikishi)
      : [];

  const winnerMap = new Map(winners.map((w) => [w.id, w.name]));

  const bashoData = recentBasho.map((b) => ({
    id: b.id,
    basho: formatBashoId(b.id),
    city: b.city,
    winner: b.winnerId ? winnerMap.get(b.winnerId) ?? "—" : "—",
  }));

  return (
    <>
      <Header title="Dashboard" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Total Rikishi" value={Number(rikishiCount.count)} />
        <StatCard label="Total Matches" value={Number(matchCount.count).toLocaleString()} />
        <StatCard label="Tournaments" value={Number(bashoCount.count)} />
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">
        Recent Tournaments
      </h2>
      <DataTable
        columns={[
          {
            key: "basho",
            header: "Tournament",
            render: (row) => (
              <Link
                href={`/basho/${row.id}`}
                className="text-accent hover:underline"
              >
                {row.basho}
              </Link>
            ),
          },
          { key: "city", header: "City" },
          { key: "winner", header: "Makuuchi Winner" },
        ]}
        data={bashoData}
      />
    </>
  );
}
