"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field, TotalRow } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { LoanType } from "@/lib/types";

const LOAN_TYPES: { value: LoanType; label: string; tag: string }[] = [
  { value: "Edu", label: "Education", tag: "80E deduction (Old regime)" },
  { value: "Home", label: "Home", tag: "24(b) interest deduction" },
  { value: "Personal", label: "Personal", tag: "Highest rate, kill first" },
  { value: "Car", label: "Car / Vehicle", tag: "Depreciating asset" },
  { value: "Other", label: "Other", tag: "Gold loan, top-up etc." },
];

export function LoansForm() {
  const loans = useFinancialStore((s) => s.data.loans);
  const addLoan = useFinancialStore((s) => s.addLoan);
  const updateLoan = useFinancialStore((s) => s.updateLoan);
  const removeLoan = useFinancialStore((s) => s.removeLoan);

  const totalEmi = loans.reduce((acc, l) => acc + l.monthlyEmi, 0);

  const handleAdd = () => {
    addLoan({
      name: "",
      type: "Personal",
      principal: 0,
      ratePercent: 0,
      monthlyEmi: 0,
    });
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-foreground/30 py-16 text-center">
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          No loans yet — that&apos;s the goal. If you have any active EMIs (credit card,
          personal, car, edu, home) add them so the calculator can prioritize prepayment.
        </p>
        <Button
          onClick={handleAdd}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add First Loan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Add <span className="font-semibold text-foreground">every active EMI</span> —
        credit cards, personal, car, edu, home. Hiding loans skews the prepayment
        strategy. Open your bank app and check standing instructions if unsure.
      </p>

      {loans.map((loan, idx) => (
        <Card key={loan.id} className="border-foreground/15 shadow-none">
          <CardContent className="space-y-5 pt-5">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
              <span className="font-display text-base font-semibold tracking-tight">
                Loan {String(idx + 1).padStart(2, "0")}
              </span>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => removeLoan(loan.id)}
                aria-label="Remove loan"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Loan name"
                hint="A label only you need to recognize."
                doubt="Use the bank name + type. Helps when you have multiple loans."
                example="Edu Loan, Home Loan, Car Loan"
              >
                <Input
                  placeholder="Education Loan"
                  value={loan.name}
                  onChange={(e) => updateLoan(loan.id, { name: e.target.value })}
                />
              </Field>

              <Field
                label="Loan type"
                hint="Affects tax treatment + prepayment priority."
                doubt="Edu = student loan (80E interest deduction in Old regime). Home = home loan (24b deduction). Personal/Car = no tax break, highest priority to kill."
              >
                <Select
                  value={loan.type}
                  onValueChange={(val) => updateLoan(loan.id, { type: val as LoanType })}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex flex-col">
                          <span>{t.label}</span>
                          <span className="text-[11px] text-muted-foreground">{t.tag}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Outstanding principal"
                hint="Current unpaid balance — NOT the original sanctioned amount."
                doubt="Look at your latest EMI receipt or bank app. Find ‘Outstanding Principal’ or ‘Closing Balance’ on the most recent month."
                example="₹1,97,803 (not your original ₹2,90,000 if you've been paying)"
              >
                <CurrencyInput
                  value={loan.principal}
                  onChange={(v) => updateLoan(loan.id, { principal: v })}
                />
              </Field>

              <Field
                label={`Interest rate — ${loan.ratePercent.toFixed(2)}%`}
                hint="Annual interest rate (per year, not per month)."
                doubt="Floating rates change every reset. Use the CURRENT rate on your most recent EMI receipt. Find it on the bank app under loan details."
                example="~11-12% for education loans, ~8-9% for home loans"
              >
                <input
                  type="range"
                  min={0}
                  max={36}
                  step={0.25}
                  value={loan.ratePercent}
                  onChange={(e) => updateLoan(loan.id, { ratePercent: Number(e.target.value) })}
                  className="h-2 w-full cursor-pointer appearance-none rounded-none bg-muted accent-accent"
                />
              </Field>

              <Field
                label="Monthly EMI"
                hint="What auto-debits each month."
                doubt="If you're in moratorium / interest-only phase, put the moratorium amount. Pre-EMI counts."
                example="₹5,200 monthly auto-debit"
                className="md:col-span-2"
              >
                <CurrencyInput
                  value={loan.monthlyEmi}
                  onChange={(v) => updateLoan(loan.id, { monthlyEmi: v })}
                />
              </Field>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-foreground/30"
      >
        <Plus className="mr-1 h-4 w-4" />
        Add another loan
      </Button>

      <TotalRow label="Total monthly EMI" value={totalEmi} accent />
    </div>
  );
}
