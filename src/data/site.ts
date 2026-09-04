export const siteConfig = {
  name: "Santaan Companion",
  headline: "The Mobile-First Fertility Companion For Every Santaan Patient Journey",
  description:
    "A mobile-first Santaan care companion for QR scans, ads, website visitors, WhatsApp follow-up, and in-clinic support.",
  nav: [
    { label: "Companion", href: "/" },
    { label: "Care Paths", href: "/process" },
    { label: "FAQ Hub", href: "/faq" },
    { label: "Support", href: "/support" },
  ],
  footerLinks: [
    { label: "Companion Home", href: "/" },
    { label: "FAQ Hub", href: "/faq" },
    { label: "Support", href: "/support" },
    { label: "Print Guides", href: "/print-guides" },
  ],
};

export interface StepPhase {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  details: string[];
  duration: string;
  emotionalTip: string;
  /** New fields for mind-map experience */
  color: string; // hex color for node
  phaseType: "diagnostic" | "procedure" | "care";
  specialistVoice: string; // "Specialist's explanation" paragraph
  physicalSensations: string[];
  questionsToAsk: string[];
  partnerGuidance: string;
  bengaluruResources: string[];
  breathingExercise: string;
  relatedPhaseIds: string[];
}

export const ivfSteps: StepPhase[] = [
  {
    id: "initial-consultation",
    title: "Initial Consultation & Testing",
    subtitle: "Laying the foundation",
    icon: "📋",
    color: "#3b82f6",
    phaseType: "diagnostic",
    summary: "Your fertility specialist reviews medical history, performs tests, and creates a personalized treatment plan.",
    details: [
      "Complete medical history review for both partners",
      "Blood tests: hormone levels (FSH, LH, AMH, estradiol), thyroid function, and infectious disease screening",
      "Ultrasound scan to assess ovarian reserve and uterine lining",
      "Semen analysis for male partner",
      "Genetic carrier screening if recommended",
      "Discussion of lifestyle factors: nutrition, exercise, smoking, alcohol, and stress management",
      "Setting realistic expectations and timeline planning",
    ],
    duration: "1–2 weeks",
    emotionalTip: "Bring a notebook and your partner or a trusted friend. It's normal to feel overwhelmed — write down your questions beforehand.",
    specialistVoice: "This is where we begin to understand your unique story. I'll review your medical history, run baseline tests, and listen carefully to your concerns. Think of this as building a roadmap together — every test gives us a piece of the puzzle. There's no pressure to have all the answers today. My goal is to make sure you feel informed, heard, and supported before we take the next step.",
    physicalSensations: [
      "Blood draw — a quick pinch, similar to any routine lab test",
      "Transvaginal ultrasound — mild pressure, lasts about 10–15 minutes",
      "Semen analysis — no physical discomfort for the male partner",
    ],
    questionsToAsk: [
      "What is my AMH level and what does it mean for my fertility?",
      "How many cycles do you typically recommend for someone my age?",
      "Are there any lifestyle changes I should make before starting treatment?",
      "What is the estimated total cost for one complete cycle at your clinic?",
    ],
    partnerGuidance: "This is a great time to attend appointments together. Write down questions beforehand so nothing is forgotten. Remember: infertility is a medical condition, not anyone's fault. Be each other's advocate in the consultation room.",
    bengaluruResources: [
      "Indira IVF — Indiranagar, comprehensive initial consultation packages from ₹2,000",
      "Nova IVF Fertility — Koramangala, offers free first consultation camps",
      "Milann Fertility Centre — HSR Layout, known for thorough diagnostic workups",
      "Cloudnine Fertility — Whitefield, couples counseling included in initial package",
    ],
    breathingExercise: "Before your appointment, try this: Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat 5 times. This activates your parasympathetic nervous system and helps you stay calm and focused during the consultation.",
    relatedPhaseIds: ["ovarian-stimulation", "post-procedure"],
  },
  {
    id: "ovarian-stimulation",
    title: "Ovarian Stimulation",
    subtitle: "Encouraging egg development",
    icon: "💉",
    color: "#a855f7",
    phaseType: "procedure",
    summary: "Daily hormone injections stimulate the ovaries to produce multiple mature eggs instead of the usual one.",
    details: [
      "Self-administered injections (FSH/LH-based medications) for 8–14 days",
      "Regular monitoring every 2–3 days: blood tests and ultrasound scans",
      "The goal is 8–15 mature follicles, not more — quality matters over quantity",
      "Medication types: gonadotropins (Gonal-F, Menopur), GnRH agonists/antagonists to prevent premature ovulation",
      "Side effects: bloating, mild abdominal discomfort, breast tenderness, mood swings",
      "Trigger shot (hCG or GnRH agonist) administered 36 hours before egg retrieval to mature the eggs",
    ],
    duration: "10–14 days",
    emotionalTip: "Set up a daily injection routine with a timer and a reward. Many women find the first few injections the hardest — it gets easier.",
    specialistVoice: "During this phase, I'll be guiding your ovaries to produce multiple eggs in one cycle — something they don't naturally do. Think of it as giving your body a gentle nudge in the right direction. You'll be giving yourself daily injections, and we'll monitor you closely with blood tests and ultrasounds every 2–3 days. I know the injections can feel daunting at first, but most women find their rhythm within a few days. You're doing something remarkable for your future family.",
    physicalSensations: [
      "Injection site: mild stinging or burning that lasts 30–60 seconds",
      "Bloating and fullness in the lower abdomen (especially in the second week)",
      "Breast tenderness — similar to PMS but more pronounced",
      "Mood swings and fatigue from hormone fluctuations",
    ],
    questionsToAsk: [
      "What medication protocol are you recommending and why?",
      "How should I store the medications (refrigerated vs room temperature)?",
      "What time of day is best for the injections?",
      "What symptoms should I report immediately?",
    ],
    partnerGuidance: "This is where partners can truly shine. Help with injection preparation, set up a daily reminder, and celebrate each day completed. Offer to give the injections if she's comfortable with that. Be patient with mood swings — the hormones are real and intense.",
    bengaluruResources: [
      "Apollo Fertility — Jayanagar, offers injection training sessions included in treatment package",
      "Medicover Fertility — HSR Layout, 24/7 helpline for injection-related queries",
      "Local pharmacies in Indiranagar and Koramangala stock Gonal-F and Menopur — call ahead for availability",
      "Many Bengaluru clinics offer 'injection lounges' where you can get your shot and rest for 15 minutes",
    ],
    breathingExercise: "If you feel anxious before an injection: Breathe in slowly for 4 counts, hold for 2 counts, breathe out for 6 counts. Imagine tension leaving your body with each exhale. Do this 3 times before and after the injection.",
    relatedPhaseIds: ["initial-consultation", "egg-retrieval"],
  },
  {
    id: "egg-retrieval",
    title: "Egg Retrieval",
    subtitle: "A minor surgical procedure",
    icon: "🔬",
    color: "#f59e0b",
    phaseType: "procedure",
    summary: "A 20-minute procedure under sedation where eggs are collected from the ovaries using a thin ultrasound-guided needle.",
    details: [
      "Performed under light sedation or anesthesia — you will feel no pain",
      "A thin needle is passed through the vaginal wall into each ovarian follicle",
      "Fluid from each follicle is aspirated and the embryologist identifies the eggs",
      "Average yield: 8–15 eggs (varies by age, ovarian reserve, and response to stimulation)",
      "After the procedure: 1–2 hours recovery in the clinic, then rest at home for the day",
      "Mild cramping or spotting is normal for 1–2 days",
      "Avoid driving, heavy lifting, and strenuous activity for 24–48 hours",
    ],
    duration: "20–30 minutes (procedure), 2–4 hours (total visit)",
    emotionalTip: "Arrange for someone to drive you home. Plan a relaxing day afterward — watch your favorite show, order comfort food, and rest.",
    specialistVoice: "Today is a big day — and I want you to know that you're in safe hands. You'll be under sedation, so you won't feel anything during the procedure. I'll use ultrasound guidance to gently collect eggs from each mature follicle. The embryologist will be right there in the lab, ready to identify and care for every egg we collect. When you wake up, I'll come and tell you exactly how many eggs we found. This is one of the most hopeful days in the IVF journey.",
    physicalSensations: [
      "Before: mild anxiety is completely normal — you may feel nervous",
      "During: you'll be sedated and feel nothing — it's like a short nap",
      "After: mild cramping similar to period cramps, some spotting",
      "Next day: most women feel well enough for light activities",
    ],
    questionsToAsk: [
      "How many eggs did you retrieve and how many were mature?",
      "Are there any specific precautions I should take tonight?",
      "When will I know how many fertilized normally?",
      "What is the clinic's policy on fertility preservation (egg freezing)?",
    ],
    partnerGuidance: "Your role today is crucial: drive her to and from the clinic, bring a cozy blanket and her favorite snack, and handle all communication with family/friends so she can rest. Let her sleep as much as she needs. The day after, order her favorite meal and watch a movie together.",
    bengaluruResources: [
      "Many Bengaluru clinics have dedicated 'retrieval day' packages with private recovery rooms",
      "KMC Fertility Centre — Manipal Hospital, Old Airport Road, known for gentle sedation protocols",
      "After-care: Ghee and warm milk is a traditional South Indian recovery recommendation — many local families swear by it",
      "Nearby pharmacies in Koramangala and Indiranagar stock post-procedure medications",
    ],
    breathingExercise: "While waiting before the procedure: Sit comfortably. Breathe in for 4 counts — 'I am safe.' Hold for 4 counts — 'I am cared for.' Breathe out for 6 counts — 'I am letting go.' Repeat until you feel calm.",
    relatedPhaseIds: ["ovarian-stimulation", "fertilization"],
  },
  {
    id: "fertilization",
    title: "Fertilization",
    subtitle: "Creating the embryos",
    icon: "🧬",
    color: "#10b981",
    phaseType: "procedure",
    summary: "Eggs and sperm are combined in the lab. Two methods: conventional insemination or ICSI (direct sperm injection).",
    details: [
      "Conventional insemination: Eggs and sperm are placed together in a culture dish overnight",
      "ICSI (Intracytoplasmic Sperm Injection): A single healthy sperm is injected directly into each egg — used for male factor infertility or previous failed fertilization",
      "Fertilization is confirmed 16–18 hours later by checking for two pronuclei",
      "Fertilization rate: typically 60–80% of mature eggs fertilize normally",
      "The embryologist documents every step and monitors development",
      "If fertilization fails, the cycle ends — your doctor will discuss options for next steps",
    ],
    duration: "1 day",
    emotionalTip: "This is the most 'invisible' step — you won't feel anything. Stay busy with light activities and trust the lab team. The waiting can be hard.",
    specialistVoice: "Now we move to the lab — my favourite part of the journey. Your eggs and your partner's sperm are brought together here. In some cases, we use ICSI, where a single healthy sperm is gently injected directly into each egg. I want to be transparent: not every egg will fertilize, and that's completely normal. We typically see 60–80% of mature eggs fertilize. You'll receive a call from us tomorrow with the fertilization report. This waiting period is hard — I know. But our embryology team is caring for your embryos with the utmost attention and respect.",
    physicalSensations: [
      "You won't feel anything — this step happens entirely in the lab",
      "You may feel a mix of hope and anxiety while waiting for the fertilization call",
    ],
    questionsToAsk: [
      "How many eggs fertilized normally?",
      "Was ICSI used and why?",
      "What is the fertilization rate compared to what's typical for my age?",
      "When will I get the next update on embryo development?",
    ],
    partnerGuidance: "This waiting period is a good time to do something together that doesn't involve talking about IVF. Go for a walk, watch a comedy, or cook a meal together. The fertilization call usually comes the next day — plan to be together when you receive it.",
    bengaluruResources: [
      "GarbhaGudi IVF Centre — Whitefield, known for high ICSI success rates and transparent lab reporting",
      "Srinivas IVF — Jayanagar, offers same-day fertilization updates via patient portal",
      "Many Bengaluru clinics now send fertilization reports via WhatsApp — ask your clinic about their communication policy",
    ],
    breathingExercise: "While waiting for the fertilization call: Inhale deeply for 4 counts — 'I trust the process.' Hold for 2 counts. Exhale slowly for 6 counts — 'I release control.' This helps calm the nervous system during the waiting period.",
    relatedPhaseIds: ["egg-retrieval", "embryo-culture"],
  },
  {
    id: "embryo-culture",
    title: "Embryo Culture",
    subtitle: "Watching life begin",
    icon: "🌱",
    color: "#14b8a6",
    phaseType: "procedure",
    summary: "Embryos grow in a specialized incubator for 3–6 days while the embryologist grades their development.",
    details: [
      "Day 1: Fertilization check — 2 pronuclei visible",
      "Day 2–3: Embryo divides into 4–8 cells (cleavage stage)",
      "Day 5–6: Embryo reaches blastocyst stage — 100+ cells with distinct inner cell mass and trophectoderm",
      "Embryo grading: quality scores based on cell number, symmetry, fragmentation, and expansion",
      "Optional: Preimplantation Genetic Testing (PGT) for chromosomal abnormalities — takes 2–4 weeks",
      "Only the best-quality embryos are selected for transfer or cryopreservation",
      "Time-lapse incubators (EmbryoScope) allow continuous monitoring without disturbing the embryos",
    ],
    duration: "3–6 days",
    emotionalTip: "The embryologist may send daily updates or photos. Some clinics offer 'embryo bonding' — a photo of your developing embryo on day 5.",
    specialistVoice: "This is where the magic happens. Your embryos are growing in a carefully controlled incubator that mimics the environment of the human body. Our embryologists check on them daily, grading their development with precision and care. By day 5 or 6, we'll know which embryos have reached the blastocyst stage — these are the ones with the highest implantation potential. I'll walk you through the grades and help you decide which embryo(s) to transfer. If you're considering genetic testing, we'll discuss that too. Every embryo is a tiny miracle, and we treat each one with the reverence it deserves.",
    physicalSensations: [
      "No physical sensations — this entire phase happens in the lab",
      "You may feel emotional ups and downs as you wait for updates",
    ],
    questionsToAsk: [
      "How many embryos reached blastocyst stage?",
      "What are the grades of my embryos and what do they mean?",
      "Should I consider PGT genetic testing for my embryos?",
      "How many embryos would you recommend transferring?",
    ],
    partnerGuidance: "This is a beautiful time to connect with the possibility of life. If your clinic offers embryo photos, look at them together and let yourselves feel hope. Talk about what you imagine for your future family — it's okay to dream.",
    bengaluruResources: [
      "BACC Healthcare — Rajajinagar, has EmbryoScope time-lapse technology for continuous monitoring",
      "Janisthaa Fertility Centre — Basaveshwaranagar, offers video updates of embryo development",
      "Many Bengaluru clinics now offer 'embryo bonding sessions' — a short video of your day-5 embryos set to music",
    ],
    breathingExercise: "When waiting for embryo updates: Close your eyes. Breathe in for 4 counts, imagining light entering your heart. Hold for 4 counts. Breathe out for 6 counts, sending love and hope to your embryos. Do this 5 times.",
    relatedPhaseIds: ["fertilization", "embryo-transfer", "pgt-testing"],
  },
  {
    id: "pgt-testing",
    title: "Preimplantation Genetic Testing",
    subtitle: "Optional genetic screening",
    icon: "🧬",
    color: "#06b6d4",
    phaseType: "diagnostic",
    summary: "Optional genetic screening of embryos for chromosomal abnormalities before transfer. Takes 2–4 weeks and involves a biopsy of the trophectoderm (future placenta cells).",
    details: [
      "PGT-A (Aneuploidy): Screens for correct number of chromosomes — most common type",
      "PGT-M (Monogenic): Tests for specific genetic disorders like thalassemia, cystic fibrosis",
      "PGT-SR (Structural Rearrangement): For patients with chromosomal translocations",
      "Biopsy is performed on day 5 or 6 blastocysts — 5–10 cells are removed from the trophectoderm",
      "Embryos are vitrified (frozen) while awaiting results — 2–4 weeks turnaround",
      "Only chromosomally normal (euploid) embryos are recommended for transfer",
      "Cost: ₹40,000 – ₹80,000 in India, depending on the type of testing and number of embryos",
    ],
    duration: "2–4 weeks",
    emotionalTip: "The waiting period for PGT results can be emotionally intense. Some patients choose not to test — it's a personal decision. Discuss the pros and cons thoroughly with your specialist.",
    specialistVoice: "PGT is an optional tool that gives us additional information about your embryos. It's like having a genetic map that helps us select the embryo with the best chance of developing into a healthy baby. I want to be clear: PGT doesn't create embryos — it screens them. And it's not right for everyone. Some patients prefer not to test, and that's a perfectly valid choice. If you're considering PGT, we'll have a thorough discussion about what the results can and can't tell us. Knowledge is power, but it also comes with emotional weight.",
    physicalSensations: [
      "No physical sensations — the biopsy happens in the lab on day 5–6 blastocysts",
      "You may feel the emotional weight of waiting for genetic results",
    ],
    questionsToAsk: [
      "Is PGT recommended for my age and medical history?",
      "What is the difference between PGT-A and PGT-M?",
      "How many of my embryos are likely to be chromosomally normal?",
      "What happens if no embryos are normal after testing?",
    ],
    partnerGuidance: "This is a decision to make together, not alone. Research shows that many couples feel relief after PGT because it reduces uncertainty. But some feel anxious about the process. Sit down together, read the information your clinic provides, and be honest about your feelings. There's no right or wrong answer.",
    bengaluruResources: [
      "GarbhaGudi IVF Centre — Whitefield, offers PGT-A and PGT-M with 3-week turnaround",
      "Milann Fertility Centre — HSR Layout, has an in-house genetic counseling team",
      "MedGenome Labs — Bangalore-based, processes PGT samples for many clinics across South India",
      "Cost in Bengaluru clinics: ₹45,000–₹75,000 for PGT-A, ₹60,000–₹90,000 for PGT-M",
    ],
    breathingExercise: "If you're feeling anxious about genetic testing decisions: Sit quietly and place both hands on your lower belly. Breathe deeply for 4 counts, feeling your belly rise. Hold for 2 counts. Exhale slowly for 6 counts. Repeat 10 times. Trust that whatever decision you make is the right one for your family.",
    relatedPhaseIds: ["embryo-culture", "embryo-transfer"],
  },
  {
    id: "embryo-transfer",
    title: "Embryo Transfer",
    subtitle: "The big day",
    icon: "✨",
    color: "#ec4899",
    phaseType: "procedure",
    summary: "A gentle, painless procedure where one or two embryos are placed into the uterus using a thin catheter.",
    details: [
      "No anesthesia needed — similar to a Pap smear",
      "A speculum is inserted, then a thin catheter is passed through the cervix",
      "The embryo(s) in a tiny drop of fluid are gently released into the uterine cavity",
      "The procedure takes 5–10 minutes",
      "You may be asked to have a full bladder for better ultrasound visualization",
      "Bed rest for 10–30 minutes after transfer is common practice",
      "Progesterone supplementation (injections, vaginal suppositories, or gel) begins immediately to support the uterine lining",
    ],
    duration: "5–10 minutes (procedure)",
    emotionalTip: "Many clinics let you watch the embryo transfer on ultrasound. It's a beautiful moment — feel free to bring a partner or support person.",
    specialistVoice: "Today is a day of hope. I'll be placing one or two of your best embryos directly into your uterus — a journey of just a few centimetres that carries so much meaning. The procedure is gentle and painless, and you'll be awake the whole time. Many clinics let you watch on the ultrasound screen as the embryo is transferred — that tiny flash of light is the beginning of a potential life. After transfer, I'll recommend a short rest, and then you'll begin the two-week wait. Take a moment today to feel proud of how far you've come.",
    physicalSensations: [
      "A speculum insertion — mild pressure, similar to a routine Pap smear",
      "The catheter passing through the cervix — you may feel a very mild cramp",
      "A full bladder may cause some discomfort, but it helps with ultrasound visualization",
      "After transfer: mild cramping or nothing at all — both are normal",
    ],
    questionsToAsk: [
      "How many embryos are you transferring and why?",
      "What is the quality grade of the embryo(s) being transferred?",
      "Should I continue progesterone supplements and for how long?",
      "Are there any activities I should avoid after transfer?",
    ],
    partnerGuidance: "This is a moment you'll remember forever. Hold her hand during the procedure, and watch the ultrasound screen together. Afterward, take her to a nice lunch or cook her favourite meal. Create a 'transfer day' ritual — light a candle, write a note to your future baby, or plant a small plant together.",
    bengaluruResources: [
      "Many Bengaluru clinics offer 'transfer day' packages with a private room, refreshments, and a photo of the embryo on ultrasound",
      "Motherhood Fertility — HSR Layout, allows partners in the transfer room and offers a recording of the procedure",
      "After transfer: Ayurvedic rest recommendations in Bengaluru include warm sesame oil foot massage and a diet of warm, easily digestible foods",
      "Nearby: Many clinics in Koramangala and Indiranagar have tie-ups with local South Indian restaurants for post-transfer meals",
    ],
    breathingExercise: "During the transfer: Breathe slowly and deeply. Inhale for 4 counts — 'I welcome this moment.' Hold for 2 counts. Exhale for 6 counts — 'I release all tension.' Visualize your uterus as a warm, welcoming home for your embryo.",
    relatedPhaseIds: ["embryo-culture", "two-week-wait"],
  },
  {
    id: "two-week-wait",
    title: "The Two-Week Wait",
    subtitle: "The hardest part",
    icon: "⏳",
    color: "#f97316",
    phaseType: "care",
    summary: "A 10–14 day wait before a pregnancy test can confirm if the treatment was successful.",
    details: [
      "Progesterone medications continue daily to support implantation",
      "Avoid strenuous exercise, hot baths, saunas, and sexual intercourse",
      "Mild symptoms: cramping, spotting, breast tenderness, fatigue, bloating — can be from medication or pregnancy",
      "Early pregnancy test (blood hCG) is scheduled 10–14 days after transfer",
      "Home pregnancy tests are not recommended — false negatives/positives are common due to medications",
      "Stay busy, rest when you need to, and lean on your support system",
      "If the test is positive: ultrasound at 6–7 weeks to confirm heartbeat and fetal development",
    ],
    duration: "10–14 days",
    emotionalTip: "This is widely considered the most emotionally challenging phase. Try to stay present, avoid symptom-spotting, and plan small daily activities to keep your mind occupied.",
    specialistVoice: "This is the phase I call 'the hard part' — not because of anything medical, but because of the emotional weight. Your body has done everything it can, and now it's a waiting game. I want you to know that every symptom — or lack of symptoms — can be confusing. Cramping, spotting, fatigue, bloating — these can all be from the progesterone medication, not necessarily a sign of pregnancy or its absence. The only reliable answer will come from your blood test 10–14 days from now. Until then, be gentle with yourself. You've already done something incredibly brave.",
    physicalSensations: [
      "Progesterone side effects: bloating, breast tenderness, fatigue, mood swings",
      "Mild cramping and spotting can be normal — or may mean nothing at all",
      "Some women feel nothing — and that's also completely normal",
    ],
    questionsToAsk: [
      "When exactly should I come in for the blood test?",
      "Should I continue progesterone if I have spotting?",
      "What symptoms would warrant an early call to the clinic?",
      "If the test is negative, when will we have a follow-up consultation?",
    ],
    partnerGuidance: "This is the time to be a steady presence. Don't ask 'do you think it worked?' every day — it adds pressure. Instead, plan small distractions: a daily walk, a new recipe to try, a board game night. Be the calm anchor when emotions run high. Remind her that she's amazing regardless of the outcome.",
    bengaluruResources: [
      "Many Bengaluru clinics offer a 'two-week wait support call' — a weekly check-in call from a nurse",
      "Online support groups: 'IVF Warriors Bengaluru' on Facebook has daily check-in threads",
      "Local Bengaluru cafés in Indiranagar (like Matteo Coffee) offer quiet spaces to read and relax",
      "Ayurvedic spas in JP Nagar offer gentle, pregnancy-safe abhyanga (oil massage) — confirm with your doctor first",
    ],
    breathingExercise: "When anxiety spikes during the wait: 4-7-8 breathing. Inhale through nose for 4 counts. Hold breath for 7 counts. Exhale through mouth for 8 counts. Repeat 4 times. This is a natural tranquilizer for the nervous system.",
    relatedPhaseIds: ["embryo-transfer", "post-procedure"],
  },
  {
    id: "post-procedure",
    title: "Post-Procedure Care & Follow-up",
    subtitle: "What comes next",
    icon: "❤️",
    color: "#6366f1",
    phaseType: "care",
    summary: "Continued monitoring, medication adjustments, and emotional support whether the outcome is positive or not.",
    details: [
      "Positive outcome: early pregnancy monitoring, progesterone continued until 8–10 weeks, then gradual transition to standard prenatal care",
      "Negative outcome: medication is stopped, period arrives in 3–7 days, follow-up appointment to discuss results and next steps",
      "Frozen embryo transfer (FET): remaining viable embryos can be used in a future cycle",
      "Emotional counseling is available and recommended — many clinics offer free or subsidized sessions",
      "Lifestyle guidance: nutrition, gentle exercise, stress reduction, and supplements (folic acid, vitamin D)",
      "Planning for next steps: second fresh cycle, FET, donor options, or alternative family-building paths",
    ],
    duration: "Ongoing",
    emotionalTip: "No matter the outcome, give yourself space to process. IVF is a journey of courage — celebrate your strength regardless of the result.",
    specialistVoice: "Whatever the outcome, I want you to know that you are not defined by a single cycle. If the result is positive, we'll begin early pregnancy monitoring to make sure everything is progressing well. If it's not what we hoped for, we'll take time to review what we learned, adjust our approach, and plan your next steps. Many patients need more than one cycle — that's not a failure, it's part of the journey. I'll be with you every step, whether that means celebrating a pregnancy or helping you decide what comes next. Your courage in this process is extraordinary.",
    physicalSensations: [
      "If positive: continued bloating, breast tenderness from progesterone — gradually easing as pregnancy progresses",
      "If negative: period-like bleeding within 3–7 days of stopping medication, possibly heavier than usual",
      "Emotional exhaustion is the most common sensation — allow yourself to rest",
    ],
    questionsToAsk: [
      "What are the next steps based on my results?",
      "When can I try again if this cycle was unsuccessful?",
      "How many frozen embryos do I have and what are their grades?",
      "Are there any lifestyle changes I should make before attempting another cycle?",
    ],
    partnerGuidance: "This is a time for honest, gentle communication. Sit down together and talk about what each of you is feeling — without judgment. If the result is negative, grieve together. If positive, celebrate together. Either way, plan a 'next chapter' date — something to look forward to that isn't about IVF.",
    bengaluruResources: [
      "Conceive India Foundation — support groups meeting in Koramangala and Indiranagar",
      "Many Bengaluru clinics offer discounted follow-up consultations for subsequent cycles",
      "Fertility counseling services: Dr. Shwetha's Fertility Counseling Clinic — online sessions available",
      "Bengaluru-based nutritionists specializing in post-IVF recovery: Nourish Fertility Clinic — Whitefield",
    ],
    breathingExercise: "For processing any outcome: Sit quietly. Place one hand on your heart. Breathe in for 4 counts — 'I am whole.' Hold for 4 counts. Breathe out for 6 counts — 'I am enough.' Repeat 10 times. You are complete regardless of the outcome of this cycle.",
    relatedPhaseIds: ["two-week-wait", "initial-consultation"],
  },
];

