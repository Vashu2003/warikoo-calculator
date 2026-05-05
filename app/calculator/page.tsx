"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Calculator as CalculatorIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useFinancialStore } from "@/lib/store";
import { demoFinancialData } from "@/lib/demo-data";
import { ThemeToggle } from "@/components/shared/theme-toggle";

import { PersonalForm } from "@/components/form/personal-form";
import { IncomeForm } from "@/components/form/income-form";
import { ExpensesForm } from "@/components/form/expenses-form";
import { LoansForm } from "@/components/form/loans-form";
import { AssetsForm } from "@/components/form/assets-form";
import { InsuranceForm } from "@/components/form/insurance-form";
import { GoalsForm } from "@/components/form/goals-form";

const sections = [
  { id: "personal", label: "Personal", Component: PersonalForm },
  { id: "income", label: "Income", Component: IncomeForm },
  { id: "expenses", label: "Expenses", Component: ExpensesForm },
  { id: "loans", label: "Loans", Component: LoansForm },
  { id: "assets", label: "Assets", Component: AssetsForm },
  { id: "insurance", label: "Insurance", Component: InsuranceForm },
  { id: "goals", label: "Goals", Component: GoalsForm },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function CalculatorPage() {
  const router = useRouter();
  const reset = useFinancialStore((s) => s.reset);
  const data = useFinancialStore((s) => s.data);

  const [activeTab, setActiveTab] = React.useState<SectionId>("personal");

  const ids = sections.map((s) => s.id);
  const currentIdx = ids.indexOf(activeTab);
  const isLast = currentIdx === sections.length - 1;
  const isFirst = currentIdx === 0;
  const nextSection = !isLast ? sections[currentIdx + 1] : null;
  const prevSection = !isFirst ? sections[currentIdx - 1] : null;

  const totalIncome =
    data.income.salary + data.income.sideIncome + data.income.otherIncome;
  const hasMinimumData = totalIncome > 0;

  const handleDemo = () => {
    useFinancialStore.setState({ data: demoFinancialData });
    toast.success("Demo data loaded — switch tabs to see all sections.");
  };

  const goNext = () => {
    if (nextSection) {
      setActiveTab(nextSection.id);
      // scroll to top of form for clarity
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (prevSection) {
      setActiveTab(prevSection.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCalculate = () => {
    if (!hasMinimumData) {
      toast.error("Add your income first — at least a salary number.", {
        description: "Calculator needs income to compute anything meaningful.",
        action: {
          label: "Go to Income",
          onClick: () => setActiveTab("income"),
        },
      });
      return;
    }
    const t = toast.loading("Crunching your numbers...");
    setTimeout(() => {
      toast.success("Done.", { id: t });
      router.push("/results");
    }, 500);
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-base font-semibold md:text-lg">Calculator</h1>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={handleDemo}>
              <Sparkles className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Demo</span>
            </Button>

            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="outline" size="sm">
                    <RotateCcw className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset all data?</DialogTitle>
                  <DialogDescription>
                    This wipes everything you&apos;ve entered. There&apos;s no undo.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <DialogClose
                    render={
                      <Button
                        variant="destructive"
                        onClick={() => {
                          reset();
                          setActiveTab("personal");
                          toast.success("All data cleared.");
                        }}
                      >
                        Yes, reset everything
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-[0.12em] text-muted-foreground">
            Step {String(currentIdx + 1).padStart(2, "0")} of{" "}
            {String(sections.length).padStart(2, "0")} ·{" "}
            <span className="text-foreground">
              {sections[currentIdx].label}
            </span>
          </span>
          <span className="hidden font-mono uppercase tracking-[0.12em] text-muted-foreground sm:inline">
            Click any tab to jump
          </span>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as SectionId)}
          className="w-full"
        >
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
            {sections.map((s, i) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex-1 min-w-[80px] gap-1.5"
              >
                <span className="font-mono text-[10px] opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map(({ id, label, Component }) => (
            <TabsContent key={id} value={id}>
              <Card className="border-foreground/15 shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-2xl tracking-tight">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer nav: Previous · (gap) · Next or Calculate */}
        <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={goPrev}
            disabled={isFirst}
            className="border-foreground/30"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {prevSection ? `Back to ${prevSection.label}` : "Back"}
          </Button>

          {!isLast ? (
            <Button
              size="lg"
              onClick={goNext}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Next: {nextSection?.label}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleCalculate}
              disabled={!hasMinimumData}
              className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              title={
                hasMinimumData
                  ? "Run my Warikoo Health Score"
                  : "Add your income on the Income tab first"
              }
            >
              <CalculatorIcon className="mr-1.5 h-4 w-4" />
              Run my numbers
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {!hasMinimumData && isLast && (
          <p className="mt-3 text-right text-xs text-accent">
            ↳ Add at least your salary in the Income tab to enable Calculate.
          </p>
        )}
      </div>
    </main>
  );
}
