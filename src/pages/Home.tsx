import { useEffect, useMemo, useState, type ComponentProps } from "react";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  MessageCircleHeart,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  awarenessOptions,
  AwarenessStage,
  careIntentOptions,
  CareIntent,
  CompanionLanguage,
  companionOdiaLabels,
  companionOdiaTopics,
  defaultTopicId,
  EntrySource,
  helpNeededOptions,
  HelpNeeded,
  interestLevelOptions,
  InterestLevel,
  journeyTopics,
  patientModeChecklist,
  PatientStage,
  patientStageOptions,
  primaryWorryOptions,
  PrimaryWorry,
  santaanCompanionConfig,
  StageOption,
  sourceOptions,
} from "../data/companion";
import { buildWhatsAppLink, captureCrmSignal, requestWhatsAppGuide } from "../lib/api";
import { env } from "../lib/env";

function getTopic(topicId: string | null) {
  return journeyTopics.find((topic) => topic.id === topicId) || journeyTopics.find((topic) => topic.id === defaultTopicId)!;
}

function getSource(source: string | null): EntrySource {
  return sourceOptions.some((option) => option.id === source) ? (source as EntrySource) : "direct";
}

function getAwarenessStage(value: string | null, mode: string | null): AwarenessStage {
  if (awarenessOptions.some((option) => option.id === value)) {
    return value as AwarenessStage;
  }

  return mode === "patient" ? "registered-patient" : "problem-aware";
}

