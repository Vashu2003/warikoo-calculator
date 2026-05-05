"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";
import { Separator } from "@/components/ui/separator";
import type { Expenses } from "@/lib/types";

interface ExpenseFieldDef {
  key: keyof Expenses;
  label: string;
  hint: string;
  doubt: string;
  example?: string;
}

const ESSENTIALS: ExpenseFieldDef[] = [
  {
    key: "rent",
    label: "Rent",
    hint: "Monthly rent + maintenance + parking + brokerage averaged.",
    doubt: "If you OWN the home, leave this 0 — your home loan EMI goes in the Loans tab. Don't double-count.",
    example: "₹18,000 (rent ₹16k + maintenance ₹2k)",
  },
  {
    key: "groceries",
    label: "Groceries & household",
    hint: "Food, cleaning supplies, daily essentials.",
    doubt: "Includes: monthly grocery delivery apps + kirana store + e-commerce orders for daily-use items. Excludes: eating out.",
    example: "₹8,000 for a couple",
  },
  {
    key: "utilities",
    label: "Utilities & home services",
    hint: "Electricity + water + gas + maid + cook.",
    doubt: "Society maintenance goes in Rent. NOT mobile/internet (separate line).",
    example: "₹3,500 (power ₹2k + maid ₹1k + gas ₹500)",
  },
  {
    key: "mobile",
    label: "Mobile & internet",
    hint: "Postpaid + home wifi + OTT bundle prepaid recharges.",
    doubt: "Streaming subscriptions go in 'Subscriptions' below. Just connectivity here.",
    example: "₹1,200 (postpaid mobile ₹400 + home wifi ₹800)",
  },
  {
    key: "transport",
    label: "Transport / commute",
    hint: "Petrol + cab apps + metro + monthly passes averaged.",
    doubt: "Vacation flights/trains go in Other. Daily/weekly commute only here.",
    example: "₹4,000 (petrol ₹3k + cabs ₹1k)",
  },
  {
    key: "healthcare",
    label: "Healthcare (out-of-pocket)",
    hint: "Doctor visits + medicines + dental + optical.",
    doubt: "NOT health insurance premium — that's in the Insurance tab. Just direct medical spend you pay.",
    example: "₹1,500 monthly average",
  },
];

const LIFESTYLE: ExpenseFieldDef[] = [
  {
    key: "eatingOut",
    label: "Eating out & food delivery",
    hint: "Restaurants + food-delivery apps + cafes + bar bills.",
    doubt: "This is THE leak everyone underestimates. Open your last 3 months of UPI history if unsure.",
    example: "₹5,000 if you order in 2x/week + restaurant 2x/month",
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    hint: "OTT + music + cloud storage + productivity apps + gym + paid apps.",
    doubt: "Add ALL of them. The £/$ ones convert at current rate. Annual subs ÷ 12.",
    example: "₹1,500 across video + music + AI + cloud + sports streaming",
  },
  {
    key: "education",
    label: "Courses / education",
    hint: "Online courses + certifications + books + kids' school fees.",
    doubt: "Annual school fees ÷ 12. One-time courses ÷ 12 if taken in last year. Skip if zero.",
    example: "₹4,000 if kid's school is ₹48k/year",
  },
  {
    key: "familySupport",
    label: "Family support",
    hint: "Money sent to parents / siblings / dependents.",
    doubt: "Be honest — this is real and substantial for many Indians. Helps the calculator reflect your actual cash flow.",
    example: "₹10,000 sent home monthly",
  },
  {
    key: "other",
    label: "Other / discretionary",
    hint: "Catch-all: shopping, gifts, donations, hobbies, vacations averaged.",
    doubt: "Annual vacations ÷ 12. Festival/wedding spending ÷ 12. Don't leave it at 0 unless you're truly minimalist.",
    example: "₹3,000 averaged across the year",
  },
];

export function ExpensesForm() {
  const expenses = useFinancialStore((s) => s.data.expenses);
  const update = useFinancialStore((s) => s.updateExpenses);

  const total = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Monthly spend by category. Open your last 3 months of bank/UPI statements
        and average — most people <span className="font-semibold text-foreground">underestimate by 20-30%</span>.
        That gap is what kills financial plans.
      </p>

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Essentials — Needs
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {ESSENTIALS.map(({ key, label, hint, doubt, example }) => (
          <Field
            key={key}
            label={label}
            hint={hint}
            doubt={doubt}
            example={example}
          >
            <CurrencyInput
              value={expenses[key]}
              onChange={(v) => update({ [key]: v } as Partial<Expenses>)}
            />
          </Field>
        ))}
      </div>

      <Separator className="my-8" />

      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Lifestyle — Wants
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {LIFESTYLE.map(({ key, label, hint, doubt, example }) => (
          <Field
            key={key}
            label={label}
            hint={hint}
            doubt={doubt}
            example={example}
          >
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
