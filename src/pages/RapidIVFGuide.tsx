import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { faqData, ivfSteps } from "../data/site";
import { buildWhatsAppLink, captureCrmSignal } from "../lib/api";
import { postEmbedHeight, readJourneyAttribution, trackMapEvent } from "../lib/attribution";

type View = "process" | "questions";

const shortStageNames: Record<string, string> = {
  "initial-consultation": "Consult & tests",
  "ovarian-stimulation": "Injections",
  "egg-retrieval": "Egg pickup",
  fertilization: "Fertilisation",
  "embryo-culture": "Embryo growth",
  "pgt-testing": "Genetic testing",
  "embryo-transfer": "Embryo transfer",
  "two-week-wait": "Waiting for result",
  "post-procedure": "After the result",
};

const excludedQuestions = new Set([
  "Are there any fertility clinics in Bengaluru you recommend?",
  "How much does IVF cost in Bengaluru?",
]);

export default function RapidIVFGuide() {
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const [view, setView] = useState<View>("process");
  const [stageId, setStageId] = useState(ivfSteps[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const selectedStage = ivfSteps.find((stage) => stage.id === stageId) ?? ivfSteps[0];
  const questions = faqData.filter((faq) => !excludedQuestions.has(faq.q));

  useEffect(() => {
    trackMapEvent("path_opened", {
      source: attribution.source,
      channel: attribution.channel,
    });
  }, [attribution.channel, attribution.source]);

  useEffect(() => {
    const resize = () => postEmbedHeight(document.documentElement.scrollHeight);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  function selectStage(nextStageId: string) {
    setStageId(nextStageId);
    setView("process");
    trackMapEvent("path_stage_viewed", {
      stage: nextStageId,
      channel: attribution.channel,
    });
    document.getElementById("answer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleQuestion(question: string) {
    const next = openQuestion === question ? null : question;
    setOpenQuestion(next);
    if (next) {
      trackMapEvent("path_topic_opened", {
        topic: `faq:${questions.findIndex((item) => item.q === question)}`,
        channel: attribution.channel,
      });
    }
  }

  function openWhatsApp() {
    trackMapEvent("path_whatsapp_requested", {
      stage: stageId,
      channel: attribution.channel,
    });
    void captureCrmSignal({
      event: "path_whatsapp_requested",
      source: attribution.source,
      topicId: stageId,
      campaignId: attribution.campaignId,
      metadata: {
        journey_id: attribution.journeyId,
        channel: attribution.channel,
        adset_id: attribution.adsetId,
        ad_id: attribution.adId,
      },
    });
    const message = [
      "Hello Santaan. I was reading the IVF quick guide.",
      `I want to understand: ${selectedStage.title}.`,
      "Please reply on WhatsApp. Do not call unless I ask.",
      `Journey: ${attribution.journeyId.slice(0, 8)}`,
    ].join("\n");
    window.location.href = buildWhatsAppLink(message);
  }

  return (
    <main className="mx-auto w-full max-w-md bg-[#f7f5ef] px-4 pb-24 pt-3 text-slate-950 sm:max-w-2xl sm:px-6">
      <section className="rounded-[24px] bg-[#073f3c] px-5 py-5 text-white shadow-sm sm:px-7 sm:py-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          IVF quick guide · Private to browse
        </div>
        <h1 className="mt-3 text-[28px] font-black leading-[1.08] tracking-tight sm:text-4xl">
          What happens in IVF?
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-6 text-teal-50 sm:text-base">
          Tap where you are. See the actual steps, timing and common questions—without filling a form.
        </p>
      </section>

      <div className="sticky top-0 z-20 -mx-4 mt-4 border-y border-slate-200 bg-[#f7f5ef]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {ivfSteps.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => selectStage(stage.id)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition ${
                stage.id === stageId && view === "process"
                  ? "border-[#075e58] bg-[#075e58] text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {stage.icon} {shortStageNames[stage.id] ?? stage.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-2xl bg-slate-200 p-1" role="tablist" aria-label="IVF guide sections">
        <button
          type="button"
          role="tab"
          aria-selected={view === "process"}
          onClick={() => setView("process")}
          className={`min-h-11 rounded-xl text-sm font-extrabold ${view === "process" ? "bg-white text-[#075e58] shadow-sm" : "text-slate-600"}`}
        >
          The process
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "questions"}
          onClick={() => setView("questions")}
          className={`min-h-11 rounded-xl text-sm font-extrabold ${view === "questions" ? "bg-white text-[#075e58] shadow-sm" : "text-slate-600"}`}
        >
          Common questions
        </button>
      </div>

      {view === "process" ? (
        <article id="answer" className="scroll-mt-28 mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0c766e]">{selectedStage.subtitle}</p>
            <h2 className="mt-2 text-[26px] font-black leading-tight tracking-tight sm:text-3xl">{selectedStage.title}</h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-600 sm:text-base">{selectedStage.summary}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Typical time: {selectedStage.duration}
            </div>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <h3 className="text-base font-black">What usually happens</h3>
            <ol className="mt-4 space-y-3">
              {selectedStage.details.map((detail, index) => (
                <li key={detail} className="flex gap-3 text-[15px] leading-6 text-slate-700 sm:text-base">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-900">
                    {index + 1}
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-slate-100 bg-amber-50 px-5 py-5 sm:px-7">
            <h3 className="text-sm font-black text-amber-950">Useful to remember</h3>
            <p className="mt-2 text-[15px] leading-6 text-amber-950/80">{selectedStage.emotionalTip}</p>
          </div>
        </article>
      ) : (
        <section id="answer" className="scroll-mt-28 mt-4" aria-label="Common IVF questions">
          <div className="mb-3 flex items-center gap-2 px-1 text-sm font-bold text-slate-600">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Tap a question to see the answer
          </div>
          <div className="space-y-2">
            {questions.map((faq) => {
              const open = openQuestion === faq.q;
              return (
                <article key={faq.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggleQuestion(faq.q)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-extrabold leading-5"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#0c766e] transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {open ? <p className="border-t border-slate-100 px-5 py-4 text-[15px] leading-6 text-slate-700">{faq.a}</p> : null}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <p className="mt-5 px-2 text-xs leading-5 text-slate-500">
        Educational guide only. Your clinician should confirm decisions for your individual situation.
      </p>

      <section className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-800">Only if you want help</p>
        <h2 className="mt-2 text-lg font-black">Ask about {shortStageNames[stageId] ?? selectedStage.title}</h2>
        <p className="mt-2 text-[15px] leading-6 text-slate-700">Continue privately on WhatsApp. Santaan will not call unless you ask.</p>
        <button
          type="button"
          onClick={openWhatsApp}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#20c965] px-5 text-sm font-black text-slate-950"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Ask privately on WhatsApp <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
