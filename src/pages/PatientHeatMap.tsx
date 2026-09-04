import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Compass,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ageBands,
  attemptChoices,
  bookTopics,
  labelFor,
  pathwayStages,
  treatmentChoices,
  type AgeBandId,
  type AttemptId,
  type BookTopicId,
  type PatientStageId,
  type PathwayStage,
  type ReferenceSectionId,
  type TreatmentId,
} from "../data/patientHeatMap";
import type { ConcernId, JourneyPositionId, LocationId } from "../data/journeyMap";
import { buildWhatsAppLink, captureCrmSignal, requestJourneyHandoff } from "../lib/api";
import { postEmbedHeight, readJourneyAttribution, trackMapEvent } from "../lib/attribution";

const featuredStageIds: PatientStageId[] = [
  "planning",
  "tests",
  "injections",
  "before-egg-collection",
  "waiting-embryo-updates",
  "before-transfer",
  "after-transfer",
  "waiting-pregnancy-test",
  "after-result",
  "between-attempts",
  "storage",
];

const stageShortLabels: Partial<Record<PatientStageId, string>> = {
  planning: "Planning",
  tests: "Tests & reports",
  injections: "IVF injections",
  "before-egg-collection": "Before egg collection",
  "waiting-embryo-updates": "Embryo updates",
  "before-transfer": "Before transfer",
  "after-transfer": "After transfer",
  "waiting-pregnancy-test": "Waiting for test",
  "after-result": "After result",
  "between-attempts": "Between attempts",
  storage: "Freezing & storage",
};

const attemptSummaryLabels: Record<AttemptId, string> = {
  "first-time": "first time",
  "tests-only": "tests only so far",
  "one-attempt": "one previous attempt",
  "multiple-attempts": "multiple attempts",
  "prefer-not": "attempts not shared",
};

const topicConcernMap: Partial<Record<BookTopicId, ConcernId>> = {
  cost: "planning",
  outcomes: "planning",
  reports: "reports",
  medicines: "where-to-begin",
  "both-partners": "both-partners",
};

function positionForStage(stage: PatientStageId): JourneyPositionId {
  if (stage === "tests") return "reports";
  if (stage === "after-result" || stage === "between-attempts") return "previous-treatment";
  if (stage === "planning") return "wondering";
  return "comparing";
}

function createSubmissionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `map-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function ListSection({ id, title, items, icon = "book" }: {
  id: ReferenceSectionId;
  title: string;
  items: string[];
  icon?: "book" | "alert";
}) {
  return (
    <section data-reference-section={id} className="scroll-mt-24 border-t border-slate-200 py-6">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${icon === "alert" ? "bg-amber-50 text-amber-800" : "bg-teal-50 text-teal-800"}`}>
          {icon === "alert" ? <CircleAlert className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-7 text-slate-700">
                <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function PatientHeatMap() {
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const featuredStages = useMemo(
    () => featuredStageIds.map((id) => pathwayStages.find((item) => item.id === id)).filter(Boolean) as PathwayStage[],
    [],
  );
  const [stage, setStage] = useState<PatientStageId>("planning");
  const [ageBand, setAgeBand] = useState<AgeBandId>();
  const [attempt, setAttempt] = useState<AttemptId>();
  const [treatment, setTreatment] = useState<TreatmentId>();
  const [selectedTopic, setSelectedTopic] = useState<BookTopicId>();
  const [readSections, setReadSections] = useState<ReferenceSectionId[]>([]);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [callbackWindow, setCallbackWindow] = useState("");
  const [callbackLocation, setCallbackLocation] = useState<LocationId>("not-sure");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const selectedStage = pathwayStages.find((item) => item.id === stage) ?? pathwayStages[0];
  const selectedStageIndex = featuredStages.findIndex((item) => item.id === stage);
  const previousStage = selectedStageIndex > 0 ? featuredStages[selectedStageIndex - 1] : undefined;
  const nextStage = selectedStageIndex >= 0 ? featuredStages[selectedStageIndex + 1] : undefined;
  const selectedTopicContent = bookTopics.find((item) => item.id === selectedTopic);
  const journeyReference = `PATH-${attribution.journeyId.slice(0, 8).toUpperCase()}`;

  const profileSummary = useMemo(() => {
    const parts = [
      ageBand && ageBand !== "prefer-not" ? labelFor(ageBands, ageBand) : undefined,
      attempt && attempt !== "prefer-not" ? attemptSummaryLabels[attempt] : undefined,
      treatment ? labelFor(treatmentChoices, treatment) : undefined,
      selectedStage.label.toLowerCase(),
      selectedTopicContent ? `read ${selectedTopicContent.label.toLowerCase()}` : undefined,
    ];
    return parts.filter(Boolean).join(" · ");
  }, [ageBand, attempt, treatment, selectedStage, selectedTopicContent]);

  useEffect(() => {
    trackMapEvent("path_opened", { source: attribution.source, channel: attribution.channel });
  }, [attribution.channel, attribution.source]);

  useEffect(() => {
    if (!rootRef.current || !attribution.embed) return;
    const observer = new ResizeObserver(() => postEmbedHeight(rootRef.current?.scrollHeight ?? document.body.scrollHeight));
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [attribution.embed]);

  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reference-section]")];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = (entry.target as HTMLElement).dataset.referenceSection as ReferenceSectionId;
        setReadSections((current) => {
          if (current.includes(id)) return current;
          trackMapEvent("path_section_read", { section: id, stage, channel: attribution.channel });
          return [...current, id];
        });
      });
    }, { threshold: 0.6 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [attribution.channel, stage]);

  function chooseStage(id: PatientStageId) {
    setStage(id);
    setSelectedTopic(undefined);
    setReadSections([]);
    setShowContact(false);
    trackMapEvent("path_stage_viewed", { stage: id, channel: attribution.channel });
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function chooseTopic(id: BookTopicId) {
    const next = selectedTopic === id ? undefined : id;
    setSelectedTopic(next);
    trackMapEvent("path_topic_opened", { topic: next, stage, channel: attribution.channel });
  }

  function openWhatsApp() {
    const message = [
      "Hi Santaan, I was reading Santaan Fertility Path.",
      `I am looking at: ${selectedStage.label}.`,
      selectedTopicContent ? `I would like help with: ${selectedTopicContent.label}.` : "I have a question about this stage.",
      "Please reply on WhatsApp. Do not call unless I request it.",
      `Reference: ${journeyReference}`,
    ].join("\n");
    trackMapEvent("path_whatsapp_requested", {
      journey_reference: journeyReference,
      stage,
      selected_topic: selectedTopic,
      sections_read: readSections.join(","),
      campaign_id: attribution.campaignId,
      adset_id: attribution.adsetId,
      ad_id: attribution.adId,
    });
    void captureCrmSignal({
      event: "path_whatsapp_requested",
      source: attribution.source,
      topicId: selectedTopic ?? stage,
      patientStage: stage,
      campaignId: attribution.campaignId,
      metadata: {
        journeyReference,
        profileSummary,
        stage,
        selectedTopic,
        sectionsRead: readSections.join(","),
        channel: attribution.channel,
        campaignName: attribution.campaignName,
        adsetId: attribution.adsetId,
        adsetName: attribution.adsetName,
        adId: attribution.adId,
        adName: attribution.adName,
      },
    });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  async function submitCallback(event: FormEvent) {
    event.preventDefault();
    setError("");
    const cleanedPhone = cleanPhone(phone);
    if (!name.trim() || cleanedPhone.length < 12 || !callbackWindow || !consent) {
      setError("Please add your name, a valid number, a convenient time and callback permission.");
      return;
    }
    const concern = selectedTopic ? topicConcernMap[selectedTopic] : undefined;
    setSubmitting(true);
    const result = await requestJourneyHandoff({
      submissionId: createSubmissionId(),
      journeyId: attribution.journeyId,
      action: "callback",
      name: name.trim(),
      phone: cleanedPhone,
      consent,
      language: "English",
      position: positionForStage(stage),
      concerns: concern ? [concern] : [],
      helpRequested: "questions-to-ask",
      location: callbackLocation,
      preferredWindow: callbackWindow,
      topic: selectedTopic ?? stage,
      profileSummary,
      profileEvidence: {
        ageBand,
        attempt,
        treatment,
        experience: attempt ? [attempt] : [],
        currentStage: stage,
        exploredSignals: selectedTopic ? [selectedTopic] : [],
        exploredCards: readSections,
      },
      attribution,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Santaan could not save this callback yet.");
      return;
    }
    setSuccess(true);
    trackMapEvent("path_callback_requested", { journey_reference: result.journeyRef ?? journeyReference, stage });
  }

  return (
    <main ref={rootRef} className="min-h-screen bg-[#f7f3eb] pb-12 text-slate-950">
      <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-8">
        <header className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-800 px-5 py-7 text-white shadow-xl shadow-teal-950/10 sm:px-9 sm:py-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100"><Compass className="h-4 w-4" /> Santaan Fertility Path</div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-teal-50">Private · educational</span>
          </div>
          <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Understand first. Decide in your own time.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-teal-50 sm:text-lg">Clear, evidence-based guidance for the point you are at—without a form, a sales call or a diagnosis.</p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-teal-100"><Sparkles className="h-4 w-4" /> Science for Smiles</div>
        </header>

        <section className="mt-6" aria-labelledby="start-title">
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">Start where you are</p><h2 id="start-title" className="mt-1 text-2xl font-semibold">What feels closest today?</h2></div>
            <span className="text-xs text-slate-500">Swipe →</span>
          </div>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featuredStages.map((item) => {
              const active = item.id === stage;
              return <button key={item.id} type="button" aria-pressed={active} onClick={() => chooseStage(item.id)} className={`min-h-20 w-36 shrink-0 snap-start rounded-2xl border p-4 text-left text-sm font-semibold leading-5 transition ${active ? "border-teal-800 bg-teal-800 text-white shadow-lg" : "border-slate-200 bg-white text-slate-700"}`}>{stageShortLabels[item.id] ?? item.label}</button>;
            })}
          </div>
        </section>

        <article ref={contentRef} className="scroll-mt-4 mt-4 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-teal-950 to-cyan-800 px-5 py-7 text-white sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-teal-100">You are reading</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight">{selectedStage.label}</h2>
            <p className="mt-4 text-base leading-7 text-teal-50">{selectedStage.whatItIs}</p>
          </div>
          <div className="px-5 sm:px-8">
            <section data-reference-section="what-happens" className="scroll-mt-24 py-6"><h3 className="text-lg font-semibold">What usually happens</h3><p className="mt-3 text-[15px] leading-7 text-slate-700">{selectedStage.whatHappens}</p></section>
            <ListSection id="preparation" title="How people prepare" items={selectedStage.preparation} />
            <ListSection id="what-to-expect" title="What to expect" items={selectedStage.whatToExpect} />
            <ListSection id="what-varies" title="What may vary" items={selectedStage.whatVaries} />
            <section data-reference-section="next-stage" className="scroll-mt-24 border-t border-slate-200 py-6"><h3 className="text-lg font-semibold">What may come next</h3><p className="mt-3 text-[15px] leading-7 text-slate-700">{selectedStage.nextStage}</p></section>
            <ListSection id="contact-clinic" title="When to contact the treating clinic" items={selectedStage.contactClinic} icon="alert" />
          </div>
          <nav className="grid gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:grid-cols-2" aria-label="Move through the fertility path">
            {previousStage ? <button type="button" onClick={() => chooseStage(previousStage.id)} className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left"><ArrowLeft className="h-5 w-5 shrink-0 text-teal-800" /><span><span className="block text-xs text-slate-500">Earlier</span><span className="font-semibold">{stageShortLabels[previousStage.id] ?? previousStage.label}</span></span></button> : <span />}
            {nextStage ? <button type="button" onClick={() => chooseStage(nextStage.id)} className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left"><span><span className="block text-xs text-slate-500">Next</span><span className="font-semibold">{stageShortLabels[nextStage.id] ?? nextStage.label}</span></span><ArrowRight className="h-5 w-5 shrink-0 text-teal-800" /></button> : null}
          </nav>
        </article>

        <section className="mt-7 rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">Explore a question</h2><p className="mt-2 text-sm leading-6 text-slate-600">Open only what is useful to you.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{bookTopics.map((topic) => <button key={topic.id} type="button" aria-pressed={selectedTopic === topic.id} onClick={() => chooseTopic(topic.id)} className={`min-h-20 rounded-2xl border p-4 text-left text-sm font-semibold ${selectedTopic === topic.id ? "border-teal-800 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{topic.label}</button>)}</div>
          {selectedTopicContent ? <article className="mt-5 border-t border-slate-200 pt-6"><h3 className="text-xl font-semibold">{selectedTopicContent.label}</h3><p className="mt-3 leading-7 text-slate-700">{selectedTopicContent.introduction}</p><ul className="mt-4 space-y-3">{selectedTopicContent.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" />{point}</li>)}</ul><p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">{selectedTopicContent.limits}</p></article> : null}
        </section>

        <section className="mt-7 rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <button type="button" onClick={() => setShowPersonalize((current) => !current)} className="flex w-full items-center justify-between gap-4 text-left">
            <span><span className="block text-xs font-bold uppercase tracking-[0.15em] text-teal-800">Optional</span><span className="mt-1 block text-xl font-semibold">Make this path more relevant</span><span className="mt-1 block text-sm text-slate-600">Nothing here is required to keep reading.</span></span>
            <ChevronDown className={`h-5 w-5 shrink-0 transition ${showPersonalize ? "rotate-180" : ""}`} />
          </button>
          {showPersonalize ? <div className="mt-6 space-y-6 border-t border-slate-100 pt-6">
            <fieldset><legend className="text-sm font-semibold">Age range</legend><div className="mt-3 flex flex-wrap gap-2">{ageBands.map((choice) => <button key={choice.id} type="button" aria-pressed={ageBand === choice.id} onClick={() => setAgeBand(choice.id)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${ageBand === choice.id ? "border-teal-800 bg-teal-800 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{choice.label}</button>)}</div></fieldset>
            <fieldset><legend className="text-sm font-semibold">Previous attempts</legend><div className="mt-3 flex flex-wrap gap-2">{attemptChoices.map((choice) => <button key={choice.id} type="button" aria-pressed={attempt === choice.id} onClick={() => setAttempt(choice.id)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${attempt === choice.id ? "border-teal-800 bg-teal-800 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{choice.label}</button>)}</div></fieldset>
            <fieldset><legend className="text-sm font-semibold">Pathway</legend><div className="mt-3 flex flex-wrap gap-2">{treatmentChoices.map((choice) => <button key={choice.id} type="button" aria-pressed={treatment === choice.id} onClick={() => setTreatment(choice.id)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${treatment === choice.id ? "border-teal-800 bg-teal-800 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{choice.label}</button>)}</div></fieldset>
            <p className="rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">This context stays with your Path. It is shared with Santaan only if you choose WhatsApp or request a callback.</p>
          </div> : null}
        </section>

        <section className="mt-7 rounded-[1.8rem] bg-teal-950 p-5 text-white shadow-xl sm:p-8">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-teal-200" /><div><h2 className="text-2xl font-semibold">Want help with what you just read?</h2><p className="mt-2 text-sm leading-6 text-teal-50">Message privately, or ask for a call at a time you choose. No call is made from simply reading this Path.</p></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={openWhatsApp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#20c965] px-5 py-3 font-bold text-slate-950"><MessageCircle className="h-5 w-5" />Message on WhatsApp</button><button type="button" onClick={() => setShowContact((current) => !current)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-bold text-white"><PhoneCall className="h-5 w-5" />Request a callback</button></div>
          {showContact ? <div className="mt-6 border-t border-white/15 pt-6">{success ? <div className="rounded-2xl bg-white/10 p-5 text-center"><Check className="mx-auto h-7 w-7 text-teal-200" /><p className="mt-3 font-semibold">Your callback choice is saved.</p></div> : <form onSubmit={submitCallback} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold">Name</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="min-h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-slate-950" placeholder="Name Santaan should use" /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Callback number</span><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" className="min-h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-slate-950" placeholder="+91 98765 43210" /></label></div>
            <fieldset><legend className="text-sm font-semibold">Most practical area</legend><div className="mt-2 flex flex-wrap gap-2">{[["bhubaneswar", "Bhubaneswar"], ["berhampur", "Berhampur"], ["angul", "Angul"], ["south-odisha", "South Odisha"], ["not-sure", "Not sure"]].map(([value, label]) => <button key={value} type="button" onClick={() => setCallbackLocation(value as LocationId)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${callbackLocation === value ? "border-teal-200 bg-teal-100 text-teal-950" : "border-white/25"}`}>{label}</button>)}</div></fieldset>
            <label className="block"><span className="mb-2 block text-sm font-semibold">When may Santaan call?</span><select value={callbackWindow} onChange={(event) => setCallbackWindow(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-slate-950"><option value="">Choose a callback window</option><option value="09:00-12:00">9 am–12 pm</option><option value="12:00-15:00">12 pm–3 pm</option><option value="15:00-18:00">3 pm–6 pm</option><option value="18:00-20:00">6 pm–8 pm</option></select></label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white/10 p-4"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-5 w-5" /><span className="text-sm leading-6 text-teal-50">I ask Santaan to call only during the selected window.</span></label>
            {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}<button type="submit" disabled={submitting} className="min-h-12 w-full rounded-xl bg-white px-5 py-3 font-bold text-teal-950 disabled:opacity-60">{submitting ? "Saving…" : "Request this callback"}</button>
          </form>}</div> : null}
        </section>
        <footer className="mt-7 px-2 text-center text-xs leading-5 text-slate-500">Educational guidance only. Your treating clinician’s instructions remain the source of truth for personal care.</footer>
      </div>
    </main>
  );
}
