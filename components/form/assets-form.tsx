"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";
import { Separator } from "@/components/ui/separator";
import type { Assets } from "@/lib/types";

interface AssetFieldDef {
  key: keyof Assets;
  label: string;
  hint: string;
  doubt: string;
  example?: string;
}

const LIQUID: AssetFieldDef[] = [
  {
    key: "emergencyFund",
    label: "Emergency Fund",
    hint: "Money you can withdraw in 24 hours WITHOUT losing principal.",
    doubt: "Counts: savings account balance, sweep-in FDs, liquid mutual funds. Doesn't count: long-lock FDs, MF SIPs, equity. The point is liquidity in a crisis.",
    example: "₹70,000 if that's your savings account buffer",
  },
  {
    key: "fixedDeposits",
    label: "Fixed Deposits (long-term)",
    hint: "FDs with lock-in > 1 year. NOT your EF cushion.",
    doubt: "If a deposit is part of your EF, it's already counted above. Don't double-count. Tax-saver FDs (5y) count here.",
    example: "₹2,00,000 in a 3-year senior citizen FD",
  },
  {
    key: "recurringDeposits",
    label: "Recurring Deposits — current value",
    hint: "TOTAL accumulated, NOT the monthly contribution.",
    doubt: "Current balance including interest accrued so far. Monthly RD contributions go in the 'Monthly Savings' section.",
    example: "₹36,000 if you've contributed ₹3k × 12 months",
  },
];

const INVESTMENTS: AssetFieldDef[] = [
  {
    key: "mutualFunds",
    label: "Mutual Funds — current NAV value",
    hint: "Total current value across all your MF folios.",
    doubt: "Open your investment app or MF Central. Sum of current values, NOT the amount invested. If you have ₹2L invested but it's grown to ₹3.5L → put ₹3,50,000.",
    example: "₹3,50,000 across Index + Mid Cap + Small Cap",
  },
  {
    key: "stocks",
    label: "Direct stocks",
    hint: "Current portfolio value, NOT what you bought at.",
    doubt: "Open your stock broker app. Use the live portfolio value. Skip if you don't directly own stocks (MFs are separate).",
    example: "₹80,000 current value of your direct equity",
  },
  {
    key: "gold",
    label: "Gold & precious metals",
    hint: "Physical gold + SGB + Gold ETF + digital gold.",
    doubt: "Use today's price (~₹7,500/gram for 24K). Jewelry: weight × current rate, deduct 10% for making charges. Skip your wedding heirloom — it's not really liquid.",
    example: "₹50,000 (10g coin at current rate)",
  },
  {
    key: "providentFund",
    label: "EPF / PPF — accumulated balance",
    hint: "Total contributions + interest accrued.",
    doubt: "Check UAN portal for EPF, PPF passbook for PPF. Includes both employer + your share. NPS goes here too.",
    example: "₹2,40,000 from 4 years of EPF contributions",
  },
];

export function AssetsForm() {
  const assets = useFinancialStore((s) => s.data.assets);
  const update = useFinancialStore((s) => s.updateAssets);
  const monthlySavings = useFinancialStore((s) => s.data.monthlySavings);
  const updateMonthlySavings = useFinancialStore((s) => s.updateMonthlySavings);

  const total = (Object.values(assets) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Current value (today) of what you own. Don&apos;t add the home you live
        in (it&apos;s not liquid wealth). Don&apos;t add LIC endowment surrender values
        (those are insurance, not investment).
      </p>

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Liquid &amp; safe — your floor
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {LIQUID.map(({ key, label, hint, doubt, example }) => (
          <Field
            key={key}
            label={label}
            hint={hint}
            doubt={doubt}
            example={example}
          >
            <CurrencyInput
              value={assets[key]}
              onChange={(v) => update({ [key]: v } as Partial<Assets>)}
            />
          </Field>
        ))}
      </div>

      <Separator className="my-8" />

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Investments — your wealth
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {INVESTMENTS.map(({ key, label, hint, doubt, example }) => (
          <Field
            key={key}
            label={label}
            hint={hint}
            doubt={doubt}
            example={example}
          >
            <CurrencyInput
              value={assets[key]}
              onChange={(v) => update({ [key]: v } as Partial<Assets>)}
            />
          </Field>
        ))}
      </div>

      <TotalRow label="Total assets" value={total} accent />

      <Separator className="my-8" />

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Currently saving — monthly
      </h3>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        What you actively put away each month. This is what compounds. The
        projections will use these numbers.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Field
          label="SIP — mutual funds"
          hint="Total monthly SIPs across all funds."
          doubt="Sum of every SIP debit on your bank statement. If you SIP weekly, multiply by ~4.33."
          example="₹15,000 across 3 funds"
        >
          <CurrencyInput
            value={monthlySavings.sip}
            onChange={(v) => updateMonthlySavings({ sip: v })}
            placeholder="0"
          />
        </Field>

        <Field
          label="RD — recurring deposits"
          hint="Monthly contribution to bank RDs."
          doubt="Just the contribution amount, NOT accumulated balance (that's in the Liquid section above)."
          example="₹3,000 monthly RD"
        >
          <CurrencyInput
            value={monthlySavings.rd}
            onChange={(v) => updateMonthlySavings({ rd: v })}
            placeholder="0"
          />
        </Field>

        <Field
          label="Other monthly savings"
          hint="Direct equity buys, gold purchases, etc."
          doubt="Money you actively save but isn't a SIP or RD. Skip if zero."
          example="₹2,000 monthly into Digital Gold"
        >
          <CurrencyInput
            value={monthlySavings.otherSavings}
            onChange={(v) => updateMonthlySavings({ otherSavings: v })}
            placeholder="0"
          />
        </Field>
      </div>

      <TotalRow
        label="Total monthly savings"
        value={
          monthlySavings.sip + monthlySavings.rd + monthlySavings.otherSavings
        }
      />
    </div>
  );
}
