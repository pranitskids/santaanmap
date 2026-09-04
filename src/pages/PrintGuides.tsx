import { useState } from "react";
import { santaanPrintGuides } from "../data/site";
import { Printer, ArrowRight, ChevronDown, MessageCircleHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { buildWhatsAppLink } from "../lib/api";
import { env } from "../lib/env";

export default function PrintGuides() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-green-950/20 to-slate-950 px-6 pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            <Printer className="h-4 w-4" />
            Santaan Handoff Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Printable Sheets For QR, Consult, And Patient Follow-Up
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            These guides are meant to support real Santaan workflows: first consult prep, report
            review, treatment readiness, and stage-specific continuation.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          {santaanPrintGuides.map((phase) => {
            const isOpen = expandedPhase === phase.title;
            return (
              <div
                key={phase.title}
                className={`rounded-2xl border transition-all print:border-2 print:border-black print:bg-white print:text-black ${
                  isOpen ? "border-green-400/30 bg-green-950/30" : "border-white/10 bg-white/5"
                }`}
              >
                <button
                  onClick={() => setExpandedPhase(isOpen ? null : phase.title)}
                  className="flex w-full items-center justify-between p-5 text-left print:cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-white print:text-black">{phase.title}</h3>
                      <p className="text-xs text-slate-400 print:text-gray-600">{phase.useCase}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform print:hidden ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-5 pb-5 print:border-t-2 print:border-gray-300">
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500 print:text-gray-600">Guide Sections</p>
                        <ul className="space-y-1.5">
                          {phase.sections.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-slate-300 print:text-gray-700">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 print:bg-gray-500" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 print:bg-gray-100">
                        <MessageCircleHeart className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300 print:text-gray-600" />
                        <p className="text-sm text-slate-200 print:text-gray-700">
                          Pair this guide with a WhatsApp handoff so the patient can keep the same context after leaving the page or clinic.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/30 print:hidden"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print This Guide
                      </button>
                      <a
                        href={buildWhatsAppLink(`Hi ${env.clinicName}, please send me the ${phase.title} from Santaan Companion on WhatsApp.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10 print:hidden"
                      >
                        <MessageCircleHeart className="h-3.5 w-3.5" />
                        Send On WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Best Uses For These Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Attach to clinic QR codes so waiting-room patients can self-select the right topic.",
              "Use after ad clicks when a patient wants something practical instead of a long landing page.",
              "Send after a counselor call so the patient keeps a calm, structured reminder of next steps.",
              "Use patient mode guides for pre ICSI prep, two-week wait support, and post-cycle follow-up.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Explore The Live Companion Experience
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            The printable guides work best when paired with the topic-first mobile shell and CRM-ready capture flow.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
          >
            Open Companion Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
