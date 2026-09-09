import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { faqData, ivfSteps } from "../data/site";
import {
  odiaFaqs,
  odiaIvfSteps,
  odiaShortStageNames,
  type RapidGuideFaq,
  type RapidGuideStage,
} from "../data/rapidGuideOdia";
import { buildWhatsAppLink, captureCrmSignal } from "../lib/api";
import { postEmbedHeight, readJourneyAttribution, trackMapEvent } from "../lib/attribution";

type View = "process" | "questions";
type Language = "en" | "or";

const VIEW_KEY = "santaan_quick_guide_view";
const STAGE_KEY = "santaan_quick_guide_stage";
const LANGUAGE_KEY = "santaan_quick_guide_language";

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

const englishIvfSteps: RapidGuideStage[] = ivfSteps;
const englishFaqs: RapidGuideFaq[] = faqData.filter((faq) => !excludedQuestions.has(faq.q));

const uiCopy = {
  en: {
    privacy: "IVF quick guide · Private to browse",
    heading: "What happens in IVF?",
    intro: "Tap where you are. See the actual steps, timing and common questions—without filling a form.",
    languageLabel: "Choose guide language",
    processTab: "The process",
    questionsTab: "Common questions",
    tabsLabel: "IVF guide sections",
    typicalTime: "Typical time",
    detailsHeading: "What usually happens",
    tipHeading: "Useful to remember",
    faqLabel: "Common IVF questions",
    faqPrompt: "Tap a question to see the answer",
    disclaimer: "Educational guide only. Your clinician should confirm decisions for your individual situation.",
    helpEyebrow: "Only if you want help",
    askAbout: "Ask about",
    helpText: "Continue privately on WhatsApp. Santaan will not call unless you ask.",
    whatsappButton: "Ask privately on WhatsApp",
  },
  or: {
    privacy: "IVF ସହଜ ଗାଇଡ୍ · ବ୍ୟକ୍ତିଗତ ଭାବେ ଦେଖନ୍ତୁ",
    heading: "IVFରେ କଣ ହୁଏ?",
    intro: "ଆପଣ ଯେଉଁ ପର୍ଯ୍ୟାୟ ବୁଝିବାକୁ ଚାହାନ୍ତି, ସେଠାରେ ଟ୍ୟାପ୍ କରନ୍ତୁ। ଫର୍ମ ପୂରଣ ନକରି ପଦକ୍ଷେପ, ସମୟ ଓ ସାଧାରଣ ପ୍ରଶ୍ନ ଦେଖନ୍ତୁ।",
    languageLabel: "ଗାଇଡ୍‌ର ଭାଷା ବାଛନ୍ତୁ",
    processTab: "IVF ପ୍ରକ୍ରିୟା",
    questionsTab: "ସାଧାରଣ ପ୍ରଶ୍ନ",
    tabsLabel: "IVF ଗାଇଡ୍ ବିଭାଗ",
    typicalTime: "ସାଧାରଣ ସମୟ",
    detailsHeading: "ସାଧାରଣତଃ କଣ ହୁଏ",
    tipHeading: "ମନେ ରଖିବା ଉପଯୋଗୀ",
    faqLabel: "IVF ସମ୍ବନ୍ଧୀୟ ସାଧାରଣ ପ୍ରଶ୍ନ",
    faqPrompt: "ଉତ୍ତର ଦେଖିବାକୁ ପ୍ରଶ୍ନରେ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    disclaimer: "ଏହା କେବଳ ଶିକ୍ଷାମୂଳକ ଗାଇଡ୍। ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ପରିସ୍ଥିତି ପାଇଁ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।",
    helpEyebrow: "ସହାୟତା ଚାହିଁଲେ ମାତ୍ର",
    askAbout: "ଏହି ବିଷୟରେ ପଚାରନ୍ତୁ",
    helpText: "WhatsAppରେ ବ୍ୟକ୍ତିଗତ ଭାବେ କଥା ହୁଅନ୍ତୁ। ଆପଣ ନକହିଲେ Santaan ଫୋନ୍ କରିବ ନାହିଁ।",
    whatsappButton: "WhatsAppରେ ବ୍ୟକ୍ତିଗତ ଭାବେ ପଚାରନ୍ତୁ",
  },
} satisfies Record<Language, Record<string, string>>;

function readStoredView(): View {
  return window.sessionStorage.getItem(VIEW_KEY) === "questions" ? "questions" : "process";
}

function readStoredStage() {
  const stored = window.sessionStorage.getItem(STAGE_KEY);
  return ivfSteps.some((stage) => stage.id === stored) ? stored! : ivfSteps[0].id;
}

