import { basho, rikishiBasho, rikishi } from "@sumo/db";
import { type Db } from "@sumo/db";
import { apiFetch } from "../api-client.js";
import { mapBanzuke } from "../mappers/banzuke.js";

interface ApiBanzukeEntry {
  rikishiID: number;
  shikonaEn: string;
  rank: string;
}

interface ApiBanzuke {
  bashoId: string;
  division: string;
  east: ApiBanzukeEntry[];
  west: ApiBanzukeEntry[];
}

const DIVISIONS = ["Makuuchi", "Juryo"];

export async function syncBanzuke(db: Db, bashoId?: string) {
  const bashoIds = bashoId
    ? [bashoId]
    : (await db.select({ id: basho.id }).from(basho)).map((b) => b.id);

  console.log(
    `[sync-banzuke] syncing banzuke for ${bashoIds.length} basho`,
  );

  for (const bId of bashoIds) {
    for (const division of DIVISIONS) {
      try {
        const data = await apiFetch<ApiBanzuke>(
          `/basho/${bId}/banzuke/${division}`,
        );

        // Ensure all referenced rikishi exist
        for (const entry of [...data.east, ...data.west]) {
          await db
            .insert(rikishi)
            .values({ id: entry.rikishiID, name: entry.shikonaEn || `Rikishi ${entry.rikishiID}` })
            .onConflictDoNothing();
        }

        const rows = mapBanzuke(data);

        for (const row of rows) {
          await db
            .insert(rikishiBasho)
            .values(row)
            .onConflictDoUpdate({
              target: [rikishiBasho.rikishiId, rikishiBasho.bashoId],
              set: {
                rank: row.rank,
                division: row.division,
                weight: row.weight,
              },
            });
        }

        console.log(
          `[sync-banzuke] upserted ${rows.length} entries for ${bId}/${division}`,
        );
      } catch (err) {
        console.warn(
          `[sync-banzuke] skipping ${bId}/${division}: ${err}`,
        );
      }
    }
  }
}
