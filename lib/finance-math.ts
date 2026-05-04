/**
 * Pure financial math primitives shared across the app.
 * Number-in, number-out. No domain types, no I/O.
 */

export const EQUITY_CAGR = 0.12;
export const SAFE_CAGR = 0.08;
export const STEPUP_RATE = 0.1;

/* Warikoo framework thresholds — shared across modules. */
export const EF_MONTHS_TARGET = 6;
export const TERM_COVER_INCOME_MULTIPLE = 10;
export const HEALTH_COVER_FLOOR = 300_000;
export const HEALTH_COVER_WITH_DEPENDENTS = 500_000;
export const HIGH_INTEREST_LOAN_THRESHOLD = 9;
export const TOXIC_LOAN_THRESHOLD = 18;

/**
 * NPER — number of months to pay off `principal` at monthly `payment` given
 * monthly `rate` (decimal, e.g. 0.01).
 * Returns Infinity if payment can't cover monthly interest.
 */
export function nper(rate: number, payment: number, principal: number): number {
  if (principal <= 0) return 0;
  if (payment <= 0) return Infinity;
  if (rate === 0) return principal / payment;
  const monthlyInterest = principal * rate;
  if (payment <= monthlyInterest + 0.01) return Infinity;
  return -Math.log(1 - (rate * principal) / payment) / Math.log(1 + rate);
}

/**
 * Future Value of a SIP (annuity due — deposit at start of period).
 */
export function fvSip(
  monthly: number,
  annualRate: number,
  months: number,
): number {
  if (monthly <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return monthly * months;
  return monthly * (((1 + r) ** months - 1) / r) * (1 + r);
}

/**
 * Required monthly SIP to reach `target` in `months` at `annualRate`.
 */
export function requiredSip(
  target: number,
  annualRate: number,
  months: number,
): number {
  if (target <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return target / months;
  return (target * r) / (((1 + r) ** months - 1) * (1 + r));
}

/**
 * Future Value of a SIP with annual step-up. Each year's contributions are
 * compounded monthly within the year, then compounded annually for remaining
 * years (mathematically valid since each year is an independent cash flow).
 */
export function fvSipWithStepup(
  monthly: number,
  annualRate: number,
  years: number,
  stepupRate: number = STEPUP_RATE,
): number {
  if (monthly <= 0 || years <= 0) return 0;
  let total = 0;
  let yearlyMonthly = monthly;
  for (let y = 1; y <= years; y++) {
    const yearsRemaining = years - y + 1;
    total +=
      fvSip(yearlyMonthly, annualRate, 12) *
      (1 + annualRate) ** (yearsRemaining - 1);
    yearlyMonthly *= 1 + stepupRate;
  }
  return total;
}
