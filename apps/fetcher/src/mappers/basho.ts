const MONTH_TO_CITY: Record<string, string> = {
  "01": "Tokyo",
  "03": "Osaka",
  "05": "Tokyo",
  "07": "Nagoya",
  "09": "Tokyo",
  "11": "Fukuoka",
};

interface ApiBashoYusho {
  type: string;
  rikishiId: number;
}

interface ApiBasho {
  date: string;
  yusho?: ApiBashoYusho[];
}

export function mapBasho(api: ApiBasho) {
  const month = api.date.slice(4, 6);
  const makuuchiYusho = api.yusho?.find((y) => y.type === "Makuuchi");

  return {
    id: api.date,
    city: MONTH_TO_CITY[month] ?? "Unknown",
    winnerId: makuuchiYusho?.rikishiId ?? null,
  };
}
