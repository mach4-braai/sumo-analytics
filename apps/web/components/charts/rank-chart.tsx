"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui/card";

interface RankDataPoint {
  bashoId: string;
  rank: string | null;
  division: string | null;
}

const RANK_ORDER: Record<string, number> = {
  Yokozuna: 1,
  Ozeki: 2,
  Sekiwake: 3,
  Komusubi: 4,
};

function rankToNumeric(rank: string | null): number | null {
  if (!rank) return null;
  const parts = rank.split(" ");
  const title = parts[0];
  const number = parseInt(parts[1]) || 0;

  if (RANK_ORDER[title]) {
    return RANK_ORDER[title] * 10 - number;
  }
  if (title === "Maegashira") {
    return 50 + number;
  }
  return 100 + number;
}

export function RankChart({ data }: { data: RankDataPoint[] }) {
  const chartData = data.map((d) => ({
    basho: d.bashoId,
    rank: rankToNumeric(d.rank),
    label: d.rank ?? "",
  }));

  return (
    <Card>
      <h3 className="mb-4 text-sm font-medium text-slate-400">
        Rank Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252530" />
          <XAxis
            dataKey="basho"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            reversed
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            hide
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #252530",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(_: any, __: any, props: any) => [
              props?.payload?.label ?? "",
              "Rank",
            ]}
          />
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