export const successFactors = [
  {
    title: "Maternal Age",
    value: "Under 35: ~40-50%",
    note: "Success rates decline gradually after 35, more sharply after 40",
  },
  {
    title: "Embryo Quality",
    value: "Top-grade blastocyst: ~50-60%",
    note: "Genetic testing (PGT) can improve selection",
  },
  {
    title: "Previous Cycles",
    value: "Cumulative success increases",
    note: "Each cycle provides data to refine the approach",
  },
  {
    title: "Clinic Expertise",
    value: "Varies by center",
    note: "Choose a clinic with transparent published success rates",
  },
];

export const riskFactors = [
  {
    title: "Ovarian Hyperstimulation Syndrome (OHSS)",
    severity: "Moderate",
    description: "Ovaries swell and leak fluid. Mild cases are common; severe cases require hospitalization.",
    management: "Careful medication dosing, trigger shot adjustment, and monitoring. Frozen embryo transfer reduces risk.",
  },
  {
    title: "Multiple Pregnancy",
    severity: "Moderate",
    description: "Twins or triplets increase risk of preterm birth, low birth weight, and pregnancy complications.",
    management: "Single embryo transfer (SET) is now standard practice for most patients under 38.",
  },
  {
    title: "Ectopic Pregnancy",
    severity: "Rare",
    description: "Embryo implants outside the uterus, usually in a fallopian tube. Requires immediate medical attention.",
    management: "Early ultrasound monitoring and prompt treatment. Risk is ~2% in IVF pregnancies.",
  },
  {
    title: "Emotional & Psychological Impact",
    severity: "Common",
    description: "Anxiety, depression, stress, and relationship strain are common during and after treatment.",
    management: "Counseling, support groups, mindfulness, and open communication with your partner and healthcare team.",
  },
];

