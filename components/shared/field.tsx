"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Vertical label + control wrapper used across all form sections.
 *
 * UX contract: every input should anticipate the user's doubt BEFORE they
 * type. `hint` = one-line clarification. `doubt` = "what counts / what
 * doesn't" answer. `example` = concrete sample value. `help` = optional
 * popover slot for deeper reference (e.g. tax slab tables).
 */
export function Field({
  label,
  hint,
  doubt,
  example,
  htmlFor,
  className,
  help,
  children,
}: {
  label: string;
  hint?: string;
  doubt?: string;
  example?: string;
  htmlFor?: string;
  className?: string;
  help?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
        >
          {label}
        </Label>
        {help}
      </div>
      {children}
      {(hint || doubt || example) && (
        <div className="flex flex-col gap-0.5 text-xs leading-snug text-muted-foreground">
          {hint && <span>{hint}</span>}
          {doubt && (
            <span className="text-foreground/70">
              <span className="font-semibold">↳ </span>
              {doubt}
            </span>
          )}
          {example && (
            <span className="font-mono text-[11px] tracking-tight opacity-70">
              e.g. {example}
            </span>
          )}
        </div>
      )}
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
        "mt-4 flex items-center justify-between border px-4 py-3",
        accent ? "border-foreground/40 bg-secondary" : "bg-muted/40",
      )}
    >
      <span className="text-sm font-medium uppercase tracking-wide">
        {label}
      </span>
      <span
        className={cn(
          "tabular-nums font-display text-2xl font-semibold",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        ₹ {new Intl.NumberFormat("en-IN").format(Math.round(value))}
      </span>
    </div>
  );
}
