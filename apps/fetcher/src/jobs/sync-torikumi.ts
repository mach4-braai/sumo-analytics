import { basho, torikumi, rikishi } from "@sumo/db";
import { type Db } from "@sumo/db";
import { apiFetch } from "../api-client.js";
import { mapTorikumi } from "../mappers/torikumi.js";
import type { ApiTorikumi } from "../types.js";
import { BATCH_SIZE, TOURNAMENT_DAYS, DIVISIONS } from "../constants.js";

const DAYS = Array.from({ length: TOURNAMENT_DAYS }, (_, i) => i + 1);

async function ensureRikishiBatch(
  db: Db,
  matches: ApiTorikumi[],
) {
  const seen = new Map<number, string>();
  for (const match of matches) {
    if (!seen.has(match.eastId)) {
      seen.set(match.eastId, match.eastShikona || `Rikishi ${match.eastId}`);
    }
    if (!seen.has(match.westId)) {
      seen.set(match.westId, match.westShikona || `Rikishi ${match.westId}`);
    }
  }

  const values = Array.from(seen.entries()).map(([id, name]) => ({ id, name }));

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const batch = values.slice(i, i + BATCH_SIZE);
    await db.insert(rikishi).values(batch).onConflictDoNothing();
  }
}

export async function syncTorikumi(db: Db, bashoId?: string) {
  const bashoIds = bashoId
    ? [bashoId]
    : (await db.select({ id: basho.id }).from(basho)).map((b) => b.id);

  console.log(
    `[sync-torikumi] syncing torikumi for ${bashoIds.length} basho`,
  );

  for (const bId of bashoIds) {
    for (const division of DIVISIONS) {
      for (const day of DAYS) {
        try {
          const response = await apiFetch<{ torikumi: ApiTorikumi[] } | ApiTorikumi[]>(
            `/basho/${bId}/torikumi/${division}/${day}`,
          );

          const data = Array.isArray(response) ? response : response.torikumi;
          if (!data || data.length === 0) continue;

          // Batch ensure all referenced rikishi exist
          await ensureRikishiBatch(db, data);

          // Batch upsert torikumi rows
          const rows = data.map(mapTorikumi);

          for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            await db
              .insert(torikumi)
              .values(batch)
              .onConflictDoUpdate({
                target: torikumi.id,
                set: {
                  kimarite: torikumi.kimarite,
                  winnerId: torikumi.winnerId,
                },
              });
          }
        } catch (err) {
          // Day may not exist yet for ongoing tournaments
          console.warn(
            `[sync-torikumi] skipping ${bId}/${division}/day${day}: ${err}`,
          );
        }
      }
    }
    console.log(`[sync-torikumi] completed basho ${bId}`);
  }
}

export async function syncTorikumiForBasho(db: Db, bashoId: string) {
  return syncTorikumi(db, bashoId);
}
