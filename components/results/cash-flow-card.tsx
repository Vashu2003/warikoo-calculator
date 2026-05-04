"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CashFlowSummary } from "@/lib/types";

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;

function StatBox({
  label,
  value,
  emphasis = "normal",
}: {
  label: string;
  value: string;
  emphasis?: "normal" | "good" | "bad";
}) {
  const color =
    emphasis === "good"
      ? "var(--color-pillar-green)"
      : emphasis === "bad"
        ? "var(--color-pillar-red)"
        : undefined;
  return (
    <div className="flex flex-col rounded-lg bg-muted/40 p-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className="mt-1 text-base font-semibold tabular-nums md:text-lg"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function RatioBar({
  label,
  actualPct,
  targetPct,
  color,
}: {
  label: string;
  actualPct: number;
  targetPct: number;
  color: string;
}) {
  const overTarget = actualPct > targetPct;
  const widthPct = Math.min(100, Math.max(0, actualPct));
  const targetMarkerPct = Math.min(100, Math.max(0, targetPct));

  const gap = actualPct - targetPct;
  const gapText =
    Math.abs(gap) < 1
      ? "On target."
      : overTarget
        ? `Over by ${Math.abs(gap).toFixed(0)}%.`
        : `Under by ${Math.abs(gap).toFixed(0)}% — room to spare.`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {label}{" "}
          <span className="text-muted-foreground">
            (target {targetPct}%)
          </span>
        </span>
        <span className="font-semibold tabular-nums" style={{ color }}>
          {actualPct.toFixed(0)}%
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${widthPct}%`,
            backgroundColor: color,
            opacity: overTarget ? 1 : 0.7,
          }}
        />
        {/* Target marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/60"
          style={{ left: `${targetMarkerPct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{gapText}</p>
    </div>
  );
}

export function CashFlowCard({ cashFlow }: { cashFlow: CashFlowSummary }) {
  const surplus = cashFlow.surplusOrDeficit;

  // 50/30/20 split: Needs (essentials), Wants (lifestyle), Save (everything else)
  // We approximate Needs ≈ expenses + EMIs (since EMIs = needs in our model = home/edu critical)
  // For simplicity: needs ratio = expenseRatio (since expenses tab already split needs/wants)
  // We'll show: Expenses %, EMI %, Savings %
  const expensePct = cashFlow.expenseRatio * 100;
  const emiPct = cashFlow.emiRatio * 100;
  const savingsPct = cashFlow.savingsRate * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          <StatBox label="Income" value={formatINR(cashFlow.totalIncome)} />
          <StatBox label="Expenses" value={formatINR(cashFlow.totalExpenses)} />
          <StatBox label="EMIs" value={formatINR(cashFlow.totalEmis)} />
          <StatBox label="Savings" value={formatINR(cashFlow.totalSavings)} />
          <StatBox
            label={surplus >= 0 ? "Surplus" : "Deficit"}
            value={formatINR(Math.abs(surplus))}
            emphasis={surplus >= 0 ? "good" : "bad"}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Warikoo 50 / 30 / 20 Check
          </h3>
          <RatioBar
            label="Expenses (Needs + Wants)"
            actualPct={expensePct}
            targetPct={50}
            color="var(--color-pillar-yellow)"
          />
          <RatioBar
            label="EMIs"
            actualPct={emiPct}
            targetPct={30}
            color="var(--color-pillar-red)"
          />
          <RatioBar
            label="Savings + Investments"
            actualPct={savingsPct}
            targetPct={20}
            color="var(--color-pillar-green)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
