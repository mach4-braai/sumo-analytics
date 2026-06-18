import type { ApiTorikumi } from "../types.js";

export function mapTorikumi(api: ApiTorikumi) {
  return {
    id: api.id,
    bashoId: api.bashoId,
    division: api.division,
    day: api.day,
    matchNumber: api.matchNo,
    eastRikishi: api.eastId,
    westRikishi: api.westId,
    kimarite: api.kimarite || null,
    winnerId: api.winnerId || null,
  };
}
