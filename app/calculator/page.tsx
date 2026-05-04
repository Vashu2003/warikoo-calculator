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
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
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

export default function CalculatorPage() {
  const router = useRouter();
  const reset = useFinancialStore((s) => s.reset);

  const handleDemo = () => {
    useFinancialStore.setState({ data: demoFinancialData });
    toast.success("Demo data loaded — switch tabs to see all sections.");
  };

  const handleCalculate = () => {
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
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="flex-1 min-w-[80px]">
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map(({ id, label, Component }) => (
            <TabsContent key={id} value={id}>
              <Card>
                <CardHeader>
                  <CardTitle>{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={handleCalculate}
            className="shadow-lg"
            style={{
              backgroundColor: "var(--color-warikoo-blue)",
              color: "white",
              boxShadow: "0 10px 25px -5px rgba(31, 78, 120, 0.25)",
            }}
          >
            Calculate
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
