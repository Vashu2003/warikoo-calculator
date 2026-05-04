"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { RedFlag } from "@/lib/types";

const severityConfig: Record<
  RedFlag["severity"],
  { color: string; icon: typeof AlertOctagon; label: string }
> = {
  critical: { color: "var(--color-pillar-red)", icon: AlertOctagon, label: "Critical" },
  high: { color: "#F97316", icon: AlertTriangle, label: "High" },
  medium: { color: "var(--color-pillar-yellow)", icon: AlertCircle, label: "Medium" },
  low: { color: "#3B82F6", icon: Info, label: "Low" },
};

export function RedFlagsList({ flags }: { flags: RedFlag[] }) {
  if (flags.length === 0) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: "var(--color-pillar-green)" }}>
        <CardContent className="flex items-center gap-3 p-5">
          <CheckCircle2 className="h-6 w-6" style={{ color: "var(--color-pillar-green)" }} />
          <div>
            <p className="font-semibold">All clear — no red flags.</p>
            <p className="text-sm text-muted-foreground">
              Your finances pass all 8+ Warikoo anti-pattern checks.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by severity priority
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...flags].sort((a, b) => order[a.severity] - order[b.severity]);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((flag, i) => {
        const cfg = severityConfig[flag.severity];
        const Icon = cfg.icon;
        return (
          <Card
            key={i}
            className="border-l-4"
            style={{
              borderLeftColor: cfg.color,
              backgroundColor: `color-mix(in oklab, ${cfg.color} 5%, transparent)`,
            }}
          >
            <CardContent className="flex gap-3 p-4">
              <Icon className="h-5 w-5 shrink-0" style={{ color: cfg.color }} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug">{flag.title}</h3>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: cfg.color,
                      color: "white",
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{flag.detail}</p>
                <div
                  className="rounded border-l-2 px-3 py-2 text-sm"
                  style={{
                    borderLeftColor: cfg.color,
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  <span className="font-semibold">Fix: </span>
                  {flag.fix}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
