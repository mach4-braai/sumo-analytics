import { getDb } from "@sumo/db";
import { syncRikishi } from "./jobs/sync-rikishi.js";
import { syncBasho } from "./jobs/sync-basho.js";
import { syncTorikumi } from "./jobs/sync-torikumi.js";
import { syncBanzuke } from "./jobs/sync-banzuke.js";
import { startScheduler } from "./scheduler.js";

const args = process.argv.slice(2);
const isSeed = args.includes("--seed");

async function seed() {
  const db = getDb();
  console.log("[seed] starting initial data seed...");

  // Order matters: rikishi first (referenced by basho and torikumi)
  await syncRikishi(db);
  await syncBasho(db);
  await syncBanzuke(db);
  await syncTorikumi(db);

  console.log("[seed] seed complete");
  process.exit(0);
}

async function main() {
  const db = getDb();
  console.log("[fetcher] starting in cron mode...");
  startScheduler(db);
}

if (isSeed) {
  seed().catch((err) => {
    console.error("[seed] fatal error:", err);
    process.exit(1);
  });
} else {
  main().catch((err) => {
    console.error("[fetcher] fatal error:", err);
    process.exit(1);
  });
}
