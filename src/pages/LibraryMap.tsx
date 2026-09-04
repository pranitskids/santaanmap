import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Library,
  LockKeyhole,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  entryShelfByTopic,
  getChapter,
  getShelf,
  libraryNeeds,
  libraryPersonas,
  libraryShelves,
  type LibraryNeedId,
  type LibraryShelfId,
} from "../data/fertilityLibrary";
import type { ConcernId, LocationId } from "../data/journeyMap";
import {
  buildWhatsAppLink,
  captureCrmSignal,
  requestJourneyHandoff,
} from "../lib/api";
import {
  postEmbedHeight,
  readJourneyAttribution,
  trackMapEvent,
} from "../lib/attribution";

type View = "library" | "shelf" | "chapter" | "help";

const topicToPersona: Record<string, (typeof libraryPersonas)[number]["id"] | undefined> = {
  "first-consultation": "wondering",
  "both-partners": "trying",
  "previous-treatment": "previous-treatment",
  "south-odisha": "choosing-clinic",
  "planning-clarity": "comparing",
};

function unique<T>(values: Array<T | undefined>) {
  return [...new Set(values.filter((value): value is T => value !== undefined))];
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

export default function LibraryMap() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const topic = params.get("topic") ?? "private-guidance";
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const entryShelf = entryShelfByTopic[topic];
  const [view, setView] = useState<View>("library");
  const [personaId, setPersonaId] = useState<(typeof libraryPersonas)[number]["id"] | undefined>(
    topicToPersona[topic],
  );
  const [needId, setNeedId] = useState<LibraryNeedId | undefined>();
  const [shelfId, setShelfId] = useState<LibraryShelfId | undefined>(entryShelf);
  const [chapterId, setChapterId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<"English" | "Odia">("English");
  const [callbackWindow, setCallbackWindow] = useState("");
  const [callbackLocation, setCallbackLocation] = useState<LocationId>("not-sure");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const selectedPersona = libraryPersonas.find((item) => item.id === personaId);
  const selectedNeed = libraryNeeds.find((item) => item.id === needId);
  const selectedShelf = shelfId ? getShelf(shelfId) : undefined;
  const selectedChapter = chapterId ? getChapter(chapterId) : undefined;

  const recommendedShelfIds = useMemo(
    () =>
      unique<LibraryShelfId>([
        ...(selectedPersona?.shelfIds ?? []),
        ...(selectedNeed?.shelfIds ?? []),
        entryShelf,
      ]),
    [selectedPersona, selectedNeed, entryShelf],
  );

  const orderedShelves = useMemo(() => {
    if (!recommendedShelfIds.length) {
      return libraryShelves;
    }
    return [...libraryShelves].sort((left, right) => {
      const leftRank = recommendedShelfIds.indexOf(left.id);
      const rightRank = recommendedShelfIds.indexOf(right.id);
      if (leftRank === -1 && rightRank === -1) return 0;
      if (leftRank === -1) return 1;
      if (rightRank === -1) return -1;
      return leftRank - rightRank;
    });
  }, [recommendedShelfIds]);
  const recommendedChapter = useMemo(() => {
    if (selectedNeed) {
      return getChapter(selectedNeed.chapterId);
    }
    const firstShelfId = selectedPersona?.shelfIds[0] ?? entryShelf;
    return firstShelfId ? getShelf(firstShelfId).chapters[0] : undefined;
  }, [entryShelf, selectedNeed, selectedPersona]);

  const journeyReference = `MAP-${attribution.journeyId.slice(0, 8).toUpperCase()}`;

  useEffect(() => {
    trackMapEvent("library_opened", {
      topic,
      source: attribution.source,
      channel: attribution.channel,
    });
  }, [attribution.channel, attribution.source, topic]);

  useEffect(() => {
    if (!rootRef.current || !attribution.embed) return;
    const observer = new ResizeObserver(() => {
      postEmbedHeight(rootRef.current?.scrollHeight ?? document.body.scrollHeight);
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [attribution.embed]);

  function choosePersona(id: (typeof libraryPersonas)[number]["id"]) {
    const next = personaId === id ? undefined : id;
    setPersonaId(next);
    trackMapEvent("library_persona_selected", {
      persona: next,
      channel: attribution.channel,
    });
    if (next === "existing-patient") {
      setShelfId("existing-patient");
      setChapterId(undefined);
      setView("shelf");
      window.scrollTo({ top: 0, behavior: "smooth" });
      trackMapEvent("library_existing_patient_bypass", {
        channel: attribution.channel,
      });
    }
  }

  function chooseNeed(id: LibraryNeedId) {
    const next = needId === id ? undefined : id;
    setNeedId(next);
    trackMapEvent("library_need_selected", {
      need: next,
      channel: attribution.channel,
    });
  }

  function openShelf(id: LibraryShelfId) {
    setShelfId(id);
    setChapterId(undefined);
    setView("shelf");
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackMapEvent("library_shelf_opened", {
      shelf: id,
      persona: personaId,
      need: needId,
      channel: attribution.channel,
    });
  }

  function openChapter(id: string) {
    const chapter = getChapter(id);
    if (!chapter) return;
    setShelfId(chapter.shelfId);
    setChapterId(id);
    setView("chapter");
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackMapEvent("library_chapter_opened", {
      shelf: chapter.shelfId,
      chapter: chapter.id,
      persona: personaId,
      need: needId,
      channel: attribution.channel,
    });
  }

  function openHelp() {
    setView("help");
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackMapEvent("library_handoff_options_viewed", {
      shelf: selectedShelf?.id,
      chapter: selectedChapter?.id,
      channel: attribution.channel,
    });
  }

  function openWhatsApp() {
    const shelf = selectedShelf ?? getShelf(recommendedShelfIds[0] ?? "starting");
    const chapter = selectedChapter;
    const contextLabel = chapter?.title ?? shelf.title;
    const message = [
      "Hi Santaan, I explored your private fertility library.",
      `I was reading: ${contextLabel}.`,
      "I would like to continue privately on WhatsApp.",
      "Please message first. Do not call unless I ask.",
      `Reference: ${journeyReference}`,
    ].join("\n");

    trackMapEvent("library_whatsapp_clicked", {
      shelf: shelf.id,
      chapter: chapter?.id,
      persona: personaId,
      need: needId,
      journey_reference: journeyReference,
      campaign_id: attribution.campaignId,
      adset_id: attribution.adsetId,
      ad_id: attribution.adId,
    });
    void captureCrmSignal({
      event: "library_whatsapp_clicked",
      source: attribution.source,
      topicId: chapter?.id ?? shelf.id,
      awarenessStage: personaId,
      patientStage: personaId,
      campaignId: attribution.campaignId,
      metadata: {
        journeyReference,
        shelfId: shelf.id,
        chapterId: chapter?.id,
        needId,
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
    if (!name.trim()) {
      setError("Please enter the name the counselor should use.");
      return;
    }
    if (cleanedPhone.length < 12) {
      setError("Please enter a valid callback number.");
      return;
    }
    if (!callbackWindow) {
      setError("Please choose when a counselor may call.");
      return;
    }
    if (!consent) {
      setError("Please confirm that Santaan may call during the selected window.");
      return;
    }

    const shelf = selectedShelf ?? getShelf(recommendedShelfIds[0] ?? "starting");
    const concerns = unique<ConcernId>([
      selectedChapter?.concern,
      selectedNeed?.concern,
      personaId === "wondering" ? "where-to-begin" : undefined,
    ]);
    setSubmitting(true);
    const result = await requestJourneyHandoff({
      submissionId: createSubmissionId(),
      journeyId: attribution.journeyId,
      action: personaId === "existing-patient" ? "existing-patient" : "callback",
      name: name.trim(),
      phone: cleanedPhone,
      consent,
      language,
      position: personaId ?? shelf.position,
      concerns,
      helpRequested: selectedNeed?.help ?? shelf.defaultHelp,
      location: callbackLocation,
      preferredWindow: callbackWindow,
      topic: selectedChapter?.id ?? shelf.id,
      attribution,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Santaan could not save this callback yet.");
      return;
    }
    setSuccess(true);
    trackMapEvent("library_callback_requested", {
      shelf: shelf.id,
      chapter: selectedChapter?.id,
      journey_reference: result.journeyRef ?? journeyReference,
    });
  }

  return (
    <main ref={rootRef} className="min-h-screen bg-[#f7f5ef] pb-12 text-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        {view === "library" ? (
          <div>
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-800 px-5 py-7 text-white shadow-xl shadow-teal-950/10 sm:px-9 sm:py-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Private fertility library
              </div>
              <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Begin with the question that feels closest to you.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-teal-50 sm:text-lg">
                Explore at your own pace. Nothing here starts a call, asks for a diagnosis
                or commits you to treatment.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  No name or number required
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Open any chapter
                </span>
              </div>
            </section>

            <section className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Help the library understand you</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Optional. Select one from either row, or browse every shelf below.
                  </p>
                </div>
              </div>

              <fieldset className="mt-6">
                <legend className="text-sm font-bold text-slate-800">What feels closest today?</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {libraryPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      aria-pressed={personaId === persona.id}
                      onClick={() => choosePersona(persona.id)}
                      className={`min-h-12 rounded-2xl border px-3 py-2 text-left text-sm font-semibold leading-5 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
                        personaId === persona.id
                          ? "border-teal-700 bg-teal-700 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-teal-400"
                      }`}
                    >
                      {persona.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="text-sm font-bold text-slate-800">
                  What would be useful right now?
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {libraryNeeds.map((need) => (
                    <button
                      key={need.id}
                      type="button"
                      aria-pressed={needId === need.id}
                      onClick={() => chooseNeed(need.id)}
                      className={`min-h-12 rounded-2xl border px-3 py-2 text-left text-sm font-semibold leading-5 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
                        needId === need.id
                          ? "border-indigo-700 bg-indigo-700 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-400"
                      }`}
                    >
                      {need.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {recommendedChapter ? (
                <button
                  type="button"
                  onClick={() => openChapter(recommendedChapter.id)}
                  className="group mt-6 flex w-full items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-left transition hover:border-teal-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                      A useful place to begin
                    </span>
                    <span className="mt-1 block font-semibold text-slate-900">
                      {recommendedChapter.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">
                      {recommendedChapter.promise}
                    </span>
                  </span>
                  <ChevronRight
                    className="mt-3 h-5 w-5 shrink-0 text-teal-700 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              ) : null}
            </section>

            <section className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                    {recommendedShelfIds.length ? "Suggested first" : "The complete library"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Choose any shelf. You stay in control.
                  </h2>
                </div>
                <Library className="hidden h-9 w-9 text-teal-700 sm:block" aria-hidden="true" />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {orderedShelves.map((shelf, index) => {
                  const suggested = recommendedShelfIds.includes(shelf.id);
                  return (
                    <button
                      key={shelf.id}
                      type="button"
                      onClick={() => openShelf(shelf.id)}
                      className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                    >
                      <span
                        className={`block bg-gradient-to-r ${shelf.accent} px-5 py-4 text-white`}
                      >
                        <span className="flex items-center justify-between gap-4">
                          <span className="text-xs font-bold uppercase tracking-[0.16em]">
                            Shelf {String(index + 1).padStart(2, "0")}
                          </span>
                          {suggested ? (
                            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
                              Suggested
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-2 block text-xl font-semibold">{shelf.title}</span>
                      </span>
                      <span className="block p-5">
                        <span className="block text-sm leading-6 text-slate-600">
                          {shelf.description}
                        </span>
                        <span className="mt-4 block space-y-2">
                          {shelf.chapters.map((chapter) => (
                            <span key={chapter.id} className="flex items-center gap-2 text-sm text-slate-700">
                              <BookOpen className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                              {chapter.title}
                            </span>
                          ))}
                        </span>
                        <span className="mt-5 inline-flex items-center gap-2 font-bold text-teal-800">
                          Open this shelf
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        ) : null}

        {view === "shelf" && selectedShelf ? (
          <div>
            <button
              type="button"
              onClick={() => setView("library")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-slate-600 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All shelves
            </button>
            <section
              className={`mt-3 rounded-[2rem] bg-gradient-to-br ${selectedShelf.accent} px-5 py-8 text-white sm:px-9`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Private shelf
              </p>
              <h1 className="mt-3 text-3xl font-semibold">{selectedShelf.title}</h1>
              <p className="mt-3 max-w-2xl leading-7 text-white/90">
                {selectedShelf.description}
              </p>
            </section>
            <div className="mt-5 grid gap-4">
              {selectedShelf.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => openChapter(chapter.id)}
                  className="group rounded-[1.6rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 sm:p-6"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {chapter.readingTime}
                    </span>
                    <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-xl font-semibold text-slate-950">
                    {chapter.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">
                    {chapter.promise}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === "chapter" && selectedShelf && selectedChapter ? (
          <article>
            <button
              type="button"
              onClick={() => setView("shelf")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-slate-600 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {selectedShelf.title}
            </button>
            <div className="mt-3 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className={`bg-gradient-to-br ${selectedShelf.accent} px-5 py-7 text-white sm:px-9`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  {selectedChapter.readingTime} private chapter
                </div>
                <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight">
                  {selectedChapter.title}
                </h1>
                <p className="mt-3 max-w-2xl leading-7 text-white/90">
                  {selectedChapter.promise}
                </p>
              </div>
              <div className="p-5 sm:p-9">
                <div className="flex gap-3 rounded-2xl bg-teal-50 p-4 text-teal-950">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-teal-800" aria-hidden="true" />
                  <p className="font-semibold leading-6">{selectedChapter.reassurance}</p>
                </div>

                <section className="mt-7">
                  <h2 className="text-xl font-semibold">What this can clarify</h2>
                  <p className="mt-3 leading-7 text-slate-600">{selectedChapter.explanation}</p>
                </section>

                <section className="mt-7 rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                    One useful next step
                  </p>
                  <p className="mt-3 font-semibold leading-7 text-slate-800">
                    {selectedChapter.nextStep}
                  </p>
                </section>

                <section className="mt-7">
                  <h2 className="text-xl font-semibold">Questions worth keeping</h2>
                  <ol className="mt-4 space-y-3">
                    {selectedChapter.questions.map((question, index) => (
                      <li
                        key={question}
                        className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        {question}
                      </li>
                    ))}
                  </ol>
                </section>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setView("shelf")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700"
                  >
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                    Keep exploring
                  </button>
                  <button
                    type="button"
                    onClick={openHelp}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white"
                  >
                    Continue privately
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        {view === "help" ? (
          <div>
            <button
              type="button"
              onClick={() => setView(selectedChapter ? "chapter" : "library")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-slate-600 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Keep exploring
            </button>

            <section className="mt-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              {success ? (
                <div className="py-8 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                    <Check className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h1 className="mt-5 text-3xl font-semibold">Your callback choice is saved.</h1>
                  <p className="mt-3 leading-7 text-slate-600">
                    A counselor may call only during the window you selected.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                    Your choice
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold">Continue only when you feel ready.</h1>
                  <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                    WhatsApp does not permit an unsolicited call. A callback requires your
                    number, a chosen time and explicit permission.
                  </p>

                  <div className="mt-6 rounded-[1.5rem] bg-teal-950 p-5 text-white sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                        <MessageCircle className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold">Continue privately on WhatsApp</h2>
                        <p className="mt-2 text-sm leading-6 text-teal-50">
                          No form and no duplicate phone entry. Your selected chapter and
                          private reference are included.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-teal-950"
                    >
                      Open private WhatsApp
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <p className="mt-3 text-center text-xs text-teal-100">
                      Reference: {journeyReference}
                    </p>
                  </div>

                  <details className="mt-5 rounded-[1.5rem] border border-slate-200 p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-2">
                        <PhoneCall className="h-5 w-5 text-teal-800" aria-hidden="true" />
                        I prefer a scheduled callback
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </summary>
                    <form onSubmit={submitCallback} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Name</span>
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          autoComplete="name"
                          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          placeholder="Name the counselor should use"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Callback number</span>
                        <input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          inputMode="tel"
                          autoComplete="tel"
                          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                          placeholder="+91 98765 43210"
                        />
                      </label>
                      <fieldset>
                        <legend className="text-sm font-semibold">Preferred language</legend>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {(["English", "Odia"] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setLanguage(option)}
                              className={`min-h-11 rounded-xl border px-4 font-semibold ${
                                language === option
                                  ? "border-teal-700 bg-teal-50 text-teal-950"
                                  : "border-slate-200"
                              }`}
                            >
                              {option === "Odia" ? "ଓଡ଼ିଆ" : option}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="text-sm font-semibold">Most practical area</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[
                            ["bhubaneswar", "Bhubaneswar"],
                            ["berhampur", "Berhampur"],
                            ["angul", "Angul"],
                            ["south-odisha", "Jeypore / South Odisha"],
                            ["not-sure", "Not sure"],
                          ].map(([value, label]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setCallbackLocation(value as LocationId)}
                              className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                                callbackLocation === value
                                  ? "border-teal-700 bg-teal-700 text-white"
                                  : "border-slate-200"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">
                          When may a counselor call?
                        </span>
                        <select
                          value={callbackWindow}
                          onChange={(event) => setCallbackWindow(event.target.value)}
                          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        >
                          <option value="">Choose a callback window</option>
                          <option value="09:00-12:00">9 am–12 pm</option>
                          <option value="12:00-15:00">12 pm–3 pm</option>
                          <option value="15:00-18:00">3 pm–6 pm</option>
                          <option value="18:00-20:00">6 pm–8 pm</option>
                        </select>
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-1 h-5 w-5"
                        />
                        <span className="text-sm leading-6 text-slate-600">
                          I ask Santaan to call only during the window selected above.
                        </span>
                      </label>
                      {error ? (
                        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
                          {error}
                        </p>
                      ) : null}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-60"
                      >
                        {submitting ? "Saving your choice…" : "Request this callback"}
                      </button>
                    </form>
                  </details>
                </>
              )}
            </section>
          </div>
        ) : null}

        <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 px-2 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
          <p>
            Educational guidance only—not a diagnosis or emergency service. A qualified
            fertility specialist must confirm medical decisions. You control whether
            Santaan may contact you.
          </p>
        </div>
      </div>

    </main>
  );
}
