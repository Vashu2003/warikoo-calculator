"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { Pillar, PillarStatus } from "@/lib/types";

const statusConfig: Record<
  PillarStatus,
  { color: string; icon: typeof CheckCircle2; label: string }
> = {
  green: { color: "var(--color-pillar-green)", icon: CheckCircle2, label: "On track" },
  yellow: { color: "var(--color-pillar-yellow)", icon: AlertTriangle, label: "Watch" },
  red: { color: "var(--color-pillar-red)", icon: XCircle, label: "Critical" },
};

export function PillarsGrid({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => {
        const cfg = statusConfig[p.status];
        const Icon = cfg.icon;
        return (
          <Card
            key={p.name}
            className="border-l-4 transition-shadow hover:shadow-md"
            style={{ borderLeftColor: cfg.color }}
          >
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {p.name}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span
                      className="text-3xl font-bold tabular-nums"
                      style={{ color: cfg.color }}
                    >
                      {p.score}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 25</span>
                  </div>
                </div>
                <Icon className="h-6 w-6 shrink-0" style={{ color: cfg.color }} />
              </div>

              <p className="font-medium leading-snug">{p.headline}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {p.commentary}
              </p>

              {p.actions.length > 0 && (
                <ul className="mt-1 space-y-1.5 border-t pt-3">
                  {p.actions.map((a, i) => (
                    <li key={i} className="flex gap-2 text-xs">
                      <span
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
