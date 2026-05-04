"use client";

import { useFinancialStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/shared/field";
import type { TaxRegime } from "@/lib/types";

const TAX_BRACKETS = [0, 5, 10, 15, 20, 30] as const;

export function PersonalForm() {
  const personal = useFinancialStore((s) => s.data.personal);
  const update = useFinancialStore((s) => s.updatePersonal);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field
        label="Your name"
        htmlFor="p-name"
        hint="Just for the report — stays in your browser."
        doubt="Use full name, nickname, or skip — doesn't affect math."
      >
        <Input
          id="p-name"
          placeholder="e.g. Aman Sharma"
          value={personal.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </Field>

      <Field
        label="Age"
        htmlFor="p-age"
        hint="Affects insurance + retirement runway calculations."
        doubt="Your CURRENT age in years. Round down (28y 6mo = 28)."
        example="28"
      >
        <Input
          id="p-age"
          type="number"
          min={18}
          max={80}
          inputMode="numeric"
          value={personal.age || ""}
          onChange={(e) => update({ age: Number(e.target.value) || 0 })}
        />
      </Field>

      <Field
        label="Dependents"
        htmlFor="p-dep"
        hint="People who depend on YOUR income."
        doubt="Count: spouse (if not earning), kids, retired parents you support. Don't count: roommates, working spouse, friends."
        example="0 if single & no parents to support"
      >
        <Input
          id="p-dep"
          type="number"
          min={0}
          max={10}
          inputMode="numeric"
          value={personal.dependents}
          onChange={(e) => update({ dependents: Number(e.target.value) || 0 })}
        />
      </Field>

      <Field
        label="Tax regime"
        hint="Pick whichever you actually file."
        doubt="Old: itemized deductions (80C, 80E, HRA). New: lower base rates, fewer deductions. If unsure, check Form 16 or your CA."
      >
        <div className="flex gap-2">
          {(["New", "Old"] as TaxRegime[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ taxRegime: r })}
              className={`flex-1 border px-3 py-2 text-sm font-medium transition-colors ${
                personal.taxRegime === r
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {r} Regime
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Marginal tax bracket"
        hint="Your highest tax slab. Drives 80E benefit calc for education loans."
        doubt="Old regime: 0/5/20/30%. New regime: 0/5/10/15/20/30%. Pick the rate on your TOP rupee of income, not your average rate."
        example="20% if your annual taxable is ₹10-15L"
        className="md:col-span-2"
      >
        <Select
          value={String(personal.taxBracket)}
          onValueChange={(val) => update({ taxBracket: Number(val) })}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Select bracket" />
          </SelectTrigger>
          <SelectContent>
            {TAX_BRACKETS.map((b) => (
              <SelectItem key={b} value={String(b)}>
                {b}% {b === 0 ? "(below taxable threshold)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
