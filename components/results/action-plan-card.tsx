"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp, Trophy } from "lucide-react";
import type { FinancialData, CalculationOutput } from "@/lib/types";

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;

interface Phase {
  title: string;
  timeline: string;
  icon: typeof Clock;
  color: string;
  actions: string[];
}

function buildPhases(
  data: FinancialData,
  output: CalculationOutput,
): Phase[] {
  const { cashFlow, healthScore, loanStrategy } = output;
  const totalExp = cashFlow.totalExpenses + cashFlow.totalEmis;
  const efTarget = totalExp * 6;
  const efGap = Math.max(0, efTarget - data.assets.emergencyFund);
  const lowestPillar = [...healthScore.pillars].sort((a, b) => a.score - b.score)[0];

  // Phase 1: Now — fix the lowest-scoring pillar
  const phase1Actions: string[] = [];
  if (lowestPillar) {
    phase1Actions.push(
      `${lowestPillar.name} is your weakest pillar (${lowestPillar.score}/25). Start here.`,
    );
    lowestPillar.actions.slice(0, 2).forEach((a) => phase1Actions.push(a));
  }
  if (cashFlow.surplusOrDeficit < 0) {
    phase1Actions.push(
      `Plug your ${formatINR(Math.abs(cashFlow.surplusOrDeficit))}/mo deficit before doing anything else.`,
    );
  }
  if (phase1Actions.length === 0) {
    phase1Actions.push("Track every expense for 30 days. Find one ₹2k/mo leak.");
  }

  // Phase 2: 3-12 months
  const phase2Actions: string[] = [];
  if (efGap > 0) {
    phase2Actions.push(
      `Build EF by ${formatINR(efGap)} more (target: ${formatINR(efTarget)} = 6 months).`,
    );
  } else {
    phase2Actions.push("EF is funded — keep it parked in liquid FD/savings only.");
  }
  const toxicLoans = loanStrategy.filter((l) => l.recommendation === "prepay-now");
  if (toxicLoans.length > 0) {
    phase2Actions.push(
      `Kill toxic debt: ${toxicLoans.map((l) => l.loanName).join(", ")}. Throw all surplus at it.`,
    );
  }
  if (data.insurance.termCover < 5_000_000 && data.personal.dependents > 0) {
    phase2Actions.push("Buy term insurance NOW — minimum 10× annual income cover.");
  }
  if (data.insurance.healthCover < 300_000) {
    phase2Actions.push("Buy health insurance ₹3-5L family floater. ₹500-1k/mo at most.");
  }
  if (phase2Actions.length < 3) {
    phase2Actions.push("Step up SIP by 10% — compounding loves consistency.");
  }

  // Phase 3: 1-3 years
  const phase3Actions: string[] = [];
  const surplus = Math.max(0, cashFlow.surplusOrDeficit);
  if (surplus > 0) {
    phase3Actions.push(
      `Direct ${formatINR(surplus)}/mo surplus into index fund SIP — long-term wealth comes from here.`,
    );
  }
  phase3Actions.push("Eliminate all loans except home loan (if ≤ 8.5%).");
  phase3Actions.push("Build investment portfolio: 60% index, 30% mid/small, 10% gold/debt.");
  if (data.personal.age < 30) {
    phase3Actions.push("Age advantage: time IN the market matters more than timing.");
  }

  // Phase 4: 3+ years
  const phase4Actions: string[] = [];
  phase4Actions.push("Step-up SIP 10% every salary hike. Don't increase lifestyle proportionally.");
  if (data.goals.length > 0) {
    const highestGoal = output.goalFeasibility.reduce((max, g) =>
      g.requiredMonthlySip > max.requiredMonthlySip ? g : max,
    );
    if (highestGoal.requiredMonthlySip > 0) {
      phase4Actions.push(
        `${highestGoal.goalName} needs ${formatINR(highestGoal.requiredMonthlySip)}/mo SIP — track quarterly.`,
      );
    }
  } else {
    phase4Actions.push("Define 2-3 specific goals — vague targets get vague results.");
  }
  phase4Actions.push("Re-balance portfolio yearly. Sell winners, buy losers (within plan).");
  phase4Actions.push("Year 5 onwards: review every 6 months. Adjust for life events.");

  return [
    {
      title: "Phase 1 — Now",
      timeline: "This month",
      icon: Clock,
      color: "var(--color-pillar-red)",
      actions: phase1Actions.slice(0, 4),
    },
    {
      title: "Phase 2 — Foundation",
      timeline: "3–12 months",
      icon: Calendar,
      color: "var(--color-pillar-yellow)",
      actions: phase2Actions.slice(0, 4),
    },
    {
      title: "Phase 3 — Build",
      timeline: "1–3 years",
      icon: TrendingUp,
      color: "var(--color-warikoo-blue)",
      actions: phase3Actions.slice(0, 4),
    },
    {
      title: "Phase 4 — Compound",
      timeline: "3+ years",
      icon: Trophy,
      color: "var(--color-pillar-green)",
      actions: phase4Actions.slice(0, 4),
    },
  ];
}

export function ActionPlanCard({
  data,
  output,
}: {
  data: FinancialData;
  output: CalculationOutput;
}) {
  const phases = buildPhases(data, output);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Action Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-5 text-sm text-muted-foreground">
          Personalized to your numbers. Sequence matters — finish each phase before
          moving on.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.title}
                className="rounded-lg border-l-4 bg-muted/30 p-4"
                style={{ borderLeftColor: phase.color }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="rounded-full p-1.5"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${phase.color} 15%, transparent)`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: phase.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{phase.title}</h3>
                    <p className="text-xs text-muted-foreground">{phase.timeline}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {phase.actions.map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-snug">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