export const costEstimates = {
  india: {
    heading: "Cost in India (₹ INR)",
    ranges: [
      { item: "Initial Consultation & Tests", range: "₹5,000 – ₹15,000" },
      { item: "Ovarian Stimulation Medications", range: "₹30,000 – ₹80,000" },
      { item: "Egg Retrieval & Lab Fees", range: "₹25,000 – ₹50,000" },
      { item: "ICSI (if needed)", range: "₹15,000 – ₹30,000" },
      { item: "Embryo Transfer", range: "₹10,000 – ₹25,000" },
      { item: "PGT Genetic Testing (optional)", range: "₹40,000 – ₹80,000" },
      { item: "Frozen Embryo Transfer (FET)", range: "₹15,000 – ₹35,000" },
      { item: "Total (one fresh cycle, estimated)", range: "₹1,00,000 – ₹2,50,000" },
    ],
    note: "Costs vary significantly by city, clinic reputation, and individual medical needs. Bengaluru clinics may range from ₹1.2L to ₹2.8L per cycle. Many clinics offer EMI options.",
  },
  global: {
    heading: "Global Cost Comparison (USD)",
    ranges: [
      { item: "USA", range: "$12,000 – $25,000 per cycle" },
      { item: "UK", range: "£5,000 – £8,000 per cycle" },
      { item: "Australia", range: "AUD $10,000 – $15,000 per cycle" },
      { item: "Thailand", range: "$6,000 – $10,000 per cycle" },
      { item: "India", range: "$2,000 – $5,000 per cycle" },
    ],
  },
};

