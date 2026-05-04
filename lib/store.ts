"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  FinancialData,
  PersonalInfo,
  Income,
  Expenses,
  Loan,
  Assets,
  Insurance,
  Goal,
  MonthlySavings,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Defaults                                                            */
/* ------------------------------------------------------------------ */

const defaultPersonal: PersonalInfo = {
  name: "",
  age: 30,
  dependents: 0,
  taxRegime: "New",
  taxBracket: 30,
};

const defaultIncome: Income = {
  salary: 0,
  sideIncome: 0,
  otherIncome: 0,
};

const defaultExpenses: Expenses = {
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
};

const defaultAssets: Assets = {
  emergencyFund: 0,
  fixedDeposits: 0,
  recurringDeposits: 0,
  mutualFunds: 0,
  stocks: 0,
  gold: 0,
  providentFund: 0,
};

const defaultInsurance: Insurance = {
  termCover: 0,
  termPremiumMonthly: 0,
  healthCover: 0,
  healthPremiumMonthly: 0,
};

const defaultMonthlySavings: MonthlySavings = {
  sip: 0,
  rd: 0,
  otherSavings: 0,
};

export const initialFinancialData: FinancialData = {
  personal: defaultPersonal,
  income: defaultIncome,
  expenses: defaultExpenses,
  loans: [],
  assets: defaultAssets,
  insurance: defaultInsurance,
  goals: [],
  monthlySavings: defaultMonthlySavings,
};

/* ------------------------------------------------------------------ */
/*  Store                                                               */
/* ------------------------------------------------------------------ */

interface FinancialStore {
  data: FinancialData;
  updatePersonal: (patch: Partial<PersonalInfo>) => void;
  updateIncome: (patch: Partial<Income>) => void;
  updateExpenses: (patch: Partial<Expenses>) => void;
  addLoan: (loan: Omit<Loan, "id">) => void;
  updateLoan: (id: string, patch: Partial<Loan>) => void;
  removeLoan: (id: string) => void;
  updateAssets: (patch: Partial<Assets>) => void;
  updateInsurance: (patch: Partial<Insurance>) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  updateMonthlySavings: (patch: Partial<MonthlySavings>) => void;
  reset: () => void;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set) => ({
      data: initialFinancialData,
      updatePersonal: (patch) =>
        set((s) => ({
          data: { ...s.data, personal: { ...s.data.personal, ...patch } },
        })),
      updateIncome: (patch) =>
        set((s) => ({
          data: { ...s.data, income: { ...s.data.income, ...patch } },
        })),
      updateExpenses: (patch) =>
        set((s) => ({
          data: { ...s.data, expenses: { ...s.data.expenses, ...patch } },
        })),
      addLoan: (loan) =>
        set((s) => ({
          data: { ...s.data, loans: [...s.data.loans, { ...loan, id: newId() }] },
        })),
      updateLoan: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            loans: s.data.loans.map((l) =>
              l.id === id ? { ...l, ...patch } : l,
            ),
          },
        })),
      removeLoan: (id) =>
        set((s) => ({
          data: { ...s.data, loans: s.data.loans.filter((l) => l.id !== id) },
        })),
      updateAssets: (patch) =>
        set((s) => ({
          data: { ...s.data, assets: { ...s.data.assets, ...patch } },
        })),
      updateInsurance: (patch) =>
        set((s) => ({
          data: { ...s.data, insurance: { ...s.data.insurance, ...patch } },
        })),
      addGoal: (goal) =>
        set((s) => ({
          data: { ...s.data, goals: [...s.data.goals, { ...goal, id: newId() }] },
        })),
      updateGoal: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            goals: s.data.goals.map((g) =>
              g.id === id ? { ...g, ...patch } : g,
            ),
          },
        })),
      removeGoal: (id) =>
        set((s) => ({
          data: { ...s.data, goals: s.data.goals.filter((g) => g.id !== id) },
        })),
      updateMonthlySavings: (patch) =>
        set((s) => ({
          data: {
            ...s.data,
            monthlySavings: { ...s.data.monthlySavings, ...patch },
          },
        })),
      reset: () => set({ data: initialFinancialData }),
    }),
    {
      name: "warikoo-calc-data",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
