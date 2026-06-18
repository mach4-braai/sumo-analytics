interface ApiBanzukeEntry {
  rikishiID: number;
  rank: string;
}

interface ApiBanzuke {
  bashoId: string;
  division: string;
  east: ApiBanzukeEntry[];
  west: ApiBanzukeEntry[];
}

export function mapBanzuke(api: ApiBanzuke) {
  const entries = [...api.east, ...api.west];
  return entries.map((entry) => ({
    rikishiId: entry.rikishiID,
    bashoId: api.bashoId,
    rank: entry.rank || null,
    division: api.division,
    weight: null,
  }));
}
