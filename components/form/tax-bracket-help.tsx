"use client";

import { HelpCircle } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NEW_REGIME = [
  ["Up to ₹4 L", "0%"],
  ["₹4 L – ₹8 L", "5%"],
  ["₹8 L – ₹12 L", "10%"],
  ["₹12 L – ₹16 L", "15%"],
  ["₹16 L – ₹20 L", "20%"],
  ["₹20 L – ₹24 L", "25%"],
  ["Above ₹24 L", "30%"],
];

const OLD_REGIME = [
  ["Up to ₹2.5 L", "0%"],
  ["₹2.5 L – ₹5 L", "5%"],
  ["₹5 L – ₹10 L", "20%"],
  ["Above ₹10 L", "30%"],
];

export function TaxBracketHelp() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="How to find your tax bracket"
            className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent hover:text-accent/80 transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
            How to check
          </button>
        }
      />
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[min(92vw,420px)] gap-3 p-4"
      >
        <div className="space-y-3">
          <div>
            <h4 className="font-display text-base font-semibold tracking-tight">
              Marginal tax bracket — FY 2025-26
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The rate on your <span className="font-semibold text-foreground">top
              rupee</span> of taxable income, not your average rate.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              New Regime — default
            </p>
            <table className="w-full text-xs tabular-nums">
              <tbody className="divide-y divide-foreground/10">
                {NEW_REGIME.map(([range, rate]) => (
                  <tr key={range}>
                    <td className="py-1 text-muted-foreground">{range}</td>
                    <td className="py-1 text-right font-mono font-semibold">
                      {rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              <span className="font-semibold">Note:</span> Sec 87A rebate makes
              income up to ₹12 L effectively tax-free, but the marginal slab on
              your top rupee is what we ask for.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-foreground/10 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              Old Regime — only if you actively chose it
            </p>
            <table className="w-full text-xs tabular-nums">
              <tbody className="divide-y divide-foreground/10">
                {OLD_REGIME.map(([range, rate]) => (
                  <tr key={range}>
                    <td className="py-1 text-muted-foreground">{range}</td>
                    <td className="py-1 text-right font-mono font-semibold">
                      {rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 border-t border-foreground/10 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              Three ways to find yours
            </p>
            <ol className="space-y-1 text-xs leading-relaxed text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">
                  1. Form 16
                </span>{" "}
                — page 1, &ldquo;Tax on Total Income&rdquo;. Most accurate.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  2. Last salary slip
                </span>{" "}
                — TDS deducted? You&apos;re at least in the 5% slab.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  3. Quick math
                </span>{" "}
                — monthly in-hand × 12 = annual. Find your slab above.
              </li>
            </ol>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
