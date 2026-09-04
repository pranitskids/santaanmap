import type {
  ConcernId,
  HelpId,
  JourneyPositionId,
  LocationId,
} from "./journeyMap";

export type LibraryShelfId =
  | "starting"
  | "reports"
  | "together"
  | "planning"
  | "previous-treatment"
  | "access"
  | "existing-patient";

export type LibraryNeedId =
  | "understand"
  | "reports"
  | "together"
  | "costs"
  | "second-view"
  | "location"
  | "private-help";

export interface LibraryPersona {
  id: JourneyPositionId;
  label: string;
  shelfIds: LibraryShelfId[];
}

export interface LibraryNeed {
  id: LibraryNeedId;
  label: string;
  shelfIds: LibraryShelfId[];
  chapterId: string;
  help: HelpId;
  concern?: ConcernId;
}

export interface LibraryChapter {
  id: string;
  shelfId: LibraryShelfId;
  title: string;
  promise: string;
  readingTime: string;
  reassurance: string;
  explanation: string;
  nextStep: string;
  questions: string[];
  concern?: ConcernId;
}

export interface LibraryShelf {
  id: LibraryShelfId;
  title: string;
  description: string;
  accent: string;
  chapters: LibraryChapter[];
  position: JourneyPositionId;
  defaultHelp: HelpId;
  location?: LocationId;
}

export const libraryPersonas: LibraryPersona[] = [
  { id: "wondering", label: "Just beginning to wonder", shelfIds: ["starting"] },
  { id: "trying", label: "Trying and looking for clarity", shelfIds: ["together", "starting"] },
  { id: "reports", label: "I have reports or test results", shelfIds: ["reports"] },
  { id: "comparing", label: "Comparing treatment, process or costs", shelfIds: ["planning"] },
  {
    id: "previous-treatment",
    label: "Previous treatment did not work",
    shelfIds: ["previous-treatment", "reports"],
  },
  { id: "choosing-clinic", label: "Looking for care near me", shelfIds: ["access"] },
  { id: "existing-patient", label: "Already a Santaan patient", shelfIds: ["existing-patient"] },
];

export const libraryNeeds: LibraryNeed[] = [
  {
    id: "understand",
    label: "Understand where to begin",
    shelfIds: ["starting"],
    chapterId: "first-conversation",
    help: "simple-explanation",
    concern: "where-to-begin",
  },
  {
    id: "reports",
    label: "Understand reports",
    shelfIds: ["reports"],
    chapterId: "organise-reports",
    help: "questions-to-ask",
    concern: "reports",
  },
  {
    id: "together",
    label: "Prepare as a couple",
    shelfIds: ["together"],
    chapterId: "shared-timeline",
    help: "preparation-checklist",
    concern: "both-partners",
  },
  {
    id: "costs",
    label: "Explore likely steps and costs",
    shelfIds: ["planning"],
    chapterId: "cost-clarity",
    help: "preparation-checklist",
    concern: "planning",
  },
  {
    id: "second-view",
    label: "Prepare for another clinical view",
    shelfIds: ["previous-treatment", "reports"],
    chapterId: "records-review",
    help: "questions-to-ask",
    concern: "previous-experience",
  },
  {
    id: "location",
    label: "Find a practical location",
    shelfIds: ["access"],
    chapterId: "south-odisha-continuity",
    help: "nearby-santaan",
    concern: "distance",
  },
  {
    id: "private-help",
    label: "Ask privately without receiving a call",
    shelfIds: ["starting", "planning"],
    chapterId: "explore-without-contact",
    help: "private-whatsapp",
    concern: "privacy",
  },
];

