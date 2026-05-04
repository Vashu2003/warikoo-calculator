"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Edit3, Calculator, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { useFinancialStore } from "@/lib/store";
import { calculateAll } from "@/lib/calculations";
import { exportResultsToPdf } from "@/lib/pdf-export";

import { HealthScoreCard } from "@/components/results/health-score-card";
import { PillarsGrid } from "@/components/results/pillars-grid";
import { RedFlagsList } from "@/components/results/red-flags-list";
import { CashFlowCard } from "@/components/results/cash-flow-card";
import { LoanStrategyCard } from "@/components/results/loan-strategy-card";
import { SipProjectionsChart } from "@/components/results/sip-projections-chart";
import { GoalsTable } from "@/components/results/goals-table";
import { ActionPlanCard } from "@/components/results/action-plan-card";
import { ThemeToggle } from "@/components/shared/theme-toggle";

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </h2>
  );
}

export default function ResultsPage() {
  const data = useFinancialStore((s) => s.data);
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = React.useState(false);

  // Detect "no data" state — empty calculator
  const hasNoData =
    data.income.salary === 0 &&
    data.income.sideIncome === 0 &&
    data.income.otherIncome === 0 &&
    data.loans.length === 0 &&
    data.goals.length === 0;

  const output = React.useMemo(() => calculateAll(data), [data]);

  const handleExportPdf = React.useCallback(async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    const t = toast.loading("Generating your PDF report...");
    try {
      await exportResultsToPdf(reportRef.current, "warikoo-health-report.pdf");
      toast.success("Report downloaded.", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Could not export. Try again.", { id: t });
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  const handleShare = React.useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Warikoo Health Score",
          text: `My Warikoo Score: ${output.healthScore.score}/100 — ${output.healthScore.verdict}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {
      // user cancelled — silent
    }
  }, [output.healthScore]);

  if (hasNoData) {
    return (
      <main className="flex flex-1 flex-col">
        <div className="border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
            <Link href="/calculator">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-base font-semibold md:text-lg">Your Results</h1>
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <Calculator className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">No data yet</h2>
          <p className="text-sm text-muted-foreground">
            Fill in your finances in the calculator first — we&apos;ll crunch the
            numbers and show your Warikoo Health Score, red flags, and action plan.
          </p>
          <Link href="/calculator">
            <Button
              size="lg"
              style={{
                backgroundColor: "var(--color-warikoo-blue)",
                color: "white",
              }}
            >
              Start the Calculator
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 md:px-6">
          <Link href="/calculator">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Edit inputs</span>
            </Button>
          </Link>
          <h1 className="text-base font-semibold md:text-lg">Your Results</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share">
              <Share2 className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1 h-4 w-4" />
              )}
              <span className="hidden sm:inline">{exporting ? "Exporting..." : "PDF"}</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div
        ref={reportRef}
        className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-4 py-6 md:px-6 md:py-8"
      >
        {/* Health Score */}
        <section>
          <HealthScoreCard score={output.healthScore} />
        </section>

        {/* Pillars */}
        <section>
          <SectionHeading>The 4 Pillars</SectionHeading>
          <PillarsGrid pillars={output.healthScore.pillars} />
        </section>

        {/* Red Flags */}
        <section>
          <SectionHeading>Red Flags</SectionHeading>
          <RedFlagsList flags={output.redFlags} />
        </section>

        {/* Cash Flow */}
        <section>
          <SectionHeading>Cash Flow</SectionHeading>
          <CashFlowCard cashFlow={output.cashFlow} />
        </section>

        {/* Loan Strategy */}
        <section>
          <SectionHeading>Loan Strategy</SectionHeading>
          <LoanStrategyCard strategy={output.loanStrategy} loans={data.loans} />
        </section>

        {/* SIP Projections */}
        <section>
          <SectionHeading>SIP Projections</SectionHeading>
          <SipProjectionsChart currentSip={data.monthlySavings.sip} />
        </section>

        {/* Goals */}
        <section>
          <SectionHeading>Goals</SectionHeading>
          <GoalsTable feasibility={output.goalFeasibility} goals={data.goals} />
        </section>

        {/* Action Plan */}
        <section>
          <SectionHeading>Your Plan</SectionHeading>
          <ActionPlanCard data={data} output={output} />
        </section>

        {/* Footer */}
        <Card>
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
            <div>
              <h3 className="font-semibold">Next steps</h3>
              <p className="text-sm text-muted-foreground">
                Update your numbers, export a PDF, or share with a friend.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/calculator">
                <Button variant="outline">
                  <Edit3 className="mr-1 h-4 w-4" />
                  Edit My Data
                </Button>
              </Link>
              <Button
                onClick={handleExportPdf}
                disabled={exporting}
                style={{
                  backgroundColor: "var(--color-warikoo-blue)",
                  color: "white",
                }}
              >
                {exporting ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-1 h-4 w-4" />
                )}
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
