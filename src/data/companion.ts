export type EntrySource =
  | "website"
  | "instagram"
  | "meta-ad"
  | "whatsapp"
  | "clinic-qr"
  | "retargeting"
  | "organic"
  | "direct";

export type AwarenessStage =
  | "problem-aware"
  | "solution-aware"
  | "product-aware"
  | "fence-sitter"
  | "registered-patient";

export type PatientStage =
  | "trying-to-conceive"
  | "diagnosis"
  | "male-factor"
  | "low-amh"
  | "pre-ivf"
  | "pre-icsi"
  | "in-treatment"
  | "two-week-wait"
  | "post-cycle";

export type InterestLevel =
  | "just-starting"
  | "researching-options"
  | "ready-for-next-step"
  | "already-in-care"
  | "returning-after-treatment";

export type CareIntent =
  | "understand-my-situation"
  | "review-a-report"
  | "compare-treatment-options"
  | "speak-to-someone"
  | "prepare-for-treatment"
  | "stay-supported";

export type PrimaryWorry =
  | "not-conceiving-yet"
  | "confusing-test-results"
  | "time-running-out"
  | "cost-and-success-rates"
  | "treatment-timing-and-medicines"
  | "stress-after-failed-or-ongoing-cycle";

export type HelpNeeded =
  | "send-guide"
  | "care-team-call"
  | "doctor-consult"
  | "care-plan"
  | "reassurance-check-in";

export interface JourneyTopic {
  id: string;
  label: string;
  shortLabel: string;
  concern: string;
  reassurance: string;
  explanation: string;
  nextSteps: string[];
  signals: string[];
  whatToSend: string[];
  questionsToAsk: string[];
  redFlags: string[];
  heroTag: string;
  whatsappSnippet: string;
}

export interface StageOption<TValue extends string> {
  id: TValue;
  label: string;
  description: string;
}

export const santaanCompanionConfig = {
  appName: "Santaan Companion",
  mobileTagline: "Credible IVF guidance. Smart routing. Continue on WhatsApp.",
  trustPoints: [
    "Built to turn IVF confusion into a calmer, credible next step on mobile",
    "Qualifies journey stage, intent, worry, and support need without feeling like a hard form funnel",
    "Passes useful context forward so Santaan can follow up with less repetition and better care continuity",
  ],
  primaryActions: [
    { id: "send-whatsapp", label: "Get On WhatsApp" },
    { id: "talk-care-team", label: "Talk To Care Team" },
    { id: "book-consult", label: "Book Consultation" },
  ],
};

export const sourceOptions: StageOption<EntrySource>[] = [
  { id: "website", label: "Website", description: "Patient arrived from Santaan website" },
  { id: "instagram", label: "Instagram", description: "Came from organic or influencer social discovery" },
  { id: "meta-ad", label: "Meta Ad", description: "Came from paid acquisition or retargeting" },
  { id: "whatsapp", label: "WhatsApp", description: "Opened from a WhatsApp message or follow-up" },
  { id: "clinic-qr", label: "Clinic QR", description: "Scanned a code in Santaan clinic or printed material" },
  { id: "retargeting", label: "Retargeting", description: "Returned through remarketing" },
  { id: "organic", label: "Organic", description: "Found through search, content, or social sharing" },
  { id: "direct", label: "Direct", description: "Opened with no known campaign source" },
];

export const awarenessOptions: StageOption<AwarenessStage>[] = [
  {
    id: "problem-aware",
    label: "Problem Aware",
    description: "Patient knows something may be wrong and needs help understanding it",
  },
  {
    id: "solution-aware",
    label: "Solution Aware",
    description: "Patient is exploring IVF, ICSI, testing, and treatment routes",
  },
  {
    id: "product-aware",
    label: "Product Aware",
    description: "Patient is evaluating Santaan versus other options",
  },
  {
    id: "fence-sitter",
    label: "Fence Sitter",
    description: "Patient is interested but not ready to talk or book yet",
  },
  {
    id: "registered-patient",
    label: "Registered Patient",
    description: "Patient is already in Santaan care and needs ongoing support",
  },
];

