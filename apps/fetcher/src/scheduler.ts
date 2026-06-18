import cron, { type ScheduledTask } from "node-cron";
import { type Db } from "@sumo/db";
import { apiFetch } from "./api-client.js";
import { syncRikishi } from "./jobs/sync-rikishi.js";
import { syncBasho } from "./jobs/sync-basho.js";
import { syncTorikumiForBasho } from "./jobs/sync-torikumi.js";
import { syncBanzuke } from "./jobs/sync-banzuke.js";
import type { ApiBashoMeta } from "./types.js";

const BASHO_MONTHS = [1, 3, 5, 7, 9, 11];

function currentBashoId(): string | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  if (!BASHO_MONTHS.includes(month)) return null;
  const year = now.getFullYear();
  return `${year}${String(month).padStart(2, "0")}`;
}

async function isTournamentLive(): Promise<boolean> {
  const bashoId = currentBashoId();
  if (!bashoId) return false;

  try {
    const data = await apiFetch<ApiBashoMeta>(`/basho/${bashoId}`);
    const now = new Date();
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return now >= start && now <= end;
  } catch {
    return false;
  }
}

let hourlyTask: ScheduledTask | null = null;

async function syncDaily(db: Db) {
  console.log("[scheduler] running daily sync...");
  await syncRikishi(db);
  await syncBasho(db);
  await syncBanzuke(db);
  console.log("[scheduler] daily sync complete");
}

async function syncHourly(db: Db) {
  const bashoId = currentBashoId();
  if (!bashoId) return;
  console.log(`[scheduler] running hourly sync for basho ${bashoId}...`);
  await syncTorikumiForBasho(db, bashoId);
  console.log("[scheduler] hourly sync complete");
}

export function startScheduler(db: Db) {
  console.log("[scheduler] starting daily cron (06:00)");

  // Daily sync at 06:00
  cron.schedule("0 6 * * *", async () => {
    await syncDaily(db);

    // Check if we need hourly updates
    const live = await isTournamentLive();
    if (live && !hourlyTask) {
      console.log("[scheduler] tournament is live — activating hourly sync");
      hourlyTask = cron.schedule("0 * * * *", () => syncHourly(db));
    } else if (!live && hourlyTask) {
      console.log("[scheduler] tournament ended — deactivating hourly sync");
      hourlyTask.stop();
      hourlyTask = null;
    }
  });

  console.log("[scheduler] cron scheduled");
}
