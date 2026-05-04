/**
 * Demo data — realistic Indian middle-class scenario for the "Try Demo" button.
 * Pre-fills calculator with a 25-year-old IT professional in Bangalore.
 */

import type { FinancialData } from "./types";

export const demoFinancialData: FinancialData = {
  personal: {
    name: "Aman Sharma",
    age: 25,
    dependents: 0,
    taxRegime: "New",
    taxBracket: 20,
  },
  income: {
    salary: 50000,
    sideIncome: 0,
    otherIncome: 0,
  },
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
      id: "demo-loan-1",
      name: "Education Loan (ICICI)",
      type: "Edu",
      principal: 250000,
      ratePercent: 11.5,
      monthlyEmi: 6500,
    },
  ],
  assets: {
    emergencyFund: 30000,
    fixedDeposits: 50000,
    recurringDeposits: 0,
    mutualFunds: 80000,
    stocks: 20000,
    gold: 25000,
    providentFund: 60000,
  },
  insurance: {
    termCover: 5000000,
    termPremiumMonthly: 800,
    healthCover: 500000,
    healthPremiumMonthly: 600,
  },
  goals: [
    {
      id: "demo-goal-1",
      name: "KTM 390 (Cash buy)",
      currentCost: 350000,
      inflationPercent: 6,
      targetYear: new Date().getFullYear() + 3,
      alreadySaved: 0,
    },
    {
      id: "demo-goal-2",
      name: "Home Down Payment",
      currentCost: 2000000,
      inflationPercent: 7,
      targetYear: new Date().getFullYear() + 7,
      alreadySaved: 0,
    },
    {
      id: "demo-goal-3",
      name: "Retirement Corpus",
      currentCost: 30000000,
      inflationPercent: 6,
      targetYear: new Date().getFullYear() + 35,
      alreadySaved: 0,
    },
  ],
  monthlySavings: {
    sip: 5000,
    rd: 0,
    otherSavings: 0,
  },
};

export const goalTemplates = [
  {
    name: "KTM 390 / Premium Bike",
    currentCost: 350000,
    inflationPercent: 6,
    yearsFromNow: 3,
  },
  {
    name: "Home Down Payment",
    currentCost: 2000000,
    inflationPercent: 7,
    yearsFromNow: 7,
  },
  {
    name: "Mid-segment Car",
    currentCost: 1000000,
    inflationPercent: 5,
    yearsFromNow: 5,
  },
  {
    name: "Wedding",
    currentCost: 1500000,
    inflationPercent: 7,
    yearsFromNow: 4,
  },
  {
    name: "International Vacation",
    currentCost: 200000,
    inflationPercent: 6,
    yearsFromNow: 1,
  },
  {
    name: "Child Education Corpus",
    currentCost: 5000000,
    inflationPercent: 8,
    yearsFromNow: 18,
  },
  {
    name: "Retirement (₹3 Cr)",
    currentCost: 30000000,
    inflationPercent: 6,
    yearsFromNow: 30,
  },
  {
    name: "Emergency Fund",
    currentCost: 300000,
    inflationPercent: 0,
    yearsFromNow: 1,
  },
];
