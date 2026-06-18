import { basho, rikishi } from "@sumo/db";
import { type Db } from "@sumo/db";
import { eq } from "drizzle-orm";
import { apiFetch } from "../api-client.js";
import { mapBasho } from "../mappers/basho.js";

interface ApiBasho {
  date: string;
  yusho?: { type: string; rikishiId: number }[];
}

function generateBashoIds(startYear: number): string[] {
  const months = ["01", "03", "05", "07", "09", "11"];
  const ids: string[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  for (let year = startYear; year <= currentYear; year++) {
    for (const month of months) {
      const monthNum = parseInt(month);
      if (year === currentYear && monthNum > currentMonth) break;
      ids.push(`${year}${month}`);
    }
  }

  return ids;
}

export async function syncBasho(db: Db, startYear = 2020) {
  const bashoIds = generateBashoIds(startYear);
  console.log(`[sync-basho] syncing ${bashoIds.length} basho from ${startYear}`);

  for (const id of bashoIds) {
    try {
      const data = await apiFetch<ApiBasho>(`/basho/${id}`);
      const row = mapBasho(data);

      // Check if winner exists in rikishi table
      if (row.winnerId) {
        const [exists] = await db
          .select({ id: rikishi.id })
          .from(rikishi)
          .where(eq(rikishi.id, row.winnerId))
          .limit(1);
        if (!exists) {
          row.winnerId = null;
        }
      }

      await db
        .insert(basho)
        .values(row)
        .onConflictDoUpdate({
          target: basho.id,
          set: {
            city: basho.city,
            winnerId: row.winnerId,
          },
        });

      console.log(`[sync-basho] upserted basho ${id}`);
    } catch (err) {
      console.warn(`[sync-basho] skipping basho ${id}: ${err}`);
    }
  }
}
