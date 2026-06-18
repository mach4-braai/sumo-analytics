import { eq, asc } from "drizzle-orm";
import { rikishiBasho } from "../schema";
import type { Db } from "../client";

export async function getRankOverTime(db: Db, rikishiId: number) {
  return db
    .select({
      bashoId: rikishiBasho.bashoId,
      rank: rikishiBasho.rank,
      division: rikishiBasho.division,
    })
    .from(rikishiBasho)
    .where(eq(rikishiBasho.rikishiId, rikishiId))
    .orderBy(asc(rikishiBasho.bashoId));
}
