"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { H2HChart } from "@/components/charts/h2h-chart";
import { Card } from "@/components/ui/card";
import { fetchH2H } from "./actions";

interface Option {
  value: string;
  label: string;
}

interface H2HResult {
  matches: number;
  data: { name: string; wins: number }[];
}

export function H2HComparison({ options }: { options: Option[] }) {
  const [rikishi1, setRikishi1] = useState("");
  const [rikishi2, setRikishi2] = useState("");
  const [result, setResult] = useState<H2HResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCompare() {
    if (!rikishi1 || !rikishi2 || rikishi1 === rikishi2) return;
    setLoading(true);
    try {
      const data = await fetchH2H(parseInt(rikishi1), parseInt(rikishi2));
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
        <Select
          label="Rikishi 1"
          value={rikishi1}
          onChange={setRikishi1}
          options={options}
        />
        <Select
          label="Rikishi 2"
          value={rikishi2}
          onChange={setRikishi2}
          options={options}
        />
        <button
          onClick={handleCompare}
          disabled={!rikishi1 || !rikishi2 || rikishi1 === rikishi2 || loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : "Compare"}
        </button>
      </Card>

      {result && (
        <>
          <Card>
            <p className="text-center text-lg text-slate-300">
              <span className="font-bold text-white">{result.matches}</span>{" "}
              total matches
            </p>
          </Card>
          <H2HChart data={result.data} />
        </>
      )}
    </div>
  );
}