export const supportResources = [
  {
    title: "Emotional Counseling",
    description: "Professional counselors who specialize in fertility issues can help you navigate the emotional rollercoaster.",
    tips: [
      "Ask your clinic if they have an in-house counselor",
      "Look for counselors certified by the Indian Fertility Society",
      "Online therapy platforms like Practo and BetterHelp offer fertility-specific counseling",
    ],
    icon: "💬",
  },
  {
    title: "Support Groups",
    description: "Connecting with others who understand your journey can be incredibly validating and empowering.",
    tips: [
      "Facebook groups: 'IVF Support India', 'TTC Warriors India'",
      "Local Bengaluru groups meet at Indiranagar and Koramangala",
      "Conceive India Foundation offers peer support programs",
    ],
    icon: "👥",
  },
  {
    title: "Yoga & Mindfulness",
    description: "Gentle movement and meditation can reduce stress, improve sleep, and restore a sense of control.",
    tips: [
      "Restorative yoga and pregnancy yoga classes available in Bengaluru (Hosa Road, JP Nagar)",
      "Apps: Insight Timer, Calm, and Headspace have fertility-specific meditation tracks",
      "Pranayama (breathing exercises) 10 minutes daily can help calm the nervous system",
    ],
    icon: "🧘",
  },
  {
    title: "Partner & Relationship Support",
    description: "IVF affects both partners. Open communication and shared coping strategies strengthen your bond.",
    tips: [
      "Schedule weekly 'check-in' conversations without distractions",
      "Alternate attending appointments so both partners feel involved",
      "Couples counseling can help navigate intimacy and communication challenges",
    ],
    icon: "🤝",
  },
  {
    title: "Nutrition & Wellness",
    description: "A balanced diet and healthy lifestyle support fertility treatment effectiveness.",
    tips: [
      "Consult a fertility nutritionist (many in Bengaluru's Whitefield and Electronic City areas)",
      "Focus on whole foods: leafy greens, protein, healthy fats, and complex carbohydrates",
      "Supplements: folic acid (5mg), vitamin D, CoQ10, omega-3s — but only as prescribed",
    ],
    icon: "🥗",
  },
  {
    title: "Financial Guidance",
    description: "Understanding costs and available financial support can reduce a significant source of stress.",
    tips: [
      "Many Indian clinics offer EMI and zero-interest installment plans",
      "Check if your employer's health insurance covers fertility treatment",
      "Some states in India offer subsidies for infertility treatment under public health schemes",
    ],
    icon: "💰",
  },
];

