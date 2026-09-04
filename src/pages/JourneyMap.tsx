import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  CircleHelp,
  HeartHandshake,
  LockKeyhole,
  Map,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  concerns,
  concernQuestions,
  entryTopics,
  getEntryTopic,
  getJourneyPosition,
  helpChoices,
  journeyPositions,
  locations,
  trustProofs,
  type ConcernId,
  type HelpId,
  type JourneyPositionId,
  type LocationId,
} from "../data/journeyMap";
import {
  buildWhatsAppLink,
  requestJourneyHandoff,
  type JourneyLeadPayload,
} from "../lib/api";
import {
  postEmbedHeight,
  readJourneyAttribution,
  trackMapEvent,
} from "../lib/attribution";

type Stage = "welcome" | "position" | "concerns" | "help" | "location" | "map" | "contact";
type ContactAction = JourneyLeadPayload["action"];
type Satisfaction = NonNullable<JourneyLeadPayload["satisfaction"]>;

const stages: Stage[] = [
  "welcome",
  "position",
  "concerns",
  "help",
  "location",
  "map",
  "contact",
];

const stageLabels: Record<Stage, string> = {
  welcome: "Welcome",
  position: "Where you are",
  concerns: "What matters",
  help: "What would help",
  location: "Practical access",
  map: "Your private map",
  contact: "Your choice",
};

const contactOptions: Array<{
  id: ContactAction;
  title: string;
  description: string;
  icon: typeof MessageCircle;
}> = [
  {
    id: "whatsapp",
    title: "Continue privately on WhatsApp",
    description: "Message first. Santaan will not call unless you ask.",
    icon: MessageCircle,
  },
  {
    id: "callback",
    title: "Request a callback",
    description: "Choose a suitable time for a counselor to call.",
    icon: PhoneCall,
  },
  {
    id: "consultation",
    title: "Ask for a consultation",
    description: "Let the team help you choose a center and suitable time.",
    icon: CalendarClock,
  },
  {
    id: "existing-patient",
    title: "I am already a Santaan patient",
    description: "Route the request to care support instead of a sales call.",
    icon: UserRoundCheck,
  },
];

