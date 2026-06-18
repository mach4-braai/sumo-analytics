import type { ApiRikishi } from "../types.js";

export function mapRikishi(api: ApiRikishi) {
  return {
    id: api.id,
    name: api.shikonaEn || `Rikishi ${api.id}`,
    birthday: api.birthDate
      ? Math.floor(new Date(api.birthDate).getTime() / 1000)
      : null,
    origin: api.shusshin || null,
  };
}
