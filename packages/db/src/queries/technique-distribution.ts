import { eq, count, desc, isNotNull, and } from "drizzle-orm";
import { torikumi } from "../schema";
import type { Db } from "../client";

export async function getTechniqueDistribution(db: Db, rikishiId: number) {
  return db
    .select({
      kimarite: torikumi.kimarite,
      count: count(),
    })
    .from(torikumi)
    .where(
      and(
        eq(torikumi.winnerId, rikishiId),
        isNotNull(torikumi.kimarite),
      ),
    )
    .groupBy(torikumi.kimarite)
    .orderBy(desc(count()));
}
