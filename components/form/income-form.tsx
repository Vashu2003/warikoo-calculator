"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";

export function IncomeForm() {
  const income = useFinancialStore((s) => s.data.income);
  const update = useFinancialStore((s) => s.updateIncome);

  const total = income.salary + income.sideIncome + income.otherIncome;

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Enter <span className="font-semibold text-foreground">net monthly</span>{" "}
        take-home — the actual rupees that hit your account on payday. Not CTC, not gross.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          label="Salary (in-hand monthly)"
          hint="After income tax + PF + professional tax deducted."
          doubt="Look at your last salary slip. Find the ‘Net Salary’ or ‘Take Home’ row. NOT the CTC, NOT the gross."
          example="₹65,000 if that's what credits to bank monthly"
        >
          <CurrencyInput
            value={income.salary}
            onChange={(v) => update({ salary: v })}
            placeholder="50000"
          />
        </Field>

        <Field
          label="Side income / freelance"
          hint="Monthly average over last 6 months."
          doubt="Include: consulting, freelance projects, content/creator payouts, weekend gigs. Skip if it's truly one-off."
          example="₹15,000 if you average that across the year"
        >
          <CurrencyInput
            value={income.sideIncome}
            onChange={(v) => update({ sideIncome: v })}
            placeholder="0"
          />
        </Field>

        <Field
          label="Other recurring income"
          hint="Passive or recurring sources you can rely on."
          doubt="Rent received, dividends, FD interest (monthly equivalent), spousal contribution to YOUR budget. Skip lottery/gifts/one-time."
          example="₹8,000 if you rent out a portion of your home"
          className="md:col-span-2"
        >
          <CurrencyInput
            value={income.otherIncome}
            onChange={(v) => update({ otherIncome: v })}
            placeholder="0"
          />
        </Field>
      </div>

      <TotalRow label="Total monthly income" value={total} accent />
    </div>
  );
}
