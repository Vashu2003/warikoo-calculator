import { describe, expect, it } from "vitest";

import {
  calculateAll,
  calculateCashFlow,
  calculateGoalFeasibility,
  calculateHealthScore,
  calculateLoanStrategy,
  calculatePillars,
  calculateRedFlags,
  calculateSipProjections,
} from "./calculations";
import type { FinancialData } from "./types";

/**
 * Test fixture builder — partial overrides on top of a zeroed FinancialData.
 * Tests describe behavior, not implementation. Use the builder to keep tests
 * focused on the inputs that matter for each behavior.
 */
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

describe("calculateCashFlow", () => {
  it("computes totals and ratios for a typical salaried profile", () => {
    const data = buildFinancialData({
      income: { salary: 50000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 12000,
        groceries: 5000,
        utilities: 1500,
        mobile: 800,
        transport: 3000,
        eatingOut: 4000,
        subscriptions: 800,
        healthcare: 1000,
        education: 0,
        familySupport: 5000,
        other: 1500,
      },
      loans: [
        {
          id: "l1",
          name: "Edu Loan",
          type: "Edu",
          principal: 250000,
          ratePercent: 11.5,
          monthlyEmi: 6500,
        },
      ],
      monthlySavings: { sip: 5000, rd: 0, otherSavings: 0 },
    });

    const cf = calculateCashFlow(data);

    expect(cf.totalIncome).toBe(50000);
    expect(cf.totalExpenses).toBe(34600);
    expect(cf.totalEmis).toBe(6500);
    expect(cf.totalSavings).toBe(5000);
    // Surplus = 50000 - 34600 - 6500 - 5000 = 3900
    expect(cf.surplusOrDeficit).toBe(3900);
    // Savings rate = (savings + surplus) / income = (5000+3900)/50000 = 17.8%
    expect(cf.savingsRate).toBeCloseTo(0.178, 3);
    expect(cf.expenseRatio).toBeCloseTo(0.692, 3);
    expect(cf.emiRatio).toBeCloseTo(0.13, 3);
  });

  it("handles zero income without dividing by zero or returning NaN", () => {
    const data = buildFinancialData();

    const cf = calculateCashFlow(data);

    expect(cf.totalIncome).toBe(0);
    expect(cf.savingsRate).toBe(0);
    expect(cf.expenseRatio).toBe(0);
    expect(cf.emiRatio).toBe(0);
    expect(Number.isFinite(cf.savingsRate)).toBe(true);
  });

  it("reports a negative surplus when expenses exceed income", () => {
    const data = buildFinancialData({
      income: { salary: 20000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 15000,
        groceries: 5000,
        utilities: 2000,
        mobile: 1000,
        transport: 0,
        eatingOut: 0,
        subscriptions: 0,
        healthcare: 0,
        education: 0,
        familySupport: 0,
        other: 0,
      },
    });

    const cf = calculateCashFlow(data);

    expect(cf.surplusOrDeficit).toBeLessThan(0);
    expect(cf.surplusOrDeficit).toBe(-3000);
  });
});