export const faqData = [
  {
    q: "Does IVF hurt?",
    a: "Most procedures are not painful. Injections may cause mild discomfort, egg retrieval is done under sedation, and embryo transfer is painless. Some women experience bloating or cramping during stimulation.",
    category: "procedure",
  },
  {
    q: "How many IVF cycles are typically needed?",
    a: "Many patients conceive within 1–3 cycles. Cumulative success rates increase with each cycle as doctors refine the protocol based on your response.",
    category: "general",
  },
  {
    q: "Can I work during IVF treatment?",
    a: "Yes, most women continue working. You may need time off for monitoring appointments (early morning slots help). The egg retrieval day and the day after usually require rest.",
    category: "lifestyle",
  },
  {
    q: "What is the success rate of IVF?",
    a: "For women under 35, the live birth rate per cycle is about 40-50%. Rates decline with age: 35-37 (~30%), 38-40 (~20%), 40+ (~10%). Success depends on many individual factors.",
    category: "general",
  },
  {
    q: "Are there any dietary restrictions during IVF?",
    a: "A balanced diet rich in protein, healthy fats, and antioxidants is recommended. Avoid alcohol, limit caffeine to 1 cup/day, and maintain a healthy weight. Your doctor may recommend specific supplements.",
    category: "lifestyle",
  },
  {
    q: "Can IVF cause early menopause?",
    a: "No. IVF uses eggs that would have naturally been lost that cycle. It does not deplete your egg reserve or cause early menopause.",
    category: "general",
  },
  {
    q: "Is IVF covered by insurance in India?",
    a: "Most Indian health insurance plans do not cover IVF, though some corporate policies now include fertility benefits. Check with your HR department. Some states offer subsidies under public health schemes.",
    category: "costs",
  },
  {
    q: "What if my first IVF cycle fails?",
    a: "A failed cycle is not a failure — it provides valuable information. Your doctor will review what happened and adjust the protocol for the next cycle. Many patients succeed on subsequent attempts.",
    category: "emotional",
  },
  {
    q: "How long does the entire IVF process take?",
    a: "A single fresh IVF cycle typically takes 4–6 weeks from start to pregnancy test. If you include PGT testing, add 2–4 weeks. Frozen embryo transfer cycles are shorter — about 2–3 weeks.",
    category: "general",
  },
  {
    q: "What is OHSS and should I be worried?",
    a: "Ovarian Hyperstimulation Syndrome is a potential side effect of stimulation medications. Mild cases cause bloating and discomfort. Severe cases are rare. Your doctor will monitor you closely to minimize risk.",
    category: "procedure",
  },
  {
    q: "Can I travel during IVF treatment?",
    a: "Travel is generally fine during the initial consultation phase, but once ovarian stimulation begins, you'll need to be near your clinic for monitoring every 2–3 days. Avoid travel after embryo transfer.",
    category: "lifestyle",
  },
  {
    q: "How soon can I try again after a failed cycle?",
    a: "Most doctors recommend waiting 1–3 menstrual cycles after a failed fresh cycle. This allows your body to recover from the hormones. For frozen embryo transfers, you can often try again sooner.",
    category: "emotional",
  },
  {
    q: "What is the difference between fresh and frozen embryo transfer?",
    a: "Fresh transfer happens 3–5 days after egg retrieval in the same cycle. Frozen transfer (FET) uses embryos from a previous cycle that were vitrified and stored. FET success rates are often comparable or slightly higher.",
    category: "procedure",
  },
  {
    q: "Are there any fertility clinics in Bengaluru you recommend?",
    a: "Bengaluru has excellent fertility clinics including Indira IVF (Indiranagar), Nova IVF (Koramangala), Milann (HSR Layout), GarbhaGudi (Whitefield), and Apollo Fertility (Jayanagar). Always research multiple clinics, read reviews, and visit at least two before deciding.",
    category: "costs",
  },
  {
    q: "How much does IVF cost in Bengaluru?",
    a: "A single IVF cycle in Bengaluru typically costs ₹1,00,000 – ₹2,80,000 depending on the clinic, medications needed, and additional procedures like ICSI or PGT. Many clinics offer EMI options starting at ₹10,000/month.",
    category: "costs",
  },
  {
    q: "Will IVF affect my relationship with my partner?",
    a: "IVF can strain even the strongest relationships. The key is open communication, shared decision-making, and mutual support. Many couples find that counseling helps them navigate the emotional challenges together.",
    category: "emotional",
  },
];

export interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "procedure", label: "Procedure & Pain" },
  { id: "lifestyle", label: "Lifestyle & Diet" },
  { id: "costs", label: "Costs & Insurance" },
  { id: "emotional", label: "Emotional Support" },
];

export interface SantaanCarePath {
  id: string;
  title: string;
  audience: string;
  summary: string;
  signals: string[];
  nextActions: string[];
  ctaLabel: string;
}

export const santaanCarePaths: SantaanCarePath[] = [
  {
    id: "worried-now",
    title: "I Am Worried About Something",
    audience: "Problem-aware patients arriving from ads, social, QR, or website.",
    summary:
      "A fast mobile landing that calms the patient, explains the concern, and gives them three clear exits: WhatsApp, care-team handoff, or consult booking.",
    signals: ["source", "topic", "awareness-stage", "patient-stage", "emotional-state"],
    nextActions: [
      "Send a short topic guide to WhatsApp",
      "Capture what the patient wants Santaan to know before follow-up",
      "Offer counselor or care-team handoff if anxiety is high",
    ],
    ctaLabel: "Open Worried Patient Journey",
  },
  {
    id: "exploring-options",
    title: "I Am Exploring Treatment Options",
    audience: "Solution-aware patients comparing IVF, ICSI, timelines, or urgency.",
    summary:
      "A decision-support path that helps patients understand their next medical conversation without forcing a hard conversion too early.",
    signals: ["treatment-interest", "topic", "consult-intent", "repeat-visit"],
    nextActions: [
      "Send question sets and prep notes on WhatsApp",
      "Highlight when Santaan should speak to the patient soon",
      "Move interested leads into consultation flow with richer context",
    ],
    ctaLabel: "Explore Treatment Paths",
  },
  {
    id: "why-santaan",
    title: "Why Santaan",
    audience: "Product-aware visitors deciding whether to trust Santaan with their next step.",
    summary:
      "A trust path focused on clinical clarity, fast follow-up, and companion-style support instead of a generic brochure experience.",
    signals: ["product-aware", "source", "campaign-id", "consult-intent"],
    nextActions: [
      "Show how Santaan continues on WhatsApp after first contact",
      "Explain the companion handoff from acquisition to care",
      "Bring interested visitors into booking with source attribution intact",
    ],
    ctaLabel: "See Santaan Difference",
  },
  {
    id: "already-in-treatment",
    title: "I Am Already In Treatment",
    audience: "Registered or returning patients who need ongoing guidance and escalation support.",
    summary:
      "A patient mode that reframes the site from marketing entry to practical support, reducing repeat confusion between appointments.",
    signals: ["patient-mode", "patient-stage", "callback-intent", "topic-repeat-view"],
    nextActions: [
      "Show what is normal and what needs a callback",
      "Send stage-specific checklists and reminders",
      "Capture handoff notes for coordinators and care team",
    ],
    ctaLabel: "Switch To Patient Mode",
  },
];

