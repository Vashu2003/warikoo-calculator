"use client";

import { useFinancialStore } from "@/lib/store";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { goalTemplates } from "@/lib/demo-data";

export function GoalsForm() {
  const goals = useFinancialStore((s) => s.data.goals);
  const addGoal = useFinancialStore((s) => s.addGoal);
  const updateGoal = useFinancialStore((s) => s.updateGoal);
  const removeGoal = useFinancialStore((s) => s.removeGoal);

  const currentYear = new Date().getFullYear();

  const handleAddBlank = () => {
    addGoal({
      name: "",
      currentCost: 0,
      inflationPercent: 6,
      targetYear: currentYear + 5,
      alreadySaved: 0,
    });
  };

  const handleAddTemplate = (template: (typeof goalTemplates)[number]) => {
    addGoal({
      name: template.name,
      currentCost: template.currentCost,
      inflationPercent: template.inflationPercent,
      targetYear: currentYear + template.yearsFromNow,
      alreadySaved: 0,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Anything you&apos;re saving FOR. We&apos;ll inflate the cost to your target year and
        compute the SIP needed to get there.
      </p>

      {/* Quick-add templates */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Quick add
        </div>
        <div className="flex flex-wrap gap-2">
          {goalTemplates.map((t) => (
            <Button
              key={t.name}
              variant="outline"
              size="sm"
              onClick={() => handleAddTemplate(t)}
            >
              + {t.name}
            </Button>
          ))}
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            No goals yet. Use a quick-add above or build a custom one.
          </p>
          <Button
            onClick={handleAddBlank}
            style={{ backgroundColor: "var(--color-warikoo-blue)", color: "white" }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Custom Goal
          </Button>
        </div>
      ) : (
        <>
          {goals.map((goal, idx) => (
            <Card key={goal.id} size="sm" className="border border-border/60">
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Goal #{idx + 1}
                  </span>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => removeGoal(goal.id)}
                    aria-label="Remove goal"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Goal name" className="md:col-span-2">
                    <Input
                      placeholder="e.g. Home Down Payment"
                      value={goal.name}
                      onChange={(e) => updateGoal(goal.id, { name: e.target.value })}
                    />
                  </Field>

                  <Field label="Cost today">
                    <CurrencyInput
                      value={goal.currentCost}
                      onChange={(v) => updateGoal(goal.id, { currentCost: v })}
                    />
                  </Field>

                  <Field label={`Inflation — ${goal.inflationPercent}%`}>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      step={1}
                      value={goal.inflationPercent}
                      onChange={(e) =>
                        updateGoal(goal.id, { inflationPercent: Number(e.target.value) })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-warikoo-blue)]"
                    />
                  </Field>

                  <Field
                    label="Target year"
                    hint={`${Math.max(0, goal.targetYear - currentYear)} years from now`}
                  >
                    <Input
                      type="number"
                      min={currentYear + 1}
                      max={currentYear + 50}
                      value={goal.targetYear || ""}
                      onChange={(e) =>
                        updateGoal(goal.id, { targetYear: Number(e.target.value) || currentYear + 1 })
                      }
                    />
                  </Field>

                  <Field label="Already saved">
                    <CurrencyInput
                      value={goal.alreadySaved}
                      onChange={(v) => updateGoal(goal.id, { alreadySaved: v })}
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={handleAddBlank} className="w-full border-dashed">
            <Plus className="mr-1 h-4 w-4" />
            Add Custom Goal
          </Button>
        </>
      )}
    </div>
  );
}
