export type AgeBandId =
  | "under-25"
  | "25-30"
  | "31-34"
  | "35-37"
  | "38-40"
  | "41-plus"
  | "prefer-not";

export type AttemptId =
  | "first-time"
  | "tests-only"
  | "one-attempt"
  | "multiple-attempts"
  | "prefer-not";

export type TreatmentId =
  | "trying-naturally"
  | "iui"
  | "ivf-icsi"
  | "frozen-transfer"
  | "freezing"
  | "not-sure";

export type PatientStageId =
  | "planning"
  | "tests"
  | "cycle-tracking"
  | "iui-medication"
  | "iui-procedure"
  | "injections"
  | "before-egg-collection"
  | "after-egg-collection"
  | "waiting-embryo-updates"
  | "lining-preparation"
  | "before-transfer"
  | "after-transfer"
  | "waiting-pregnancy-test"
  | "after-result"
  | "between-attempts"
  | "storage";

export type ReferenceSectionId =
  | "stage-overview"
  | "what-happens"
  | "preparation"
  | "what-to-expect"
  | "what-varies"
  | "next-stage"
  | "contact-clinic";

export type BookTopicId =
  | "cost"
  | "outcomes"
  | "reports"
  | "medicines"
  | "both-partners";

export interface TapChoice<TId extends string> {
  id: TId;
  label: string;
}

export interface PathwayStage extends TapChoice<PatientStageId> {
  phase: string;
  treatments: TreatmentId[];
  whatItIs: string;
  whatHappens: string;
  preparation: string[];
  whatToExpect: string[];
  whatVaries: string[];
  nextStage: string;
  contactClinic: string[];
}

export interface BookTopic extends TapChoice<BookTopicId> {
  introduction: string;
  points: string[];
  limits: string;
}

export const ageBands: TapChoice<AgeBandId>[] = [
  { id: "under-25", label: "Under 25" },
  { id: "25-30", label: "25–30" },
  { id: "31-34", label: "31–34" },
  { id: "35-37", label: "35–37" },
  { id: "38-40", label: "38–40" },
  { id: "41-plus", label: "41+" },
  { id: "prefer-not", label: "Skip" },
];

export const attemptChoices: TapChoice<AttemptId>[] = [
  { id: "first-time", label: "First time" },
  { id: "tests-only", label: "Tests only so far" },
  { id: "one-attempt", label: "One previous attempt" },
  { id: "multiple-attempts", label: "More than one attempt" },
  { id: "prefer-not", label: "Skip" },
];

export const treatmentChoices: TapChoice<TreatmentId>[] = [
  { id: "trying-naturally", label: "Trying naturally" },
  { id: "iui", label: "IUI" },
  { id: "ivf-icsi", label: "IVF / ICSI" },
  { id: "frozen-transfer", label: "Frozen embryo transfer" },
  { id: "freezing", label: "Egg or embryo freezing" },
  { id: "not-sure", label: "Not sure yet" },
];

const sharedContactClinic = [
  "You are unsure about an instruction, medicine or appointment time.",
  "You develop symptoms that feel severe, sudden or worrying.",
  "Your treating clinic has given you a specific threshold or reason to contact them.",
];

