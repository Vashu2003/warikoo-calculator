/**
 * Compare Scenarios — generates Current vs Warikoo Recommended vs Aggressive
 * synthetic projections so users can see the gap between where they are and
 * where they could be.
 *
 * Pure functions. Same constraints as lib/calculations.ts.
 */

import { calculateAll } from "./calculations";
import {
  EQUITY_CAGR,
  HEALTH_COVER_FLOOR,
  HEALTH_COVER_WITH_DEPENDENTS,
  TERM_COVER_INCOME_MULTIPLE,
  fvSipWithStepup,
} from "./finance-math";
import type { CalculationOutput, FinancialData } from "./types";

export interface Scenario {
  name: "Your Current" | "Warikoo Recommended" | "Aggressive";
  data: FinancialData;
  output: CalculationOutput;
  /** Projected SIP/MF corpus after 10 years at 12% CAGR with 10% step-up. */
  tenYearCorpus: number;
}

const NEEDS_KEYS = [
  "rent",
  "groceries",
  "utilities",
  "mobile",
  "transport",
  "healthcare",
] as const;

const WANTS_KEYS = [
  "eatingOut",
  "subscriptions",
  "education",
  "familySupport",
  "other",
] as const;

function totalIncome(data: FinancialData): number {
  return data.income.salary + data.income.sideIncome + data.income.otherIncome;
}

function totalEmis(data: FinancialData): number {
  return data.loans.reduce((acc, l) => acc + l.monthlyEmi, 0);
}

/**
 * Build a scenario with target savings rate. We trim WANTS expenses first
 * (eating out, subscriptions, etc.), preserving needs. If wants alone can't
 * close the gap, we shrink needs proportionally as a last resort. Then the
 * surplus becomes monthly SIP.
 */
function rebalance(actual: FinancialData, targetSavingsRate: number): FinancialData {
  const income = totalIncome(actual);
  const emis = totalEmis(actual);
  if (income <= 0) return actual;

  const targetSavings = income * targetSavingsRate;
  const e = actual.expenses;
  const currentNeeds = NEEDS_KEYS.reduce((s, k) => s + e[k], 0);
  const currentWants = WANTS_KEYS.reduce((s, k) => s + e[k], 0);

  // Available for expenses after EMIs and target savings
  const expenseBudget = Math.max(0, income - emis - targetSavings);

  let newNeeds = currentNeeds;
  let newWants = currentWants;

  if (currentNeeds + currentWants <= expenseBudget) {
    // Already within budget — no trimming needed
  } else if (currentNeeds <= expenseBudget) {
    // Trim wants down so total fits the budget
    newWants = expenseBudget - currentNeeds;
  } else {
    // Even needs alone exceed budget — proportionally shrink needs, zero wants
    newNeeds = expenseBudget;
    newWants = 0;
  }

  const needsScale = currentNeeds > 0 ? newNeeds / currentNeeds : 0;
  const wantsScale = currentWants > 0 ? newWants / currentWants : 0;

  // Floor (not round) so the cumulative rounding error always favours
  // savings — keeps actual savings rate >= target even after integer ₹ display.
  const roundedExpenses: FinancialData["expenses"] = {
    rent: Math.floor(e.rent * needsScale),
    groceries: Math.floor(e.groceries * needsScale),
    utilities: Math.floor(e.utilities * needsScale),
    mobile: Math.floor(e.mobile * needsScale),
    transport: Math.floor(e.transport * needsScale),
    healthcare: Math.floor(e.healthcare * needsScale),
    eatingOut: Math.floor(e.eatingOut * wantsScale),
    subscriptions: Math.floor(e.subscriptions * wantsScale),
    education: Math.floor(e.education * wantsScale),
    familySupport: Math.floor(e.familySupport * wantsScale),
    other: Math.floor(e.other * wantsScale),
  };

  const actualSpend =
    Object.values(roundedExpenses).reduce((s, v) => s + v, 0) + emis;
  const newSavings = Math.max(0, income - actualSpend);

  const annualIncome = income * 12;
  const recommendedTermCover =
    actual.personal.dependents > 0
      ? Math.max(
          actual.insurance.termCover,
          annualIncome * TERM_COVER_INCOME_MULTIPLE,
        )
      : actual.insurance.termCover;
  const recommendedHealthCover = Math.max(
    actual.insurance.healthCover,
    actual.personal.dependents > 0
      ? HEALTH_COVER_WITH_DEPENDENTS
      : HEALTH_COVER_FLOOR,
  );

  return {
    ...actual,
    expenses: roundedExpenses,
    insurance: {
      ...actual.insurance,
      termCover: recommendedTermCover,
      healthCover: recommendedHealthCover,
    },
    monthlySavings: {
      sip: newSavings,
      rd: 0,
      otherSavings: 0,
    },
  };
}

export function compareScenarios(actual: FinancialData): Scenario[] {
  const datasets: Array<[Scenario["name"], FinancialData]> = [
    ["Your Current", actual],
    ["Warikoo Recommended", rebalance(actual, 0.2)],
    ["Aggressive", rebalance(actual, 0.3)],
  ];

  return datasets.map(([name, data]) => {
    const monthlySip =
      data.monthlySavings.sip +
      data.monthlySavings.rd +
      data.monthlySavings.otherSavings;
    return {
      name,
      data,
      output: calculateAll(data),
      tenYearCorpus: Math.round(fvSipWithStepup(monthlySip, EQUITY_CAGR, 10)),
    };
  });
}
