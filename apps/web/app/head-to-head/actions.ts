"use server";

import { getDb, getHeadToHead, rikishi } from "@sumo/db";
import { inArray } from "drizzle-orm";
import { z } from "zod";

const rikishiId = z.number().int().positive();

export async function fetchH2H(id1: number, id2: number) {
  const parsed1 = rikishiId.safeParse(id1);
  const parsed2 = rikishiId.safeParse(id2);

  if (!parsed1.success || !parsed2.success) {
    throw new Error("Invalid rikishi IDs: both must be positive integers");
  }

  const db = getDb();
  const result = await getHeadToHead(db, parsed1.data, parsed2.data);

  const wrestlers = await db
    .select({ id: rikishi.id, name: rikishi.name })
    .from(rikishi)
    .where(inArray(rikishi.id, [parsed1.data, parsed2.data]));

  const nameMap = new Map(wrestlers.map((w) => [w.id, w.name]));

  return {
    matches: result.matches,
    data: [
      { name: nameMap.get(parsed1.data) ?? String(parsed1.data), wins: result.wins[parsed1.data] ?? 0 },
      { name: nameMap.get(parsed2.data) ?? String(parsed2.data), wins: result.wins[parsed2.data] ?? 0 },
    ],
  };
}
