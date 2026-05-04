import { describe, expect, it } from "vitest";

import { calculateCashFlow } from "./calculations";
import { compareScenarios } from "./scenarios";
import type { FinancialData } from "./types";

function buildFinancialData(
  overrides: Partial<FinancialData> = {},
): FinancialData {
  return {
    personal: {
      name: "",
      age: 25,
      dependents: 0,
      taxRegime: "New",
      taxBracket: 0,
    },
    income: { salary: 0, sideIncome: 0, otherIncome: 0 },
    expenses: {
      rent: 0,
      groceries: 0,
      utilities: 0,
      mobile: 0,
      transport: 0,
      eatingOut: 0,
      subscriptions: 0,
      healthcare: 0,
      education: 0,
      familySupport: 0,
      other: 0,
    },
    loans: [],
    assets: {
      emergencyFund: 0,
      fixedDeposits: 0,
      recurringDeposits: 0,
      mutualFunds: 0,
      stocks: 0,
      gold: 0,
      providentFund: 0,
    },
    insurance: {
      termCover: 0,
      termPremiumMonthly: 0,
      healthCover: 0,
      healthPremiumMonthly: 0,
    },
    goals: [],
    monthlySavings: { sip: 0, rd: 0, otherSavings: 0 },
    ...overrides,
  };
}

describe("compareScenarios", () => {
  it("returns three scenarios named Your Current, Warikoo Recommended, Aggressive", () => {
    const actual = buildFinancialData({
      income: { salary: 50000, sideIncome: 0, otherIncome: 0 },
    });

    const scenarios = compareScenarios(actual);

    expect(scenarios).toHaveLength(3);
    expect(scenarios.map((s) => s.name)).toEqual([
      "Your Current",
      "Warikoo Recommended",
      "Aggressive",
    ]);
  });

  it("Your Current scenario carries the actual data unchanged", () => {
    const actual = buildFinancialData({
      income: { salary: 75000, sideIncome: 5000, otherIncome: 0 },
      expenses: {
        rent: 18000,
        groceries: 8000,
        utilities: 2000,
        mobile: 1000,
        transport: 4000,
        eatingOut: 3000,
        subscriptions: 500,
        healthcare: 1500,
        education: 0,
        familySupport: 0,
        other: 1000,
      },
    });

    const [current] = compareScenarios(actual);

    expect(current.data).toEqual(actual);
  });

  it("Warikoo Recommended scenario allocates >= 20% of income to savings", () => {
    const actual = buildFinancialData({
      income: { salary: 60000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 30000,
        groceries: 15000,
        utilities: 2000,
        mobile: 1000,
        transport: 4000,
        eatingOut: 5000,
        subscriptions: 0,
        healthcare: 0,
        education: 0,
        familySupport: 0,
        other: 0,
      },
      monthlySavings: { sip: 0, rd: 0, otherSavings: 0 },
    });

    const [, recommended] = compareScenarios(actual);
    const cf = calculateCashFlow(recommended.data);

    expect(cf.savingsRate).toBeGreaterThanOrEqual(0.2);
  });

  it("Aggressive scenario allocates >= 30% of income to savings", () => {
    const actual = buildFinancialData({
      income: { salary: 80000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 25000,
        groceries: 12000,
        utilities: 2500,
        mobile: 1000,
        transport: 5000,
        eatingOut: 8000,
        subscriptions: 1500,
        healthcare: 2000,
        education: 0,
        familySupport: 5000,
        other: 3000,
      },
    });

    const [, , aggressive] = compareScenarios(actual);
    const cf = calculateCashFlow(aggressive.data);

    expect(cf.savingsRate).toBeGreaterThanOrEqual(0.3);
  });

  it("Recommended scenario tops up term cover to >= 10x annual income when dependents exist", () => {
    const actual = buildFinancialData({
      income: { salary: 80000, sideIncome: 0, otherIncome: 0 },
      personal: {
        name: "",
        age: 32,
        dependents: 2,
        taxRegime: "New",
        taxBracket: 30,
      },
      insurance: {
        termCover: 500_000, // 5L — way short of 10x annual = 96L
        termPremiumMonthly: 300,
        healthCover: 300_000,
        healthPremiumMonthly: 500,
      },
    });

    const [, recommended] = compareScenarios(actual);

    const annualIncome = 80000 * 12;
    expect(recommended.data.insurance.termCover).toBeGreaterThanOrEqual(
      annualIncome * 10,
    );
  });

  it("Recommended scenario does NOT inflate term cover when there are no dependents", () => {
    const actual = buildFinancialData({
      income: { salary: 50000, sideIncome: 0, otherIncome: 0 },
      personal: {
        name: "",
        age: 25,
        dependents: 0,
        taxRegime: "New",
        taxBracket: 0,
      },
      insurance: {
        termCover: 500_000,
        termPremiumMonthly: 300,
        healthCover: 300_000,
        healthPremiumMonthly: 500,
      },
    });

    const [, recommended] = compareScenarios(actual);

    expect(recommended.data.insurance.termCover).toBe(500_000);
  });

  it("each scenario carries a complete CalculationOutput with a 0-100 health score", () => {
    const actual = buildFinancialData({
      income: { salary: 60000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 18000,
        groceries: 8000,
        utilities: 2000,
        mobile: 1000,
        transport: 4000,
        eatingOut: 4000,
        subscriptions: 800,
        healthcare: 1500,
        education: 0,
        familySupport: 0,
        other: 1000,
      },
    });

    const scenarios = compareScenarios(actual);

    for (const s of scenarios) {
      expect(s.output).toBeDefined();
      expect(s.output.healthScore.score).toBeGreaterThanOrEqual(0);
      expect(s.output.healthScore.score).toBeLessThanOrEqual(100);
      expect(s.output.healthScore.pillars).toHaveLength(4);
      expect(s.output.cashFlow).toBeDefined();
      expect(Array.isArray(s.output.redFlags)).toBe(true);
      expect(Array.isArray(s.output.loanStrategy)).toBe(true);
    }
  });

  it("ten-year projected corpus increases monotonically: current <= recommended <= aggressive", () => {
    const actual = buildFinancialData({
      income: { salary: 70000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 25000,
        groceries: 10000,
        utilities: 2000,
        mobile: 1000,
        transport: 4000,
        eatingOut: 8000,
        subscriptions: 1000,
        healthcare: 1000,
        education: 0,
        familySupport: 0,
        other: 2000,
      },
      monthlySavings: { sip: 1000, rd: 0, otherSavings: 0 },
    });

    const scenarios = compareScenarios(actual);
    const corpus = scenarios.map((s) => s.tenYearCorpus);

    expect(corpus[0]).toBeLessThanOrEqual(corpus[1]);
    expect(corpus[1]).toBeLessThanOrEqual(corpus[2]);
    // Recommended must beat current with this profile
    expect(corpus[1]).toBeGreaterThan(corpus[0]);
  });

  it("returns three valid scenarios for an empty profile without throwing", () => {
    const empty = buildFinancialData();

    expect(() => compareScenarios(empty)).not.toThrow();

    const scenarios = compareScenarios(empty);
    expect(scenarios).toHaveLength(3);
    for (const s of scenarios) {
      expect(Number.isFinite(s.tenYearCorpus)).toBe(true);
      expect(s.tenYearCorpus).toBeGreaterThanOrEqual(0);
      expect(s.output.healthScore.score).toBeGreaterThanOrEqual(0);
    }
  });
});
