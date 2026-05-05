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
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Anything you&apos;re saving FOR — bike, home, marriage, retirement.
        We inflate today&apos;s cost to your target year and compute the monthly
        SIP needed at 8% (short-term) or 12% (long-term) returns.
      </p>

      {/* Quick-add templates */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          <Sparkles className="h-3 w-3" /> Quick-add typical goals
        </div>
        <div className="flex flex-wrap gap-2">
          {goalTemplates.map((t) => (
            <Button
              key={t.name}
              variant="outline"
              size="sm"
              onClick={() => handleAddTemplate(t)}
              className="border-foreground/20"
            >
              + {t.name}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Click adds a pre-filled goal. Edit cost / year after.
        </p>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-foreground/30 py-16 text-center">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            No goals yet. Use a quick-add above (recommended) or build a custom one.
          </p>
          <Button
            onClick={handleAddBlank}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add custom goal
          </Button>
        </div>
      ) : (
        <>
          {goals.map((goal, idx) => (
            <Card key={goal.id} className="border-foreground/15 shadow-none">
              <CardContent className="space-y-5 pt-5">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                  <span className="font-display text-base font-semibold tracking-tight">
                    Goal {String(idx + 1).padStart(2, "0")}
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

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field
                    label="Goal name"
                    hint="Be specific — concrete goals get funded more often than vague ones."
                    doubt="‘Trip to Japan in summer’ beats ‘Vacation’. ‘House down payment in your city’ beats ‘House’."
                    example="Home down payment, parents' medical fund, premium bike"
                    className="md:col-span-2"
                  >
                    <Input
                      placeholder="Home Down Payment"
                      value={goal.name}
                      onChange={(e) => updateGoal(goal.id, { name: e.target.value })}
                    />
                  </Field>

                  <Field
                    label="Cost today"
                    hint="What this would cost RIGHT NOW. Don't try to inflate it yourself."
                    doubt="Today's price tag, today's quote. The calculator will inflate it forward — don't do it twice."
                    example="₹40L for a tier-1 city home down payment today"
                  >
                    <CurrencyInput
                      value={goal.currentCost}
                      onChange={(v) => updateGoal(goal.id, { currentCost: v })}
                    />
                  </Field>

                  <Field
                    label={`Inflation — ${goal.inflationPercent}% per year`}
                    hint="How fast prices in this category rise."
                    doubt="Vehicles 5-6%. Real estate 6-8%. Education 8-10%. General CPI 6%. Healthcare 10-12%. Wedding/jewelry 6-8%. Vacation 5-7%."
                    example="7% for real estate, 6% for vehicles"
                  >
                    <input
                      type="range"
                      min={0}
                      max={15}
                      step={1}
                      value={goal.inflationPercent}
                      onChange={(e) =>
                        updateGoal(goal.id, { inflationPercent: Number(e.target.value) })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-none bg-muted accent-accent"
                    />
                  </Field>

                  <Field
                    label="Target year"
                    hint={`${Math.max(0, goal.targetYear - currentYear)} year${
                      goal.targetYear - currentYear === 1 ? "" : "s"
                    } from now`}
                    doubt="Be realistic. Don't say 'next year' if you're nowhere close — the calculator will mark it NOT FEASIBLE. Pick the year you'd actually buy/use this."
                    example={`${currentYear + 5} for a typical 5-year goal`}
                  >
                    <Input
                      type="number"
                      min={currentYear + 1}
                      max={currentYear + 50}
                      inputMode="numeric"
                      value={goal.targetYear || ""}
                      onChange={(e) =>
                        updateGoal(goal.id, {
                          targetYear: Number(e.target.value) || currentYear + 1,
                        })
                      }
                    />
                  </Field>

                  <Field
                    label="Already saved"
                    hint="Earmarked savings for THIS specific goal."
                    doubt="If you have a generic ₹5L savings split across 3 goals, allocate roughly. Skip if it's mixed with EF or general investments — those are tracked in Assets tab."
                    example="₹2,00,000 in a separate goal-specific FD"
                  >
                    <CurrencyInput
                      value={goal.alreadySaved}
                      onChange={(v) => updateGoal(goal.id, { alreadySaved: v })}
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={handleAddBlank}
            className="w-full border-dashed border-foreground/30"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add custom goal
          </Button>
        </>
      )}
    </div>
  );
}