function getPatientStage(value: string | null, topicId: string): PatientStage {
  if (patientStageOptions.some((option) => option.id === value)) {
    return value as PatientStage;
  }

  const topicToStage: Record<string, PatientStage> = {
    "male-factor": "male-factor",
    "low-amh": "low-amh",
    "pre-icsi": "pre-icsi",
    "two-week-wait": "two-week-wait",
    "first-visit": "diagnosis",
  };

  return topicToStage[topicId] || "diagnosis";
}

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function getOptionLabel<TValue extends string>(options: StageOption<TValue>[], value: TValue) {
  return options.find((option) => option.id === value)?.label || value;
}

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topic = useMemo(() => getTopic(searchParams.get("topic")), [searchParams]);
  const source = useMemo(() => getSource(searchParams.get("source")), [searchParams]);
  const mode = searchParams.get("mode");
  const campaignId = searchParams.get("campaign") || searchParams.get("campaignId") || "";
  const qrId = searchParams.get("qr") || searchParams.get("qrId") || "";
  const awarenessStage = useMemo(
    () => getAwarenessStage(searchParams.get("awareness"), mode),
    [searchParams, mode]
  );
  const patientStage = useMemo(
    () => getPatientStage(searchParams.get("stage"), searchParams.get("topic") || defaultTopicId),
    [searchParams]
  );

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<CompanionLanguage>("en");
  const [interestLevel, setInterestLevel] = useState<InterestLevel>("researching-options");
  const [careIntent, setCareIntent] = useState<CareIntent>("understand-my-situation");
  const [primaryWorry, setPrimaryWorry] = useState<PrimaryWorry>("confusing-test-results");
  const [helpNeeded, setHelpNeeded] = useState<HelpNeeded>("send-guide");
  const [summary, setSummary] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");

  const isOdia = language === "or";
  const t = (english: string, odia: string) => (isOdia ? odia : english);
  const localizedTopic = isOdia ? companionOdiaTopics[topic.id] : null;

  const patientStageLabel = patientStageOptions.find((option) => option.id === patientStage)?.label || patientStage;
  const awarenessStageLabel = getOptionLabel(awarenessOptions, awarenessStage);
  const isPatientMode = mode === "patient" || awarenessStage === "registered-patient";
  const interestLevelLabel = getOptionLabel(interestLevelOptions, interestLevel);
  const careIntentLabel = getOptionLabel(careIntentOptions, careIntent);
  const primaryWorryLabel = getOptionLabel(primaryWorryOptions, primaryWorry);
  const helpNeededLabel = getOptionLabel(helpNeededOptions, helpNeeded);
  const awarenessStageDisplayLabel = isOdia ? companionOdiaLabels.awarenessStage[awarenessStage] : awarenessStageLabel;
  const patientStageDisplayLabel = isOdia ? companionOdiaLabels.patientStage[patientStage] : patientStageLabel;
  const interestLevelDisplayLabel = isOdia ? companionOdiaLabels.interestLevel[interestLevel] : interestLevelLabel;
  const careIntentDisplayLabel = isOdia ? companionOdiaLabels.careIntent[careIntent] : careIntentLabel;
  const primaryWorryDisplayLabel = isOdia ? companionOdiaLabels.primaryWorry[primaryWorry] : primaryWorryLabel;
  const helpNeededDisplayLabel = isOdia ? companionOdiaLabels.helpNeeded[helpNeeded] : helpNeededLabel;

  const buildCrmMetadata = (
    overrides: Partial<{
      interestLevel: InterestLevel;
      careIntent: CareIntent;
      primaryWorry: PrimaryWorry;
      helpNeeded: HelpNeeded;
      patientMode: boolean;
      ctaIntent: string;
      changedField: string;
      changedValue: string;
    }> = {}
  ) => {
    const nextInterestLevel = overrides.interestLevel ?? interestLevel;
    const nextCareIntent = overrides.careIntent ?? careIntent;
    const nextPrimaryWorry = overrides.primaryWorry ?? primaryWorry;
    const nextHelpNeeded = overrides.helpNeeded ?? helpNeeded;

    return {
      heroTag: topic.heroTag,
      awarenessLabel: awarenessStageLabel,
      patientStageLabel,
      interestLevel: nextInterestLevel,
      interestLevelLabel: getOptionLabel(interestLevelOptions, nextInterestLevel),
      careIntent: nextCareIntent,
      careIntentLabel: getOptionLabel(careIntentOptions, nextCareIntent),
      primaryWorry: nextPrimaryWorry,
      primaryWorryLabel: getOptionLabel(primaryWorryOptions, nextPrimaryWorry),
      helpNeeded: nextHelpNeeded,
      helpNeededLabel: getOptionLabel(helpNeededOptions, nextHelpNeeded),
      patientMode: overrides.patientMode ?? isPatientMode,
      ctaIntent: overrides.ctaIntent,
      changedField: overrides.changedField,
      changedValue: overrides.changedValue,
    };
  };

  const structuredSummary = [
    `Awareness stage: ${awarenessStageLabel}`,
    `IVF stage: ${patientStageLabel}`,
    `Interest level: ${interestLevelLabel}`,
    `Intent: ${careIntentLabel}`,
    `Main worry: ${primaryWorryLabel}`,
    `Help requested: ${helpNeededLabel}`,
    summary ? `Patient notes: ${summary}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  useEffect(() => {
    void captureCrmSignal({
      event: "companion_view",
      source,
      topicId: topic.id,
      awarenessStage,
      patientStage,
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      mode: mode || undefined,
      metadata: buildCrmMetadata(),
    });
  }, [topic.id, source, awarenessStage, patientStage, campaignId, qrId, mode]);

  const updateQuery = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        next.delete(key);
        return;
      }

      next.set(key, value);
    });
    setSearchParams(next);
  };

  const handleTopicChange = (topicId: string) => {
    updateQuery({ topic: topicId });
    setFormMessage("");
    setSubmittedPhone("");
    void captureCrmSignal({
      event: "topic_selected",
      source,
      topicId,
      awarenessStage,
      patientStage,
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      metadata: buildCrmMetadata(),
    });
  };

  const enterPatientMode = () => {
    setInterestLevel("already-in-care");
    setCareIntent("stay-supported");
    setPrimaryWorry("treatment-timing-and-medicines");
    setHelpNeeded("care-plan");
    updateQuery({
      mode: "patient",
      awareness: "registered-patient",
      stage: "in-treatment",
    });
    void captureCrmSignal({
      event: "patient_mode_entered",
      source,
      topicId: topic.id,
      awarenessStage: "registered-patient",
      patientStage: "in-treatment",
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      mode: "patient",
      metadata: buildCrmMetadata({
        interestLevel: "already-in-care",
        careIntent: "stay-supported",
        primaryWorry: "treatment-timing-and-medicines",
        helpNeeded: "care-plan",
        patientMode: true,
      }),
    });
  };

  const openSantaanWhatsApp = (intent: "guide" | "care-team" | "consult") => {
    const actionLabels = {
      guide: "send this guide",
      "care-team": "talk to the care team",
      consult: "book a consultation",
    };

    void captureCrmSignal({
      event: `cta_${intent}`,
      source,
      topicId: topic.id,
      awarenessStage,
      patientStage,
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      metadata: {
        ...buildCrmMetadata({ ctaIntent: intent }),
      },
    });

    const message = [
      `Hi ${env.clinicName}, I scanned your companion for ${topic.label}.`,
      `I would like to ${actionLabels[intent]}.`,
      `Interest level: ${interestLevelLabel}.`,
      `Intent: ${careIntentLabel}.`,
      `My stage: ${patientStageLabel}.`,
      `What is bothering me most: ${primaryWorryLabel}.`,
      `Best next help: ${helpNeededLabel}.`,
      summary ? `Notes: ${summary}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (event: FormSubmitEvent) => {
    event.preventDefault();

    const cleanedPhone = normalizePhone(phone);
    if (cleanedPhone.replace(/\D/g, "").length < 10) {
      setFormMessage(
        t(
          "Please enter a valid WhatsApp number so Santaan can send the guide.",
          "ଦୟାକରି ଏକ ଠିକ୍ WhatsApp ନମ୍ବର ଦିଅନ୍ତୁ, ଯାହାଦ୍ୱାରା ସନ୍ତାନ ଗାଇଡ୍ ପଠାଇପାରିବ।"
        )
      );
      return;
    }

    if (!consent) {
      setFormMessage(
        t(
          "Please allow Santaan to contact you on WhatsApp so we can continue this journey.",
          "ଏହି ଯାତ୍ରାକୁ ଆଗକୁ ନେବା ପାଇଁ ସନ୍ତାନକୁ WhatsApp ରେ ସମ୍ପର୍କ କରିବାର ଅନୁମତି ଦିଅନ୍ତୁ।"
        )
      );
      return;
    }

    setIsSubmitting(true);
    setFormMessage("");

    const result = await requestWhatsAppGuide({
      phone: cleanedPhone,
      topicId: topic.id,
      source,
      awarenessStage,
      patientStage,
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      patientName: patientName || undefined,
      consent,
      resourceLabel: topic.whatToSend[0],
      summary: structuredSummary,
    });

    await captureCrmSignal({
      event: "whatsapp_guide_requested",
      source,
      topicId: topic.id,
      awarenessStage,
      patientStage,
      campaignId: campaignId || undefined,
      qrId: qrId || undefined,
      phone: cleanedPhone,
      consent,
      metadata: {
        queued: result.queued,
        resource: topic.whatToSend[0],
        ...buildCrmMetadata(),
      },
    });

    setSubmittedPhone(cleanedPhone);
    setFormMessage(
      result.queued
        ? t(
            `We saved this request for ${cleanedPhone} on this device while live handoff is being connected. You can still continue on WhatsApp now.`,
            `${cleanedPhone} ପାଇଁ ଏହି ଅନୁରୋଧକୁ ଏହି device ରେ ସଂରକ୍ଷଣ କରାଗଲା। live handoff ଯୋଡ଼ାଯାଉଥିବା ସମୟରେ ମଧ୍ୟ ଆପଣ WhatsApp ରେ ଆଗକୁ ବଢିପାରିବେ।`
          )
        : t(
            `Thanks. ${env.clinicName} can continue this conversation on WhatsApp at ${cleanedPhone}.`,
            `ଧନ୍ୟବାଦ। ${env.clinicName} ${cleanedPhone} ରେ WhatsApp ଦ୍ୱାରା ଏହି କଥାବାର୍ତ୍ତାକୁ ଆଗକୁ ନେଇପାରିବ।`
          )
    );
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 pb-28 md:pb-0">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 px-4 pt-24 pb-8 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute -top-20 right-0 h-60 w-60 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="animate-float-delay absolute bottom-0 left-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("Personal fertility companion", "ବ୍ୟକ୍ତିଗତ ଫର୍ଟିଲିଟି ସାଥୀ")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300">
                  {isPatientMode ? t("Patient care mode", "ରୋଗୀ ସେବା ମୋଡ୍") : t("Gentle guided support", "ନରମ ପଥଦର୍ଶନ")}
                </span>
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-3 py-1.5 transition ${language === "en" ? "bg-cyan-500/20 text-white" : "text-slate-300"}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("or")}
                    className={`rounded-full px-3 py-1.5 transition ${language === "or" ? "bg-cyan-500/20 text-white" : "text-slate-300"}`}
                  >
                    ଓଡ଼ିଆ
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-cyan-300">
                {t(santaanCompanionConfig.mobileTagline, "ବିଶ୍ବାସଯୋଗ୍ୟ IVF ପଥଦର୍ଶନ। ସ୍ମାର୍ଟ ରାଉଟିଂ। WhatsApp ରେ ଆଗକୁ ବଢନ୍ତୁ।")}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl">
                {localizedTopic?.label ?? topic.label}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {localizedTopic?.concern ?? topic.concern}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {t(
                  "This journey map is designed to do two things well: give patients credible IVF guidance quickly, then quietly capture the context Santaan needs to follow up with the right next step.",
                  "ଏହି journey map ଦୁଇଟି କାମ ଭଲଭାବେ କରେ: ରୋଗୀଙ୍କୁ ଶୀଘ୍ର ବିଶ୍ବାସଯୋଗ୍ୟ IVF ତଥ୍ୟ ଦେଇଥାଏ, ତାପରେ ପରବର୍ତ୍ତୀ ସହଯୋଗ ପାଇଁ ଦରକାର context କୁ ସନ୍ତାନ ପାଇଁ ସଂଗ୍ରହ କରେ।"
                )}
              </p>
              <div className="animate-rise-in mt-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/5 p-4">
                <p className="text-sm font-medium text-cyan-100">{localizedTopic?.reassurance ?? topic.reassurance}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{localizedTopic?.explanation ?? topic.explanation}</p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  t(
                    "1. Land on a credible IVF topic that matches the patient's real question",
                    "1. ରୋଗୀଙ୍କ ସତ୍ୟିକର ଚିନ୍ତା ସହ ମେଳ ହେଉଥିବା ବିଶ୍ବାସଯୋଗ୍ୟ IVF ବିଷୟରେ ପହଞ୍ଚନ୍ତୁ"
                  ),
                  t(
                    "2. Guide them by interest level, IVF stage, and what is bothering them now",
                    "2. interest level, IVF ପର୍ଯ୍ୟାୟ ଏବଂ ବର୍ତ୍ତମାନର ଚିନ୍ତା ଆଧାରରେ ପଥଦର୍ଶନ କରନ୍ତୁ"
                  ),
                  t(
                    "3. Send a richer handoff to CRM so the next human step feels informed",
                    "3. CRM କୁ ଅଧିକ ସମୃଦ୍ଧ handoff ପଠାନ୍ତୁ ଯାହାରେ ପରବର୍ତ୍ତୀ ମାନବୀୟ ସହଯୋଗ ଅଧିକ ସଚେତନ ହୁଏ"
                  ),
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-cyan-400/15 bg-slate-900/70 p-4 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => openSantaanWhatsApp("guide")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/35"
                >
                  <MessageCircleHeart className="h-4 w-4" />
                  {t("Get Guide On WhatsApp", "WhatsApp ରେ ଗାଇଡ୍ ପାଆନ୍ତୁ")}
                </button>
                <button
                  onClick={() => openSantaanWhatsApp("care-team")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <HeartHandshake className="h-4 w-4" />
                  {t("Talk To Care Team", "କେୟାର ଟିମ୍ ସହ କଥାହୁଅନ୍ତୁ")}
                </button>
                <button
                  onClick={enterPatientMode}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500/20"
                >
                  <ClipboardList className="h-4 w-4" />
                  {t("I'm Already In Treatment", "ମୋର ଚିକିତ୍ସା ଚାଲିଛି")}
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(isOdia
                  ? [
                      "ମୋବାଇଲ୍ ରେ IVF ଅସ୍ପଷ୍ଟତାକୁ ଶାନ୍ତ ଏବଂ ବିଶ୍ବାସଯୋଗ୍ୟ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପରେ ପରିବର୍ତ୍ତନ କରେ",
                      "ଏହା କଠିନ form funnel ଭାବ ନ ଦେଇ ଯାତ୍ରା ପର୍ଯ୍ୟାୟ, intent, worry ଓ support need କୁ ବୁଝେ",
                      "ଏହା context କୁ ଆଗକୁ ପଠାଏ ଯାହାଦ୍ୱାରା ସନ୍ତାନ ଅଧିକ ଭଲ ଭାବେ follow-up କରିପାରେ",
                    ]
                  : santaanCompanionConfig.trustPoints
                ).map((point) => (
                  <div key={point} className="card-lift rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                    <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-rise-in rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{t("Get guided, then continue privately", "ପଥଦର୍ଶନ ପାଆନ୍ତୁ, ପରେ ଗୋପନୀୟ ଭାବେ ଆଗକୁ ବଢନ୍ତୁ")}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {t(
                        "Share only what helps. This path is built to understand who the patient is, what stage they are in, what is bothering them, and what kind of help they want next.",
                        "ଯେତିକି ଉପକାରୀ ସେତିକି ମାତ୍ର ଶେୟର୍ କରନ୍ତୁ। ଏହି ପଥ ରୋଗୀ କିଏ, ସେ କେଉଁ ପର୍ଯ୍ୟାୟରେ ଅଛନ୍ତି, କଣ ତାଙ୍କୁ ଚିନ୍ତା ଦେଉଛି ଏବଂ ପରେ କେମିତି ସହାୟତା ଚାହୁଁଛନ୍ତି ତାହା ବୁଝିବା ପାଇଁ ତିଆରି।"
                      )}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-200">
                    {t("CRM-ready support path", "CRM-ready support path")}
                  </span>
                </div>

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">{t("Step 1: Tell Santaan how to guide you", "ପଦକ୍ଷେପ 1: ସନ୍ତାନ ଆପଣଙ୍କୁ କିପରି ପଥଦର୍ଶନ କରିବ ସେଥି କୁହନ୍ତୁ")}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {t(
                        "This keeps the experience useful for new, active, and returning patients while making the CRM handoff smarter.",
                        "ଏହା ନୂତନ, active ଏବଂ ପୁଣି ଫେରୁଥିବା ରୋଗୀମାନଙ୍କ ପାଇଁ ଅନୁଭବକୁ ଉପଯୋଗୀ ରଖି CRM handoff କୁ ଅଧିକ ସ୍ମାର୍ଟ କରେ।"
                      )}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("Interest level", "ଆଗ୍ରହର ସ୍ତର")}</span>
                        <select
                          value={interestLevel}
                          onChange={(event) => {
                            const nextValue = event.target.value as InterestLevel;
                            setInterestLevel(nextValue);
                            void captureCrmSignal({
                              event: "qualification_updated",
                              source,
                              topicId: topic.id,
                              awarenessStage,
                              patientStage,
                              campaignId: campaignId || undefined,
                              qrId: qrId || undefined,
                              metadata: buildCrmMetadata({
                                interestLevel: nextValue,
                                changedField: "interestLevel",
                                changedValue: nextValue,
                              }),
                            });
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                        >
                          {interestLevelOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                              {isOdia ? companionOdiaLabels.interestLevel[option.id] : option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("What are you trying to do?", "ଆପଣ ଏବେ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?")}</span>
                        <select
                          value={careIntent}
                          onChange={(event) => {
                            const nextValue = event.target.value as CareIntent;
                            setCareIntent(nextValue);
                            void captureCrmSignal({
                              event: "qualification_updated",
                              source,
                              topicId: topic.id,
                              awarenessStage,
                              patientStage,
                              campaignId: campaignId || undefined,
                              qrId: qrId || undefined,
                              metadata: buildCrmMetadata({
                                careIntent: nextValue,
                                changedField: "careIntent",
                                changedValue: nextValue,
                              }),
                            });
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                        >
                          {careIntentOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                              {isOdia ? companionOdiaLabels.careIntent[option.id] : option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("What is bothering you most?", "ସବୁଠାରୁ ଅଧିକ କଣ ଆପଣଙ୍କୁ ଚିନ୍ତିତ କରୁଛି?")}</span>
                        <select
                          value={primaryWorry}
                          onChange={(event) => {
                            const nextValue = event.target.value as PrimaryWorry;
                            setPrimaryWorry(nextValue);
                            void captureCrmSignal({
                              event: "qualification_updated",
                              source,
                              topicId: topic.id,
                              awarenessStage,
                              patientStage,
                              campaignId: campaignId || undefined,
                              qrId: qrId || undefined,
                              metadata: buildCrmMetadata({
                                primaryWorry: nextValue,
                                changedField: "primaryWorry",
                                changedValue: nextValue,
                              }),
                            });
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                        >
                          {primaryWorryOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                              {isOdia ? companionOdiaLabels.primaryWorry[option.id] : option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("What help do you want next?", "ପରେ କେମିତି ସହାୟତା ଚାହୁଁଛନ୍ତି?")}</span>
                        <select
                          value={helpNeeded}
                          onChange={(event) => {
                            const nextValue = event.target.value as HelpNeeded;
                            setHelpNeeded(nextValue);
                            void captureCrmSignal({
                              event: "qualification_updated",
                              source,
                              topicId: topic.id,
                              awarenessStage,
                              patientStage,
                              campaignId: campaignId || undefined,
                              qrId: qrId || undefined,
                              metadata: buildCrmMetadata({
                                helpNeeded: nextValue,
                                changedField: "helpNeeded",
                                changedValue: nextValue,
                              }),
                            });
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                        >
                          {helpNeededOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                              {isOdia ? companionOdiaLabels.helpNeeded[option.id] : option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">{t("Step 2: Tell us where you are in the IVF journey", "ପଦକ୍ଷେପ 2: IVF ଯାତ୍ରାର କେଉଁ ପର୍ଯ୍ୟାୟରେ ଅଛନ୍ତି ସେଥି କୁହନ୍ତୁ")}</p>
                    <div className="mt-3 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("Your name", "ଆପଣଙ୍କ ନାମ")}</span>
                          <input
                            value={patientName}
                            onChange={(event) => setPatientName(event.target.value)}
                            placeholder={t("Optional", "ଇଚ୍ଛାକୃତ")}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("WhatsApp Number", "WhatsApp ନମ୍ବର")}</span>
                          <input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder={t("10-digit or country code", "10-ଡିଜିଟ୍ କିମ୍ବା country code")}
                            inputMode="tel"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("Where are you in your journey?", "ଆପଣଙ୍କ ଯାତ୍ରା କେଉଁ ପର୍ଯ୍ୟାୟରେ ଅଛି?")}</span>
                          <select
                            value={awarenessStage}
                            onChange={(event) => {
                              const nextStage = event.target.value as AwarenessStage;
                              if (nextStage === "registered-patient") {
                                setInterestLevel("already-in-care");
                                setCareIntent("stay-supported");
                                setHelpNeeded("care-plan");
                              }
                              updateQuery({
                                awareness: nextStage,
                                mode: nextStage === "registered-patient" ? "patient" : null,
                              });
                              void captureCrmSignal({
                                event: "qualification_updated",
                                source,
                                topicId: topic.id,
                                awarenessStage: nextStage,
                                patientStage,
                                campaignId: campaignId || undefined,
                                qrId: qrId || undefined,
                                metadata: buildCrmMetadata({
                                  interestLevel: nextStage === "registered-patient" ? "already-in-care" : undefined,
                                  careIntent: nextStage === "registered-patient" ? "stay-supported" : undefined,
                                  helpNeeded: nextStage === "registered-patient" ? "care-plan" : undefined,
                                  patientMode: nextStage === "registered-patient",
                                  changedField: "awarenessStage",
                                  changedValue: nextStage,
                                }),
                              });
                            }}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                          >
                            {awarenessOptions.map((option) => (
                              <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                                {isOdia ? companionOdiaLabels.awarenessStage[option.id] : option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("What feels most relevant today?", "ଆଜି ସବୁଠାରୁ ଅଧିକ ସମ୍ପର୍କିତ କଣ ଲାଗୁଛି?")}</span>
                          <select
                            value={patientStage}
                            onChange={(event) => {
                              const nextStage = event.target.value as PatientStage;
                              updateQuery({ stage: nextStage });
                              void captureCrmSignal({
                                event: "qualification_updated",
                                source,
                                topicId: topic.id,
                                awarenessStage,
                                patientStage: nextStage,
                                campaignId: campaignId || undefined,
                                qrId: qrId || undefined,
                                metadata: buildCrmMetadata({
                                  changedField: "patientStage",
                                  changedValue: nextStage,
                                }),
                              });
                            }}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                          >
                            {patientStageOptions.map((option) => (
                              <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                                {isOdia ? companionOdiaLabels.patientStage[option.id] : option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-slate-400">{t("Anything else Santaan should know?", "ସନ୍ତାନ ଆଉ କଣ ଜାଣିବା ଉଚିତ?")}</span>
                    <textarea
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      rows={3}
                      placeholder={t(
                        "Example: trying for 2 years, low AMH 0.7, first cycle failed elsewhere, want clarity on next best option.",
                        "ଉଦାହରଣ: 2 ବର୍ଷ ହେଲା ଚେଷ୍ଟା କରୁଛୁ, AMH 0.7, ପ୍ରଥମ ସାଇକେଲ୍ ଅନ୍ୟଠାରେ ବିଫଳ, ପରବର୍ତ୍ତୀ ଭଲ ବିକଳ୍ପ କଣ ଜାଣିବାକୁ ଚାହୁଁଛି।"
                      )}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/30"
                    />
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5"
                    />
                    <span>
                      {t(
                        `I'm okay with ${env.clinicName} contacting me on WhatsApp about this question and the next steps that fit my situation.`,
                        `${env.clinicName} ମୋ ସହ ଏହି ପ୍ରଶ୍ନ ଓ ମୋ ପରିସ୍ଥିତିକୁ ମେଳ ହେଉଥିବା ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ବିଷୟରେ WhatsApp ରେ ସମ୍ପର୍କ କରିପାରିବ।`
                      )}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/35 disabled:opacity-60"
                  >
                    {isSubmitting
                      ? t("Saving Request...", "ଅନୁରୋଧ ସଂରକ୍ଷଣ ହେଉଛି...")
                      : t("Send This Guide And My Guided Context", "ଏହି ଗାଇଡ୍ ଏବଂ ମୋର context ପଠାନ୍ତୁ")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100">
                  <p className="font-medium">{t("CRM handoff preview", "CRM handoff preview")}</p>
                  <p className="mt-1 text-emerald-50/90">
                    {t("Topic", "ବିଷୟ")}: {localizedTopic?.shortLabel ?? topic.shortLabel} | {t("Awareness", "Awareness")}: {awarenessStageDisplayLabel} | {t("IVF stage", "IVF ପର୍ଯ୍ୟାୟ")}: {patientStageDisplayLabel} |
                    {" "}
                    {t("Interest", "ଆଗ୍ରହ")}: {interestLevelDisplayLabel} | {t("Intent", "ଉଦ୍ଦେଶ୍ୟ")}: {careIntentDisplayLabel} | {t("Worry", "ଚିନ୍ତା")}: {primaryWorryDisplayLabel} | {t("Help", "ସହାୟତା")}:
                    {" "}
                    {helpNeededDisplayLabel}
                  </p>
                </div>

                {formMessage && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200">
                    {formMessage}
                    {submittedPhone && (
                      <button
                        onClick={() => openSantaanWhatsApp("guide")}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        {t("Continue In WhatsApp", "WhatsApp ରେ ଆଗକୁ ବଢନ୍ତୁ")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{t("Choose what you need help with today", "ଆଜି କଣ ସହାୟତା ଚାହୁଁଛନ୍ତି ଚୟନ କରନ୍ତୁ")}</p>
              <p className="mt-1 text-xs text-slate-400">{t("Each path is written to feel calm, clear, and easy to act on from mobile.", "ପ୍ରତ୍ୟେକ ପଥ ମୋବାଇଲ୍ ରୁ ଶାନ୍ତ, ସ୍ପଷ୍ଟ ଏବଂ ସହଜ ଭାବେ ବ୍ୟବହାର କରିବା ପାଇଁ ଲେଖାଯାଇଛି।")}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {journeyTopics.map((item) => {
              const active = item.id === topic.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTopicChange(item.id)}
                  className={`card-lift min-w-[220px] rounded-3xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-400/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className={`text-sm font-semibold ${active ? "text-cyan-100" : "text-white"}`}>{isOdia ? companionOdiaTopics[item.id].label : item.label}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{isOdia ? companionOdiaTopics[item.id].concern : item.concern}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <Stethoscope className="h-5 w-5 text-blue-300" />
            <h2 className="mt-3 text-lg font-semibold text-white">{t("What This Means", "ଏହାର ଅର୍ଥ କଣ")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{localizedTopic?.explanation ?? topic.explanation}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <BookOpenText className="h-5 w-5 text-cyan-300" />
            <h2 className="mt-3 text-lg font-semibold text-white">{t("What Santaan Can Send", "ସନ୍ତାନ କଣ ପଠାଇପାରେ")}</h2>
            <ul className="mt-3 space-y-2">
              {topic.whatToSend.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <PhoneCall className="h-5 w-5 text-emerald-300" />
            <h2 className="mt-3 text-lg font-semibold text-white">{t("What To Do Next", "ପରେ କଣ କରିବେ")}</h2>
            <ul className="mt-3 space-y-2">
              {topic.nextSteps.map((step) => (
                <li key={step} className="flex items-start gap-2 text-sm text-slate-300">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-white">{t("Questions the patient should ask next", "ପରେ ରୋଗୀ କଣ ପଚାରିବା ଉଚିତ")}</p>
            <div className="mt-3 space-y-3">
              {topic.questionsToAsk.map((question) => (
                <div key={question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                  {question}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-300" />
              <p className="text-sm font-semibold text-amber-100">{t("When Santaan Should Step In Quickly", "ସନ୍ତାନ କେବେ ଶୀଘ୍ର ସହଯୋଗ କରିବା ଉଚିତ")}</p>
            </div>
            <div className="mt-3 space-y-3">
              {topic.redFlags.map((flag) => (
                <div key={flag} className="rounded-2xl border border-amber-400/20 bg-slate-950/50 p-4 text-sm text-amber-50">
                  {flag}
                </div>
              ))}
            </div>
            <button
              onClick={() => openSantaanWhatsApp("care-team")}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {t("Talk To The Care Team Now", "ଏବେ କେୟାର ଟିମ୍ ସହ କଥାହୁଅନ୍ତୁ")}
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-white">
              {isPatientMode
                ? t("Today's Patient Companion", "ଆଜିର ରୋଗୀ ସାଥୀ")
                : t("Want the patient mode experience?", "patient mode ଅନୁଭବ ଚାହୁଁଛନ୍ତି କି?")}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isPatientMode
                ? t(
                    "This block supports Santaan patients who need practical help between calls, appointments, and treatment milestones.",
                    "ଏହି ଅଂଶ call, appointment ଏବଂ treatment milestones ମଧ୍ୟରେ ପ୍ରାୟୋଗିକ ସହାୟତା ଦରକାର ଥିବା ସନ୍ତାନ ରୋଗୀଙ୍କୁ ସହଯୋଗ କରେ।"
                  )
                : t(
                    "Once a lead becomes a patient, the same companion can shift from acquisition to care continuity with stage-specific guidance.",
                    "ଏକ lead ରୋଗୀ ହେଲାପରେ, ଏହି ଏକଇ companion stage-specific guidance ସହ acquisition ଠାରୁ care continuity କୁ ଶିଫ୍ଟ ହୋଇପାରେ।"
                  )}
            </p>
            <div className="mt-4 space-y-2">
              {patientModeChecklist[patientStage].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
            {!isPatientMode && (
              <button
                onClick={enterPatientMode}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                {t("Switch To Patient Mode", "Patient mode କୁ ସ୍ୱିଚ୍ କରନ୍ତୁ")}
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 to-slate-900/80 p-5">
            <p className="text-sm font-semibold text-white">{t("A calm path from first question to the next step", "ପ୍ରଥମ ପ୍ରଶ୍ନ ଠାରୁ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ପର୍ଯ୍ୟନ୍ତ ଶାନ୍ତ ପଥ")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200">{t("Clarity", "ସ୍ପଷ୍ଟତା")}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Patients land on one focused topic instead of a broad page that forces them to hunt for meaning.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200">{t("Reassurance", "ନିଶ୍ଚିନ୍ତତା")}</p>
                <p className="mt-2 text-sm text-slate-300">
                  The experience stays short, warm, and emotionally steady instead of feeling like a form funnel.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200">{t("Continuity", "ନିରନ୍ତରତା")}</p>
                <p className="mt-2 text-sm text-slate-300">
                  When patients continue on WhatsApp, the conversation can carry context forward quietly in the background.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200">{t("Ongoing support", "ନିରନ୍ତର ସହଯୋଗ")}</p>
                <p className="mt-2 text-sm text-slate-300">
                  The same space can keep helping registered patients between appointments, milestones, and anxious moments.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => openSantaanWhatsApp("consult")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white"
              >
                {t("Book Consultation", "ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("Explore FAQ Hub", "FAQ Hub ଦେଖନ୍ତୁ")}
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("Emotional Support", "ଭାବନାତ୍ମକ ସହଯୋଗ")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2">
          <button
            onClick={() => openSantaanWhatsApp("guide")}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-3 text-xs font-semibold text-white"
          >
            {t("Get Guide", "ଗାଇଡ୍ ପାଆନ୍ତୁ")}
          </button>
          <button
            onClick={() => openSantaanWhatsApp("care-team")}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold text-white"
          >
            {t("Talk To Care", "କେୟାର ସହ କଥାହୁଅନ୍ତୁ")}
          </button>
          <button
            onClick={() => openSantaanWhatsApp("consult")}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-3 text-xs font-semibold text-cyan-100"
          >
            {t("Book Consult", "ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ")}
          </button>
        </div>
      </div>
    </main>
  );
}
