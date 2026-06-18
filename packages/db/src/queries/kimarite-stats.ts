import { count, desc, isNotNull } from "drizzle-orm";
import { torikumi } from "../schema";
import type { Db } from "../client";

export async function getKimariteStats(db: Db) {
  return db
    .select({
      kimarite: torikumi.kimarite,
      count: count(),
    })
    .from(torikumi)
    .where(isNotNull(torikumi.kimarite))
    .groupBy(torikumi.kimarite)
    .orderBy(desc(count()));
}
