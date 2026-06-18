import { getDb, basho, rikishi, rikishiBasho, torikumi } from "@sumo/db";
import { eq, and, count } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { formatBashoId, formatRank } from "@/lib/utils";
import Link from "next/link";

export default async function BashoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d{4}(0[1-9]|1[0-2])$/.test(id)) notFound();

  const db = getDb();

  const [tournament] = await db
    .select()
    .from(basho)
    .where(eq(basho.id, id));

  if (!tournament) notFound();

  const [matchCount] = await db
    .select({ count: count() })
    .from(torikumi)
    .where(eq(torikumi.bashoId, id));

  const banzukeData = await db
    .select({
      rikishiId: rikishiBasho.rikishiId,
      rank: rikishiBasho.rank,
      division: rikishiBasho.division,
    })
    .from(rikishiBasho)
    .where(eq(rikishiBasho.bashoId, id));

  const rikishiIds = banzukeData.map((b) => b.rikishiId);
  const wrestlers =
    rikishiIds.length > 0
      ? await db
          .select({ id: rikishi.id, name: rikishi.name })
          .from(rikishi)
      : [];

  const nameMap = new Map(wrestlers.map((w) => [w.id, w.name]));
  const winnerName = tournament.winnerId
    ? nameMap.get(tournament.winnerId) ?? "—"
    : "—";

  const makuuchiBanzuke = banzukeData
    .filter((b) => b.division === "Makuuchi")
    .sort((a, b) => (a.rank ?? "").localeCompare(b.rank ?? ""))
    .map((b) => ({
      id: String(b.rikishiId),
      name: nameMap.get(b.rikishiId) ?? "Unknown",
      rank: formatRank(b.rank),
    }));

  return (
    <>
      <Header title={formatBashoId(id)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="City" value={tournament.city} />
        <StatCard label="Makuuchi Winner" value={winnerName} />
        <StatCard label="Matches Recorded" value={Number(matchCount.count)} />
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-slate-400">
          Makuuchi Banzuke
        </h3>
        <DataTable
          columns={[
            { key: "rank", header: "Rank" },
            {
              key: "name",
              header: "Rikishi",
              render: (row) => (
                <Link
                  href={`/rikishi/${row.id}`}
                  className="text-accent hover:underline"
                >
                  {row.name}
                </Link>
              ),
            },
          ]}
          data={makuuchiBanzuke}
        />
      </Card>
    </>
  );
}
