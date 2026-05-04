"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Vertical label + control wrapper used across all form sections.
 */
export function Field({
  label,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

/**
 * Total summary row used at the bottom of expense / income / assets forms.
 */
export function TotalRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between rounded-lg border px-4 py-3",
        accent ? "border-warikoo-blue/30 bg-warikoo-blue/5" : "bg-muted/40",
      )}
      style={
        accent
          ? {
              borderColor: "color-mix(in oklab, var(--color-warikoo-blue) 30%, transparent)",
              backgroundColor: "color-mix(in oklab, var(--color-warikoo-blue) 5%, transparent)",
            }
          : undefined
      }
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--color-warikoo-blue)" }}>
        ₹ {new Intl.NumberFormat("en-IN").format(Math.round(value))}
      </span>
    </div>
  );
}