export const patientStageOptions: StageOption<PatientStage>[] = [
  {
    id: "trying-to-conceive",
    label: "Trying To Conceive",
    description: "Need help understanding when to investigate fertility concerns",
  },
  { id: "diagnosis", label: "Diagnosis", description: "Undergoing tests and interpreting findings" },
  { id: "male-factor", label: "Male Factor", description: "Facing semen, sperm, or male fertility issues" },
  { id: "low-amh", label: "Low AMH", description: "Worried about ovarian reserve and next options" },
  { id: "pre-ivf", label: "Pre IVF", description: "Comparing IVF and preparing for treatment decisions" },
  { id: "pre-icsi", label: "Pre ICSI", description: "Preparing for ICSI and understanding lab steps" },
  { id: "in-treatment", label: "In Treatment", description: "Already in stimulation, monitoring, or retrieval cycle" },
  { id: "two-week-wait", label: "Two Week Wait", description: "Need support after transfer while waiting for the test" },
  { id: "post-cycle", label: "Post Cycle", description: "Reviewing results and planning next steps" },
];

export const interestLevelOptions: StageOption<InterestLevel>[] = [
  {
    id: "just-starting",
    label: "Just Starting",
    description: "New to fertility questions and trying to understand the journey",
  },
  {
    id: "researching-options",
    label: "Researching Options",
    description: "Comparing IVF, ICSI, testing, timelines, and clinics",
  },
  {
    id: "ready-for-next-step",
    label: "Ready For Next Step",
    description: "Wants a decision, callback, or consult instead of more browsing",
  },
  {
    id: "already-in-care",
    label: "Already In Care",
    description: "Needs treatment support, coordination, or answers between appointments",
  },
  {
    id: "returning-after-treatment",
    label: "Returning After Treatment",
    description: "Past or paused patient coming back for review, closure, or the next plan",
  },
];

export const careIntentOptions: StageOption<CareIntent>[] = [
  {
    id: "understand-my-situation",
    label: "Understand My Situation",
    description: "Wants clarity before deciding what to do next",
  },
  {
    id: "review-a-report",
    label: "Review A Report",
    description: "Needs help making sense of AMH, scans, semen reports, or prior findings",
  },
  {
    id: "compare-treatment-options",
    label: "Compare Options",
    description: "Deciding between consult, IVF, ICSI, another cycle, or waiting",
  },
  {
    id: "speak-to-someone",
    label: "Speak To Someone",
    description: "Prefers a live handoff instead of reading alone",
  },
  {
    id: "prepare-for-treatment",
    label: "Prepare For Treatment",
    description: "Needs checklists, timelines, medicines, or treatment-day readiness",
  },
  {
    id: "stay-supported",
    label: "Stay Supported",
    description: "Needs reassurance and continuity during or after treatment",
  },
];

export const primaryWorryOptions: StageOption<PrimaryWorry>[] = [
  {
    id: "not-conceiving-yet",
    label: "Why Not Conceiving",
    description: "Trying without success and unsure where the issue may be",
  },
  {
    id: "confusing-test-results",
    label: "Confusing Reports",
    description: "AMH, scans, or semen analysis are creating more questions than answers",
  },
  {
    id: "time-running-out",
    label: "Running Out Of Time",
    description: "Feels urgency because of age, reserve, past delays, or previous outcomes",
  },
  {
    id: "cost-and-success-rates",
    label: "Cost And Success",
    description: "Needs realistic clarity on investment, outcomes, and whether to proceed",
  },
  {
    id: "treatment-timing-and-medicines",
    label: "Timing Or Medicines",
    description: "Worried about dates, injections, prep, or missing something important",
  },
  {
    id: "stress-after-failed-or-ongoing-cycle",
    label: "Stress During Or After Cycle",
    description: "Feels anxious, overwhelmed, or unsupported during treatment or after a setback",
  },
];

export const helpNeededOptions: StageOption<HelpNeeded>[] = [
  {
    id: "send-guide",
    label: "Guide On WhatsApp",
    description: "Best when the patient wants a credible resource to revisit privately",
  },
  {
    id: "care-team-call",
    label: "Care Team Follow-Up",
    description: "Best when a coordinator or counselor should continue the conversation",
  },
  {
    id: "doctor-consult",
    label: "Doctor Consultation",
    description: "Best when the patient wants clinical advice or a treatment decision",
  },
  {
    id: "care-plan",
    label: "Step-By-Step Plan",
    description: "Best when the patient wants a clear next-step sequence instead of broad information",
  },
  {
    id: "reassurance-check-in",
    label: "Reassurance Check-In",
    description: "Best when the patient needs emotional steadiness and quick clarification",
  },
];

