"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";

type Rikishi = {
  id: string;
  name: string;
  origin: string;
};

export function RikishiList({ data }: { data: Rikishi[] }) {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();
  const filtered = query
    ? data.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.origin.toLowerCase().includes(query),
      )
    : data;

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or origin..."
          className="w-full max-w-sm rounded-lg border border-surface-700 bg-surface-800 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent transition-colors"
        />
        <span className="text-sm text-slate-500 whitespace-nowrap">
          {filtered.length === data.length
            ? `${data.length} rikishi`
            : `${filtered.length} of ${data.length} rikishi`}
        </span>
      </div>

      <DataTable
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <Link
                href={`/rikishi/${row.id}`}
                className="text-accent hover:underline font-medium"
              >
                {row.name}
              </Link>
            ),
          },
          { key: "origin", header: "Origin" },
        ]}
        data={filtered}
      />
    </>
  );
}
