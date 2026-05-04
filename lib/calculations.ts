/**
 * Warikoo Calculator — core math.
 *
 * Pure functions only. No DOM, no fetch, no localStorage.
 * Implementations follow Ankur Warikoo's framework:
 *   - 50/30/20 rule (with India tweaks)
 *   - emergency fund = 6× monthly (expenses + EMIs)
 *   - term cover = 10× annual income
 *   - health cover = ₹3L floor (₹5L+ with dependents)
 *   - debt avalanche over snowball (math > psychology)
 *   - SIP step-up at 10% YoY by default, 12% CAGR equity
 *
 * All money values are INR rupees. Percentages stored as percentages (30 = 30%).
 */

import {
  EF_MONTHS_TARGET,
  EQUITY_CAGR,
  HEALTH_COVER_FLOOR,
  HEALTH_COVER_WITH_DEPENDENTS,
  HIGH_INTEREST_LOAN_THRESHOLD,
  SAFE_CAGR,
  STEPUP_RATE,
  TERM_COVER_INCOME_MULTIPLE,
  TOXIC_LOAN_THRESHOLD,
  fvSipWithStepup,
  nper,
  requiredSip,
} from "./finance-math";
import type {
  FinancialData,
  HealthScore,
  Pillar,
  PillarStatus,
  RedFlag,
  CashFlowSummary,
  LoanStrategyItem,
  GoalFeasibility,
  SipProjection,
  CalculationOutput,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sumIncome(d: FinancialData): number {
  return d.income.salary + d.income.sideIncome + d.income.otherIncome;
}

function sumExpenses(d: FinancialData): number {
  const e = d.expenses;
  return (
    e.rent +
    e.groceries +
    e.utilities +
    e.mobile +
    e.transport +
    e.eatingOut +
    e.subscriptions +
    e.healthcare +
    e.education +
    e.familySupport +
    e.other
  );
}

function sumEmis(d: FinancialData): number {
  return d.loans.reduce((acc, l) => acc + l.monthlyEmi, 0);
}

function sumMonthlySavings(d: FinancialData): number {
  const s = d.monthlySavings;
  return s.sip + s.rd + s.otherSavings;
}

function sumInvestments(d: FinancialData): number {
  const a = d.assets;
  return a.fixedDeposits + a.mutualFunds + a.stocks + a.gold + a.providentFund;
}

function safe(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return safe(numerator / denominator);
}

/* ------------------------------------------------------------------ */
/*  Cash Flow                                                          */
/* ------------------------------------------------------------------ */

export function calculateCashFlow(data: FinancialData): CashFlowSummary {
  const totalIncome = sumIncome(data);
  const totalExpenses = sumExpenses(data);
  const totalEmis = sumEmis(data);
  const totalSavings = sumMonthlySavings(data);
  const surplusOrDeficit =
    totalIncome - totalExpenses - totalEmis - totalSavings;

  return {
    totalIncome,
    totalExpenses,
    totalEmis,
    totalSavings,
    surplusOrDeficit,
    savingsRate: ratio(totalSavings + Math.max(0, surplusOrDeficit), totalIncome),
    expenseRatio: ratio(totalExpenses, totalIncome),
    emiRatio: ratio(totalEmis, totalIncome),
  };
}

/* ------------------------------------------------------------------ */
/*  Pillars                                                            */
/* ------------------------------------------------------------------ */

function pillarCashFlow(data: FinancialData, cf: CashFlowSummary): Pillar {
  const rate = cf.savingsRate;
  let status: PillarStatus = "red";
  let score = 0;
  let headline = "";
  const actions: string[] = [];

  if (cf.totalIncome === 0) {
    status = "red";
    score = 0;
    headline = "No income recorded.";
    actions.push("Add your monthly salary in the Income tab.");
  } else if (cf.surplusOrDeficit < 0) {
    status = "red";
    score = 0;
    headline = "You're spending more than you earn.";
    actions.push("Cut wants (eating out, OTT) by 30% this month.");
    actions.push("Track every rupee for 30 days — find the leak.");
  } else if (rate >= 0.3) {
    status = "green";
    score = 25;
    headline = `Saving ${Math.round(rate * 100)}% — top tier.`;
    actions.push("Step up SIP 10% every year — compound on autopilot.");
  } else if (rate >= 0.2) {
    status = "green";
    score = 22;
    headline = `Saving ${Math.round(rate * 100)}% — Warikoo target hit.`;
    actions.push("Push to 30% if income allows — wealth accelerates.");
  } else if (rate >= 0.1) {
    status = "yellow";
    score = 15;
    headline = `Saving ${Math.round(rate * 100)}% — below target.`;
    actions.push("Aim for 20%+. Cut ONE category by ₹2k this month.");
    actions.push("Income > expense cuts. Plan a job switch in 12 months.");
  } else {
    status = "red";
    score = 5;
    headline = `Saving only ${Math.round(rate * 100)}% — critical.`;
    actions.push("Audit expenses ruthlessly — typical leak is eating out + subscriptions.");
    actions.push("Side income or skill upgrade is more important than saving.");
  }

  return {
    name: "Cash Flow",
    status,
    score,
    headline,
    commentary:
      "Warikoo's first rule: spend less than you earn, save at least 20%. The 50/30/20 split — 50% needs, 30% wants, 20% invest — is the floor.",
    actions,
  };
}

function pillarProtection(data: FinancialData): Pillar {
  const annualIncome = sumIncome(data) * 12;
  const requiredTerm =
    annualIncome > 0 ? annualIncome * TERM_COVER_INCOME_MULTIPLE : 5_000_000;
  const requiredHealth =
    data.personal.dependents > 0
      ? HEALTH_COVER_WITH_DEPENDENTS
      : HEALTH_COVER_FLOOR;

  const termOk = data.insurance.termCover >= requiredTerm;
  const termPartial =
    data.insurance.termCover >= requiredTerm * 0.5 && !termOk;
  const healthOk = data.insurance.healthCover >= requiredHealth;
  const healthPartial =
    data.insurance.healthCover >= HEALTH_COVER_FLOOR && !healthOk;

  let status: PillarStatus = "red";
  let score = 0;
  let headline = "";
  const actions: string[] = [];

  if (data.personal.dependents === 0 && annualIncome === 0) {
    status = "yellow";
    score = 12;
    headline = "Health cover is enough at this stage.";
  } else if (termOk && healthOk) {
    status = "green";
    score = 25;
    headline = "Term + Health both adequate. Insulated.";
    actions.push("Review covers every 3 years — they should grow with income.");
  } else if (
    (termOk || (data.personal.dependents === 0 && annualIncome === 0)) &&
    healthOk
  ) {
    status = "green";
    score = 22;
    headline = "Insurance baseline met.";
  } else if (termPartial || healthPartial) {
    status = "yellow";
    score = 14;
    headline = "Partial cover — one shock away from trouble.";
    if (!termOk && data.personal.dependents > 0)
      actions.push(
        `Upgrade term cover to at least ₹${(requiredTerm / 100_000).toFixed(0)}L (10× annual income).`,
      );
    if (!healthOk)
      actions.push(
        `Upgrade health cover to at least ₹${(requiredHealth / 100_000).toFixed(0)}L family floater.`,
      );
  } else {
    status = "red";
    score = 4;
    headline = "No real protection. One emergency wipes years of work.";
    if (!termOk && data.personal.dependents > 0)
      actions.push(
        `Buy term plan ₹${(requiredTerm / 100_000).toFixed(0)}L cover today (~₹500-800/mo at age 25).`,
      );
    if (!healthOk)
      actions.push(
        `Buy health insurance ₹${(requiredHealth / 100_000).toFixed(0)}L (~₹500-1000/mo).`,
      );
  }

  return {
    name: "Protection",
    status,
    score,
    headline,
    commentary:
      "Insurance is protection, not investment. Term cover replaces income for dependents. Health cover absorbs medical shocks. Buy both before any wealth-building.",
    actions,
  };
}

function pillarWealth(data: FinancialData): Pillar {
  const annualIncome = sumIncome(data) * 12;
  const ef = data.assets.emergencyFund;
  const investments = sumInvestments(data);
  const totalExp = sumExpenses(data) + sumEmis(data);
  const efMonths = ratio(ef, totalExp || 1);
  const efRatio = ratio(ef, totalExp * EF_MONTHS_TARGET);

  // Score components: EF (40%), investments (60%)
  const efScore =
    efMonths >= EF_MONTHS_TARGET ? 10 : Math.round(efRatio * 10);
  const investmentRatio = annualIncome > 0 ? investments / annualIncome : 0;
  const invScore =
    investmentRatio >= 1
      ? 15
      : investmentRatio >= 0.3
        ? Math.round(5 + ((investmentRatio - 0.3) / 0.7) * 10)
        : Math.round(investmentRatio * (5 / 0.3));

  const score = Math.min(25, efScore + invScore);

  let status: PillarStatus = "red";
  let headline = "";
  const actions: string[] = [];

  if (efMonths < 1) {
    status = "red";
    headline = "Emergency Fund is empty. Pillar 1 of Warikoo's framework.";
    actions.push(
      `Build EF to ₹${Math.round(totalExp * EF_MONTHS_TARGET).toLocaleString("en-IN")} (6 months survival cost).`,
    );
    actions.push("Park in liquid FD or high-yield savings — NEVER equity.");
  } else if (efMonths < EF_MONTHS_TARGET) {
    status = "yellow";
    headline = `EF covers ${efMonths.toFixed(1)} months — keep building.`;
    actions.push(
      `Top up EF by ₹${Math.round(totalExp * EF_MONTHS_TARGET - ef).toLocaleString("en-IN")} more.`,
    );
  } else if (investmentRatio < 0.3) {
    status = "yellow";
    headline = "EF done — now build wealth via SIPs.";
    actions.push("Start SIP minimum 20% of income. Index fund + mid-cap mix.");
  } else if (investmentRatio < 1) {
    status = "yellow";
    headline = "Building corpus — keep stepping up.";
    actions.push("Bump SIP 10% every year. Compounding rewards consistency.");
  } else {
    status = "green";
    headline = "Strong corpus relative to income. Compounding is working.";
    actions.push("Diversify — index 60%, mid/small 30%, debt/gold 10%.");
  }

  return {
    name: "Wealth",
    status,
    score,
    headline,
    commentary:
      "Emergency Fund first (6 months in liquid). Then SIPs in equity. Time IN the market beats timing the market — Warikoo's mantra.",
    actions,
  };
}

function pillarDebt(data: FinancialData, cf: CashFlowSummary): Pillar {
  const ratioVal = cf.emiRatio;
  const hasHighInterestLoan = data.loans.some(
    (l) => l.ratePercent > HIGH_INTEREST_LOAN_THRESHOLD,
  );
  const hasToxicLoan = data.loans.some(
    (l) => l.ratePercent >= TOXIC_LOAN_THRESHOLD,
  );

  let status: PillarStatus = "red";
  let score = 0;
  let headline = "";
  const actions: string[] = [];

  if (data.loans.length === 0) {
    status = "green";
    score = 25;
    headline = "Debt-free. Stay there.";
    actions.push(
      "Avoid lifestyle EMIs (bike, gadget on EMI) — buy in cash or skip.",
    );
  } else if (hasToxicLoan) {
    status = "red";
    score = 3;
    headline = "Toxic debt detected (>18% interest).";
    actions.push("Kill credit card / personal loan FIRST. Everything else waits.");
    actions.push("Consolidate via lower-rate loan if possible.");
  } else if (ratioVal > 0.4) {
    status = "red";
    score = 6;
    headline = `EMI ratio ${Math.round(ratioVal * 100)}% — over the danger line.`;
    actions.push("Don't take ANY new loan. Pause SIPs. Throw all surplus at debt.");
    actions.push("Income must grow before more EMIs.");
  } else if (ratioVal > 0.2) {
    status = "yellow";
    score = 15;
    headline = `EMI ratio ${Math.round(ratioVal * 100)}% — manageable but tight.`;
    if (hasHighInterestLoan) {
      actions.push("Prepay highest-interest loan — saves more than any FD/RD return.");
    }
    actions.push("Reduce TENURE not EMI when prepaying.");
  } else if (hasHighInterestLoan) {
    status = "yellow";
    score = 18;
    headline = "EMI under control but interest rate is high.";
    actions.push("Direct prepay > RD. Saves the rate spread (loan rate − RD rate).");
  } else {
    status = "green";
    score = 23;
    headline = "Debt is healthy and low-cost.";
    actions.push("Stay disciplined — finish current loans, no new EMIs.");
  }

  return {
    name: "Debt",
    status,
    score,
    headline,
    commentary:
      "EMI < 40% of income (Warikoo's hard line). High-interest debt (>9%) gets prepay priority over investing — the math is unbeatable.",
    actions,
  };
}

export function calculatePillars(data: FinancialData): Pillar[] {
  const cf = calculateCashFlow(data);
  return [
    pillarCashFlow(data, cf),
    pillarProtection(data),
    pillarWealth(data),
    pillarDebt(data, cf),
  ];
}

/* ------------------------------------------------------------------ */
/*  Health Score                                                       */
/* ------------------------------------------------------------------ */

export function calculateHealthScore(data: FinancialData): HealthScore {
  const pillars = calculatePillars(data);
  const score = pillars.reduce((acc, p) => acc + p.score, 0);

  let grade: string;
  let verdict: string;

  if (score >= 90) {
    grade = "A+";
    verdict = "Excellent — you're in the top 5% of disciplined savers.";
  } else if (score >= 80) {
    grade = "A";
    verdict = "Strong foundation. Keep compounding.";
  } else if (score >= 65) {
    grade = "B";
    verdict = "Good but with gaps. Close the red pillars first.";
  } else if (score >= 50) {
    grade = "C";
    verdict = "Fragile. One emergency could derail you.";
  } else if (score >= 30) {
    grade = "D";
    verdict = "Significant rebuilding needed. Start with Cash Flow.";
  } else {
    grade = "F";
    verdict = "Critical. Stop, breathe, fix Pillar 1 (Emergency Fund) first.";
  }

  return { score, grade, verdict, pillars };
}

/* ------------------------------------------------------------------ */
/*  Red Flags                                                          */
/* ------------------------------------------------------------------ */

export function calculateRedFlags(data: FinancialData): RedFlag[] {
  const flags: RedFlag[] = [];
  const cf = calculateCashFlow(data);
  const totalExp = cf.totalExpenses + cf.totalEmis;

  // Negative cash flow
  if (cf.surplusOrDeficit < 0) {
    flags.push({
      severity: "critical",
      title: "You're spending more than you earn",
      detail: `Monthly deficit of ₹${Math.abs(cf.surplusOrDeficit).toLocaleString("en-IN")}. You're funding lifestyle on credit or eroding savings.`,
      fix: "Track every rupee for 30 days. Cut the biggest discretionary line (eating out, OTT, shopping) by 50%.",
    });
  }

  // EMI > 40%
  if (cf.emiRatio > 0.4) {
    flags.push({
      severity: "high",
      title: `EMI ratio ${Math.round(cf.emiRatio * 100)}% — Warikoo's 40% danger line crossed`,
      detail: "You're a job loss away from default. Banks won't approve more credit either.",
      fix: "Pause SIPs. No new loans. Aggressive prepay on highest-interest debt.",
    });
  }

  // Investing while EMI high
  if (cf.emiRatio > 0.4 && cf.totalSavings > 0) {
    flags.push({
      severity: "high",
      title: "Investing while drowning in EMIs",
      detail: "You're earning ~12% on equity while paying 11-15% on debt. Math says kill debt first.",
      fix: "Redirect all SIPs to loan prepayment until EMI ratio < 30%.",
    });
  }

  // No EF but investing
  const efMonths = ratio(data.assets.emergencyFund, totalExp || 1);
  if (efMonths < 3 && cf.totalSavings > 0) {
    flags.push({
      severity: "high",
      title: "Investing without an Emergency Fund",
      detail: `EF covers ${efMonths.toFixed(1)} months. One job loss forces you to sell investments at a loss.`,
      fix: `Pause non-essential SIPs. Build EF to ₹${Math.round(totalExp * 6).toLocaleString("en-IN")} in liquid FD first.`,
    });
  }

  // No insurance with dependents
  const annualIncome = sumIncome(data) * 12;
  if (
    data.personal.dependents > 0 &&
    data.insurance.termCover < annualIncome * 5
  ) {
    flags.push({
      severity: "critical",
      title: "Dependents but inadequate term cover",
      detail: `You have ${data.personal.dependents} dependent(s). If you die today, they get ₹${(data.insurance.termCover / 100_000).toFixed(0)}L — likely not enough.`,
      fix: `Buy ₹${((annualIncome * TERM_COVER_INCOME_MULTIPLE) / 100_000).toFixed(0)}L term plan today. Premium ₹500-1500/mo.`,
    });
  }

  // No health insurance
  if (data.insurance.healthCover < HEALTH_COVER_FLOOR) {
    flags.push({
      severity: "high",
      title: "No / low health insurance",
      detail: `₹${(data.insurance.healthCover / 100_000).toFixed(0)}L cover. One ICU admission costs ₹2-5L easily.`,
      fix: "Buy ₹3-5L family floater health insurance. ₹500-1000/mo for someone in their 20s.",
    });
  }

  // Multiple loans
  if (data.loans.length > 2) {
    flags.push({
      severity: "medium",
      title: `${data.loans.length} active loans — consolidation risk`,
      detail: "Multiple EMIs increase default risk and crush cash flow.",
      fix: "Consolidate via personal loan only if it lowers blended rate. Otherwise prepay smallest first for cash flow relief.",
    });
  }

  // Toxic debt
  const toxicLoans = data.loans.filter(
    (l) => l.ratePercent >= TOXIC_LOAN_THRESHOLD,
  );
  if (toxicLoans.length > 0) {
    flags.push({
      severity: "critical",
      title: "Toxic debt (≥18% interest)",
      detail: `${toxicLoans.map((l) => l.name).join(", ")} — credit card/personal loan rates eat your wealth.`,
      fix: "Kill these FIRST. Use any FD/savings (not EF) to pay off. Math beats psychology.",
    });
  }

  // Lifestyle loan with student loan
  const hasEduLoan = data.loans.some((l) => l.type === "Edu");
  const hasLifestyleLoan = data.loans.some(
    (l) => l.type === "Car" || l.type === "Personal",
  );
  if (hasEduLoan && hasLifestyleLoan) {
    flags.push({
      severity: "medium",
      title: "Lifestyle loan while education loan active",
      detail: "Bike/Car/Personal loan stacked on top of education loan delays wealth building.",
      fix: "Don't take lifestyle loans till education loan cleared. Old vehicles work fine.",
    });
  }

  // High-interest LIC-style endowment without term plan
  // (heuristic: high LIC-like premium but term cover < 10× income)
  if (
    data.insurance.termCover < annualIncome * 5 &&
    data.monthlySavings.rd > 1500 &&
    data.personal.age < 35
  ) {
    flags.push({
      severity: "medium",
      title: "Possible LIC endowment without proper term plan",
      detail: "Endowment / money-back policies return 4-5%. Same money in index fund returns 12%.",
      fix: "Verify your LIC plan type. If it's endowment/money-back: surrender or paid-up. Buy pure term plan instead.",
    });
  }

  // Lazy money in savings account (assumes EF target = 6mo expenses)
  const efTarget = totalExp * EF_MONTHS_TARGET;
  if (data.assets.emergencyFund > efTarget * 1.5 && totalExp > 0) {
    flags.push({
      severity: "low",
      title: "Excess cash in liquid — earning negative real return",
      detail: `EF is ₹${Math.round(data.assets.emergencyFund - efTarget).toLocaleString("en-IN")} above 6-month target. Inflation eats it.`,
      fix: "Move surplus to short-term debt MF or SIP — earn 7-12% instead of 3-4%.",
    });
  }

  return flags;
}

/* ------------------------------------------------------------------ */
/*  Loan Strategy                                                      */
/* ------------------------------------------------------------------ */

export function calculateLoanStrategy(
  data: FinancialData,
): LoanStrategyItem[] {
  if (data.loans.length === 0) return [];

  // Debt avalanche — sort by interest rate desc
  const sorted = [...data.loans].sort((a, b) => b.ratePercent - a.ratePercent);

  return sorted.map((loan, idx) => {
    const r = loan.ratePercent / 12 / 100;
    const baselineMonths = nper(r, loan.monthlyEmi, loan.principal);
    const baselineInterest = isFinite(baselineMonths)
      ? baselineMonths * loan.monthlyEmi - loan.principal
      : 0;

    // Scenario: extra ₹2k/month
    const withExtraMonths = nper(r, loan.monthlyEmi + 2000, loan.principal);
    const withExtraInterest = isFinite(withExtraMonths)
      ? withExtraMonths * (loan.monthlyEmi + 2000) - loan.principal
      : 0;

    const monthsSaved = isFinite(baselineMonths)
      ? Math.max(0, Math.round(baselineMonths - withExtraMonths))
      : 0;
    const interestSaved = Math.max(0, Math.round(baselineInterest - withExtraInterest));

    let recommendation: LoanStrategyItem["recommendation"];
    let reasoning: string;

    if (loan.ratePercent >= TOXIC_LOAN_THRESHOLD) {
      recommendation = "prepay-now";
      reasoning = `${loan.ratePercent}% interest is toxic. Throw every spare rupee at it. No SIP, no FD — kill this first.`;
    } else if (loan.ratePercent > HIGH_INTEREST_LOAN_THRESHOLD) {
      recommendation = "prepay-now";
      reasoning = `${loan.ratePercent}% > 9% threshold. Direct prepay saves more than any safe investment returns. Reduce TENURE not EMI.`;
    } else if (loan.ratePercent >= 7) {
      recommendation = idx === 0 ? "prepay-later" : "continue";
      reasoning = `${loan.ratePercent}% is borderline. Index fund (~12%) beats prepay math, but prepay if you can't stick to SIP discipline.`;
    } else {
      recommendation = "continue";
      reasoning = `${loan.ratePercent}% is cheap money. Run the EMI, invest your surplus instead — math wins.`;
    }

    if (loan.type === "Edu" && data.personal.taxRegime === "Old") {
      reasoning += " Note: 80E tax deduction lowers your effective rate further (Old regime).";
    }

    return {
      loanId: loan.id,
      loanName: loan.name || `${loan.type} Loan`,
      priority: idx + 1,
      recommendation,
      reasoning,
      monthsSaved,
      interestSaved,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Goal Feasibility                                                   */
/* ------------------------------------------------------------------ */

export function calculateGoalFeasibility(
  data: FinancialData,
): GoalFeasibility[] {
  const currentYear = new Date().getFullYear();
  const cf = calculateCashFlow(data);
  const freeCash = Math.max(0, cf.surplusOrDeficit + cf.totalSavings);

  return data.goals.map((goal) => {
    const yearsRemaining = Math.max(0, goal.targetYear - currentYear);
    const months = yearsRemaining * 12;
    const inflationRate = goal.inflationPercent / 100;
    const futureCost =
      goal.currentCost * (1 + inflationRate) ** yearsRemaining;
    const gap = Math.max(0, futureCost - goal.alreadySaved);

    // Use safer 8% for ≤3 year goals, 12% otherwise
    const annualRate = yearsRemaining <= 3 ? SAFE_CAGR : EQUITY_CAGR;
    const requiredMonthlySip = Math.round(
      requiredSip(gap, annualRate, months),
    );

    const onTrack = requiredMonthlySip <= freeCash * 0.5;
    const shortfall = Math.max(0, requiredMonthlySip - freeCash);

    return {
      goalId: goal.id,
      goalName: goal.name,
      futureCost: Math.round(futureCost),
      requiredMonthlySip,
      onTrack,
      shortfall,
      yearsRemaining,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  SIP Projections                                                    */
/* ------------------------------------------------------------------ */

export function calculateSipProjections(
  data: FinancialData,
): SipProjection[] {
  const monthly = data.monthlySavings.sip > 0 ? data.monthlySavings.sip : 5000;
  const horizons = [5, 10, 15, 20, 25, 30];

  return horizons.map((years) => {
    const months = years * 12;
    const invested = monthly * months;
    const projectedValue = Math.round(
      fvSipWithStepup(monthly, EQUITY_CAGR, years, STEPUP_RATE),
    );
    return {
      year: years,
      invested,
      projectedValue,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Umbrella                                                           */
/* ------------------------------------------------------------------ */

export function calculateAll(data: FinancialData): CalculationOutput {
  return {
    healthScore: calculateHealthScore(data),
    redFlags: calculateRedFlags(data),
    cashFlow: calculateCashFlow(data),
    loanStrategy: calculateLoanStrategy(data),
    goalFeasibility: calculateGoalFeasibility(data),
    sipProjections: calculateSipProjections(data),
  };
}