export const pathwayStages: PathwayStage[] = [
  {
    id: "planning",
    label: "Planning or deciding",
    phase: "Starting point",
    treatments: ["trying-naturally", "iui", "ivf-icsi", "frozen-transfer", "freezing", "not-sure"],
    whatItIs:
      "The point at which you are learning the available pathways before agreeing to tests or treatment.",
    whatHappens:
      "A clinical discussion usually brings together history, previous information and the purpose of any proposed test or treatment.",
    preparation: [
      "List important dates, previous tests, medicines and treatment records.",
      "Write down what you want the next conversation to clarify.",
    ],
    whatToExpect: [
      "More than one possible next step may be discussed.",
      "Some decisions can remain open until relevant information is available.",
    ],
    whatVaries: ["Which tests are useful", "Whether both partners need assessment", "Which pathway is relevant"],
    nextStage: "Tests or a further discussion may follow; treatment is not automatically the next step.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "tests",
    label: "Tests and reports",
    phase: "Before treatment",
    treatments: ["trying-naturally", "iui", "ivf-icsi", "frozen-transfer", "freezing", "not-sure"],
    whatItIs:
      "A stage for collecting and interpreting information that may help explain the current situation.",
    whatHappens:
      "Tests are interpreted alongside timing, history and other findings rather than as isolated numbers.",
    preparation: [
      "Keep the report date, laboratory name and reason for the test with the result.",
      "Bring older reports so changes over time can be understood.",
    ],
    whatToExpect: [
      "A result may answer one question while leaving others open.",
      "A clinician may explain whether a result changes the next decision.",
    ],
    whatVaries: ["Which tests are relevant", "When a test is performed", "Whether a test needs repeating"],
    nextStage: "The next point may be further assessment, discussing options or continued observation.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "cycle-tracking",
    label: "Tracking the cycle",
    phase: "Trying naturally",
    treatments: ["trying-naturally"],
    whatItIs:
      "Observing cycle timing and relevant clinical information while trying without an assisted procedure.",
    whatHappens:
      "The clinical purpose of tracking is to understand timing or decide whether further assessment is useful.",
    preparation: ["Record dates consistently.", "Follow only the testing or timing plan agreed with your clinician."],
    whatToExpect: ["Tracking may be done for more than one cycle.", "A single cycle may not answer every question."],
    whatVaries: ["The method used for tracking", "How long observation continues", "When further assessment is discussed"],
    nextStage: "The pathway may continue with trying, tests or a discussion of other options.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "iui-medication",
    label: "Before the IUI procedure",
    phase: "IUI",
    treatments: ["iui"],
    whatItIs:
      "The monitoring and preparation period before the planned insemination procedure.",
    whatHappens:
      "The treating team may monitor timing and provide an individual medicine and appointment plan.",
    preparation: ["Keep the written schedule available.", "Confirm who to contact if timing or medicines are unclear."],
    whatToExpect: ["Monitoring or timing updates", "A confirmed date or window for the procedure"],
    whatVaries: ["Whether medicines are used", "Monitoring frequency", "The timing decision"],
    nextStage: "The planned IUI procedure follows when the treating team confirms timing.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "iui-procedure",
    label: "IUI procedure day",
    phase: "IUI",
    treatments: ["iui"],
    whatItIs: "The day prepared sperm is placed in the uterus as part of an IUI cycle.",
    whatHappens:
      "The clinic confirms the procedure-day process and the instructions that apply before and after it.",
    preparation: ["Confirm arrival time and any clinic instructions.", "Know when the result will be checked."],
    whatToExpect: ["A clinic procedure", "Instructions for the period after the procedure"],
    whatVaries: ["Clinic process", "Individual preparation", "Follow-up timing"],
    nextStage: "A waiting period follows before the planned pregnancy test or review.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "injections",
    label: "Taking IVF injections",
    phase: "IVF / ICSI",
    treatments: ["ivf-icsi", "freezing"],
    whatItIs:
      "The part of an IVF or freezing cycle when medicines and monitoring are used before egg collection.",
    whatHappens:
      "The treating team reviews monitoring information and confirms individual medicine doses and timing.",
    preparation: ["Keep the latest written schedule.", "Use the clinic’s contact route for any dosing or timing doubt."],
    whatToExpect: ["Monitoring appointments", "Possible changes to the individual schedule"],
    whatVaries: ["Medicine plan", "Monitoring frequency", "Length of this stage"],
    nextStage: "The clinic confirms when preparation moves toward egg collection.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "before-egg-collection",
    label: "Before egg collection",
    phase: "IVF / ICSI",
    treatments: ["ivf-icsi", "freezing"],
    whatItIs: "The final preparation period before the scheduled egg collection procedure.",
    whatHappens:
      "The clinic confirms timing, arrival instructions and any individual preparation required.",
    preparation: ["Recheck the exact date and time.", "Follow the treating clinic’s written instructions only."],
    whatToExpect: ["A scheduled clinic procedure", "A recovery and update plan after the procedure"],
    whatVaries: ["Procedure timing", "Anaesthesia arrangements", "Individual recovery advice"],
    nextStage: "Recovery follows; IVF patients may then receive embryo-development updates.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "after-egg-collection",
    label: "After egg collection",
    phase: "IVF / ICSI",
    treatments: ["ivf-icsi", "freezing"],
    whatItIs: "The immediate recovery period after egg collection.",
    whatHappens:
      "The clinic provides recovery instructions and explains when the next update or review is expected.",
    preparation: ["Keep the discharge instructions accessible.", "Know which symptoms require contacting the clinic."],
    whatToExpect: ["Recovery guidance", "A planned clinic update"],
    whatVaries: ["How recovery feels", "Follow-up timing", "The next laboratory or storage update"],
    nextStage: "The next step may be embryo updates, freezing information or a later review.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "waiting-embryo-updates",
    label: "Waiting for embryo updates",
    phase: "IVF / ICSI",
    treatments: ["ivf-icsi"],
    whatItIs:
      "The period when the laboratory observes development and the clinic communicates planned updates.",
    whatHappens:
      "Updates describe what has been observed at that point; the treating team explains what the update can and cannot establish.",
    preparation: ["Confirm when updates are normally provided.", "Keep questions for the next planned update."],
    whatToExpect: ["Updates at clinic-defined times", "Discussion of the next available decision"],
    whatVaries: ["Number and timing of updates", "What can be concluded at each update", "The next clinical step"],
    nextStage: "The pathway may move to transfer preparation, freezing or a clinical review.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "lining-preparation",
    label: "Preparing for frozen transfer",
    phase: "Frozen embryo transfer",
    treatments: ["frozen-transfer"],
    whatItIs: "The preparation and monitoring period before a planned frozen embryo transfer.",
    whatHappens:
      "The treating team checks the individual plan and confirms medicines, monitoring and timing.",
    preparation: ["Keep the latest schedule.", "Confirm instructions directly with the treating team."],
    whatToExpect: ["Monitoring or review", "A confirmed transfer plan when clinically appropriate"],
    whatVaries: ["Preparation method", "Medicine plan", "Transfer timing"],
    nextStage: "The clinic confirms when the pathway moves to the embryo-transfer stage.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "before-transfer",
    label: "Preparing for embryo transfer",
    phase: "IVF / frozen transfer",
    treatments: ["ivf-icsi", "frozen-transfer"],
    whatItIs:
      "The point after a transfer plan is made and before the embryo-transfer procedure takes place.",
    whatHappens:
      "The clinic confirms the transfer date, individual medicine schedule and procedure-day instructions.",
    preparation: [
      "Recheck the date, arrival time and written medicine schedule.",
      "Ask the clinic which normal activities can continue and whether any individual restriction applies.",
    ],
    whatToExpect: [
      "A clinic procedure followed by written instructions.",
      "A planned date for the pregnancy test or next review.",
    ],
    whatVaries: ["Preparation method", "Medicine schedule", "Procedure-day instructions"],
    nextStage: "The post-transfer period follows until the planned pregnancy test or clinical review.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "after-transfer",
    label: "After embryo transfer",
    phase: "After transfer",
    treatments: ["ivf-icsi", "frozen-transfer"],
    whatItIs: "The period immediately after the embryo-transfer procedure.",
    whatHappens:
      "The treating team’s medicine, activity and testing instructions remain the individual source of truth.",
    preparation: ["Keep the post-transfer instructions.", "Know the test date and clinic contact route."],
    whatToExpect: ["Continuation of the agreed plan", "A waiting period before the planned test"],
    whatVaries: ["Medicines", "Activity advice", "Follow-up timing"],
    nextStage: "The next formal point is usually the planned pregnancy test or clinic review.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "waiting-pregnancy-test",
    label: "Waiting for the pregnancy test",
    phase: "After IUI or transfer",
    treatments: ["iui", "ivf-icsi", "frozen-transfer"],
    whatItIs: "The waiting period before the test or review scheduled by the clinic.",
    whatHappens:
      "Treatment instructions continue. Symptoms alone cannot reliably confirm the result.",
    preparation: ["Keep the planned test date.", "Use the treating clinic’s route for individual concerns."],
    whatToExpect: ["Uncertainty while waiting", "A planned result and follow-up discussion"],
    whatVaries: ["Medicines", "How a person feels", "The clinic’s testing process"],
    nextStage: "The result is interpreted with the clinic and the next discussion follows from it.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "after-result",
    label: "After the result",
    phase: "Review",
    treatments: ["iui", "ivf-icsi", "frozen-transfer"],
    whatItIs: "The point when the result and immediate next steps are discussed.",
    whatHappens:
      "The clinic explains the result, any medicines or follow-up and when a broader review is appropriate.",
    preparation: ["Keep the result and treatment summary.", "Write down what remains unanswered."],
    whatToExpect: ["An immediate plan", "A later review where relevant"],
    whatVaries: ["Follow-up", "Medicine instructions", "When another discussion occurs"],
    nextStage: "The pathway may move to ongoing care, records review or time between attempts.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "between-attempts",
    label: "Between attempts",
    phase: "Review",
    treatments: ["iui", "ivf-icsi", "frozen-transfer", "not-sure"],
    whatItIs: "A period for reviewing records and understanding what is known before another decision.",
    whatHappens:
      "A review can separate confirmed findings, unanswered questions and options that may be discussed next.",
    preparation: ["Collect reports, prescriptions and procedure summaries.", "List decisions you want explained."],
    whatToExpect: ["A review of previous information", "Discussion of what another step would be intended to address"],
    whatVaries: ["Which records are available", "What can be learned", "Whether further assessment is useful"],
    nextStage: "A later decision may be continued observation, another attempt, a different option or no immediate treatment.",
    contactClinic: sharedContactClinic,
  },
  {
    id: "storage",
    label: "Freezing and storage",
    phase: "Egg or embryo freezing",
    treatments: ["freezing"],
    whatItIs: "The stage after eggs or embryos are frozen and storage arrangements are documented.",
    whatHappens:
      "The clinic explains what was stored, the records provided and the storage and consent process.",
    preparation: ["Keep storage records and consent documents.", "Know how the clinic communicates future storage matters."],
    whatToExpect: ["Written records", "Information about ongoing storage arrangements"],
    whatVaries: ["What was stored", "Storage terms", "Future clinical decisions"],
    nextStage: "Any future use requires a separate clinical discussion and individual plan.",
    contactClinic: sharedContactClinic,
  },
];

