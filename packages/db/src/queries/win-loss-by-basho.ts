import { eq, or, sql } from "drizzle-orm";
import { torikumi } from "../schema";
import type { Db } from "../client";

export async function getWinLossByBasho(db: Db, rikishiId: number) {
  return db
    .select({
      bashoId: torikumi.bashoId,
      wins: sql<number>`count(case when ${torikumi.winnerId} = ${rikishiId} then 1 end)`,
      losses: sql<number>`count(case when ${torikumi.winnerId} != ${rikishiId} then 1 end)`,
    })
    .from(torikumi)
    .where(
      or(
        eq(torikumi.eastRikishi, rikishiId),
        eq(torikumi.westRikishi, rikishiId),
      ),
    )
    .groupBy(torikumi.bashoId)
    .orderBy(torikumi.bashoId);
}
