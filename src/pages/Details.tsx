import { ArrowRight, AlertTriangle, DollarSign, ChevronDown, Shield, BarChart3, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { riskFactors, costEstimates, successFactors, faqData } from "../data/site";

export default function Details() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 px-6 pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            <BarChart3 className="h-4 w-4" />
            Risks, Costs & Success Rates
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Making Informed Decisions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            A balanced view of the medical risks, financial investment, and realistic success
            statistics to help you and your family plan ahead.
          </p>
        </div>
      </section>

      {/* Risks Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Medical Risks & Complications</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {riskFactors.map((risk) => (
              <div
                key={risk.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{risk.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    risk.severity === "Common" ? "bg-yellow-500/10 text-yellow-300" :
                    risk.severity === "Moderate" ? "bg-orange-500/10 text-orange-300" :
                    "bg-red-500/10 text-red-300"
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{risk.description}</p>
                <div className="mt-3 rounded-xl border border-blue-400/10 bg-blue-500/5 p-3">
                  <p className="text-xs font-medium text-blue-300">Management</p>
                  <p className="mt-0.5 text-xs text-blue-200/70">{risk.management}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Costs Section */}
      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cost Considerations</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* India costs */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{costEstimates.india.heading}</h3>
              <div className="mt-4 space-y-2">
                {costEstimates.india.ranges.map((item) => (
                  <div
                    key={item.item}
                    className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5"
                  >
                    <span className="text-sm text-slate-300">{item.item}</span>
                    <span className="text-sm font-medium text-green-400">{item.range}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">{costEstimates.india.note}</p>
            </div>
            {/* Global comparison */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{costEstimates.global.heading}</h3>
              <div className="mt-4 space-y-2">
                {costEstimates.global.ranges.map((item) => (
                  <div
                    key={item.item}
                    className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5"
                  >
                    <span className="text-sm text-slate-300">{item.item}</span>
                    <span className="text-sm font-medium text-blue-400">{item.range}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-amber-400/10 bg-amber-500/5 p-4">
                <p className="text-xs font-medium text-amber-300">💡 Starting in Bengaluru?</p>
                <p className="mt-1 text-xs text-amber-200/70">
                  Many clinics in Indiranagar, Koramangala, and HSR Layout offer comprehensive
                  packages starting at ₹1.2L with EMI options. Ask about bundled cycle discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Rates */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Success Rates</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {successFactors.map((factor) => (
              <div
                key={factor.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
              >
                <p className="text-xs text-slate-500">{factor.title}</p>
                <p className="mt-2 text-xl font-bold text-green-400">{factor.value}</p>
                <p className="mt-1 text-xs text-slate-500">{factor.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center text-xs text-slate-500">
            Success rates are based on published data from the Society for Assisted Reproductive
            Technology (SART) and the Indian Society of Assisted Reproduction. Individual results
            vary significantly.
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqData.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/[0.07]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-slate-200">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-white/5 px-5 py-4 text-sm leading-relaxed text-slate-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Need Emotional Support?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            The IVF journey is about more than just medical procedures. Explore our support
            resources for counseling, groups, and wellness tips.
          </p>
          <Link
            to="/support"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
          >
            Find Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
