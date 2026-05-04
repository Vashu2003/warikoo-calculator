"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";
import { Separator } from "@/components/ui/separator";
import type { Expenses } from "@/lib/types";

const ESSENTIALS: Array<{ key: keyof Expenses; label: string }> = [
  { key: "rent", label: "Rent / EMI on home" },
  { key: "groceries", label: "Groceries" },
  { key: "utilities", label: "Utilities (power, water, gas)" },
  { key: "mobile", label: "Mobile / internet" },
  { key: "transport", label: "Transport / fuel" },
  { key: "healthcare", label: "Healthcare (out-of-pocket)" },
];

const LIFESTYLE: Array<{ key: keyof Expenses; label: string }> = [
  { key: "eatingOut", label: "Eating out / Swiggy / Zomato" },
  { key: "subscriptions", label: "Subscriptions (OTT, gym, apps)" },
  { key: "education", label: "Courses / education" },
  { key: "familySupport", label: "Family support / sent home" },
  { key: "other", label: "Other / discretionary" },
];

export function ExpensesForm() {
  const expenses = useFinancialStore((s) => s.data.expenses);
  const update = useFinancialStore((s) => s.updateExpenses);

  const total = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Monthly spend by category. Be honest — averaging eating-out spend
        upward by ₹1k each month is the #1 reason this calculator lies.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Essentials (Needs)
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ESSENTIALS.map(({ key, label }) => (
          <Field key={key} label={label}>
            <CurrencyInput
              value={expenses[key]}
              onChange={(v) => update({ [key]: v } as Partial<Expenses>)}
            />
          </Field>
        ))}
      </div>

      <Separator className="my-6" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Lifestyle (Wants)
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LIFESTYLE.map(({ key, label }) => (
          <Field key={key} label={label}>
            <CurrencyInput
              value={expenses[key]}
              onChange={(v) => update({ [key]: v } as Partial<Expenses>)}
            />
          </Field>
        ))}
      </div>

      <TotalRow label="Total monthly expenses" value={total} accent />
    </div>
  );
}