export default function RapidIVFGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = location.pathname === "/or" ? "or" : "en";
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const [view, setView] = useState<View>(readStoredView);
  const [stageId, setStageId] = useState(readStoredStage);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const stages = language === "or" ? odiaIvfSteps : englishIvfSteps;
  const questions = language === "or" ? odiaFaqs : englishFaqs;
  const shortNames = language === "or" ? odiaShortStageNames : shortStageNames;
  const copy = uiCopy[language];
  const selectedStage = stages.find((stage) => stage.id === stageId) ?? stages[0];

  useEffect(() => {
    if (!["/", "/quick-guide"].includes(location.pathname)) return;
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    const nextPath = storedLanguage === "or" ? "/or" : "/en";
    navigate({ pathname: nextPath, search: location.search }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const odia = language === "or";
    document.documentElement.lang = odia ? "or-IN" : "en-IN";
    document.title = odia
      ? "IVF ପ୍ରକ୍ରିୟା ଗାଇଡ୍ — ପଦକ୍ଷେପ ଓ ପ୍ରଶ୍ନ | Santaan"
      : "Santaan IVF Quick Guide — Process & Answers";

    const description = odia
      ? "IVFର ପଦକ୍ଷେପ, ସମୟ ଓ ସାଧାରଣ ପ୍ରଶ୍ନ Odiaରେ ବୁଝନ୍ତୁ। ଫର୍ମ ବିନା ବ୍ୟକ୍ତିଗତ ଭାବେ ଦେଖନ୍ତୁ।"
      : "Tap an IVF stage to see the process, timing and common questions. Private to browse; no form required.";
    let descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = description;

    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex,follow";

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.santaan.in/fertility-map";
  }, [language]);

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
    window.sessionStorage.setItem(STAGE_KEY, nextStageId);
    window.sessionStorage.setItem(VIEW_KEY, "process");
    trackMapEvent("path_stage_viewed", {
      stage: nextStageId,
      channel: attribution.channel,
    });
    document.getElementById("answer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectView(nextView: View) {
    setView(nextView);
    window.sessionStorage.setItem(VIEW_KEY, nextView);
  }

  function selectLanguage(nextLanguage: Language) {
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setOpenQuestion(null);
    trackMapEvent("guide_language_changed", {
      language: nextLanguage,
      channel: attribution.channel,
    });
    navigate({ pathname: `/${nextLanguage}`, search: location.search });
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
        language,
      },
    });
    const message =
      language === "or"
        ? [
            "ନମସ୍କାର Santaan। ମୁଁ IVF ସହଜ ଗାଇଡ୍ ପଢ଼ୁଥିଲି।",
            `ମୁଁ ଏହି ବିଷୟ ବୁଝିବାକୁ ଚାହୁଁଛି: ${selectedStage.title}।`,
            "ଦୟାକରି WhatsAppରେ ଉତ୍ତର ଦିଅନ୍ତୁ। ମୁଁ ନକହିଲେ ଫୋନ୍ କରନ୍ତୁ ନାହିଁ।",
            `Journey: ${attribution.journeyId.slice(0, 8)}`,
          ].join("\n")
        : [
            "Hello Santaan. I was reading the IVF quick guide.",
            `I want to understand: ${selectedStage.title}.`,
            "Please reply on WhatsApp. Do not call unless I ask.",
            `Journey: ${attribution.journeyId.slice(0, 8)}`,
          ].join("\n");
    window.location.href = buildWhatsAppLink(message);
  }

  return (
    <main className="mx-auto w-full max-w-md bg-[#f7f5ef] px-4 pb-24 pt-3 text-slate-950 sm:max-w-2xl sm:px-6">
      <section lang={language === "or" ? "or" : "en"} className="rounded-[24px] bg-[#073f3c] px-5 py-5 text-white shadow-sm sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-100">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {copy.privacy}
          </div>
          <div className="inline-flex rounded-full border border-white/25 bg-white/10 p-1" role="group" aria-label={copy.languageLabel}>
            {(["en", "or"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectLanguage(option)}
                aria-pressed={language === option}
                className={`min-h-9 rounded-full px-3 text-xs font-extrabold transition ${
                  language === option ? "bg-white text-[#073f3c]" : "text-white hover:bg-white/10"
                }`}
              >
                {option === "en" ? "English" : "ଓଡ଼ିଆ"}
              </button>
            ))}
          </div>
        </div>
        <h1 className="mt-3 text-[28px] font-black leading-[1.08] tracking-tight sm:text-4xl">
          {copy.heading}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-6 text-teal-50 sm:text-base">
          {copy.intro}
        </p>
      </section>

      <div className="sticky top-0 z-20 -mx-4 mt-4 border-y border-slate-200 bg-[#f7f5ef]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {stages.map((stage) => (
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
              {stage.icon} {shortNames[stage.id] ?? stage.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-2xl bg-slate-200 p-1" role="tablist" aria-label={copy.tabsLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={view === "process"}
          onClick={() => selectView("process")}
          className={`min-h-11 rounded-xl text-sm font-extrabold ${view === "process" ? "bg-white text-[#075e58] shadow-sm" : "text-slate-600"}`}
        >
          {copy.processTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "questions"}
          onClick={() => selectView("questions")}
          className={`min-h-11 rounded-xl text-sm font-extrabold ${view === "questions" ? "bg-white text-[#075e58] shadow-sm" : "text-slate-600"}`}
        >
          {copy.questionsTab}
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
              {copy.typicalTime}: {selectedStage.duration}
            </div>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <h3 className="text-base font-black">{copy.detailsHeading}</h3>
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
            <h3 className="text-sm font-black text-amber-950">{copy.tipHeading}</h3>
            <p className="mt-2 text-[15px] leading-6 text-amber-950/80">{selectedStage.emotionalTip}</p>
          </div>
        </article>
      ) : (
        <section id="answer" className="scroll-mt-28 mt-4" aria-label={copy.faqLabel}>
          <div className="mb-3 flex items-center gap-2 px-1 text-sm font-bold text-slate-600">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            {copy.faqPrompt}
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
        {copy.disclaimer}
      </p>

      <section className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-800">{copy.helpEyebrow}</p>
        <h2 className="mt-2 text-lg font-black">{copy.askAbout} {shortNames[stageId] ?? selectedStage.title}</h2>
        <p className="mt-2 text-[15px] leading-6 text-slate-700">{copy.helpText}</p>
        <button
          type="button"
          onClick={openWhatsApp}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#20c965] px-5 text-sm font-black text-slate-950"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {copy.whatsappButton} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