export interface SantaanSupportProgram {
  title: string;
  description: string;
  bullets: string[];
  outcome: string;
}

export interface SantaanFounderValuePoint {
  title: string;
  description: string;
  value: string;
}

export const santaanFounderValuePoints: SantaanFounderValuePoint[] = [
  {
    title: "Higher-quality patient conversion",
    description:
      "Map.Santaan does not just collect leads. It qualifies where the patient is in the IVF journey, what is bothering them, and what kind of help they want next.",
    value: "Santaan gets fewer blind inquiries and more context-rich patient intent.",
  },
  {
    title: "One system from acquisition to care",
    description:
      "The same experience can serve ad traffic, website visitors, clinic QR scans, active patients, and returning patients without forcing separate tools for each stage.",
    value: "Santaan gets continuity instead of fragmented funnels and disconnected support journeys.",
  },
  {
    title: "Faster follow-up with less repetition",
    description:
      "When the patient continues on WhatsApp or through CRM, the handoff already contains the topic, stage, worry, and support need.",
    value: "Santaan gets a warmer patient experience and a more efficient care-team workflow.",
  },
  {
    title: "Better retention and stronger NPS",
    description:
      "This is not only a top-of-funnel tool. It can also support patients during treatment, during anxious waiting periods, and after a failed or completed cycle.",
    value: "Santaan gets a product that helps improve trust, reassurance, and long-term relationship value.",
  },
  {
    title: "Regional-language trust with Odia",
    description:
      "An English/Odia toggle reduces friction for patients and families who are more comfortable processing care information in Odia before speaking to the team.",
    value: "Santaan gets broader reach, stronger trust, and a more locally resonant care experience.",
  },
];

export const santaanSupportPrograms: SantaanSupportProgram[] = [
  {
    title: "WhatsApp Continuation",
    description: "Turns a scan or ad click into an owned follow-up channel with topic-specific guidance.",
    bullets: [
      "Send guide summaries, prep sheets, and doctor questions",
      "Preserve the patient concern and stage before handoff",
      "Give anxious patients a simple next step without forcing a long form",
    ],
    outcome: "Better lead capture with lower friction and stronger revisit potential.",
  },
  {
    title: "Care-Team Escalation",
    description: "Offers a quicker human handoff when the patient sounds stuck, scared, or clinically urgent.",
    bullets: [
      "Flags red-flag topics and rising anxiety",
      "Packages summary notes for counselor or coordinator follow-up",
      "Keeps the patient inside the Santaan journey instead of dropping them",
    ],
    outcome: "Faster triage for higher-intent or emotionally heavy cases.",
  },
  {
    title: "Consult Readiness",
    description: "Moves a patient from broad concern into a cleaner consultation request with less repetition.",
    bullets: [
      "Collects source, topic, stage, and short concern summary",
      "Lets the booking or CRM team start from context instead of zero",
      "Works for both first-time leads and returning patients",
    ],
    outcome: "Higher-quality consult requests and easier CRM enrichment.",
  },
  {
    title: "Patient Reassurance",
    description: "Supports registered patients between visits so they know what is normal and when to escalate.",
    bullets: [
      "Stage-specific reminders for prep, medication, waiting, and callback triggers",
      "Practical companion content instead of generic articles",
      "Useful for clinic QR codes and post-visit follow-up",
    ],
    outcome: "Better continuity and fewer avoidable confusion loops.",
  },
];

export interface SantaanPrintGuide {
  title: string;
  useCase: string;
  sections: string[];
}

export const santaanPrintGuides: SantaanPrintGuide[] = [
  {
    title: "First Consultation Starter Sheet",
    useCase: "For new leads who want to arrive prepared without feeling pushed into treatment.",
    sections: [
      "What to bring to the first Santaan conversation",
      "Questions to ask the doctor or counselor",
      "What to write in the summary field before follow-up",
    ],
  },
  {
    title: "Low AMH Decision Prep",
    useCase: "For patients who need urgency, clarity, and practical next-step framing.",
    sections: [
      "What low AMH does and does not mean",
      "Questions about urgency and next treatment step",
      "What Santaan should know before calling back",
    ],
  },
  {
    title: "Male Factor Report Review",
    useCase: "For couples trying to understand semen analysis and whether ICSI enters the discussion.",
    sections: [
      "Which findings matter most in the report",
      "What needs repeat testing or clarification",
      "How to ask about IVF versus ICSI next",
    ],
  },
  {
    title: "Pre ICSI Checklist",
    useCase: "For clinic QR and registered patient support right before treatment begins.",
    sections: [
      "What reports and medications to keep ready",
      "What to confirm before stimulation starts",
      "When to message Santaan urgently for clarification",
    ],
  },
];

export const santaanFaqCategories = [
  { id: "all", label: "All Questions" },
  { id: "entry", label: "Entry & QR" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "consult", label: "Consult" },
  { id: "patient", label: "Patient Mode" },
  { id: "crm", label: "CRM Signals" },
];

export const santaanFaqData: FAQItem[] = [
  {
    q: "Can this page open directly to a topic from a QR code or ad?",
    a: "Yes. Santaan Companion supports URL parameters like topic, source, campaign, qr, mode, awareness, and stage so campaigns can land on the right concern immediately.",
    category: "entry",
  },
  {
    q: "What happens when a patient taps Send To WhatsApp?",
    a: "The experience creates a WhatsApp continuation path using the selected topic, patient stage, and any short summary the patient entered. That gives Santaan a softer lead capture and a cleaner follow-up handoff.",
    category: "whatsapp",
  },
  {
    q: "Does the site collect CRM-ready lead context before backend integration is finished?",
    a: "Yes. The frontend shapes source, campaign, QR, topic, awareness stage, patient stage, consent, and intent into payloads inside src/lib/api.ts. When no backend is configured, requests are queued locally for later wiring.",
    category: "crm",
  },
  {
    q: "How is this different from a generic IVF information page?",
    a: "This experience is topic-first, mobile-first, and handoff-ready. Instead of browsing a long phase guide, the patient lands on the exact concern, sees immediate next actions, and can continue with Santaan on WhatsApp or in consult flow.",
    category: "entry",
  },
  {
    q: "Can an existing patient use the same experience?",
    a: "Yes. Patient mode reframes the shell around current treatment stage, normal-versus-escalate guidance, and quick callback prompts for registered patients.",
    category: "patient",
  },
  {
    q: "What should Santaan ask for before booking a consultation?",
    a: "At minimum: the concern topic, where the patient came from, their current stage, and one short summary in their own words. That gives the care or CRM team context before the first call.",
    category: "consult",
  },
  {
    q: "Which signals are worth passing into CRM from the frontend?",
    a: "Start with source, campaign ID, QR ID, topic, awareness stage, patient stage, consent, WhatsApp request, consult intent, and whether the patient appears to be a prospect or an active patient.",
    category: "crm",
  },
  {
    q: "Can Santaan use this for clinic QR codes as well as ads?",
    a: "Yes. Clinic QR flows are especially useful for pre ICSI prep, two-week wait support, and report-review journeys because the patient can continue from scan to WhatsApp without losing context.",
    category: "entry",
  },
];

