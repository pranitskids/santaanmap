export type JourneyPositionId =
  | "wondering"
  | "trying"
  | "reports"
  | "comparing"
  | "previous-treatment"
  | "choosing-clinic"
  | "existing-patient";

export type ConcernId =
  | "where-to-begin"
  | "privacy"
  | "fear-of-commitment"
  | "both-partners"
  | "reports"
  | "planning"
  | "distance"
  | "previous-experience"
  | "not-ready";

export type HelpId =
  | "simple-explanation"
  | "preparation-checklist"
  | "questions-to-ask"
  | "nearby-santaan"
  | "private-whatsapp"
  | "scheduled-callback"
  | "consultation";

export type LocationId =
  | "bhubaneswar"
  | "berhampur"
  | "angul"
  | "south-odisha"
  | "not-sure";

export type EntryTopicId =
  | "first-consultation"
  | "planning-clarity"
  | "both-partners"
  | "previous-treatment"
  | "south-odisha"
  | "private-guidance";

export interface JourneyPosition {
  id: JourneyPositionId;
  shortLabel: string;
  label: string;
  reassurance: string;
  nextStep: string;
  preparation: string[];
}

export interface JourneyChoice<TId extends string> {
  id: TId;
  label: string;
  supportingText?: string;
}

export const entryTopics: Record<
  EntryTopicId,
  {
    eyebrow: string;
    title: string;
    description: string;
    suggestedPosition: JourneyPositionId;
  }
> = {
  "first-consultation": {
    eyebrow: "A private first step",
    title: "Find where you are before deciding what to do.",
    description:
      "A first conversation is for clarity. It does not commit you to IVF or any treatment.",
    suggestedPosition: "wondering",
  },
  "planning-clarity": {
    eyebrow: "Understand before deciding",
    title: "Make treatment planning feel less uncertain.",
    description:
      "Explore the questions, preparation and next choices that can make a planning conversation useful.",
    suggestedPosition: "comparing",
  },
  "both-partners": {
    eyebrow: "Clarity for both partners",
    title: "Start with a shared, respectful view of the journey.",
    description:
      "See how a first discussion can consider both partners without blame or assumptions.",
    suggestedPosition: "trying",
  },
  "previous-treatment": {
    eyebrow: "A calmer second look",
    title: "Organise what you want answered after previous treatment.",
    description:
      "Build a simple record-and-question checklist before choosing your next conversation.",
    suggestedPosition: "previous-treatment",
  },
  "south-odisha": {
    eyebrow: "Guidance closer to home",
    title: "Explore a practical fertility-care path for South Odisha.",
    description:
      "Clarify what can begin now, what may need a center visit and which location feels practical.",
    suggestedPosition: "choosing-clinic",
  },
  "private-guidance": {
    eyebrow: "Private fertility guidance",
    title: "Know where you are. See what may come next.",
    description:
      "Use this guided map privately. You decide whether to keep exploring, message Santaan or request a call.",
    suggestedPosition: "wondering",
  },
};

export const journeyPositions: JourneyPosition[] = [
  {
    id: "wondering",
    shortLabel: "Wondering",
    label: "I am only beginning to wonder.",
    reassurance:
      "You do not need to decide on treatment today. A useful first step is simply understanding what a consultation can clarify.",
    nextStep: "Learn what a first fertility conversation usually covers.",
    preparation: [
      "Note how long the concern has been on your mind.",
      "Collect any reports you already have—none are required to begin.",
      "Write down the three questions you most want answered.",
    ],
  },
  {
    id: "trying",
    shortLabel: "Seeking clarity",
    label: "We have been trying and want more clarity.",
    reassurance:
      "A structured conversation can help both partners understand what information is useful without placing blame on either person.",
    nextStep: "Prepare a shared timeline and questions for both partners.",
    preparation: [
      "Create a simple shared timeline.",
      "List any tests already completed by either partner.",
      "Note what feels most confusing or stressful right now.",
    ],
  },
  {
    id: "reports",
    shortLabel: "Have reports",
    label: "We have tests or reports and need help understanding the next step.",
    reassurance:
      "A single report rarely tells the whole story. A clinician can interpret it alongside history and other findings.",
    nextStep: "Organise the reports and identify the questions they raise.",
    preparation: [
      "Keep original reports and dates together.",
      "Note who recommended each test and why.",
      "Avoid making a treatment decision from one value alone.",
    ],
  },
  {
    id: "comparing",
    shortLabel: "Comparing options",
    label: "We are comparing possible treatments or planning.",
    reassurance:
      "It is reasonable to ask how options differ, what each step involves and which costs depend on individual findings.",
    nextStep: "Build a planning checklist before comparing clinics or treatments.",
    preparation: [
      "Ask which parts of a plan are essential and which depend on results.",
      "Request a written explanation of the proposed sequence.",
      "Compare clinical process and follow-up—not only a headline price.",
    ],
  },
  {
    id: "previous-treatment",
    shortLabel: "After treatment",
    label: "We had previous treatment and want another view.",
    reassurance:
      "Wanting another explanation is understandable. A useful review starts with records, what was tried and what remains unanswered.",
    nextStep: "Prepare a records-review conversation rather than starting over.",
    preparation: [
      "Collect prescriptions, scans, lab reports and procedure summaries.",
      "Write down what you understood from the previous plan.",
      "List what you want a second conversation to clarify.",
    ],
  },
  {
    id: "choosing-clinic",
    shortLabel: "Choosing care",
    label: "We are choosing where and how to consult.",
    reassurance:
      "Location, communication and continuity matter during a longer care journey. You can consider them alongside clinical questions.",
    nextStep: "Compare access, follow-up and the first-consultation process.",
    preparation: [
      "Choose the location that is practical for repeated visits.",
      "Ask how follow-up works between appointments.",
      "Confirm who will explain results and next steps.",
    ],
  },
  {
    id: "existing-patient",
    shortLabel: "In care",
    label: "I am already a Santaan patient.",
    reassurance:
      "You need a care-support route, not another acquisition call. Use the map to organise your question for the care team.",
    nextStep: "Prepare the specific question or timing concern for your care team.",
    preparation: [
      "Keep your patient details or appointment information ready.",
      "Write the one question that needs the quickest answer.",
      "Use the care-team route for medication or timing instructions.",
    ],
  },
];

