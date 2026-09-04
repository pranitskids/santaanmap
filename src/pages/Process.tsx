import { ArrowRight, MessageCircleHeart, QrCode, Route, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { journeyTopics } from "../data/companion";
import { santaanCarePaths, santaanFounderValuePoints } from "../data/site";
import { buildWhatsAppLink } from "../lib/api";
import { env } from "../lib/env";

export default function Process() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 px-6 pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Route className="h-4 w-4" />
            Santaan Care Paths
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Topic-First Journeys For Ads, QR, Website, And Ongoing Care
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Santaan Companion is built around what the patient needs right now: quick understanding,
            mobile actions, WhatsApp continuation, and CRM-ready handoff.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <QrCode className="h-4 w-4 text-cyan-300" />
                Entry logic
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Each care path can open directly from a parameterized URL such as{" "}
                <code className="text-cyan-200">?topic=low-amh&source=meta-ad</code> or{" "}
                <code className="text-cyan-200">?topic=pre-icsi&source=clinic-qr&mode=patient</code>.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Source and campaign attribution stay attached to the visit",
                  "Topic choice reshapes the hero copy and CTA order",
                  "Patient mode can open directly for existing Santaan patients",
                  "WhatsApp and consult actions keep the same context for CRM handoff",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <MessageCircleHeart className="h-4 w-4" />
                Fast mobile actions
              </div>
              <p className="mt-3 text-sm leading-6 text-cyan-50/90">
                The patient should never have to hunt through long navigation. Every path is built
                around fast scanning and one-handed action on mobile.
              </p>
              <div className="mt-4 space-y-3">
                {["Send To WhatsApp", "Talk To Santaan", "Book Consultation", "Switch To Patient Mode"].map((item) => (
                  <div key={item} className="rounded-2xl border border-cyan-400/20 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-4">
          {santaanCarePaths.map((path) => (
            <div key={path.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-300">{path.audience}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{path.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{path.summary}</p>
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-white">What happens next</p>
                    <div className="mt-3 space-y-2">
                      {path.nextActions.map((item) => (
                        <div key={item} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-white">Signals to capture</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {path.signals.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={path.id === "already-in-treatment" ? "/?mode=patient&stage=in-treatment" : "/"}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white"
                  >
                    {path.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">Founder view</p>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              Why the Santaan founder should care about Map.Santaan
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50/90">
              This is not another brochure microsite. It is a patient-intent operating layer that helps Santaan attract,
              qualify, convert, support, retain, and re-engage fertility patients through one coherent mobile journey.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {santaanFounderValuePoints.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  <p className="mt-3 text-xs font-medium text-cyan-200">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-300" />
            <h2 className="text-2xl font-bold text-white">High-priority topic journeys</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {journeyTopics.map((topic) => (
              <div key={topic.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">{topic.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{topic.concern}</p>
                <p className="mt-3 text-xs text-slate-500">{topic.heroTag}</p>
                <Link
                  to={`/?topic=${topic.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                >
                  Open topic landing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Need A Live Santaan Follow-Up Route?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Use WhatsApp as the lowest-friction continuation channel, then let the CRM or care team
            pick up the context with source, topic, and stage already attached.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={buildWhatsAppLink(`Hi ${env.clinicName}, I want to continue from the Santaan Companion and understand the right next step for me.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
            >
              Continue On WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Review CRM FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
