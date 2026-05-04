"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import type { GoalFeasibility, Goal } from "@/lib/types";

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;

type Status = "FEASIBLE" | "TIGHT" | "NOT FEASIBLE";

function statusFor(g: GoalFeasibility): { label: Status; color: string } {
  if (g.onTrack) return { label: "FEASIBLE", color: "var(--color-pillar-green)" };
  if (g.shortfall === 0)
    return { label: "TIGHT", color: "var(--color-pillar-yellow)" };
  return { label: "NOT FEASIBLE", color: "var(--color-pillar-red)" };
}

export function GoalsTable({
  feasibility,
  goals,
}: {
  feasibility: GoalFeasibility[];
  goals: Goal[];
}) {
  if (feasibility.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <Target className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No goals set. Add goals in the Calculator to see how achievable they are.
          </p>
          <Link href="/calculator#goals">
            <Button variant="outline" size="sm">
              Add Goals
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Feasibility</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: stacked cards */}
        <div className="space-y-3 md:hidden">
          {feasibility.map((f) => {
            const goal = goals.find((g) => g.id === f.goalId);
            const st = statusFor(f);
            const progress = goal && f.futureCost > 0
              ? Math.min(100, (goal.alreadySaved / f.futureCost) * 100)
              : 0;
            return (
              <div key={f.goalId} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold">{f.goalName}</span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
                    style={{ backgroundColor: st.color, color: "white" }}
                  >
                    {st.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Years left</div>
                    <div className="font-medium tabular-nums">{f.yearsRemaining}y</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Future cost</div>
                    <div className="font-medium tabular-nums">{formatINR(f.futureCost)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Required SIP/mo</div>
                    <div className="font-medium tabular-nums" style={{ color: st.color }}>
                      {formatINR(f.requiredMonthlySip)}
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: st.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 text-left font-medium">Goal</th>
                <th className="py-2 pr-3 text-right font-medium">Years</th>
                <th className="py-2 pr-3 text-right font-medium">Future Cost</th>
                <th className="py-2 pr-3 text-right font-medium">SIP/mo</th>
                <th className="py-2 pr-3 text-left font-medium">Progress</th>
                <th className="py-2 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {feasibility.map((f) => {
                const goal = goals.find((g) => g.id === f.goalId);
                const st = statusFor(f);
                const progress = goal && f.futureCost > 0
                  ? Math.min(100, (goal.alreadySaved / f.futureCost) * 100)
                  : 0;
                return (
                  <tr key={f.goalId} className="border-b last:border-b-0">
                    <td className="py-3 pr-3 font-medium">{f.goalName}</td>
                    <td className="py-3 pr-3 text-right tabular-nums">
                      {f.yearsRemaining}y
                    </td>
                    <td className="py-3 pr-3 text-right tabular-nums">
                      {formatINR(f.futureCost)}
                    </td>
                    <td
                      className="py-3 pr-3 text-right font-semibold tabular-nums"
                      style={{ color: st.color }}
                    >
                      {formatINR(f.requiredMonthlySip)}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: st.color,
                            }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
                        style={{ backgroundColor: st.color, color: "white" }}
                      >
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
