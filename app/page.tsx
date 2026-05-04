import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const faqs = [
  {
    q: "Is my data sent anywhere?",
    a: "No. Every calculation runs in your browser. We use localStorage to remember your inputs across visits — that's it. No servers, no analytics, no tracking. Verify in your browser's network tab.",
  },
  {
    q: "How accurate are the projections?",
    a: "We use 12% CAGR for equity SIPs (historical Nifty 50 average), 8% for short-term safe instruments, and 10% annual SIP step-up. These match Warikoo's defaults from his Money Matters series. Real returns vary — markets aren't smooth.",
  },
  {
    q: "Is this really free? What's the catch?",
    a: "Free, fully. No premium tier, no upsells, no email capture. Built as a public-good tool for the Indian middle class who get fleeced by LIC agents and bank RMs. The only ask: tell a friend who needs it.",
  },
  {
    q: "How long does it take?",
    a: "5-8 minutes if you have your salary, expense estimate, loan details, and rough asset values handy. The Demo Data button shows you the format with a sample profile.",
  },
  {
    q: "Why Ankur Warikoo's framework?",
    a: "Because his rules are unfussy and tested: 50/30/20 budget, 6-month emergency fund, term + health insurance before any investing, kill high-interest debt before SIPs, step-up SIP every year. Boring works. We coded it up.",
  },
  {
    q: "Is this affiliated with Ankur Warikoo?",
    a: "No. This is an independent educational tool inspired by his publicly-shared Money Matters framework. We don't speak for him.",
  },
  {
    q: "Can I export or share my results?",
    a: "Yes — one-click PDF export of your full report. The share button copies the page URL (your data lives in localStorage, not the URL, so it stays private).",
  },
  {
    q: "What if my situation is unusual?",
    a: "The calculator handles most middle-class Indian scenarios. For complex situations (NRIs, business owners, rental property, multiple insurance policies, RSUs), use this as a starting point — then consult a SEBI-registered fee-only advisor.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Top nav — minimal, no logo box */}
      <nav className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight"
          >
            Warikoo<span className="text-accent">.</span>Calc
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="#methodology"
              className="hidden text-muted-foreground hover:text-foreground sm:inline"
            >
              Methodology
            </Link>
            <Link
              href="#faq"
              className="text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
            <ThemeToggle />
            <Link href="/calculator">
              <Button className="rounded-none bg-foreground font-medium text-background hover:bg-foreground/90">
                Start
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — asymmetric, editorial, no centered CTA */}
      <section className="border-b border-foreground/15">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-32">
          {/* Headline column — 7 cols */}
          <div className="md:col-span-7 md:pr-8">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Issue 01 · Personal Finance · Free
            </p>
            <h1 className="mt-8 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-light leading-[0.95] tracking-tight">
              Your money,{" "}
              <span className="italic text-accent" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
                honestly
              </span>{" "}
              scored.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A financial health calculator built on Ankur Warikoo&apos;s framework.
              No fluff. No upsell. Just math applied to your actual numbers — and
              the truth about which loans to kill, what to insure, where your money
              should compound.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/calculator">
                <Button
                  size="lg"
                  className="rounded-none bg-accent text-base font-medium text-accent-foreground hover:bg-accent/90"
                >
                  Run my numbers
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <span className="font-mono text-xs text-muted-foreground">
                ~5 min · No signup · Stays in your browser
              </span>
            </div>
          </div>

          {/* Editorial sidebar — 5 cols, contains "the spec" */}
          <aside className="md:col-span-5 md:border-l md:border-foreground/15 md:pl-10">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              The spec
            </p>

            <dl className="mt-6 space-y-5 font-mono text-sm">
              <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-3">
                <dt className="text-muted-foreground">Score scale</dt>
                <dd className="tabular-nums">0&ndash;100</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-3">
                <dt className="text-muted-foreground">Pillars measured</dt>
                <dd className="tabular-nums">04</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-3">
                <dt className="text-muted-foreground">Reports generated</dt>
                <dd className="tabular-nums">08</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-3">
                <dt className="text-muted-foreground">Inputs requested</dt>
                <dd className="tabular-nums">~40</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-3">
                <dt className="text-muted-foreground">Time to complete</dt>
                <dd>5&ndash;8 min</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">Data sent to server</dt>
                <dd className="text-accent">none</dd>
              </div>
            </dl>

            <p className="mt-10 border-l-2 border-accent pl-4 font-display text-base italic leading-relaxed">
              &ldquo;Wealth accumulation is more about increasing income than cutting
              costs. There&apos;s no upper limit on earning, only a lower limit on saving.&rdquo;
              <span className="mt-3 block font-sans text-xs not-italic text-muted-foreground">
                — Ankur Warikoo, Money Matters
              </span>
            </p>
          </aside>
        </div>
      </section>

      {/* What you get — editorial section, NOT a 4-icon grid */}
      <section id="methodology" className="border-b border-foreground/15">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            §01 — What you get
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
            Eight reports.
            <br />
            One PDF.
            <br />
            <span className="italic text-accent">Zero ads.</span>
          </h2>

          <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">01</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Warikoo Health Score
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                A single 0&ndash;100 number across four pillars: Cash Flow,
                Protection, Wealth, Debt. Each scored out of 25, ruthlessly.
                Letter grade + verdict in plain English.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">02</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Red flag detection
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Eight anti-pattern checks. Investing while drowning in EMIs?
                LIC endowment masquerading as investment? Toxic credit-card debt?
                We surface the issues your bank&apos;s RM won&apos;t.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">03</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Loan prepayment strategy
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Debt-avalanche order. Months saved with ₹2k extra/month. Tax
                impact (80E for edu loans). Concrete prepay-now / continue /
                refinance recommendation per loan.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">04</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                SIP projections (with step-up)
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                5/10/15/20/25/30-year corpus at 12% CAGR with 10% annual step-up.
                Adjustable SIP slider so you can model what ₹5k vs ₹15k does
                to your retirement.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">05</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Goal feasibility
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Inflation-adjusted future cost. Required SIP at 8% (short-term)
                or 12% (long). Honest verdict: feasible / tight / not feasible.
                Bike, home, marriage, retirement — same engine.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">06</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Compare scenarios
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Your current allocation vs Warikoo Recommended vs Aggressive.
                Same income, three rebalances. See the 10-year corpus delta —
                often ₹40+ Lakhs of opportunity.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">07</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Personalised action plan
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Phase-by-phase plan with specific ₹ amounts and target dates,
                derived from your data. Phase 1 emergency fund, Phase 2 kill
                high-interest debt, Phase 3 SIP, Phase 4 goals.
              </p>
            </article>

            <article className="border-t border-foreground/30 pt-6">
              <p className="font-mono text-xs text-muted-foreground">08</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                Branded PDF export
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                One-click. Multi-page A4. Goes to your CA, your spouse, or
                your future self. Generated in your browser — your data
                doesn&apos;t leave the device.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* The framework — long-form editorial */}
      <section className="border-b border-foreground/15 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            §02 — The framework
          </p>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Four pillars,{" "}
            <span className="italic text-accent">in this order.</span>
          </h2>

          <div className="mt-12 space-y-10 text-lg leading-relaxed">
            <div className="grid gap-4 md:grid-cols-[auto_1fr]">
              <span className="font-display text-5xl font-light text-accent md:text-6xl">
                01
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Emergency Fund — six months of survival cost
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Liquid FD or sweep account. Never equity. Until this is built,
                  pause SIPs. The math is unromantic but the rule is unbreakable.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[auto_1fr]">
              <span className="font-display text-5xl font-light text-accent md:text-6xl">
                02
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Insurance — pure term, real health cover
                </h3>
                <p className="mt-2 text-muted-foreground">
                  10× annual income in term life if you have dependents. ₹3-10L
                  health floater. Endowment / money-back / ULIP are insurance
                  AND investment done badly.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[auto_1fr]">
              <span className="font-display text-5xl font-light text-accent md:text-6xl">
                03
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Debt — kill anything above 9%
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Reduce tenure, not EMI. Avalanche by interest rate. Toxic debt
                  (≥18%) gets every spare rupee. SIPs wait until your blended
                  rate beats expected equity returns.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[auto_1fr]">
              <span className="font-display text-5xl font-light text-accent md:text-6xl">
                04
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Investments — boring, automated, stepped up
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Index 60% / mid-small 30% / debt-gold 10%. Step up SIP 10%
                  every year. Time IN the market beats timing the market. Don&apos;t
                  pick stocks. Don&apos;t chase F&amp;O. Stay boring, win.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — editorial style */}
      <section id="faq" className="border-b border-foreground/15">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            §03 — FAQ
          </p>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
            What you&apos;ll ask{" "}
            <span className="italic text-accent">before clicking start.</span>
          </h2>
          <Accordion className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="py-5 text-left font-display text-xl font-medium tracking-tight">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA — editorial, asymmetric */}
      <section className="border-b border-foreground/15 bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] opacity-60">
              §04 — Now
            </p>
            <h2 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
              See the truth.
              <br />
              <span className="italic" style={{ color: "var(--color-accent)" }}>
                Then act on it.
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start justify-center md:col-span-5">
            <p className="text-lg leading-relaxed opacity-80">
              You&apos;ve got 5 minutes. Your bank app, last salary slip, and rough
              estimates of expenses are enough to start.
            </p>
            <Link href="/calculator" className="mt-6">
              <Button
                size="lg"
                className="rounded-none bg-accent text-base font-medium text-accent-foreground hover:bg-accent/90"
              >
                Run my numbers
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-base font-bold tracking-tight">
                Warikoo<span className="text-accent">.</span>Calc
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A free, private financial calculator inspired by Ankur Warikoo&apos;s
                Money Matters framework. Built for India.
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Methodology
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>50/30/20 budget rule</li>
                <li>6-month emergency fund</li>
                <li>10× income term cover</li>
                <li>Debt avalanche prepayment</li>
                <li>12% equity CAGR · 10% step-up</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Privacy
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>No accounts, no signup</li>
                <li>No analytics, no tracking</li>
                <li>Data stays in your browser</li>
                <li>Open methodology</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-foreground/15 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p className="max-w-xl leading-relaxed">
              Not affiliated with Ankur Warikoo. Educational tool, not financial advice.
              Always verify with a SEBI-registered fee-only advisor before major decisions.
            </p>
            <p className="font-mono">© {new Date().getFullYear()} · v1</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
