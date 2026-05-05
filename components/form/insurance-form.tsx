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

  const annualIncome =
    (income.salary + income.sideIncome + income.otherIncome) * 12;
  const recommendedTerm = Math.max(annualIncome * 10, 5_000_000);
  const recommendedHealth = dependents > 0 ? 1_000_000 : 500_000;

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Insurance is <span className="font-semibold text-foreground">protection</span> —
        not investment. Buy pure term + health. If you have an &ldquo;LIC policy&rdquo; with
        maturity benefit, that&apos;s endowment — and it&apos;s the worst of both worlds.
      </p>

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Term life cover
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          label="Sum assured"
          hint={`Recommended: ${formatLakhCrore(recommendedTerm)} (10× annual income)`}
          doubt="The DEATH BENEFIT — what your family receives if you die during the policy term. NOT the premium. Look for ‘Sum Assured’ on the policy bond first page. ₹50L cover ≠ ₹50L premium."
          example="50,00,000 (= ₹50 Lakh = 50L cover)"
        >
          <CurrencyInput
            value={insurance.termCover}
            onChange={(v) => update({ termCover: v })}
            placeholder="5000000"
          />
        </Field>

        <Field
          label="Term premium (monthly)"
          hint="Should be cheap. ₹500-1,500/month at age 25-30 for ₹1Cr cover."
          doubt="If paid annually, divide by 12. If your premium feels high (>₹3,000/mo for ₹1Cr cover at age <35), you might have endowment, not term."
          example="₹800/month for ₹1Cr cover at 28"
        >
          <CurrencyInput
            value={insurance.termPremiumMonthly}
            onChange={(v) => update({ termPremiumMonthly: v })}
          />
        </Field>
      </div>

      <Separator className="my-8" />

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Health insurance
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          label="Sum assured"
          hint={`Recommended: ${formatLakhCrore(recommendedHealth)} ${
            dependents > 0 ? "family floater" : "individual cover"
          }`}
          doubt="Total cover across ALL health policies you own. If you have employer + personal cover, sum them. Family floater: the limit shared across family members."
          example="₹10,00,000 (= ₹10L floater for family of 4)"
        >
          <CurrencyInput
            value={insurance.healthCover}
            onChange={(v) => update({ healthCover: v })}
            placeholder="500000"
          />
        </Field>

        <Field
          label="Health premium (monthly)"
          hint="Annual premium ÷ 12. Skip employer-paid policies."
          doubt="Only count what YOU pay. Employer-paid health (group cover) is technically free to you — don't count it as premium, but DO count it in cover above."
          example="₹650/month for individual ₹5L cover at age 28"
        >
          <CurrencyInput
            value={insurance.healthPremiumMonthly}
            onChange={(v) => update({ healthPremiumMonthly: v })}
          />
        </Field>
      </div>

      <div className="mt-8 border-l-4 border-accent bg-secondary/40 p-5">
        <p className="font-display text-sm font-semibold tracking-tight">
          The LIC trap
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If your policy has a maturity value, surrender value, or &ldquo;money-back&rdquo;
          benefits — it&apos;s endowment, not term. Returns are typically 4-6%.
          A pure term plan + index fund beats it by ~7%/year. Don&apos;t enter
          endowment cover here — it&apos;s an investment line, not insurance.
        </p>
      </div>
    </div>
  );
}
