"use client";

/**
 * Print-optimised report page. View at /report; user prints to PDF via the
 * browser (Cmd/Ctrl-P) which produces a real vector PDF with selectable text.
 *
 * Layout uses A4 portrait via CSS @page; each section is a .sheet div that
 * forces a page break before it. SVG-only charts (no Recharts) so the print
 * pipeline gets clean vectors.
 */

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { useFinancialStore } from "@/lib/store";
import { calculateAll } from "@/lib/calculations";
import { demoFinancialData } from "@/lib/demo-data";
import type {
  CalculationOutput,
  FinancialData,
  Pillar,
  RedFlag,
} from "@/lib/types";

import "./report.css";

const inr = new Intl.NumberFormat("en-IN");
const money = (n: number) =>
  `₹${inr.format(Math.round(Math.max(0, Math.abs(n))))}` +
  (n < 0 ? "" : "");
const moneySigned = (n: number) =>
  `${n < 0 ? "-" : ""}₹${inr.format(Math.round(Math.abs(n)))}`;
const pct = (n: number, d = 0) => `${(n * 100).toFixed(d)}%`;

const todayLong = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

function severityClass(s: RedFlag["severity"]) {
  return `flag flag-${s}`;
}

function pillarClass(s: Pillar["status"]) {
  return `pillar pillar-${s}`;
}

/* ------------------------------------------------------------------ */
/*  Charts (raw SVG so print rasterises cleanly)                       */
/* ------------------------------------------------------------------ */

