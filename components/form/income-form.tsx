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
      <p className="mb-4 text-sm text-muted-foreground">
        Net monthly take-home — what hits your bank account, not CTC.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Salary (in-hand monthly)">
          <CurrencyInput
            value={income.salary}
            onChange={(v) => update({ salary: v })}
            placeholder="50000"
          />
        </Field>

        <Field label="Side income / freelance" hint="Average per month">
          <CurrencyInput
            value={income.sideIncome}
            onChange={(v) => update({ sideIncome: v })}
            placeholder="0"
          />
        </Field>

        <Field
          label="Other income"
          hint="Rent, dividends, interest etc."
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
