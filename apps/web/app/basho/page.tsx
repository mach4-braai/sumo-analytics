import { getDb, basho, rikishi } from "@sumo/db";
import { desc } from "drizzle-orm";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/ui/data-table";
import { formatBashoId } from "@/lib/utils";
import Link from "next/link";

export default async function BashoListPage() {
  const db = getDb();

  const tournaments = await db
    .select({
      id: basho.id,
      city: basho.city,
      winnerId: basho.winnerId,
    })
    .from(basho)
    .orderBy(desc(basho.id));

  const winners = await db
    .select({ id: rikishi.id, name: rikishi.name })
    .from(rikishi);

  const winnerMap = new Map(winners.map((w) => [w.id, w.name]));

  const data = tournaments.map((t) => ({
    id: t.id,
    basho: formatBashoId(t.id),
    city: t.city,
    winner: t.winnerId ? winnerMap.get(t.winnerId) ?? "—" : "—",
  }));

  return (
    <>
      <Header title="Basho" />
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
        data={data}
      />
    </>
  );
}