export const journeyTopics: JourneyTopic[] = [
  {
    id: "male-factor",
    label: "Male Factor Fertility",
    shortLabel: "Male Factor",
    concern: "Worried that sperm quality, count, or motility may be affecting conception?",
    reassurance:
      "Male factor fertility is common, and it gives us a clearer starting point for next steps instead of a dead end.",
    explanation:
      "This topic helps the patient understand semen analysis basics, what common male factor findings mean, when ICSI is considered, and what should happen next with Santaan.",
    nextSteps: [
      "Understand which semen report values matter and which ones need repeat testing",
      "Know when lifestyle changes help and when specialist intervention matters more",
      "See whether IVF, ICSI, or further male fertility workup is usually discussed next",
    ],
    signals: ["male-factor-interest", "icsi-likelihood", "needs-report-review"],
    whatToSend: ["Male factor explainer", "Questions to ask after semen analysis", "ICSI readiness note"],
    questionsToAsk: [
      "Which value in the report is the main concern for us right now?",
      "Do we need to repeat the semen analysis before deciding treatment?",
      "Would you recommend IVF, ICSI, or additional male evaluation first?",
    ],
    redFlags: [
      "Repeated severe abnormalities in semen analysis",
      "History of varicocele, testicular surgery, or hormonal issues with no follow-up",
      "Very high anxiety because previous doctors gave conflicting advice",
    ],
    heroTag: "Useful for ad clicks, website visitors, and report-review follow-up",
    whatsappSnippet:
      "Please send me the Santaan male factor fertility guide and the next steps for our case.",
  },
  {
    id: "low-amh",
    label: "Low AMH And Ovarian Reserve",
    shortLabel: "Low AMH",
    concern: "Scared that a low AMH value means pregnancy is no longer possible?",
    reassurance:
      "Low AMH is important, but it is not the whole story. It helps guide urgency, treatment planning, and realistic expectations.",
    explanation:
      "This journey reframes low AMH from panic into planning. It explains ovarian reserve, what low AMH does and does not predict, and how Santaan can help the patient act early and wisely.",
    nextSteps: [
      "Understand what AMH reflects and why age and scan findings still matter",
      "Know what questions to ask before choosing IVF timing or another protocol",
      "Move toward a doctor conversation with less confusion and more urgency",
    ],
    signals: ["low-amh-concern", "high-urgency", "wants-doctor-clarity"],
    whatToSend: ["Low AMH guide", "Questions for consultation", "Timeline planning note"],
    questionsToAsk: [
      "How urgent is treatment in my specific case?",
      "What does my scan suggest alongside AMH?",
      "Would you recommend IVF now, egg freezing, or another next step?",
    ],
    redFlags: [
      "Patient feels delayed by conflicting advice and wants quick triage",
      "Low AMH plus advanced age or previous failed cycles",
      "Emotionally overwhelmed and avoiding appointments out of fear",
    ],
    heroTag: "Strong fit for social ads and QR-led education funnels",
    whatsappSnippet:
      "Please send me the Santaan low AMH guide and the questions I should ask before deciding treatment.",
  },
  {
    id: "pre-icsi",
    label: "Pre ICSI Preparation",
    shortLabel: "Pre ICSI",
    concern: "Need a clean, calm explanation of what happens before ICSI and how to prepare?",
    reassurance:
      "Pre ICSI preparation becomes much easier when patients know the timeline, reports, medications, and who to contact for help.",
    explanation:
      "This journey supports patients who are already close to treatment. It clarifies the preparation window, testing, medication readiness, partner preparation, and what Santaan should collect for CRM and care follow-up.",
    nextSteps: [
      "Confirm medications, reports, and treatment dates",
      "Know what to expect before stimulation, retrieval, and lab work",
      "Request the prep checklist directly on WhatsApp for easy reference",
    ],
    signals: ["pre-icsi-prep", "registered-patient-likely", "needs-checklist"],
    whatToSend: ["Pre ICSI checklist", "Medication prep note", "Doctor question sheet"],
    questionsToAsk: [
      "What needs to be completed before our stimulation start date?",
      "Which reports should we keep handy on treatment days?",
      "Who should we message if we miss a dose or feel confused during the cycle?",
    ],
    redFlags: [
      "Missed medication instructions",
      "Patient unsure about dates, trigger timing, or clinic coordination",
      "High anxiety right before treatment start",
    ],
    heroTag: "Ideal for clinic QR and registered patient support flows",
    whatsappSnippet:
      "Please send me the Santaan pre ICSI preparation checklist and treatment prep details on WhatsApp.",
  },
  {
    id: "first-visit",
    label: "First Fertility Consultation",
    shortLabel: "First Visit",
    concern: "Not sure whether it is time to speak to a fertility specialist yet?",
    reassurance:
      "A first fertility consultation is not a commitment to IVF. It is a way to understand the problem early and reduce guesswork.",
    explanation:
      "This journey is for problem-aware patients who are worried but not yet in treatment. It helps them know what to bring, what questions to ask, and how Santaan can guide the first step without pressure.",
    nextSteps: [
      "See what usually happens in the first consultation",
      "Know which reports, timelines, and concerns to share",
      "Choose between WhatsApp guidance, counselor handoff, or booking a consult",
    ],
    signals: ["first-consult-interest", "new-lead", "needs-soft-entry"],
    whatToSend: ["First consultation guide", "What to bring list", "Questions to ask the doctor"],
    questionsToAsk: [
      "Based on our history, what should we test first?",
      "Do you think we are early, on time, or delayed in seeking help?",
      "What should our next 30 days look like with Santaan?",
    ],
    redFlags: [
      "Trying for a long duration with no structured evaluation",
      "Recurring losses or repeated failed treatment elsewhere",
      "Patient is confused about where to begin and keeps postponing help",
    ],
    heroTag: "Default landing for website, social, and QR-first acquisition",
    whatsappSnippet:
      "Please send me the Santaan first fertility consultation guide and next-step checklist on WhatsApp.",
  },
  {
    id: "two-week-wait",
    label: "Two Week Wait Support",
    shortLabel: "Two Week Wait",
    concern: "Need emotional and practical support after transfer while waiting for the pregnancy test?",
    reassurance:
      "The two week wait is emotionally heavy. Patients need clear expectations, calm reminders, and quick access to care when something feels off.",
    explanation:
      "This journey is for active or recently treated patients. It focuses on normal symptoms, what not to over-interpret, when to escalate, and how Santaan can stay present during the waiting window.",
    nextSteps: [
      "Know what symptoms are common and which ones should trigger a callback",
      "Get a day-by-day support sheet on WhatsApp",
      "Capture anxiety level and route a patient toward care follow-up if needed",
    ],
    signals: ["two-week-wait-support", "active-patient", "high-anxiety-possible"],
    whatToSend: ["Two week wait support guide", "Red flag checklist", "Calm questions for care team"],
    questionsToAsk: [
      "What symptoms are expected after transfer in my case?",
      "When should I contact Santaan urgently?",
      "What should I avoid doing while waiting for my beta test?",
    ],
    redFlags: [
      "Severe pain, heavy bleeding, or escalating distress",
      "Patient testing early repeatedly and spiraling emotionally",
      "Patient feels unsupported after a transfer elsewhere",
    ],
    heroTag: "Best for retention, re-engagement, and registered patient care",
    whatsappSnippet:
      "Please send me the Santaan two week wait support guide and red flag checklist on WhatsApp.",
  },
];