export interface PatientPosition {
  id: string;
  label: string;
  description: string;
  icon: string;
  highlightedPhaseIds: string[];
}

export interface MedicalHistory {
  age: string;
  bmi: string;
  infertilityDuration: string;
  previousTreatments: string;
  medicalConditions: string;
  medications: string;
  priorSurgeries: string;
  priorIVFAttempts: string;
  createdAt: string;
}

export const defaultMedicalHistory: MedicalHistory = {
  age: "",
  bmi: "",
  infertilityDuration: "",
  previousTreatments: "",
  medicalConditions: "",
  medications: "",
  priorSurgeries: "",
  priorIVFAttempts: "",
  createdAt: new Date().toISOString(),
};

export interface DoubtEntry {
  id: string;
  text: string;
  timestamp: string;
  phaseId: string;
  answered: boolean;
}

export interface EmotionalCheckIn {
  mood: "calm" | "anxious" | "overwhelmed" | "hopeful" | "sad";
  date: string;
  note: string;
}

export const emotionalResources: Record<string, { title: string; description: string; link: string }[]> = {
  calm: [
    { title: "Mindfulness for Fertility", description: "A guided meditation to stay present and grounded during your IVF journey.", link: "#" },
    { title: "Partner Connection Exercise", description: "A 10-minute gratitude-sharing exercise with your partner.", link: "#" },
  ],
  anxious: [
    { title: "4-7-8 Breathing Technique", description: "Inhale 4 counts, hold 7, exhale 8. Activates the parasympathetic nervous system.", link: "#" },
    { title: "Fertility Counseling Hotline", description: "Conceive India Foundation: 1800-123-456 (Toll-free, 9 AM–9 PM)", link: "#" },
    { title: "Journaling Prompts for Anxiety", description: "Write down: 'What is one thing I can control today?'", link: "#" },
  ],
  overwhelmed: [
    { title: "Crisis Support", description: "If you're feeling overwhelmed, call iCall Helpline: 9152987821 (available 24/7)", link: "#" },
    { title: "Take a 5-Minute Break", description: "Step away from all screens. Breathe deeply. Drink water. You are doing enough.", link: "#" },
    { title: "Support Groups in Bengaluru", description: "Conceive India Foundation support groups meet every Saturday at Indiranagar.", link: "#" },
  ],
  hopeful: [
    { title: "Share Your Hope", description: "Write a letter to your future self about what you're looking forward to.", link: "#" },
    { title: "Celebrate Small Wins", description: "Acknowledge each step completed. You're showing incredible strength.", link: "#" },
  ],
  sad: [
    { title: "Grief & Loss Support", description: "It's okay to grieve for what this journey has taken from you. You are not alone.", link: "#" },
    { title: "Partner Communication Tips", description: "Share one feeling with your partner today without expecting a solution — just being heard helps.", link: "#" },
    { title: "Professional Counseling", description: "Dr. Shwetha's Fertility Counseling — available online and in-clinic at Bengaluru.", link: "#" },
  ],
};

export const commonPhaseFears: Record<string, string[]> = {
  "initial-consultation": ["What if my tests show something worrying?", "Will I be judged for my age/lifestyle?", "How do I choose the right clinic?"],
  "ovarian-stimulation": ["What if the injections hurt too much?", "What if my body doesn't respond?", "Will I gain weight from the hormones?"],
  "egg-retrieval": ["What if they don't find enough eggs?", "Will I be in pain after?", "What if I don't wake up well from sedation?"],
  "fertilization": ["What if none of the eggs fertilize?", "Should we have done ICSI?", "When will they call us?"],
  "embryo-culture": ["What if the embryos stop growing?", "How do I know if they're good quality?", "Should we do PGT testing?"],
  "pgt-testing": ["What if all embryos are abnormal?", "How long does the wait feel?", "What if we need to decide about a mosaic embryo?"],
  "embryo-transfer": ["Will it hurt?", "What if the embryo doesn't implant?", "Should I rest or move around afterward?"],
  "two-week-wait": ["What if I get my period?", "Can I test early?", "How do I cope with the anxiety?"],
  "post-procedure": ["What if it didn't work?", "When can we try again?", "Should we consider alternatives?"],
};

export const patientPositions: PatientPosition[] = [
  {
    id: "just-starting",
    label: "Just Starting Out",
    description: "Exploring options, haven't begun treatment yet",
    icon: "🔍",
    highlightedPhaseIds: ["initial-consultation"],
  },
  {
    id: "in-stimulation",
    label: "In Treatment — Ovarian Stimulation",
    description: "Currently doing daily injections and monitoring",
    icon: "💉",
    highlightedPhaseIds: ["ovarian-stimulation"],
  },
  {
    id: "awaiting-retrieval",
    label: "Waiting for Egg Retrieval",
    description: "Trigger shot done, retrieval scheduled",
    icon: "🔬",
    highlightedPhaseIds: ["ovarian-stimulation", "egg-retrieval"],
  },
  {
    id: "in-lab",
    label: "In Lab Phase",
    description: "Eggs retrieved, waiting for fertilization and embryo updates",
    icon: "🧬",
    highlightedPhaseIds: ["fertilization", "embryo-culture", "pgt-testing"],
  },
  {
    id: "preparing-transfer",
    label: "Preparing for Embryo Transfer",
    description: "Embryos selected, transfer date approaching",
    icon: "✨",
    highlightedPhaseIds: ["embryo-culture", "embryo-transfer"],
  },
  {
    id: "two-week-wait",
    label: "In the Two-Week Wait",
    description: "Transfer done, waiting for pregnancy test",
    icon: "⏳",
    highlightedPhaseIds: ["two-week-wait"],
  },
  {
    id: "post-cycle",
    label: "Post-Cycle / Planning Next Steps",
    description: "Got results, considering next cycle or alternatives",
    icon: "❤️",
    highlightedPhaseIds: ["post-procedure", "initial-consultation"],
  },
];
