"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui/card";

interface KimariteDataPoint {
  kimarite: string | null;
  count: number;
}

export function KimariteChart({
  data,
  title = "Technique Distribution",
}: {
  data: KimariteDataPoint[];
  title?: string;
}) {
  const chartHeight = Math.max(300, data.length * 32);

  return (
    <Card>
      <h3 className="mb-4 text-sm font-medium text-slate-400">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#252530" />
          <XAxis
            type="number"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="kimarite"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            width={100}
            interval={0}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #252530",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