export const defaultTopicId = "first-visit";

export const patientModeChecklist: Record<PatientStage, string[]> = {
  "trying-to-conceive": [
    "Track how long you have been trying and note any major cycle irregularities",
    "Collect old reports before speaking to Santaan",
    "Save the topic guide to WhatsApp so you can revisit it later",
  ],
  diagnosis: [
    "Keep blood tests, scan reports, and semen analysis in one place",
    "Write down your three biggest doubts before the next doctor call",
    "Use the CRM-ready form so Santaan already knows your concern before speaking to you",
  ],
  "male-factor": [
    "Keep the latest semen report handy",
    "Request the male factor guide and report-review questions on WhatsApp",
    "Escalate quickly if previous advice has been unclear or conflicting",
  ],
  "low-amh": [
    "Save your AMH value and scan notes in the summary field",
    "Ask for a doctor-ready low AMH question set",
    "Do not delay consult timing if urgency has been flagged",
  ],
  "pre-ivf": [
    "Confirm what reports or repeat tests are still pending",
    "Ask Santaan which decision must happen next, not just what is possible",
    "Use the consult CTA if you are comparing options and feeling stuck",
  ],
  "pre-icsi": [
    "Request the pre ICSI checklist on WhatsApp",
    "Confirm medication start dates and escalation contact",
    "Keep partner preparation details handy as well",
  ],
  "in-treatment": [
    "Use the companion as a quick refresher between appointments",
    "Save any prep or medication guidance to WhatsApp",
    "Escalate fast if timing instructions become unclear",
  ],
  "two-week-wait": [
    "Do not interpret every symptom on your own",
    "Keep the red flag checklist easy to access",
    "Ask for a Santaan callback if anxiety is rising",
  ],
  "post-cycle": [
    "Capture what happened this cycle before the review call",
    "Request a next-step summary on WhatsApp",
    "Use Santaan for closure and planning, not just results delivery",
  ],
};

