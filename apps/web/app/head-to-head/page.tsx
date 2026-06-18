import { getDb, rikishi } from "@sumo/db";
import { asc } from "drizzle-orm";
import { Header } from "@/components/layout/header";
import { H2HComparison } from "./comparison";

export default async function HeadToHeadPage() {
  const db = getDb();

  const wrestlers = await db
    .select({ id: rikishi.id, name: rikishi.name })
    .from(rikishi)
    .orderBy(asc(rikishi.name));

  const options = wrestlers.map((w) => ({
    value: String(w.id),
    label: w.name,
  }));

  return (
    <>
      <Header title="Head to Head" />
      <H2HComparison options={options} />
    </>
  );
}
