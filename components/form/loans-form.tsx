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

const LOAN_TYPES: LoanType[] = ["Edu", "Home", "Personal", "Car", "Other"];

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
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          No loans yet — that&apos;s great. Add one if you have any active EMIs.
        </p>
        <Button onClick={handleAdd} style={{ backgroundColor: "var(--color-warikoo-blue)", color: "white" }}>
          <Plus className="mr-1 h-4 w-4" />
          Add First Loan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Add every active EMI — credit card, personal, car, edu, home. Hide nothing.
      </p>

      {loans.map((loan, idx) => (
        <Card key={loan.id} size="sm" className="border border-border/60">
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Loan #{idx + 1}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Name">
                <Input
                  placeholder="e.g. Education Loan (ICICI)"
                  value={loan.name}
                  onChange={(e) => updateLoan(loan.id, { name: e.target.value })}
                />
              </Field>

              <Field label="Type">
                <Select
                  value={loan.type}
                  onValueChange={(val) => updateLoan(loan.id, { type: val as LoanType })}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Outstanding principal">
                <CurrencyInput
                  value={loan.principal}
                  onChange={(v) => updateLoan(loan.id, { principal: v })}
                />
              </Field>

              <Field label={`Interest rate — ${loan.ratePercent.toFixed(1)}%`}>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={loan.ratePercent}
                  onChange={(e) => updateLoan(loan.id, { ratePercent: Number(e.target.value) })}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-warikoo-blue)]"
                />
              </Field>

              <Field label="Monthly EMI" className="md:col-span-2">
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
        className="w-full border-dashed"
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Loan
      </Button>

      <TotalRow label="Total monthly EMI" value={totalEmi} accent />
    </div>
  );
}