export const bookTopics: BookTopic[] = [
  {
    id: "cost",
    label: "Understanding costs",
    introduction: "A useful cost discussion follows the pathway rather than one headline price.",
    points: [
      "Ask which steps are included and which are separate.",
      "Separate known costs from items that depend on later findings or medicines.",
      "Ask when each cost would become relevant—not only the total.",
    ],
    limits: "An educational map cannot calculate an individual treatment cost.",
  },
  {
    id: "outcomes",
    label: "How outcomes are discussed",
    introduction: "Outcome discussions should explain evidence and uncertainty without guarantees.",
    points: [
      "Ask which individual information is relevant.",
      "Separate population statistics from an individual prediction.",
      "Ask what remains uncertain even after assessment.",
    ],
    limits: "Age, one report or one previous result cannot responsibly become a personal guarantee.",
  },
  {
    id: "reports",
    label: "Reading reports",
    introduction: "A report is interpreted in context, not as a standalone answer.",
    points: [
      "Keep the date, laboratory and reason for the test with the result.",
      "Compare related information only when a clinician says the comparison is meaningful.",
      "Ask whether the result changes a decision or simply adds context.",
    ],
    limits: "This map does not interpret personal reports or provide a diagnosis.",
  },
  {
    id: "medicines",
    label: "Medicines and schedules",
    introduction: "Individual medicine instructions belong to the treating clinic.",
    points: [
      "Use the latest written schedule.",
      "Confirm unclear doses or times directly with the treating team.",
      "Do not change a medicine because of general online information.",
    ],
    limits: "This map intentionally provides no personal dosing or treatment instructions.",
  },
  {
    id: "both-partners",
    label: "Information from both partners",
    introduction: "Fertility assessment can involve information from either or both partners without blame.",
    points: [
      "Ask why each test or history point is relevant.",
      "Keep a shared timeline of previous tests and treatment.",
      "Ask for findings and decisions to be explained to both partners where appropriate.",
    ],
    limits: "The relevant assessment depends on individual history and qualified clinical judgement.",
  },
];

export function stagesForTreatment(treatment: TreatmentId | undefined) {
  if (!treatment) return [];
  return pathwayStages.filter((stage) => stage.treatments.includes(treatment));
}

export function labelFor<TId extends string>(
  choices: Array<TapChoice<TId>>,
  id: TId | undefined,
) {
  return choices.find((choice) => choice.id === id)?.label;
}
