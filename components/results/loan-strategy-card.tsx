"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";
import type { LoanStrategyItem, Loan } from "@/lib/types";

const recColors: Record<
  LoanStrategyItem["recommendation"],
  { color: string; label: string }
> = {
  "prepay-now": { color: "var(--color-pillar-red)", label: "PREPAY NOW" },
  "prepay-later": { color: "var(--color-pillar-yellow)", label: "PREPAY LATER" },
  continue: { color: "var(--color-pillar-green)", label: "CONTINUE EMI" },
  refinance: { color: "#3B82F6", label: "REFINANCE" },
};

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;

export function LoanStrategyCard({
  strategy,
  loans,
}: {
  strategy: LoanStrategyItem[];
  loans: Loan[];
}) {
  if (strategy.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2
              className="h-5 w-5"
              style={{ color: "var(--color-pillar-green)" }}
            />
            <span>No loans — debt-free is the goal. Stay there.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Strategy (Debt Avalanche)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Sorted by interest rate. Highest rate dies first — math beats psychology.
        </p>

        {strategy.map((s) => {
          const cfg = recColors[s.recommendation];
          const loan = loans.find((l) => l.id === s.loanId);
          return (
            <div
              key={s.loanId}
              className="rounded-lg border p-4"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: cfg.color,
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    #{s.priority}
                  </Badge>
                  <span className="font-semibold">{s.loanName}</span>
                  {loan && (
                    <span className="text-xs text-muted-foreground">
                      · {loan.ratePercent}% · {formatINR(loan.principal)}
                    </span>
                  )}
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide"
                  style={{ backgroundColor: cfg.color, color: "white" }}
                >
                  {cfg.label}
                </span>
              </div>

              <p className="mt-2 text-sm">{s.reasoning}</p>

              {s.monthsSaved !== undefined && s.monthsSaved > 0 && (
                <div
                  className="mt-3 flex flex-wrap items-center gap-3 rounded-md p-2 text-xs"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--color-pillar-green) 10%, transparent)",
                  }}
                >
                  <Zap
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--color-pillar-green)" }}
                  />
                  <span>
                    Add ₹2k/mo extra → save{" "}
                    <strong>{s.monthsSaved} months</strong>
                    {s.interestSaved !== undefined && s.interestSaved > 0 && (
                      <>
                        {" "}and <strong>{formatINR(s.interestSaved)}</strong> in interest
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
