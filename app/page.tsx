import Link from "next/link";
import {
  Activity,
  Target,
  Banknote,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Zap,
  IndianRupee,
  Lock,
  Code2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const features = [
  {
    icon: Activity,
    title: "Health Score",
    description:
      "A single 0-100 number that tells you how your finances actually look. Four pillars, no sugar-coating.",
  },
  {
    icon: Target,
    title: "Goal Tracker",
    description:
      "Inflate your dreams, then check if your SIPs are getting you there. House. Retirement. Kid's education.",
  },
  {
    icon: Banknote,
    title: "Loan Prepayment",
    description:
      "Which loan to kill first. Debt avalanche math, EMI savings, payoff timelines. Warikoo would approve.",
  },
  {
    icon: TrendingUp,
    title: "SIP Projections",
    description:
      "Compound your SIPs at realistic returns. 10% step-up built in. Year-by-year wealth curve.",
  },
];

const trustChips = [
  { icon: Lock, label: "100% private" },
  { icon: IndianRupee, label: "Built for India" },
  { icon: Zap, label: "Free, no signup" },
  { icon: Code2, label: "Open methodology" },
];

const faqs = [
  {
    q: "Is my data sent anywhere?",
    a: "No. Every calculation runs in your browser. We use localStorage to remember your inputs across visits — that's it. No servers, no analytics, no tracking. You can verify in your browser's network tab.",
  },
  {
    q: "How accurate are the projections?",
    a: "We use 12% CAGR for equity SIPs (historical Nifty 50 average), 8% for short-term safe instruments, and 10% annual SIP step-up. These match Warikoo's defaults from his Money Matters series. Real returns will vary — markets aren't smooth.",
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
    a: "The calculator handles most middle-class Indian scenarios. For complex situations (NRIs, business owners, rental property, multiple insurance policies, RSUs), use this as a starting point and consult a SEBI-registered fee-only advisor.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-warikoo-blue)] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base md:text-lg">Warikoo Calculator</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#faq" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
              FAQ
            </Link>
            <Link href="/calculator">
              <Button
                size="sm"
                style={{
                  backgroundColor: "var(--color-warikoo-blue)",
                  color: "white",
                }}
              >
                Start
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, var(--color-warikoo-accent-soft), transparent), radial-gradient(circle at 90% 80%, var(--color-warikoo-blue-50), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Left col */}
            <div className="animate-fadeUp">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-pillar-green)]" />
                Built on Ankur Warikoo&apos;s Money Matters framework
              </div>
              <h1 className="mt-6 text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Honest money advice.{" "}
                <span style={{ color: "var(--color-warikoo-blue)" }}>
                  Yours,
                </span>{" "}
                in 5 minutes.
              </h1>
              <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Score your financial health. See which loans to kill first. Project your SIP corpus. All math, no fluff, no signup.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/calculator">
                  <Button
                    size="lg"
                    className="w-full text-base shadow-lg sm:w-auto"
                    style={{
                      backgroundColor: "var(--color-warikoo-blue)",
                      color: "white",
                      boxShadow: "0 10px 25px -5px rgba(31, 78, 120, 0.25)",
                    }}
                  >
                    Start Calculator
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full text-base sm:w-auto">
                    See what you get
                  </Button>
                </Link>
              </div>

              {/* Trust chips */}
              <div className="mt-8 flex flex-wrap gap-2">
                {trustChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <chip.icon className="h-3 w-3" />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right col — score preview */}
            <div className="hidden md:flex md:items-center md:justify-center">
              <ScorePreview />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to clarity
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Input",
                copy: "Enter income, expenses, loans, assets, insurance, goals. Demo data button if you want to see it first.",
              },
              {
                num: "02",
                title: "Analyze",
                copy: "We score your finances against Warikoo's framework — 4 pillars, red flags, cash flow, loan strategy.",
              },
              {
                num: "03",
                title: "Plan",
                copy: "Get a personalized phase-by-phase action plan with specific ₹ amounts and target dates. Export PDF.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-black tabular-nums"
                  style={{
                    backgroundColor: "var(--color-warikoo-accent-soft)",
                    color: "var(--color-warikoo-blue)",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b bg-[var(--color-surface-subtle)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Reports you get
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Eight reports. One PDF. Zero ads.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--color-warikoo-accent-soft), var(--color-warikoo-accent))",
                    color: "var(--color-warikoo-blue)",
                  }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Common questions
            </h2>
          </div>
          <Accordion className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b">
        <div
          className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, var(--color-warikoo-blue-50), transparent)",
          }}
        >
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see the truth?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            ~5 minutes. Need: salary, expense estimate, loan EMIs, rough assets, insurance covers.
          </p>
          <Link href="/calculator">
            <Button
              size="lg"
              className="mt-6 text-base shadow-lg"
              style={{
                backgroundColor: "var(--color-warikoo-blue)",
                color: "white",
                boxShadow: "0 10px 25px -5px rgba(31, 78, 120, 0.25)",
              }}
            >
              Start Calculator
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[var(--color-surface-subtle)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <Link href="/" className="flex items-center gap-2 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-warikoo-blue)] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                Warikoo Calculator
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Free, private financial health calculator for Indians. Built on Ankur Warikoo&apos;s framework.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Methodology</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>50/30/20 budget rule</li>
                <li>6-month emergency fund</li>
                <li>10× income term cover</li>
                <li>Debt avalanche prepayment</li>
                <li>12% equity CAGR · 10% step-up</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Privacy</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>No accounts, no signup</li>
                <li>No analytics, no tracking</li>
                <li>Data lives in your browser</li>
                <li>Open source methodology</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              Not affiliated with Ankur Warikoo. Educational tool, not financial advice. Always verify with a SEBI-registered advisor before major decisions.
            </p>
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} Warikoo Calculator</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ScorePreview() {
  const score = 72;
  const ringSize = 280;
  const stroke = 16;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div
      className="relative aspect-square w-full max-w-md rounded-3xl border bg-card p-8 shadow-2xl animate-fadeUp"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(31, 78, 120, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pillar-green-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-pillar-green-ink)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pillar-green)]" />
        Sample
      </div>
      <svg
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className="mx-auto h-full w-full"
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="var(--color-warikoo-blue-50)"
          strokeWidth={stroke}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="var(--color-pillar-yellow)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-7xl font-black tabular-nums"
          style={{ color: "var(--color-pillar-yellow-ink)" }}
        >
          {score}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Grade B · Strong start
        </span>
        <span className="mt-2 max-w-[12rem] text-balance text-center text-sm text-muted-foreground">
          Close the red pillars first.
        </span>
      </div>
    </div>
  );
}