function PillarBars({ pillars }: { pillars: Pillar[] }) {
  const max = 25;
  return (
    <div className="pillar-bars">
      {pillars.map((p) => (
        <div key={p.name} className="pillar-bar-row">
          <div className="pillar-bar-name">{p.name}</div>
          <div className="pillar-bar-track">
            <div
              className={`pillar-bar-fill pillar-bar-${p.status}`}
              style={{ width: `${(p.score / max) * 100}%` }}
            />
            <div className="pillar-bar-label">{p.score}/25</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CashFlowWaterfall({
  income,
  expenses,
  emis,
  savings,
  surplus,
}: {
  income: number;
  expenses: number;
  emis: number;
  savings: number;
  surplus: number;
}) {
  const total = Math.max(income, 1);
  const segments = [
    { label: "Expenses", value: expenses, cls: "cf-expenses" },
    { label: "EMIs", value: emis, cls: "cf-emis" },
    { label: "Savings", value: savings, cls: "cf-savings" },
    { label: "Free", value: Math.max(0, surplus), cls: "cf-surplus" },
  ].filter((s) => s.value > 0);

  return (
    <div className="cf">
      <div className="cf-bar">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`cf-seg ${s.cls}`}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="cf-legend">
        {segments.map((s) => (
          <div key={s.label} className="cf-leg-item">
            <span className={`cf-swatch ${s.cls}`} />
            <span className="cf-leg-label">{s.label}</span>
            <span className="cf-leg-val">
              {pct(s.value / income, 0)} · {money(s.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SipChart({
  projections,
}: {
  projections: { year: number; invested: number; projectedValue: number }[];
}) {
  if (projections.length === 0) return null;
  const W = 760;
  const H = 220;
  const PAD = 28;
  const maxV = Math.max(...projections.map((p) => p.projectedValue));
  const xStep = (W - PAD * 2) / (projections.length - 1);
  const y = (v: number) => H - PAD - (v / maxV) * (H - PAD * 2);
  const x = (i: number) => PAD + i * xStep;

  const areaPath =
    `M ${x(0)} ${H - PAD} ` +
    projections
      .map((p, i) => `L ${x(i)} ${y(p.projectedValue)}`)
      .join(" ") +
    ` L ${x(projections.length - 1)} ${H - PAD} Z`;

  const investedPath =
    `M ${x(0)} ${y(projections[0].invested)} ` +
    projections.slice(1).map((p, i) => `L ${x(i + 1)} ${y(p.invested)}`).join(" ");

  const valuePath =
    `M ${x(0)} ${y(projections[0].projectedValue)} ` +
    projections
      .slice(1)
      .map((p, i) => `L ${x(i + 1)} ${y(p.projectedValue)}`)
      .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sip-chart" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F4E78" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1F4E78" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={PAD}
          x2={W - PAD}
          y1={H - PAD - g * (H - PAD * 2)}
          y2={H - PAD - g * (H - PAD * 2)}
          stroke="#E5E1D7"
          strokeWidth="1"
        />
      ))}
      {/* baseline */}
      <line
        x1={PAD}
        x2={W - PAD}
        y1={H - PAD}
        y2={H - PAD}
        stroke="#1A1A18"
        strokeWidth="1"
      />
      {/* invested area fill */}
      <path d={areaPath} fill="url(#sipGrad)" />
      {/* invested line */}
      <path
        d={investedPath}
        fill="none"
        stroke="#6E6A60"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {/* value line */}
      <path d={valuePath} fill="none" stroke="#1F4E78" strokeWidth="2.5" />
      {/* end label */}
      <text
        x={x(projections.length - 1) - 6}
        y={y(projections[projections.length - 1].projectedValue) - 8}
        fontSize="11"
        fontWeight="700"
        fill="#1F4E78"
        textAnchor="end"
      >
        {money(projections[projections.length - 1].projectedValue)}
      </text>
      {/* x labels */}
      {projections.map((p, i) =>
        i === 0 || i === projections.length - 1 || i % 2 === 1 ? (
          <text
            key={p.year}
            x={x(i)}
            y={H - PAD + 14}
            fontSize="10"
            fill="#6E6A60"
            textAnchor="middle"
          >
            Yr {p.year}
          </text>
        ) : null,
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

function Cover({
  data,
  output,
}: {
  data: FinancialData;
  output: CalculationOutput;
}) {
  const score = output.healthScore;
  return (
    <section className="sheet sheet-cover">
      <div className="cover-top">
        <div className="brand">
          <span className="brand-mark">W</span>
          <span className="brand-text">Warikoo</span>
        </div>
        <div className="cover-meta">
          <div>Financial Health Report</div>
          <div className="cover-date">{todayLong()}</div>
        </div>
      </div>

      <div className="cover-recipient">
        <div className="kicker">Prepared for</div>
        <h1 className="cover-name">{data.personal.name?.trim() || "—"}</h1>
        <div className="cover-sub">
          Age {data.personal.age}
          <span className="dot" />
          {data.personal.dependents} dependents
          <span className="dot" />
          {data.personal.taxRegime} regime
        </div>
      </div>

      <div className="cover-title-block">
        <h2 className="cover-eyebrow">An honest look at</h2>
        <h2 className="cover-headline">
          your money,
          <br />
          measured.
        </h2>
        <p className="cover-blurb">
          Cash flow, debt, protection, goals — scored on the framework
          popularised by Ankur Warikoo. No fluff. Just numbers and the
          decisions they imply.
        </p>
      </div>

      <div className="cover-score">
        <div className="score-meta">
          <div className="kicker kicker-on-dark">Warikoo Health Score</div>
          <div className="score-grade">Grade {score.grade}</div>
        </div>
        <div className="score-number">
          <span className="score-num">{score.score}</span>
          <span className="score-denom">/100</span>
        </div>
        <p className="score-verdict">{score.verdict}</p>
      </div>

      <div className="cover-pillars">
        <div className="kicker">The four pillars</div>
        <div className="cover-pillar-grid">
          {score.pillars.map((p) => (
            <div key={p.name} className="cover-pillar">
              <div className={`pillar-tick pillar-tick-${p.status}`} />
              <div className="cover-pillar-name">{p.name}</div>
              <div className="cover-pillar-score">
                {p.score}<span className="cover-pillar-of">/25</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cover-foot">
        <span>Confidential · Personal use only</span>
        <span>Page 1</span>
      </div>
    </section>
  );
}

function ExecutiveSummary({
  data,
  output,
}: {
  data: FinancialData;
  output: CalculationOutput;
}) {
  const cf = output.cashFlow;
  return (
    <section className="sheet">
      <SheetHeader title="Executive Summary" section="01" />

      <div className="kpi-grid kpi-grid-4">
        <Kpi label="Income" value={money(cf.totalIncome)} />
        <Kpi label="Expenses" value={money(cf.totalExpenses)} />
        <Kpi label="EMIs" value={money(cf.totalEmis)} />
        <Kpi label="Savings" value={money(cf.totalSavings)} />
      </div>

      <h3 className="sub-h">Where the rupee goes</h3>
      <CashFlowWaterfall
        income={cf.totalIncome}
        expenses={cf.totalExpenses}
        emis={cf.totalEmis}
        savings={cf.totalSavings}
        surplus={Math.max(0, cf.surplusOrDeficit)}
      />

      <div className="kpi-grid kpi-grid-3">
        <Kpi
          label="Surplus / deficit"
          value={moneySigned(cf.surplusOrDeficit)}
          tone={cf.surplusOrDeficit < 0 ? "bad" : "good"}
          big
        />
        <Kpi
          label="Savings rate"
          value={pct(cf.savingsRate, 1)}
          tone={cf.savingsRate >= 0.2 ? "good" : "bad"}
          big
          benchmark="Target ≥ 20%"
        />
        <Kpi
          label="EMI ratio"
          value={pct(cf.emiRatio, 1)}
          tone={cf.emiRatio <= 0.4 ? "good" : "bad"}
          big
          benchmark="Limit ≤ 40%"
        />
      </div>

      <h3 className="sub-h">The four pillars at a glance</h3>
      <PillarBars pillars={output.healthScore.pillars} />

      <div className="pillar-headlines">
        {output.healthScore.pillars.map((p) => (
          <div key={p.name} className={pillarClass(p.status)}>
            <div className={`pillar-dot pillar-dot-${p.status}`} />
            <div className="pillar-name">{p.name}</div>
            <div className="pillar-headline">{p.headline}</div>
          </div>
        ))}
      </div>

      <SheetFoot page={2} />
    </section>
  );
}

function RedFlagsSection({ output }: { output: CalculationOutput }) {
  if (output.redFlags.length === 0) {
    return (
      <section className="sheet">
        <SheetHeader title="Red Flags" section="02" />
        <p className="empty">
          No critical issues detected. Stress-test the plan as life events
          change.
        </p>
        <SheetFoot page={3} />
      </section>
    );
  }
  return (
    <section className="sheet">
      <SheetHeader title="Red Flags" section="02" />
      <p className="lede">
        Issues, ranked by severity. Each one names the problem and the fix.
      </p>
      <div className="flag-list">
        {output.redFlags.map((f, i) => (
          <div key={i} className={severityClass(f.severity)}>
            <div className="flag-tag">
              <span className="flag-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="flag-sev">{f.severity}</span>
            </div>
            <h3 className="flag-title">{f.title}</h3>
            <p className="flag-detail">{f.detail}</p>
            <div className="flag-fix">
              <span className="flag-fix-label">Fix</span>
              <span>{f.fix}</span>
            </div>
          </div>
        ))}
      </div>
      <SheetFoot page={3} />
    </section>
  );
}

function LoanSection({
  data,
  output,
}: {
  data: FinancialData;
  output: CalculationOutput;
}) {
  if (data.loans.length === 0) {
    return (
      <section className="sheet">
        <SheetHeader title="Loan Strategy" section="03" />
        <p className="empty">No active loans recorded. Stay debt-light.</p>
        <SheetFoot page={4} />
      </section>
    );
  }
  const loanById = new Map(data.loans.map((l) => [l.id, l]));
  const ranked = [...output.loanStrategy].sort(
    (a, b) => a.priority - b.priority,
  );
  return (
    <section className="sheet">
      <SheetHeader title="Loan Strategy" section="03" />
      <p className="lede">
        Ordered by what to tackle first. Avalanche over snowball — math beats
        psychology over a 5-year horizon.
      </p>
      <table className="report-table">
        <thead>
          <tr>
            <th style={{ width: "8%" }}>#</th>
            <th>Loan</th>
            <th>Type</th>
            <th className="num">Principal</th>
            <th className="num">Rate</th>
            <th className="num">EMI</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((s) => {
            const ln = loanById.get(s.loanId);
            return (
              <tr key={s.loanId}>
                <td>
                  <span className="rank-pill">{s.priority}</span>
                </td>
                <td className="b">{s.loanName}</td>
                <td>{ln?.type}</td>
                <td className="num">{ln ? money(ln.principal) : "—"}</td>
                <td className="num">{ln ? `${ln.ratePercent}%` : "—"}</td>
                <td className="num">{ln ? money(ln.monthlyEmi) : "—"}</td>
                <td>
                  <span className={`rec-badge rec-${s.recommendation}`}>
                    {s.recommendation.replace("-", " ")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="sub-h">Reasoning</h3>
      <ol className="reason-list">
        {ranked.map((s) => (
          <li key={s.loanId}>
            <div className="reason-h">
              <span className="reason-num">{s.priority}.</span>
              <span className="reason-name">{s.loanName}</span>
              <span className={`rec-badge rec-${s.recommendation}`}>
                {s.recommendation.replace("-", " ")}
              </span>
            </div>
            <p>{s.reasoning}</p>
            {s.interestSaved && s.interestSaved > 0 ? (
              <p className="reason-saving">
                <strong>Estimated savings:</strong> {money(s.interestSaved)} in
                interest
                {s.monthsSaved ? `, ${s.monthsSaved} months earlier.` : "."}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
      <SheetFoot page={4} />
    </section>
  );
}

function GoalsSection({
  data,
  output,
}: {
  data: FinancialData;
  output: CalculationOutput;
}) {
  if (data.goals.length === 0) {
    return (
      <section className="sheet">
        <SheetHeader title="Goals & Feasibility" section="04" />
        <p className="empty">
          No goals recorded. Add at least one (retirement, home, child) for a
          complete plan.
        </p>
        <SheetFoot page={5} />
      </section>
    );
  }
  const onTrack = output.goalFeasibility.filter((f) => f.onTrack).length;
  const total = output.goalFeasibility.length;
  return (
    <section className="sheet">
      <SheetHeader title="Goals & Feasibility" section="04" />
      <div className="goal-summary">
        <div>
          <span className="big-num">{onTrack}</span>
          <span className="big-denom">/ {total}</span>
          <div className="kicker">on track</div>
        </div>
        <p className="lede">
          Each goal inflated to its target year, then back-solved into a
          required monthly SIP. A gap means current savings won't get you
          there.
        </p>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Goal</th>
            <th className="num">Target</th>
            <th className="num">Years</th>
            <th className="num">Future cost</th>
            <th className="num">Required SIP</th>
            <th className="num">Shortfall</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {output.goalFeasibility.map((f) => {
            const g = data.goals.find((x) => x.id === f.goalId);
            return (
              <tr key={f.goalId}>
                <td className="b">{f.goalName}</td>
                <td className="num">{g?.targetYear}</td>
                <td className="num">{f.yearsRemaining}</td>
                <td className="num">{money(f.futureCost)}</td>
                <td className="num">{money(f.requiredMonthlySip)}</td>
                <td className="num">
                  {f.shortfall > 0 ? money(f.shortfall) : "—"}
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      f.onTrack ? "status-ok" : "status-gap"
                    }`}
                  >
                    {f.onTrack ? "on track" : "gap"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <SheetFoot page={5} />
    </section>
  );
}

function SipSection({ output }: { output: CalculationOutput }) {
  const ps = output.sipProjections;
  if (ps.length === 0) return null;
  const final = ps[ps.length - 1];
  const wealth = final.projectedValue - final.invested;
  return (
    <section className="sheet">
      <SheetHeader title="SIP Projections" section="05" />
      <p className="lede">
        Wealth path assuming current monthly SIP, 10% annual step-up and 12%
        equity CAGR.
      </p>
      <SipChart projections={ps} />
      <div className="kpi-grid kpi-grid-4">
        <Kpi label="Horizon" value={`${final.year} yrs`} />
        <Kpi label="Total invested" value={money(final.invested)} />
        <Kpi label="Wealth created" value={money(wealth)} tone="good" big />
        <Kpi
          label="Projected value"
          value={money(final.projectedValue)}
          big
        />
      </div>
      <table className="report-table report-table-tight">
        <thead>
          <tr>
            <th>Year</th>
            <th className="num">Invested</th>
            <th className="num">Projected value</th>
            <th className="num">Wealth created</th>
          </tr>
        </thead>
        <tbody>
          {ps.map((p) => (
            <tr key={p.year}>
              <td className="b">Yr {p.year}</td>
              <td className="num">{money(p.invested)}</td>
              <td className="num">{money(p.projectedValue)}</td>
              <td className="num pos">
                {money(p.projectedValue - p.invested)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SheetFoot page={6} />
    </section>
  );
}

function ActionPlanSection({ output }: { output: CalculationOutput }) {
  return (
    <section className="sheet">
      <SheetHeader title="Action Plan" section="06" />
      <p className="lede">
        Concrete moves per pillar, ordered by priority. Tackle the red items
        first.
      </p>
      <div className="action-list">
        {output.healthScore.pillars.map((p) => (
          <div key={p.name} className={`action-block action-${p.status}`}>
            <div className="action-h">
              <div className={`pillar-dot pillar-dot-${p.status}`} />
              <h3 className="action-name">{p.name}</h3>
              <span className="action-score">
                {p.score}/25 · {p.status}
              </span>
            </div>
            <p className="action-headline">{p.headline}</p>
            {p.commentary ? (
              <p className="action-comm">{p.commentary}</p>
            ) : null}
            {p.actions.length > 0 && (
              <ul className="action-bullets">
                {p.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="disclaimer">
        <strong>Disclaimer.</strong> This report is informational and not
        investment advice. Calculations assume the inputs you provided are
        accurate. Markets carry risk; past returns do not guarantee future
        performance. Consult a SEBI-registered advisor before acting on any
        recommendation.
      </div>
      <SheetFoot page={7} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bits                                                               */
/* ------------------------------------------------------------------ */

function Kpi({
  label,
  value,
  tone,
  big,
  benchmark,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
  big?: boolean;
  benchmark?: string;
}) {
  return (
    <div className={`kpi ${big ? "kpi-big" : ""} ${tone ? `kpi-${tone}` : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {benchmark ? <div className="kpi-bench">{benchmark}</div> : null}
    </div>
  );
}

function SheetHeader({ title, section }: { title: string; section: string }) {
  return (
    <header className="sheet-header">
      <div className="sheet-section">Section {section}</div>
      <h2 className="sheet-title">{title}</h2>
      <div className="sheet-rule" />
    </header>
  );
}

function SheetFoot({ page }: { page: number }) {
  return (
    <div className="sheet-foot">
      <span>Warikoo Health Report</span>
      <span>Confidential · Personal use only</span>
      <span>Page {page}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReportPage() {
  const storeData = useFinancialStore((s) => s.data);
  const data = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "1") return demoFinancialData;
    }
    return storeData;
  }, [storeData]);
  const output = React.useMemo(() => calculateAll(data), [data]);

  const hasNoData =
    data.income.salary === 0 &&
    data.income.sideIncome === 0 &&
    data.income.otherIncome === 0 &&
    data.loans.length === 0 &&
    data.goals.length === 0;

  const handlePrint = React.useCallback(() => window.print(), []);

  // If launched with ?print=1, fire the print dialog once layout & fonts settle.
  React.useEffect(() => {
    if (hasNoData) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") !== "1") return;
    const ready =
      "fonts" in document ? document.fonts.ready : Promise.resolve();
    let timer = 0;
    ready.then(() => {
      timer = window.setTimeout(() => window.print(), 400);
    });
    return () => window.clearTimeout(timer);
  }, [hasNoData]);

  if (hasNoData) {
    return (
      <main className="report-empty">
        <div>
          <h1>No data yet</h1>
          <p>
            Fill in your finances in the calculator first — we&apos;ll build
            the report from your numbers.
          </p>
          <Link href="/calculator" className="empty-cta">
            Start the calculator
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="report-root">
      <div className="report-toolbar">
        <Link href="/results" className="tb-link">
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>
        <div className="tb-title">Report preview</div>
        <button onClick={handlePrint} className="tb-print">
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>

      <div className="report-stage">
        <Cover data={data} output={output} />
        <ExecutiveSummary data={data} output={output} />
        <RedFlagsSection output={output} />
        <LoanSection data={data} output={output} />
        <GoalsSection data={data} output={output} />
        <SipSection output={output} />
        <ActionPlanSection output={output} />
      </div>
    </main>
  );
}