export const crmSignalLabels = {
  source: "Acquisition source",
  campaignId: "Campaign ID",
  qrId: "QR code ID",
  topicId: "Topic",
  awarenessStage: "Awareness stage",
  patientStage: "Patient stage",
  interestLevel: "Interest level",
  careIntent: "Intent",
  primaryWorry: "Primary worry",
  helpNeeded: "Requested help",
};

export type CompanionLanguage = "en" | "or";

export const companionOdiaLabels = {
  awarenessStage: {
    "problem-aware": "ସମସ୍ୟା ବୁଝୁଛନ୍ତି",
    "solution-aware": "ସମାଧାନ ଖୋଜୁଛନ୍ତି",
    "product-aware": "ସନ୍ତାନକୁ ମୂଲ୍ୟାୟନ କରୁଛନ୍ତି",
    "fence-sitter": "ଏଖଣି ନିଷ୍ପତ୍ତି ନେଇନାହାନ୍ତି",
    "registered-patient": "ନମୋଦିତ ରୋଗୀ",
  } as Record<AwarenessStage, string>,
  patientStage: {
    "trying-to-conceive": "ଗର୍ଭଧାରଣ ପାଇଁ ଚେଷ୍ଟାରେ",
    diagnosis: "ରିପୋର୍ଟ ଓ ଟେଷ୍ଟ ଚାଲୁଛି",
    "male-factor": "ପୁରୁଷ ଫର୍ଟିଲିଟି ଚିନ୍ତା",
    "low-amh": "କମ୍ AMH",
    "pre-ivf": "IVF ପୂର୍ବରୁ",
    "pre-icsi": "ICSI ପୂର୍ବରୁ",
    "in-treatment": "ଚିକିତ୍ସା ଚାଲିଛି",
    "two-week-wait": "ଦୁଇ ସପ୍ତାହ ଅପେକ୍ଷା ପର୍ଯ୍ୟାୟ",
    "post-cycle": "ସାଇକେଲ୍ ପରେ",
  } as Record<PatientStage, string>,
  interestLevel: {
    "just-starting": "ଏଖଣି ଆରମ୍ଭ କରୁଛନ୍ତି",
    "researching-options": "ବିକଳ୍ପ ଖୋଜୁଛନ୍ତି",
    "ready-for-next-step": "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ପାଇଁ ପ୍ରସ୍ତୁତ",
    "already-in-care": "ଇତିମଧ୍ୟେ ସେବାରେ ଅଛନ୍ତି",
    "returning-after-treatment": "ଚିକିତ୍ସା ପରେ ପୁଣି ଫେରିଛନ୍ତି",
  } as Record<InterestLevel, string>,
  careIntent: {
    "understand-my-situation": "ମୋ ପରିସ୍ଥିତି ବୁଝିବାକୁ",
    "review-a-report": "ରିପୋର୍ଟ ବୁଝିବାକୁ",
    "compare-treatment-options": "ଚିକିତ୍ସା ବିକଳ୍ପ ତୁଳନା କରିବାକୁ",
    "speak-to-someone": "କାହାଙ୍କ ସହ କଥା ହେବାକୁ",
    "prepare-for-treatment": "ଚିକିତ୍ସା ପାଇଁ ପ୍ରସ୍ତୁତି",
    "stay-supported": "ନିରନ୍ତର ସହଯୋଗ ଚାହୁଁଛନ୍ତି",
  } as Record<CareIntent, string>,
  primaryWorry: {
    "not-conceiving-yet": "ଗର୍ଭଧାରଣ କାହିଁକି ହେଉନାହିଁ",
    "confusing-test-results": "ରିପୋର୍ଟ ବୁଝି ପାରୁନାହିଁ",
    "time-running-out": "ସମୟ ସରିଯାଉଛି ଭାବନା",
    "cost-and-success-rates": "ଖର୍ଚ୍ଚ ଓ ସଫଳତା ନେଇ ଚିନ୍ତା",
    "treatment-timing-and-medicines": "ତାରିଖ, ଔଷଧ, ଇଞ୍ଜେକ୍ସନ୍ ନେଇ ଚିନ୍ତା",
    "stress-after-failed-or-ongoing-cycle": "ଚିକିତ୍ସା ସମୟରେ କିମ୍ବା ପରେ ମାନସିକ ଚାପ",
  } as Record<PrimaryWorry, string>,
  helpNeeded: {
    "send-guide": "WhatsApp ରେ ଗାଇଡ୍",
    "care-team-call": "କେୟାର ଟିମ୍ ଫଲୋ-ଅପ୍",
    "doctor-consult": "ଡାକ୍ତର ପରାମର୍ଶ",
    "care-plan": "ପଦକ୍ଷେପ ଭିତ୍ତିକ ଯୋଜନା",
    "reassurance-check-in": "ନିଶ୍ଚିନ୍ତତା ପାଇଁ ଚେକ୍-ଇନ୍",
  } as Record<HelpNeeded, string>,
};

