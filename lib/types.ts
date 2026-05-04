/**
 * Warikoo Calculator — type definitions for all input and output data.
 * All money values are in INR (rupees, not paise) unless noted.
 */

export type TaxRegime = "New" | "Old";

export interface PersonalInfo {
  name: string;
  age: number;
  dependents: number;
  taxRegime: TaxRegime;
  /** Marginal tax bracket as a percentage, e.g. 30 for 30%. */
  taxBracket: number;
}

export interface Income {
  /** Net monthly take-home salary. */
  salary: number;
  /** Side / freelance / consulting monthly income. */
  sideIncome: number;
  /** Other recurring monthly income (rent, dividends, etc.). */
  otherIncome: number;
}

export interface Expenses {
  rent: number;
  groceries: number;
  utilities: number;
  mobile: number;
  transport: number;
  eatingOut: number;
  subscriptions: number;
  healthcare: number;
  education: number;
  familySupport: number;
  other: number;
}

export type LoanType = "Edu" | "Home" | "Personal" | "Car" | "Other";

export interface Loan {
  id: string;
  name: string;
  type: LoanType;
  /** Outstanding principal in INR. */
  principal: number;
  /** Annual interest rate as a percentage, e.g. 9.5 for 9.5%. */
  ratePercent: number;
  /** Monthly EMI in INR. */
  monthlyEmi: number;
}

export interface Assets {
  emergencyFund: number;
  fixedDeposits: number;
  recurringDeposits: number;
  mutualFunds: number;
  stocks: number;
  gold: number;
  providentFund: number;
}

export interface Insurance {
  /** Term life cover sum assured. */
  termCover: number;
  termPremiumMonthly: number;
  /** Health insurance sum assured. */
  healthCover: number;
  healthPremiumMonthly: number;
}

export interface Goal {
  id: string;
  name: string;
  /** Cost of the goal in today's rupees. */
  currentCost: number;
  /** Expected inflation for this goal in % per year. */
  inflationPercent: number;
  /** Target year (absolute, e.g. 2035). */
  targetYear: number;
  /** Amount already saved toward this goal. */
  alreadySaved: number;
}

export interface MonthlySavings {
  sip: number;
  rd: number;
  otherSavings: number;
}

export interface FinancialData {
  personal: PersonalInfo;
  income: Income;
  expenses: Expenses;
  loans: Loan[];
  assets: Assets;
  insurance: Insurance;
  goals: Goal[];
  monthlySavings: MonthlySavings;
}

/* ------------------------------------------------------------------ */
/*  Output / computation types                                         */
/* ------------------------------------------------------------------ */

export type PillarStatus = "green" | "yellow" | "red";

export interface Pillar {
  name: string;
  status: PillarStatus;
  score: number;
  /** Short one-line headline summarising status. */
  headline: string;
  /** Long-form Warikoo-style commentary. */
  commentary: string;
  /** Concrete action items, ordered by priority. */
  actions: string[];
}

export interface HealthScore {
  /** 0-100 overall Warikoo Health Score. */
  score: number;
  /** Letter grade A/B/C/D/F or similar. */
  grade: string;
  /** One-line summary of the score. */
  verdict: string;
  /** Per-pillar breakdown. */
  pillars: Pillar[];
}

export type Verdict = "Excellent" | "Strong" | "OK" | "Fragile" | "Critical";

export interface RedFlag {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
  /** Recommended fix. */
  fix: string;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpenses: number;
  totalEmis: number;
  totalSavings: number;
  surplusOrDeficit: number;
  savingsRate: number;
  expenseRatio: number;
  emiRatio: number;
}

export interface LoanStrategyItem {
  loanId: string;
  loanName: string;
  /** Recommended priority order — 1 = pay off first. */
  priority: number;
  /** Whether to prepay aggressively, continue, or refinance. */
  recommendation: "prepay-now" | "prepay-later" | "continue" | "refinance";
  reasoning: string;
  /** Months of EMIs saved if recommendation is followed. */
  monthsSaved?: number;
  interestSaved?: number;
}

export interface GoalFeasibility {
  goalId: string;
  goalName: string;
  /** Inflated cost at target year. */
  futureCost: number;
  /** Required monthly SIP to reach goal. */
  requiredMonthlySip: number;
  /** Whether goal is on track at current savings rate. */
  onTrack: boolean;
  shortfall: number;
  yearsRemaining: number;
}

export interface SipProjection {
  year: number;
  invested: number;
  projectedValue: number;
}

export interface CalculationOutput {
  healthScore: HealthScore;
  redFlags: RedFlag[];
  cashFlow: CashFlowSummary;
  loanStrategy: LoanStrategyItem[];
  goalFeasibility: GoalFeasibility[];
  sipProjections: SipProjection[];
}
