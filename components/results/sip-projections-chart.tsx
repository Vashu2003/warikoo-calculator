"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { calculateSipProjections } from "@/lib/calculations";

const formatLakhCrore = (n: number): string => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
};

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;

export function SipProjectionsChart({
  currentSip,
}: {
  currentSip: number;
}) {
  const startSip = currentSip > 0 ? currentSip : 5000;
  const [sip, setSip] = React.useState<number>(startSip);

  const projections = React.useMemo(() => {
    // Reuse the calc engine — it has step-up baked in
    return calculateSipProjections({
      personal: { name: "", age: 30, dependents: 0, taxRegime: "New", taxBracket: 30 },
      income: { salary: 0, sideIncome: 0, otherIncome: 0 },
      expenses: { rent: 0, groceries: 0, utilities: 0, mobile: 0, transport: 0, eatingOut: 0, subscriptions: 0, healthcare: 0, education: 0, familySupport: 0, other: 0 },
      loans: [],
      assets: { emergencyFund: 0, fixedDeposits: 0, recurringDeposits: 0, mutualFunds: 0, stocks: 0, gold: 0, providentFund: 0 },
      insurance: { termCover: 0, termPremiumMonthly: 0, healthCover: 0, healthPremiumMonthly: 0 },
      goals: [],
      monthlySavings: { sip, rd: 0, otherSavings: 0 },
    });
  }, [sip]);

  const final = projections[projections.length - 1];
  const earned = final.projectedValue - final.invested;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIP Projections (12% CAGR, 10% step-up)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="sip-slider" className="font-medium">
              Monthly SIP: {formatINR(sip)}
            </label>
            <span className="text-muted-foreground tabular-nums">
              {formatINR(1000)} → {formatINR(50000)}
            </span>
          </div>
          <input
            id="sip-slider"
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={sip}
            onChange={(e) => setSip(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-warikoo-blue)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Invested over {final.year}y
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {formatINR(final.invested)}
            </div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--color-pillar-green) 10%, transparent)",
            }}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Wealth created
            </div>
            <div
              className="mt-1 text-lg font-semibold tabular-nums"
              style={{ color: "var(--color-pillar-green)" }}
            >
              {formatINR(earned)}
            </div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--color-warikoo-blue) 10%, transparent)",
            }}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Final corpus
            </div>
            <div
              className="mt-1 text-lg font-semibold tabular-nums"
              style={{ color: "var(--color-warikoo-blue)" }}
            >
              {formatINR(final.projectedValue)}
            </div>
          </div>
        </div>

        {/* Static fallback table — only shown during PDF capture */}
        <div data-pdf-only style={{ display: "none" }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-foreground/20">
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Year
                </th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Invested
                </th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Projected corpus
                </th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Wealth created
                </th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p) => (
                <tr key={p.year} className="border-b border-foreground/10">
                  <td className="py-2 font-mono">{p.year}y</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatINR(p.invested)}
                  </td>
                  <td className="py-2 text-right font-semibold tabular-nums">
                    {formatINR(p.projectedValue)}
                  </td>
                  <td className="py-2 text-right tabular-nums text-[var(--color-pillar-green)]">
                    {formatINR(p.projectedValue - p.invested)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live interactive chart — hidden during PDF capture */}
        <div data-pdf-skip className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-projected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-warikoo-blue)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-warikoo-blue)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="grad-invested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-warikoo-accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-warikoo-accent)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
              <XAxis
                dataKey="year"
                tickFormatter={(y) => `${y}y`}
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatLakhCrore}
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip
                formatter={(value) => formatINR(Number(value) || 0)}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-popover)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="invested"
                name="Invested"
                stroke="var(--color-warikoo-accent)"
                fill="url(#grad-invested)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="projectedValue"
                name="Corpus"
                stroke="var(--color-warikoo-blue)"
                fill="url(#grad-projected)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