export const companionOdiaTopics: Record<
  JourneyTopic["id"],
  Pick<JourneyTopic, "label" | "shortLabel" | "concern" | "reassurance" | "explanation">
> = {
  "male-factor": {
    label: "ପୁରୁଷ ଫର୍ଟିଲିଟି ଚିନ୍ତା",
    shortLabel: "ପୁରୁଷ ଫ୍ୟାକ୍ଟର",
    concern: "ସ୍ପର୍ମ ଗୁଣବତ୍ତା, କାଉଣ୍ଟ କିମ୍ବା ଗତି ଗର୍ଭଧାରଣକୁ ପ୍ରଭାବିତ କରୁଛି କି ବୋଲି ଚିନ୍ତିତ କି?",
    reassurance:
      "ପୁରୁଷ ଫ୍ୟାକ୍ଟର ଫର୍ଟିଲିଟି ସାଧାରଣ କଥା। ଏହା ଆମକୁ ଆଗକୁ କଣ କରିବା ଦରକାର ସେଥିପାଇଁ ସ୍ପଷ୍ଟ ଆରମ୍ଭ ଦିଏ।",
    explanation:
      "ଏହି ପଥ ରୋଗୀଙ୍କୁ semen analysis ର ମୁଖ୍ୟ ଅଂଶ, ସାଧାରଣ ଫଳାଫଳର ଅର୍ଥ, ICSI କେବେ ଭାବାଯାଏ, ଏବଂ ସନ୍ତାନ ସହ କଣ କରିବେ ସେଥିରେ ସହଯୋଗ କରେ।",
  },
  "low-amh": {
    label: "କମ୍ AMH ଓ ଓଭାରିଆନ୍ ରିଜର୍ଭ",
    shortLabel: "କମ୍ AMH",
    concern: "କମ୍ AMH ମାନେ ଗର୍ଭଧାରଣ ଅସମ୍ଭବ ବୋଲି ଭୟ ଲାଗୁଛି କି?",
    reassurance:
      "AMH ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ହେଲେମଧ୍ୟ ସେଇଠି ସମଗ୍ର ଚିତ୍ର ନୁହେଁ। ଏହା ସମୟ, ଯୋଜନା ଏବଂ ବାସ୍ତବ ଆଶା ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।",
    explanation:
      "ଏହି ପଥ panic ଠାରୁ planning କୁ ନେଇଯାଏ। ovarian reserve କାହାକୁ କୁହାଯାଏ, low AMH କଣ କୁହେ କଣ କୁହେନାହିଁ, ଏବଂ ସନ୍ତାନ କିପରି ସହଯୋଗ କରିପାରେ ତାହା ଏଠାରେ ସ୍ପଷ୍ଟ କରାଯାଏ।",
  },
  "pre-icsi": {
    label: "ICSI ପୂର୍ବ ପ୍ରସ୍ତୁତି",
    shortLabel: "Pre ICSI",
    concern: "ICSI ପୂର୍ବରୁ କଣ ହୁଏ ଏବଂ କିପରି ପ୍ରସ୍ତୁତି ନେବେ ସେଥିପାଇଁ ସହଜ ଏବଂ ସ୍ପଷ୍ଟ ବ୍ୟାଖ୍ୟା ଚାହୁଁଛନ୍ତି କି?",
    reassurance:
      "ସମୟରେଖା, ରିପୋର୍ଟ, ଔଷଧ ଏବଂ ସହାୟତା କାହାଠାରୁ ମିଳିବ ସେଥି ଜାଣିଲେ pre-ICSI ପ୍ରସ୍ତୁତି ଅଧିକ ସହଜ ହୋଇଯାଏ।",
    explanation:
      "ଏହି ପଥ ଚିକିତ୍ସା ନିକଟରେ ଥିବା ରୋଗୀଙ୍କ ପାଇଁ। ଏହା ପ୍ରସ୍ତୁତି ସମୟ, ଟେଷ୍ଟ, ଔଷଧ, partner preparation ଏବଂ CRM handoff ପାଇଁ କଣ ଧରିବା ଦରକାର ସେଥିରେ ସାହାଯ୍ୟ କରେ।",
  },
  "first-visit": {
    label: "ପ୍ରଥମ ଫର୍ଟିଲିଟି ପରାମର୍ଶ",
    shortLabel: "ପ୍ରଥମ ଭିଜିଟ୍",
    concern: "ଏବେ ଫର୍ଟିଲିଟି ସ୍ପେଶାଲିଷ୍ଟଙ୍କ ସହ କଥା ହେବା ଠିକ୍ ସମୟ କି ନୁହେଁ ବୋଲି ନିଶ୍ଚିତ ନୁହେଁ କି?",
    reassurance:
      "ପ୍ରଥମ ଫର୍ଟିଲିଟି ପରାମର୍ଶ ମାନେ ସିଧା IVF ର ନିଷ୍ପତ୍ତି ନୁହେଁ। ଏହା ସମସ୍ୟାକୁ ଶୀଘ୍ର ବୁଝିବା ଏବଂ ଅନୁମାନ କମାଇବାର ଉପାୟ।",
    explanation:
      "ଏହି ପଥ ଚିନ୍ତିତ କିନ୍ତୁ ଚିକିତ୍ସାରେ ନଥିବା ରୋଗୀଙ୍କ ପାଇଁ। କଣ ନେଇଯିବେ, କଣ ପଚାରିବେ, ଏବଂ ସନ୍ତାନ କିପରି pressure ବିନା ପ୍ରଥମ ପଦକ୍ଷେପକୁ ସହଜ କରିପାରିବ ତାହା ଏଠାରେ ଦିଆଯାଏ।",
  },
  "two-week-wait": {
    label: "ଦୁଇ ସପ୍ତାହ ଅପେକ୍ଷା ସହଯୋଗ",
    shortLabel: "ଦୁଇ ସପ୍ତାହ ଅପେକ୍ଷା",
    concern: "transfer ପରେ test result ଅପେକ୍ଷା ସମୟରେ ଭାବନାତ୍ମକ ଏବଂ ପ୍ରାୟୋଗିକ ସହଯୋଗ ଚାହୁଁଛନ୍ତି କି?",
    reassurance:
      "ଏହି ସମୟ ଭାବନାତ୍ମକ ଭାବେ ଅତ୍ୟନ୍ତ ଭାରି ହୋଇପାରେ। ରୋଗୀଙ୍କୁ ସ୍ପଷ୍ଟ ଆଶା, ଶାନ୍ତ ନିର୍ଦ୍ଦେଶ ଏବଂ ଶୀଘ୍ର ସହାୟତା ଦରକାର।",
    explanation:
      "ଏହି ପଥ active କିମ୍ବା recently treated ରୋଗୀଙ୍କ ପାଇଁ। କେଉଁ ଲକ୍ଷଣ ସାଧାରଣ, କେଉଁଗୁଡ଼ିକୁ ଅତିରିକ୍ତ ଅର୍ଥ ନଦେବା ଉଚିତ୍, କେବେ escalate କରିବା ଦରକାର ଏବଂ ସନ୍ତାନ କିପରି ଏହି ସମୟରେ ସାଙ୍ଗରେ ରହିପାରିବ ସେଥିରେ ଏହା ସହଯୋଗ କରେ।",
  },
};
