import { getDb, rikishi } from "@sumo/db";
import { asc } from "drizzle-orm";
import { Header } from "@/components/layout/header";
import { RikishiList } from "./rikishi-list";

export default async function RikishiListPage() {
  const db = getDb();

  const wrestlers = await db
    .select({
      id: rikishi.id,
      name: rikishi.name,
      origin: rikishi.origin,
    })
    .from(rikishi)
    .orderBy(asc(rikishi.name));

  const data = wrestlers.map((w) => ({
    id: String(w.id),
    name: w.name,
    origin: w.origin ?? "—",
  }));

  return (
    <>
      <Header title="Rikishi" />
      <RikishiList data={data} />
    </>
  );
}
