import { rikishi } from "@sumo/db";
import { type Db } from "@sumo/db";
import { fetchAllPages } from "../api-client.js";
import { mapRikishi } from "../mappers/rikishi.js";
import type { ApiRikishi } from "../types.js";
import { BATCH_SIZE } from "../constants.js";

export async function syncRikishi(db: Db) {
  console.log("[sync-rikishi] fetching all rikishi...");
  const records = await fetchAllPages<ApiRikishi>("/rikishis");
  console.log(`[sync-rikishi] fetched ${records.length} rikishi`);

  const rows = records.map(mapRikishi);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await db
      .insert(rikishi)
      .values(batch)
      .onConflictDoUpdate({
        target: rikishi.id,
        set: {
          name: rikishi.name,
          birthday: rikishi.birthday,
          origin: rikishi.origin,
        },
      });
  }

  console.log(`[sync-rikishi] upserted ${rows.length} rikishi`);
}