export const libraryShelves: LibraryShelf[] = [
  {
    id: "starting",
    title: "Starting privately",
    description: "For questions you want to explore before speaking to anyone.",
    accent: "from-teal-700 to-emerald-600",
    position: "wondering",
    defaultHelp: "simple-explanation",
    chapters: [
      {
        id: "first-conversation",
        shelfId: "starting",
        title: "What a first fertility conversation is for",
        promise: "Understand what can be clarified without committing to treatment.",
        readingTime: "2 min",
        reassurance:
          "Asking questions does not commit you to IVF, tests or treatment.",
        explanation:
          "A first conversation can organise your concerns, timeline and existing information. A qualified clinician may then explain which questions are relevant and whether any assessment should be considered.",
        nextStep:
          "Write down how long the concern has been on your mind and the one answer that would make the next step feel clearer.",
        questions: [
          "What can be understood from our history before discussing treatment?",
          "What information would make a consultation useful?",
        ],
        concern: "fear-of-commitment",
      },
      {
        id: "explore-without-contact",
        shelfId: "starting",
        title: "What you can understand without contacting anyone",
        promise: "Take a private first step and remain in control.",
        readingTime: "1 min",
        reassurance:
          "You can keep exploring this library without giving Santaan your name or number.",
        explanation:
          "Use the chapters to collect questions, understand common planning considerations and decide whether a private WhatsApp conversation would be useful. Nothing here starts a call.",
        nextStep: "Open the chapter that feels closest to your current worry.",
        questions: [
          "What is the main uncertainty I want to reduce?",
          "Would I prefer information, WhatsApp or a scheduled call?",
        ],
        concern: "privacy",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports and test results",
    description: "Organise reports and prepare questions without interpreting one value alone.",
    accent: "from-sky-700 to-cyan-600",
    position: "reports",
    defaultHelp: "questions-to-ask",
    chapters: [
      {
        id: "organise-reports",
        shelfId: "reports",
        title: "How to organise reports for a useful review",
        promise: "Turn scattered reports into a clearer clinical conversation.",
        readingTime: "2 min",
        reassurance:
          "A report is most useful when it is considered with dates, history and the reason it was requested.",
        explanation:
          "Keep reports in date order. Add the name of the test, who requested it and the question it was meant to answer. Include relevant information for both partners when available.",
        nextStep: "Create one folder containing reports, prescriptions and scan summaries.",
        questions: [
          "Which results still need clinical context?",
          "Are any reports old enough that a clinician may want to review their relevance?",
        ],
        concern: "reports",
      },
      {
        id: "report-context",
        shelfId: "reports",
        title: "Why one report rarely gives the whole answer",
        promise: "Know what to ask before drawing conclusions from a result.",
        readingTime: "2 min",
        reassurance:
          "An isolated number should not be treated as a diagnosis or treatment plan.",
        explanation:
          "Clinical interpretation may depend on history, timing, the laboratory method and other findings. The useful goal is not to interpret the report yourself, but to prepare the right questions.",
        nextStep: "Mark the result or wording that you most want a clinician to explain.",
        questions: [
          "What does this result mean in the context of our history?",
          "Would another finding change the interpretation?",
        ],
        concern: "reports",
      },
    ],
  },
  {
    id: "together",
    title: "Both partners",
    description: "A shared, blame-free way to prepare for clarity.",
    accent: "from-violet-700 to-fuchsia-600",
    position: "trying",
    defaultHelp: "preparation-checklist",
    chapters: [
      {
        id: "shared-timeline",
        shelfId: "together",
        title: "Build a shared timeline without blame",
        promise: "Prepare together while respecting each partner’s experience.",
        readingTime: "2 min",
        reassurance:
          "Fertility questions can involve information from either or both partners.",
        explanation:
          "A shared timeline can include how long you have been trying, previous pregnancies or treatment, known health information and tests already completed. It is a preparation tool, not a diagnosis.",
        nextStep: "Write one shared timeline and one private question for each partner.",
        questions: [
          "What information may be useful from each partner?",
          "How will findings and options be explained to both of us?",
        ],
        concern: "both-partners",
      },
      {
        id: "partner-researching",
        shelfId: "together",
        title: "If you are researching for your partner or both of you",
        promise: "Explore privately and bring back a calmer set of questions.",
        readingTime: "1 min",
        reassurance:
          "You do not need to have every answer before beginning a respectful conversation.",
        explanation:
          "Focus first on what is unclear, what has already been tried and what kind of support would help both partners feel informed. Avoid assuming that one person is responsible.",
        nextStep: "Choose one chapter to share rather than sending the entire library.",
        questions: [
          "What would help my partner feel supported rather than pressured?",
          "Which decision do we not need to make yet?",
        ],
        concern: "both-partners",
      },
    ],
  },
  {
    id: "planning",
    title: "Treatment planning and costs",
    description: "Understand what can vary before comparing a headline package.",
    accent: "from-amber-700 to-orange-600",
    position: "comparing",
    defaultHelp: "preparation-checklist",
    chapters: [
      {
        id: "cost-clarity",
        shelfId: "planning",
        title: "What to ask when discussing likely costs",
        promise: "Separate a headline price from the steps relevant to you.",
        readingTime: "2 min",
        reassurance:
          "A responsible cost discussion should make assumptions, inclusions and exclusions clear.",
        explanation:
          "Ask which parts of a proposed plan are fixed, which depend on findings and which medicines, tests, procedures or follow-up items are included. A clinician must first confirm what is clinically relevant.",
        nextStep: "Request a written sequence with likely inclusions and decision points.",
        questions: [
          "Which costs depend on individual findings?",
          "What is included, excluded or decided later?",
        ],
        concern: "planning",
      },
      {
        id: "compare-process",
        shelfId: "planning",
        title: "Compare the care process, not only the price",
        promise: "Look at explanation, continuity and follow-up.",
        readingTime: "2 min",
        reassurance:
          "A lower or higher headline price does not explain whether a plan is appropriate.",
        explanation:
          "Compare how results are explained, who coordinates follow-up, how questions are handled between visits and which parts of a plan require repeated travel.",
        nextStep: "Create one comparison page covering process, access and communication.",
        questions: [
          "Who explains results and next steps?",
          "How does follow-up work between appointments?",
        ],
        concern: "planning",
      },
    ],
  },
  {
    id: "previous-treatment",
    title: "After previous treatment",
    description: "Prepare for another view without feeling that you must start from zero.",
    accent: "from-rose-700 to-pink-600",
    position: "previous-treatment",
    defaultHelp: "questions-to-ask",
    chapters: [
      {
        id: "records-review",
        shelfId: "previous-treatment",
        title: "Prepare a records-review conversation",
        promise: "Organise what happened, what was explained and what remains unanswered.",
        readingTime: "2 min",
        reassurance:
          "Wanting another explanation after previous treatment is understandable.",
        explanation:
          "Collect prescriptions, scans, laboratory reports and procedure summaries. Add a brief timeline of what you understood from the previous plan and where confidence was reduced.",
        nextStep: "Write the three questions another clinical view must address.",
        questions: [
          "Can the clinician review our previous records before suggesting a next step?",
          "What remains uncertain after the previous cycle or treatment?",
        ],
        concern: "previous-experience",
      },
      {
        id: "second-view",
        shelfId: "previous-treatment",
        title: "What a useful second clinical view should clarify",
        promise: "Seek explanation rather than a premature promise.",
        readingTime: "2 min",
        reassurance:
          "A second view should help organise evidence and options, not guarantee an outcome.",
        explanation:
          "The discussion may cover what was attempted, the available records, how previous findings were interpreted and which questions remain relevant. Recommendations require a qualified clinician.",
        nextStep: "Separate confirmed facts from assumptions and unanswered questions.",
        questions: [
          "Which previous decisions were based on confirmed findings?",
          "What additional context would help review the earlier plan?",
        ],
        concern: "previous-experience",
      },
    ],
  },
  {
    id: "access",
    title: "Location, travel and continuity",
    description: "Plan repeated care around real travel and follow-up needs.",
    accent: "from-blue-800 to-indigo-600",
    position: "choosing-clinic",
    defaultHelp: "nearby-santaan",
    location: "south-odisha",
    chapters: [
      {
        id: "travel-planning",
        shelfId: "access",
        title: "Questions to ask when travel is difficult",
        promise: "Understand which steps may need a center visit and how follow-up works.",
        readingTime: "2 min",
        reassurance:
          "Distance and continuity are reasonable parts of choosing where to consult.",
        explanation:
          "Ask which discussions can happen remotely, which assessments require an in-person visit and who coordinates questions between appointments. The exact schedule depends on the agreed clinical plan.",
        nextStep: "List your practical travel limits before choosing a center.",
        questions: [
          "Which visits may need to happen in person?",
          "How are questions and follow-up handled between visits?",
        ],
        concern: "distance",
      },
      {
        id: "south-odisha-continuity",
        shelfId: "access",
        title: "Planning care from Jeypore and South Odisha",
        promise: "Prepare questions about access, continuity and the appropriate center.",
        readingTime: "2 min",
        reassurance:
          "A practical location can reduce stress during a longer care journey.",
        explanation:
          "Santaan can explain current center options, what may be started at an existing center and how future access closer to Jeypore may apply. Availability and continuity must be confirmed for the individual plan.",
        nextStep: "Share your town and travel preference only when you want location help.",
        questions: [
          "Which Santaan center is practical for my current need?",
          "How would continuity work if care later continues closer to Jeypore?",
        ],
        concern: "distance",
      },
    ],
  },
  {
    id: "existing-patient",
    title: "Existing-patient support",
    description: "Reach the care route without entering another acquisition journey.",
    accent: "from-slate-800 to-slate-600",
    position: "existing-patient",
    defaultHelp: "private-whatsapp",
    chapters: [
      {
        id: "care-question",
        shelfId: "existing-patient",
        title: "Organise a question for your care team",
        promise: "Send one clear question with the right appointment context.",
        readingTime: "1 min",
        reassurance:
          "Existing patients should receive care support rather than another sales call.",
        explanation:
          "Keep your appointment or patient information ready. State the specific question and relevant timing. Urgent symptoms or emergencies require appropriate medical or emergency services, not this library.",
        nextStep: "Prepare your patient reference, appointment date and one clear question.",
        questions: [
          "Which care-team route should handle this question?",
          "Is the question time-sensitive?",
        ],
      },
      {
        id: "appointment-follow-up",
        shelfId: "existing-patient",
        title: "Prepare for appointment or report follow-up",
        promise: "Keep the request concise so the care team can route it correctly.",
        readingTime: "1 min",
        reassurance:
          "Clear context helps the team understand whether the request concerns an appointment, report or ongoing plan.",
        explanation:
          "Include the relevant center, appointment date and type of request. Do not change medicines or treatment timing based on educational content in this library.",
        nextStep: "Choose existing-patient WhatsApp support when you are ready.",
        questions: [
          "Which center or clinician is coordinating my care?",
          "What exact response do I need from the team?",
        ],
      },
    ],
  },
];

export const entryShelfByTopic: Record<string, LibraryShelfId | undefined> = {
  "first-consultation": "starting",
  "planning-clarity": "planning",
  "both-partners": "together",
  "previous-treatment": "previous-treatment",
  "south-odisha": "access",
  "private-guidance": undefined,
};

export function getShelf(id: LibraryShelfId) {
  return libraryShelves.find((shelf) => shelf.id === id) ?? libraryShelves[0];
}

export function getChapter(id: string) {
  return libraryShelves.flatMap((shelf) => shelf.chapters).find((chapter) => chapter.id === id);
}