function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `map-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function normalisePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

function ChoiceCard({
  active,
  children,
  onClick,
  multiple = false,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  multiple?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
        active
          ? "border-teal-600 bg-teal-50 text-slate-950 shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border ${
          multiple ? "rounded-md" : "rounded-full"
        } ${active ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white"}`}
      >
        {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
        {eyebrow}
      </p>
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function JourneyMap() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const topicId = getEntryTopic(params.get("topic"));
  const topic = entryTopics[topicId];
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const initialPosition: JourneyPositionId =
    params.get("mode") === "patient" ? "existing-patient" : topic.suggestedPosition;
  const [stage, setStage] = useState<Stage>("welcome");
  const [position, setPosition] = useState<JourneyPositionId>(initialPosition);
  const [selectedConcerns, setSelectedConcerns] = useState<ConcernId[]>([]);
  const [helpRequested, setHelpRequested] = useState<HelpId>("simple-explanation");
  const [location, setLocation] = useState<LocationId>("not-sure");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>();
  const [contactAction, setContactAction] = useState<ContactAction>(
    initialPosition === "existing-patient" ? "existing-patient" : "whatsapp",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<"English" | "Odia">("English");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [question, setQuestion] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    action: ContactAction;
    journeyRef?: string;
  }>();
  const submissionId = useRef(createSubmissionId());
  const started = useRef(false);

  const stageIndex = stages.indexOf(stage);
  const progress = Math.round((stageIndex / (stages.length - 1)) * 100);
  const currentPosition = getJourneyPosition(position);
  const selectedConcernLabels = concerns
    .filter((item) => selectedConcerns.includes(item.id))
    .map((item) => item.label);
  const suggestedQuestions =
    selectedConcerns.length > 0
      ? selectedConcerns.map((item) => concernQuestions[item])
      : [
          concernQuestions["where-to-begin"],
          concernQuestions["fear-of-commitment"],
          concernQuestions.privacy,
        ];
  const help = helpChoices.find((item) => item.id === helpRequested) ?? helpChoices[0];
  const selectedLocation = locations.find((item) => item.id === location) ?? locations[4];

  useEffect(() => {
    if (!attribution.embed) {
      return;
    }
    const observer = new ResizeObserver(() => {
      postEmbedHeight(document.documentElement.scrollHeight);
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [attribution.embed]);

  useEffect(() => {
    document.title = `${stageLabels[stage]} | Santaan Fertility Map`;
  }, [stage]);

  function begin() {
    setStage("position");
    if (!started.current) {
      started.current = true;
      trackMapEvent("map_started", {
        channel: attribution.channel,
        source: attribution.source,
        embed: attribution.embed,
      });
    }
  }

  function goTo(nextStage: Stage) {
    setError("");
    setStage(nextStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const current = stages.indexOf(stage);
    if (current < stages.length - 1) {
      const nextStage = stages[current + 1];
      if (nextStage === "map") {
        trackMapEvent("personal_map_viewed", {
          journey_step: "personal_map",
          channel: attribution.channel,
        });
      }
      goTo(nextStage);
    }
  }

  function back() {
    const current = stages.indexOf(stage);
    if (current > 0) {
      goTo(stages[current - 1]);
    }
  }

  function toggleConcern(id: ConcernId) {
    setSelectedConcerns((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 3) {
        setError("Choose up to three concerns so the map stays focused.");
        return current;
      }
      setError("");
      return [...current, id];
    });
  }

  function chooseContactAction(action: ContactAction) {
    setContactAction(action);
    trackMapEvent("contact_action_selected", {
      action,
      channel: attribution.channel,
    });
    goTo("contact");
  }

  function reset() {
    setStage("welcome");
    setPosition(initialPosition);
    setSelectedConcerns([]);
    setHelpRequested("simple-explanation");
    setLocation("not-sure");
    setSatisfaction(undefined);
    setContactAction(initialPosition === "existing-patient" ? "existing-patient" : "whatsapp");
    setName("");
    setPhone("");
    setPreferredWindow("");
    setQuestion("");
    setConsent(false);
    setError("");
    setSuccess(undefined);
    submissionId.current = createSubmissionId();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalisedPhone = normalisePhone(phone);
    if (!name.trim()) {
      setError("Please enter the name the counselor should use.");
      return;
    }
    if (normalisedPhone.length < 10 || normalisedPhone.length > 15) {
      setError("Please enter a valid WhatsApp or callback number.");
      return;
    }
    if (contactAction === "callback" && !preferredWindow) {
      setError("Choose when a counselor may call.");
      return;
    }
    if (!consent) {
      setError("Please confirm that Santaan may use these details for the action you selected.");
      return;
    }

    const whatsappWindow =
      contactAction === "whatsapp" && attribution.embed
        ? window.open("about:blank", "_blank")
        : null;
    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }
    setSubmitting(true);
    setError("");
    const result = await requestJourneyHandoff({
      submissionId: submissionId.current,
      journeyId: attribution.journeyId,
      action: contactAction,
      name: name.trim(),
      phone: normalisedPhone,
      consent,
      language,
      position,
      concerns: selectedConcerns,
      helpRequested,
      location,
      preferredWindow: contactAction === "callback" ? preferredWindow : undefined,
      satisfaction,
      question: question.trim() || undefined,
      topic: topicId,
      attribution,
    });
    setSubmitting(false);

    if (!result.ok || !result.accepted) {
      whatsappWindow?.close();
      setError(
        result.error ??
          "Your request could not be saved yet. Please try again. No callback has been scheduled.",
      );
      return;
    }

    setSuccess({ action: contactAction, journeyRef: result.journeyRef });
    trackMapEvent("handoff_completed", {
      action: contactAction,
      channel: attribution.channel,
    });

    if (contactAction === "whatsapp") {
      const reference = result.journeyRef
        ? ` Reference: ${result.journeyRef}.`
        : "";
      const link = buildWhatsAppLink(
        `Hello Santaan. I would like private fertility guidance.${reference}`,
      );
      if (whatsappWindow) {
        whatsappWindow.location.href = link;
      } else {
        window.location.assign(link);
      }
    }
  }

  return (
    <main className="min-h-[calc(100vh-9rem)] bg-[#f7f5ef] text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        {stage !== "welcome" ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-600">
              <span>{stageLabels[stage]}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <LockKeyhole className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              Your choices stay on this device until you ask Santaan to contact you.
            </p>
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
          {stage === "welcome" ? (
            <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 p-6 text-white sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-2xl" />
              <div className="relative max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold">
                  <Sparkles className="h-4 w-4 text-cyan-200" aria-hidden="true" />
                  Santaan Guide · automated educational guide
                </div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
                  {topic.eyebrow}
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
                  {topic.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                  {topic.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    [LockKeyhole, "Explore privately", "No name or number to begin."],
                    [Map, "See your next step", "A map shaped by your choices."],
                    [HeartHandshake, "You stay in control", "WhatsApp first, or choose a call time."],
                  ].map(([Icon, title, description]) => {
                    const GuideIcon = Icon as typeof LockKeyhole;
                    return (
                      <div
                        key={title as string}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <GuideIcon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                        <p className="mt-3 font-semibold">{title as string}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {description as string}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={begin}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-3 font-bold text-white shadow-lg shadow-pink-950/20 transition hover:bg-pink-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 sm:w-auto"
                >
                  Start my private map
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <p className="mt-4 max-w-xl text-xs leading-5 text-slate-400">
                  This guide does not diagnose, recommend treatment or replace a fertility
                  specialist. For urgent medical concerns, contact your clinician directly.
                </p>
              </div>
            </div>
          ) : null}

          {stage === "position" ? (
            <div className="animate-rise-in">
              <StepHeader
                eyebrow="Place yourself on the map"
                title="Which feels closest to where you are today?"
                description="There is no right answer. Choose the point that best describes the conversation you need."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {journeyPositions.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    active={position === item.id}
                    onClick={() => {
                      setPosition(item.id);
                      if (item.id === "existing-patient") {
                        setContactAction("existing-patient");
                      }
                    }}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-500">
                      {item.reassurance}
                    </span>
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ) : null}

          {stage === "concerns" ? (
            <div className="animate-rise-in">
              <StepHeader
                eyebrow="What matters most"
                title="What would make the next step feel easier?"
                description="Choose up to three. These choices are not a diagnosis and are not shared until you request contact."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {concerns.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    active={selectedConcerns.includes(item.id)}
                    onClick={() => toggleConcern(item.id)}
                    multiple
                  >
                    <span className="font-semibold">{item.label}</span>
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ) : null}

          {stage === "help" ? (
            <div className="animate-rise-in">
              <StepHeader
                eyebrow="Choose the kind of help"
                title="What would feel useful right now?"
                description="You can stay private and use only the educational map."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {helpChoices.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    active={helpRequested === item.id}
                    onClick={() => setHelpRequested(item.id)}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-500">
                      {item.supportingText}
                    </span>
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ) : null}

          {stage === "location" ? (
            <div className="animate-rise-in">
              <StepHeader
                eyebrow="Make the path practical"
                title="Which location would be easiest to consider?"
                description="This helps the guide explain access. It does not book or assign you to a center."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {locations.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    active={location === item.id}
                    onClick={() => setLocation(item.id)}
                  >
                    <span className="font-semibold">{item.label}</span>
                  </ChoiceCard>
                ))}
              </div>
              {location === "south-odisha" ? (
                <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
                  If you are in Jeypore, Koraput, Rayagada, Nabarangpur or nearby,
                  Santaan can explain current access through its existing Odisha centers
                  and how future continuity closer to Jeypore may work. No opening date or
                  treatment availability is promised inside this guide.
                </div>
              ) : null}
            </div>
          ) : null}

          {stage === "map" ? (
            <div className="animate-rise-in">
              <StepHeader
                eyebrow="Your private fertility map"
                title="A calmer path from uncertainty to a useful conversation."
                description="This is educational guidance based on what you selected—not a clinical assessment."
              />

              <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl bg-slate-950 p-5 text-white sm:p-7">
                  <div className="relative space-y-5 before:absolute before:bottom-7 before:left-[1.05rem] before:top-7 before:w-px before:bg-teal-300/30">
                    {[
                      {
                        label: "You are here",
                        title: currentPosition.shortLabel,
                        body: currentPosition.reassurance,
                      },
                      {
                        label: "Make it clearer",
                        title: currentPosition.nextStep,
                        body:
                          selectedConcernLabels.length > 0
                            ? `Your priorities: ${selectedConcernLabels.join(" ")}`
                            : "You can add concerns or continue with a general preparation path.",
                      },
                      {
                        label: "Your preferred support",
                        title: help.label,
                        body: `${help.supportingText ?? ""} Preferred area: ${selectedLocation.label}.`,
                      },
                    ].map((stop, index) => (
                      <div key={stop.label} className="relative flex gap-4">
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-200/40 bg-teal-900 text-sm font-bold text-teal-100">
                          {index + 1}
                        </div>
                        <div className="pb-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
                            {stop.label}
                          </p>
                          <h2 className="mt-1 text-lg font-semibold">{stop.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{stop.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-teal-800">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    <h2 className="font-semibold">Prepare without pressure</h2>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {currentPosition.preparation.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                    {position === "existing-patient" ? trustProofs.continuity : trustProofs.privacy}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-teal-200 bg-teal-50 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-teal-900">
                  <CircleHelp className="h-5 w-5" aria-hidden="true" />
                  <h2 className="font-semibold">Questions your map suggests asking</h2>
                </div>
                <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                  {suggestedQuestions.map((item, index) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl border border-teal-100 bg-white p-4 text-sm leading-6 text-slate-700"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 p-5 sm:p-6">
                <h2 className="font-semibold text-slate-900">Did this make the next step clearer?</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[
                    ["clearer", "Yes, clearer"],
                    ["somewhat", "Somewhat"],
                    ["needs-help", "I still need help"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSatisfaction(value as Satisfaction);
                        trackMapEvent("satisfaction_submitted", {
                          response: value,
                          channel: attribution.channel,
                        });
                      }}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
                        satisfaction === value
                          ? "border-teal-600 bg-teal-50 text-teal-950"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  If you want human help, choose how Santaan may continue:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {contactOptions
                    .filter((option) =>
                      position === "existing-patient"
                        ? option.id === "existing-patient" || option.id === "whatsapp"
                        : option.id !== "existing-patient",
                    )
                    .map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => chooseContactAction(option.id)}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-400 hover:bg-teal-50/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-slate-900">
                              {option.title}
                            </span>
                            <span className="mt-1 block text-sm leading-5 text-slate-500">
                              {option.description}
                            </span>
                          </span>
                          <ChevronRight className="mt-2 h-4 w-4 text-slate-400" aria-hidden="true" />
                        </button>
                      );
                    })}
                </div>
                <button
                  type="button"
                  onClick={() => goTo("position")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Edit my choices
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-5 mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Keep this private and start again
                </button>
              </div>
            </div>
          ) : null}

          {stage === "contact" ? (
            <div className="animate-rise-in">
              {success ? (
                <div className="mx-auto max-w-2xl py-8 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                    <Check className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h1 className="mt-5 text-3xl font-semibold text-slate-950">
                    Your choice has been saved.
                  </h1>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {success.action === "callback"
                      ? "A Santaan counselor may call only during the window you selected."
                      : success.action === "consultation"
                        ? "A Santaan counselor will help with the consultation request."
                        : success.action === "existing-patient"
                          ? "Your request is marked for existing-patient support."
                          : "WhatsApp is opening so you can continue privately."}
                  </p>
                  {success.journeyRef ? (
                    <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                      Reference: {success.journeyRef}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Start a new private map
                  </button>
                </div>
              ) : (
                <>
                  <StepHeader
                    eyebrow="You control the handoff"
                    title={
                      contactOptions.find((option) => option.id === contactAction)?.title ??
                      "Choose how Santaan may help"
                    }
                    description="Your details are used only for the action you select. Selecting WhatsApp does not permit an unsolicited call."
                  />

                  <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Name
                        </span>
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          autoComplete="name"
                          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          placeholder="Name the counselor should use"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          {contactAction === "callback" ? "Callback number" : "WhatsApp number"}
                        </span>
                        <input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          inputMode="tel"
                          autoComplete="tel"
                          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          placeholder="+91 98765 43210"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Preferred language
                        </span>
                        <select
                          value={language}
                          onChange={(event) =>
                            setLanguage(event.target.value as "English" | "Odia")
                          }
                          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        >
                          <option>English</option>
                          <option>Odia</option>
                        </select>
                      </label>
                      {contactAction === "callback" ? (
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">
                            When may a counselor call?
                          </span>
                          <select
                            value={preferredWindow}
                            onChange={(event) => setPreferredWindow(event.target.value)}
                            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          >
                            <option value="">Choose a callback window</option>
                            <option value="09:00-12:00">9 am–12 pm</option>
                            <option value="12:00-15:00">12 pm–3 pm</option>
                            <option value="15:00-18:00">3 pm–6 pm</option>
                            <option value="18:00-20:00">6 pm–8 pm</option>
                          </select>
                        </label>
                      ) : null}
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          One question you want answered{" "}
                          <span className="font-normal text-slate-400">(optional)</span>
                        </span>
                        <textarea
                          value={question}
                          onChange={(event) => setQuestion(event.target.value.slice(0, 300))}
                          rows={3}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          placeholder="Keep this brief. Do not enter urgent medical information."
                        />
                        <span className="mt-1 block text-right text-xs text-slate-400">
                          {question.length}/300
                        </span>
                      </label>
                    </div>

                    <div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                          What the counselor receives
                        </p>
                        <dl className="mt-4 space-y-3 text-sm">
                          <div>
                            <dt className="font-semibold text-slate-800">Journey position</dt>
                            <dd className="text-slate-500">{currentPosition.shortLabel}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-slate-800">Requested help</dt>
                            <dd className="text-slate-500">{help.label}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-slate-800">Preferred location</dt>
                            <dd className="text-slate-500">{selectedLocation.label}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-slate-800">Contact permission</dt>
                            <dd className="text-slate-500">
                              {contactAction === "callback"
                                ? "Callback in chosen window"
                                : contactAction === "whatsapp"
                                  ? "WhatsApp only; no unsolicited call"
                                  : contactAction === "existing-patient"
                                    ? "Existing-patient support"
                                    : "Consultation assistance"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                        />
                        <span className="text-sm leading-6 text-slate-600">
                          I ask Santaan to use my details to complete the action selected
                          above. I understand this is not a diagnosis or emergency service.
                        </span>
                      </label>

                      {error ? (
                        <div
                          role="alert"
                          className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                        >
                          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          {error}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 disabled:cursor-wait disabled:opacity-60"
                      >
                        {submitting
                          ? "Saving your choice…"
                          : contactAction === "whatsapp"
                            ? "Save and open WhatsApp"
                            : contactAction === "callback"
                              ? "Request this callback"
                              : contactAction === "existing-patient"
                                ? "Send to care support"
                                : "Request consultation help"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          ) : null}

          {error && stage !== "contact" ? (
            <div
              role="alert"
              className="mt-5 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            >
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          ) : null}

          {!["welcome", "map", "contact"].includes(stage) ? (
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={back}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-5 py-2 font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </section>

        <div className="mx-auto mt-5 flex max-w-3xl items-start gap-3 px-2 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
          <p>
            Santaan Fertility Map is an automated educational guide, not a clinician.
            Health and treatment decisions require a qualified fertility specialist.
            You control whether Santaan may contact you.
          </p>
        </div>
      </div>
    </main>
  );
}