describe("calculatePillars", () => {
  it("returns the four pillars in fixed order: Cash Flow, Protection, Wealth, Debt", () => {
    const data = buildFinancialData();

    const pillars = calculatePillars(data);

    expect(pillars).toHaveLength(4);
    expect(pillars.map((p) => p.name)).toEqual([
      "Cash Flow",
      "Protection",
      "Wealth",
      "Debt",
    ]);
  });

  it("flags the Cash Flow pillar red when expenses exceed income", () => {
    const data = buildFinancialData({
      income: { salary: 10000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 15000,
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
    });

    const [cashFlow] = calculatePillars(data);

    expect(cashFlow.status).toBe("red");
    expect(cashFlow.score).toBe(0);
    expect(cashFlow.actions.length).toBeGreaterThan(0);
  });

  it("greens the Protection pillar only when both term + health meet targets", () => {
    const baseSalaried = buildFinancialData({
      income: { salary: 100000, sideIncome: 0, otherIncome: 0 },
      personal: {
        name: "",
        age: 30,
        dependents: 1,
        taxRegime: "New",
        taxBracket: 30,
      },
    });

    const noInsurance = calculatePillars(baseSalaried)[1];
    expect(noInsurance.status).toBe("red");

    const partialInsurance = calculatePillars({
      ...baseSalaried,
      insurance: {
        termCover: 5_000_000,
        termPremiumMonthly: 800,
        healthCover: 0,
        healthPremiumMonthly: 0,
      },
    })[1];
    expect(partialInsurance.status).not.toBe("green");

    const fullyCovered = calculatePillars({
      ...baseSalaried,
      insurance: {
        termCover: 12_000_000,
        termPremiumMonthly: 1500,
        healthCover: 500_000,
        healthPremiumMonthly: 800,
      },
    })[1];
    expect(fullyCovered.status).toBe("green");
  });

  it("flags Wealth pillar red when emergency fund is empty despite income", () => {
    const data = buildFinancialData({
      income: { salary: 80000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 20000,
        groceries: 5000,
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
    });

    const wealth = calculatePillars(data)[2];

    expect(wealth.status).toBe("red");
    expect(wealth.headline).toMatch(/emergency fund/i);
  });

  it("penalises the Debt pillar when a toxic >=18% loan exists", () => {
    const data = buildFinancialData({
      income: { salary: 50000, sideIncome: 0, otherIncome: 0 },
      loans: [
        {
          id: "cc",
          name: "Credit Card",
          type: "Personal",
          principal: 50000,
          ratePercent: 36,
          monthlyEmi: 5000,
        },
      ],
    });

    const debt = calculatePillars(data)[3];

    expect(debt.status).toBe("red");
    expect(debt.headline.toLowerCase()).toContain("toxic");
  });
});

describe("calculateHealthScore", () => {
  it("aggregates pillar scores into a 0-100 total with a grade", () => {
    const data = buildFinancialData({
      income: { salary: 100000, sideIncome: 0, otherIncome: 0 },
      assets: {
        emergencyFund: 600000,
        fixedDeposits: 200000,
        recurringDeposits: 0,
        mutualFunds: 800000,
        stocks: 200000,
        gold: 100000,
        providentFund: 200000,
      },
      insurance: {
        termCover: 15_000_000,
        termPremiumMonthly: 1500,
        healthCover: 1_000_000,
        healthPremiumMonthly: 800,
      },
      monthlySavings: { sip: 25000, rd: 0, otherSavings: 0 },
      personal: {
        name: "",
        age: 30,
        dependents: 1,
        taxRegime: "Old",
        taxBracket: 30,
      },
    });

    const score = calculateHealthScore(data);

    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.pillars).toHaveLength(4);
    expect(score.grade).toMatch(/^(A\+|A|B|C|D|F)$/);
    expect(score.verdict.length).toBeGreaterThan(0);
    // Sum of pillar scores must equal total
    const sum = score.pillars.reduce((a, p) => a + p.score, 0);
    expect(score.score).toBe(sum);
  });

  it("assigns the lowest grade F for genuinely critical profiles (toxic debt + negative cash flow + no insurance + no EF)", () => {
    const broke = buildFinancialData({
      income: { salary: 20000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 30000,
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
      personal: {
        name: "",
        age: 30,
        dependents: 2,
        taxRegime: "New",
        taxBracket: 30,
      },
      loans: [
        {
          id: "cc",
          name: "Credit Card",
          type: "Personal",
          principal: 100000,
          ratePercent: 36,
          monthlyEmi: 8000,
        },
      ],
    });

    const score = calculateHealthScore(broke);

    expect(score.score).toBeLessThan(30);
    expect(score.grade).toBe("F");
    expect(score.verdict.toLowerCase()).toContain("critical");
  });

  it("returns a low non-zero grade for an empty (unfilled) form rather than crashing", () => {
    const empty = calculateHealthScore(buildFinancialData());

    expect(empty.score).toBeGreaterThanOrEqual(0);
    expect(empty.score).toBeLessThan(50);
    expect(empty.grade).toMatch(/^(F|D|C)$/);
  });
});

describe("calculateRedFlags", () => {
  it("raises a CRITICAL flag when cash flow is negative", () => {
    const data = buildFinancialData({
      income: { salary: 20000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 25000,
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
    });

    const flags = calculateRedFlags(data);
    const negative = flags.find((f) =>
      f.title.toLowerCase().includes("spending more than"),
    );

    expect(negative).toBeDefined();
    expect(negative?.severity).toBe("critical");
  });

  it("raises a CRITICAL flag for toxic high-interest debt", () => {
    const data = buildFinancialData({
      income: { salary: 60000, sideIncome: 0, otherIncome: 0 },
      loans: [
        {
          id: "pl",
          name: "Personal Loan",
          type: "Personal",
          principal: 200000,
          ratePercent: 24,
          monthlyEmi: 8000,
        },
      ],
    });

    const flags = calculateRedFlags(data);
    const toxic = flags.find((f) => f.title.toLowerCase().includes("toxic"));

    expect(toxic).toBeDefined();
    expect(toxic?.severity).toBe("critical");
    expect(toxic?.fix).toMatch(/kill/i);
  });

  it("raises a CRITICAL flag when dependents exist but term cover is inadequate", () => {
    const data = buildFinancialData({
      income: { salary: 80000, sideIncome: 0, otherIncome: 0 },
      personal: {
        name: "",
        age: 32,
        dependents: 2,
        taxRegime: "New",
        taxBracket: 30,
      },
      insurance: {
        termCover: 1_000_000, // 10L — far below 10x annual income
        termPremiumMonthly: 500,
        healthCover: 500_000,
        healthPremiumMonthly: 700,
      },
    });

    const flags = calculateRedFlags(data);
    const term = flags.find((f) => f.title.toLowerCase().includes("term cover"));

    expect(term).toBeDefined();
    expect(term?.severity).toBe("critical");
  });

  it("returns no flags for a clean Warikoo-aligned profile", () => {
    const clean = buildFinancialData({
      income: { salary: 200000, sideIncome: 0, otherIncome: 0 },
      expenses: {
        rent: 30000,
        groceries: 10000,
        utilities: 3000,
        mobile: 1000,
        transport: 5000,
        eatingOut: 5000,
        subscriptions: 1000,
        healthcare: 2000,
        education: 0,
        familySupport: 5000,
        other: 3000,
      },
      assets: {
        emergencyFund: 600000,
        fixedDeposits: 200000,
        recurringDeposits: 0,
        mutualFunds: 1500000,
        stocks: 500000,
        gold: 200000,
        providentFund: 500000,
      },
      insurance: {
        termCover: 30_000_000,
        termPremiumMonthly: 2500,
        healthCover: 2_000_000,
        healthPremiumMonthly: 1500,
      },
      monthlySavings: { sip: 50000, rd: 0, otherSavings: 0 },
      personal: {
        name: "",
        age: 32,
        dependents: 1,
        taxRegime: "New",
        taxBracket: 30,
      },
    });

    const flags = calculateRedFlags(clean);

    expect(flags.filter((f) => f.severity === "critical")).toHaveLength(0);
  });
});

describe("calculateLoanStrategy", () => {
  it("orders loans by interest rate descending (debt avalanche)", () => {
    const data = buildFinancialData({
      income: { salary: 80000, sideIncome: 0, otherIncome: 0 },
      loans: [
        {
          id: "home",
          name: "Home",
          type: "Home",
          principal: 5000000,
          ratePercent: 8.5,
          monthlyEmi: 35000,
        },
        {
          id: "edu",
          name: "Edu",
          type: "Edu",
          principal: 200000,
          ratePercent: 11.5,
          monthlyEmi: 5000,
        },
        {
          id: "cc",
          name: "Credit Card",
          type: "Personal",
          principal: 60000,
          ratePercent: 32,
          monthlyEmi: 4000,
        },
      ],
    });

    const strategy = calculateLoanStrategy(data);

    expect(strategy.map((s) => s.loanName)).toEqual(["Credit Card", "Edu", "Home"]);
    expect(strategy[0].priority).toBe(1);
    expect(strategy[0].recommendation).toBe("prepay-now");
  });

  it("recommends 'continue' for cheap (<7%) loans", () => {
    const data = buildFinancialData({
      loans: [
        {
          id: "cheap",
          name: "Subsidised Home Loan",
          type: "Home",
          principal: 3000000,
          ratePercent: 6.5,
          monthlyEmi: 22000,
        },
      ],
    });

    const [item] = calculateLoanStrategy(data);

    expect(item.recommendation).toBe("continue");
    expect(item.reasoning.toLowerCase()).toContain("cheap");
  });

  it("returns empty array when there are no loans", () => {
    const out = calculateLoanStrategy(buildFinancialData());
    expect(out).toEqual([]);
  });
});

describe("calculateGoalFeasibility", () => {
  it("inflates current cost to a future target", () => {
    const data = buildFinancialData({
      goals: [
        {
          id: "ktm",
          name: "Premium Bike",
          currentCost: 350000,
          inflationPercent: 6,
          targetYear: new Date().getFullYear() + 3,
          alreadySaved: 0,
        },
      ],
    });

    const [g] = calculateGoalFeasibility(data);

    // 350000 * 1.06^3 ≈ 416,927
    expect(g.futureCost).toBeGreaterThan(350000);
    expect(g.futureCost).toBeCloseTo(350000 * 1.06 ** 3, -2);
    expect(g.yearsRemaining).toBe(3);
    expect(g.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("marks an unaffordable short-horizon goal as not on track", () => {
    const data = buildFinancialData({
      income: { salary: 30000, sideIncome: 0, otherIncome: 0 },
      goals: [
        {
          id: "house",
          name: "House Down Payment",
          currentCost: 5000000,
          inflationPercent: 7,
          targetYear: new Date().getFullYear() + 1,
          alreadySaved: 0,
        },
      ],
    });

    const [g] = calculateGoalFeasibility(data);

    expect(g.onTrack).toBe(false);
    expect(g.shortfall).toBeGreaterThan(0);
  });
});

describe("calculateSipProjections", () => {
  it("projects monotonically increasing corpus across horizons", () => {
    const data = buildFinancialData({
      monthlySavings: { sip: 10000, rd: 0, otherSavings: 0 },
    });

    const projections = calculateSipProjections(data);

    expect(projections).toHaveLength(6);
    expect(projections.map((p) => p.year)).toEqual([5, 10, 15, 20, 25, 30]);

    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].projectedValue).toBeGreaterThan(
        projections[i - 1].projectedValue,
      );
      // Compounded value beats principal-only contributions
      expect(projections[i].projectedValue).toBeGreaterThan(
        projections[i].invested,
      );
    }
  });

  it("falls back to a 5,000 default SIP if user has none configured", () => {
    const projections = calculateSipProjections(buildFinancialData());
    expect(projections[0].invested).toBe(5000 * 5 * 12); // 3,00,000
  });
});

describe("calculateAll (umbrella)", () => {
  it("returns a complete output object without throwing on empty input", () => {
    expect(() => calculateAll(buildFinancialData())).not.toThrow();

    const out = calculateAll(buildFinancialData());

    expect(out.healthScore).toBeDefined();
    expect(out.cashFlow).toBeDefined();
    expect(out.redFlags).toBeInstanceOf(Array);
    expect(out.loanStrategy).toBeInstanceOf(Array);
    expect(out.goalFeasibility).toBeInstanceOf(Array);
    expect(out.sipProjections).toBeInstanceOf(Array);
  });
});
