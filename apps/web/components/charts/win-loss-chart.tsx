"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card } from "../ui/card";

interface WinLossDataPoint {
  bashoId: string;
  wins: number;
  losses: number;
}

export function WinLossChart({ data }: { data: WinLossDataPoint[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-medium text-slate-400">
        Win/Loss by Basho
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252530" />
          <XAxis
            dataKey="bashoId"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #252530",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
          />
          <Bar dataKey="wins" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
