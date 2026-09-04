import { Heart, MessageCircleHeart, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { santaanSupportPrograms } from "../data/site";
import { buildWhatsAppLink } from "../lib/api";
import { env } from "../lib/env";

export default function Support() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-950 px-6 pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-4 py-2 text-sm text-pink-300">
            <Heart className="h-4 w-4" />
            Santaan Follow-Up Support
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Support That Continues After The First Click
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Santaan Companion is not meant to stop at education. It should continue the patient
            journey with WhatsApp, callbacks, consult preparation, and patient reassurance.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {santaanSupportPrograms.map((resource) => (
              <div
                key={resource.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <h3 className="mt-3 text-lg font-semibold text-white">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{resource.description}</p>
                <ul className="mt-4 space-y-2">
                  {resource.bullets.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl border border-pink-400/20 bg-pink-500/10 p-3 text-sm text-pink-50">
                  {resource.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">What A Good Santaan Handoff Should Preserve</h2>
            <p className="mt-2 text-slate-400">The minimum context a coordinator or CRM should receive from the frontend</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Who The Patient Is", desc: "Name and WhatsApp number when the patient agrees to continue the journey.", emoji: "👤" },
              { title: "Where They Came From", desc: "Source, campaign ID, and QR code so marketing and clinic teams can attribute intent correctly.", emoji: "📍" },
              { title: "What They Need", desc: "Topic, awareness stage, patient stage, and free-text summary in the patient's own words.", emoji: "🩺" },
              { title: "What They Asked For", desc: "WhatsApp guide request, consult intent, or care-team handoff event.", emoji: "📝" },
              { title: "How Urgent It Feels", desc: "Red-flag topic signals and whether the patient appears anxious or time-sensitive.", emoji: "⏱️" },
              { title: "Whether They Are Already In Care", desc: "Prospect versus registered patient should change the next follow-up playbook.", emoji: "🔁" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ready To Continue With Santaan?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            The companion can keep the patient in one coherent path from first concern to active
            follow-up.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={buildWhatsAppLink(`Hi ${env.clinicName}, I want support through the Santaan Companion and would like the right next step for my case.`)}
              target="_blank"
              rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
          >
              <MessageCircleHeart className="h-4 w-4" />
              Continue On WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" />
              Open Companion Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
