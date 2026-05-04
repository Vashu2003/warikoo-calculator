"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field } from "@/components/shared/field";
import { Separator } from "@/components/ui/separator";

const formatLakhCrore = (n: number): string => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${new Intl.NumberFormat("en-IN").format(n)}`;
};

export function InsuranceForm() {
  const insurance = useFinancialStore((s) => s.data.insurance);
  const income = useFinancialStore((s) => s.data.income);
  const dependents = useFinancialStore((s) => s.data.personal.dependents);
  const update = useFinancialStore((s) => s.updateInsurance);

  const annualIncome = (income.salary + income.sideIncome + income.otherIncome) * 12;
  const recommendedTerm = Math.max(annualIncome * 10, 5_000_000);
  const recommendedHealth = dependents > 0 ? 1_000_000 : 500_000;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Insurance is protection — not investment. Buy pure term + health. Avoid
        endowment / money-back policies.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Term Life
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Sum assured (cover)"
          hint={`Recommended: ${formatLakhCrore(recommendedTerm)} (10× annual income)`}
        >
          <CurrencyInput
            value={insurance.termCover}
            onChange={(v) => update({ termCover: v })}
            placeholder="5000000"
          />
        </Field>

        <Field label="Premium (monthly)" hint="Term plans should be cheap. ₹500-1500/mo at age 25-30.">
          <CurrencyInput
            value={insurance.termPremiumMonthly}
            onChange={(v) => update({ termPremiumMonthly: v })}
          />
        </Field>
      </div>

      <Separator className="my-6" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-warikoo-blue)" }}>
        Health
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Sum assured (cover)"
          hint={`Recommended: ${formatLakhCrore(recommendedHealth)} ${
            dependents > 0 ? "(family floater with dependents)" : "(individual)"
          }`}
        >
          <CurrencyInput
            value={insurance.healthCover}
            onChange={(v) => update({ healthCover: v })}
            placeholder="500000"
          />
        </Field>

        <Field label="Premium (monthly)">
          <CurrencyInput
            value={insurance.healthPremiumMonthly}
            onChange={(v) => update({ healthPremiumMonthly: v })}
          />
        </Field>
      </div>

      <div
        className="mt-6 rounded-lg border p-4 text-sm"
        style={{
          borderColor: "color-mix(in oklab, var(--color-warikoo-accent) 40%, transparent)",
          backgroundColor: "color-mix(in oklab, var(--color-warikoo-accent) 10%, transparent)",
        }}
      >
        <strong>Pro tip:</strong> If your &ldquo;LIC policy&rdquo; has a maturity value, it&apos;s
        endowment — not term. Calculate the IRR. Most return 4-6%, while a pure
        term + index fund combo beats it by 7-8% per year.
      </div>
    </div>
  );
}
