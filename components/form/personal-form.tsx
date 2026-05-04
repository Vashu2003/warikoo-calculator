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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field label="Your name" htmlFor="p-name">
        <Input
          id="p-name"
          placeholder="e.g. Aman Sharma"
          value={personal.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </Field>

      <Field label="Age" htmlFor="p-age" hint="Used to calibrate insurance + retirement runway">
        <Input
          id="p-age"
          type="number"
          min={18}
          max={80}
          value={personal.age || ""}
          onChange={(e) => update({ age: Number(e.target.value) || 0 })}
        />
      </Field>

      <Field
        label="Dependents"
        htmlFor="p-dep"
        hint="Spouse, kids, parents you financially support"
      >
        <Input
          id="p-dep"
          type="number"
          min={0}
          max={10}
          value={personal.dependents}
          onChange={(e) => update({ dependents: Number(e.target.value) || 0 })}
        />
      </Field>

      <Field label="Tax regime">
        <div className="flex gap-2">
          {(["New", "Old"] as TaxRegime[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ taxRegime: r })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                personal.taxRegime === r
                  ? "border-transparent text-white"
                  : "border-border bg-background hover:bg-muted"
              }`}
              style={
                personal.taxRegime === r
                  ? { backgroundColor: "var(--color-warikoo-blue)" }
                  : undefined
              }
            >
              {r} Regime
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Marginal tax bracket"
        hint="Highest slab your income hits — informs prepay vs invest math"
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
                {b}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