export const concerns: JourneyChoice<ConcernId>[] = [
  { id: "where-to-begin", label: "I do not know where to begin." },
  { id: "privacy", label: "I want privacy and control over contact." },
  {
    id: "fear-of-commitment",
    label: "I worry that a consultation means immediate treatment.",
  },
  { id: "both-partners", label: "We need clarity for both partners." },
  { id: "reports", label: "Tests or reports feel confusing." },
  { id: "planning", label: "Treatment planning and costs feel unclear." },
  { id: "distance", label: "Travel or distance makes care difficult." },
  {
    id: "previous-experience",
    label: "A previous experience reduced our confidence.",
  },
  { id: "not-ready", label: "I am not ready to speak to someone yet." },
];

export const helpChoices: JourneyChoice<HelpId>[] = [
  {
    id: "simple-explanation",
    label: "A simple explanation",
    supportingText: "Understand the next step without contacting anyone.",
  },
  {
    id: "preparation-checklist",
    label: "A preparation checklist",
    supportingText: "Know what information and questions to organise.",
  },
  {
    id: "questions-to-ask",
    label: "Questions to ask",
    supportingText: "Build a useful list for a future consultation.",
  },
  {
    id: "nearby-santaan",
    label: "The most practical Santaan location",
    supportingText: "Consider distance, continuity and follow-up.",
  },
  {
    id: "private-whatsapp",
    label: "A private WhatsApp conversation",
    supportingText: "Message first. No call unless you request one.",
  },
  {
    id: "scheduled-callback",
    label: "A callback at a time I choose",
    supportingText: "Choose when a counselor may call.",
  },
  {
    id: "consultation",
    label: "A consultation",
    supportingText: "Request help selecting a center and time.",
  },
];

export const locations: JourneyChoice<LocationId>[] = [
  { id: "bhubaneswar", label: "Bhubaneswar" },
  { id: "berhampur", label: "Berhampur" },
  { id: "angul", label: "Angul" },
  { id: "south-odisha", label: "Jeypore / South Odisha" },
  { id: "not-sure", label: "I am not sure yet" },
];

export const trustProofs = {
  general:
    "Santaan’s role here is to help you prepare for a useful clinical conversation—not to diagnose you inside an app.",
  continuity:
    "You can ask how Santaan will explain findings, coordinate follow-up and support the next agreed step.",
  privacy:
    "You decide whether to continue privately, start WhatsApp, choose a callback time or request a consultation.",
};

export const concernQuestions: Record<ConcernId, string> = {
  "where-to-begin": "What usually happens in a first fertility conversation?",
  privacy: "How will Santaan contact us, and can we choose WhatsApp only?",
  "fear-of-commitment": "Does a consultation commit us to IVF or any treatment?",
  "both-partners": "What information may be useful for each partner?",
  reports: "Which existing reports should we bring, and what may need context?",
  planning: "Which steps and costs depend on individual findings?",
  distance: "How many visits might require travel, and how does follow-up work?",
  "previous-experience": "Can a clinician review our previous records before suggesting a next step?",
  "not-ready": "What can we understand privately before deciding whether to speak?",
};

export function getEntryTopic(value: string | null): EntryTopicId {
  if (value && value in entryTopics) {
    return value as EntryTopicId;
  }
  return "private-guidance";
}

export function getJourneyPosition(id: JourneyPositionId) {
  return journeyPositions.find((position) => position.id === id) ?? journeyPositions[0];
}
