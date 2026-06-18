import { eq, or, and, count, sql } from "drizzle-orm";
import { torikumi } from "../schema";
import type { Db } from "../client";

export async function getHeadToHead(
  db: Db,
  rikishiId1: number,
  rikishiId2: number,
) {
  const rows = await db
    .select({
      winnerId: torikumi.winnerId,
      count: count(),
    })
    .from(torikumi)
    .where(
      or(
        and(
          eq(torikumi.eastRikishi, rikishiId1),
          eq(torikumi.westRikishi, rikishiId2),
        ),
        and(
          eq(torikumi.eastRikishi, rikishiId2),
          eq(torikumi.westRikishi, rikishiId1),
        ),
      ),
    )
    .groupBy(torikumi.winnerId);

  const wins: Record<number, number> = {};
  let matches = 0;

  for (const row of rows) {
    const c = Number(row.count);
    if (row.winnerId !== null) {
      wins[row.winnerId] = c;
    }
    matches += c;
  }

  return { matches, wins };
}
