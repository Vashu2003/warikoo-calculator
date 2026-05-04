"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";
import { Separator } from "@/components/ui/separator";
import type { Assets } from "@/lib/types";

const LIQUID: Array<{ key: keyof Assets; label: string; hint?: string }> = [
  { key: "emergencyFund", label: "Emergency Fund", hint: "In savings / liquid FD only" },
  { key: "fixedDeposits", label: "Fixed Deposits" },
  { key: "recurringDeposits", label: "Recurring Deposits" },
];

const INVESTMENTS: Array<{ key: keyof Assets; label: string; hint?: string }> = [
  { key: "mutualFunds", label: "Mutual Funds (current value)" },
  { key: "stocks", label: "Stocks (current value)" },
  { key: "gold", label: "Gold (jewellery + SGB + ETF)" },
  { key: "providentFund", label: "EPF / PPF" },
];

export function AssetsForm() {
  const assets = useFinancialStore((s) => s.data.assets);
  const update = useFinancialStore((s) => s.updateAssets);

  const total = (Object.values(assets) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Current value (today) of what you own. Be conservative — don&apos;t add house
        you live in or LIC surrender values.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Liquid (low risk)
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LIQUID.map(({ key, label, hint }) => (
          <Field key={key} label={label} hint={hint}>
            <CurrencyInput
              value={assets[key]}
              onChange={(v) => update({ [key]: v } as Partial<Assets>)}
            />
          </Field>
        ))}
      </div>

      <Separator className="my-6" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Investments (long-term)
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {INVESTMENTS.map(({ key, label, hint }) => (
          <Field key={key} label={label} hint={hint}>
            <CurrencyInput
              value={assets[key]}
              onChange={(v) => update({ [key]: v } as Partial<Assets>)}
            />
          </Field>
        ))}
      </div>

      <TotalRow label="Total assets" value={total} accent />
    </div>
  );
}
