"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "../ui/card";

interface H2HData {
  name: string;
  wins: number;
}

export function H2HChart({ data }: { data: H2HData[] }) {
  const colors = ["#6366f1", "#f59e0b"];

  return (
    <Card>
      <h3 className="mb-4 text-sm font-medium text-slate-400">
        Head to Head Record
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <XAxis
            type="number"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #252530",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="wins" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
