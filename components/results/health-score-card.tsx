"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HealthScore } from "@/lib/types";

function colorFor(score: number): string {
  if (score >= 80) return "var(--color-pillar-green)";
  if (score >= 40) return "var(--color-pillar-yellow)";
  return "var(--color-pillar-red)";
}

function bgFor(score: number): string {
  if (score >= 80) return "color-mix(in oklab, var(--color-pillar-green) 12%, transparent)";
  if (score >= 40) return "color-mix(in oklab, var(--color-pillar-yellow) 12%, transparent)";
  return "color-mix(in oklab, var(--color-pillar-red) 12%, transparent)";
}

export function HealthScoreCard({ score }: { score: HealthScore }) {
  const pct = Math.max(0, Math.min(100, score.score));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = colorFor(score.score);

  return (
    <Card className="overflow-hidden">
      <CardContent
        className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-center md:justify-around"
        style={{ backgroundColor: bgFor(score.score) }}
      >
        {/* Radial progress */}
        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="h-48 w-48 -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-muted"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 800ms ease" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold tabular-nums" style={{ color }}>
              {score.score}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div className="flex items-center gap-3">
            <Badge
              className="text-base font-bold"
              style={{ backgroundColor: color, color: "white" }}
            >
              Grade {score.grade}
            </Badge>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Warikoo Health Score
            </span>
          </div>
          <h2 className="mt-3 text-xl font-semibold leading-tight md:text-2xl">
            {score.verdict}
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Computed across 4 pillars: Cash Flow, Protection, Wealth, Debt. Each
            scored out of 25.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
