import { useState } from "react";
import { StepPhase, ivfSteps } from "../data/site";
import { Heart, Clock, Stethoscope, ArrowLeft, Users, MapPin, Wind, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface PhaseDetailPanelProps {
  phase: StepPhase;
  onBack: () => void;
  onNavigateToPhase: (phaseId: string) => void;
}

export default function PhaseDetailPanel({ phase, onBack, onNavigateToPhase }: PhaseDetailPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("specialist");

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const relatedPhases = ivfSteps.filter((s) => phase.relatedPhaseIds.includes(s.id));

  const sections = [
    {
      id: "specialist",
      icon: <Stethoscope className="h-4 w-4" />,
      label: "Specialist's Voice",
      content: (
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5 border border-blue-400/20">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
              <Stethoscope className="h-4 w-4 text-blue-300" />
            </div>
            <span className="text-sm font-medium text-blue-300">Your Specialist says...</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200 italic">
            "{phase.specialistVoice}"
          </p>
        </div>
      ),
    },
    {
      id: "timeline",
      icon: <Clock className="h-4 w-4" />,
      label: "Timeline & Duration",
      content: (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Expected Duration</p>
            <p className="text-sm font-medium text-white">{phase.duration}</p>
          </div>
        </div>
      ),
    },
    {
      id: "sensations",
      icon: <Heart className="h-4 w-4" />,
      label: "Physical Sensations",
      content: (
        <ul className="space-y-2">
          {phase.physicalSensations.map((sensation, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-[10px] text-purple-300">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{sensation}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "questions",
      icon: <HelpCircle className="h-4 w-4" />,
      label: "Questions to Ask Your Doctor",
      content: (
        <ul className="space-y-2">
          {phase.questionsToAsk.map((q, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] text-amber-300">
                ?
              </span>
              <span className="text-sm text-slate-200">{q}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "partner",
      icon: <Users className="h-4 w-4" />,
      label: "Partner Guidance",
      content: (
        <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-pink-400" />
            <span className="text-xs font-medium text-pink-300">For Partners</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{phase.partnerGuidance}</p>
        </div>
      ),
    },
    {
      id: "bengaluru",
      icon: <MapPin className="h-4 w-4" />,
      label: "Bengaluru Resources",
      content: (
        <ul className="space-y-2">
          {phase.bengaluruResources.map((resource, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-green-500/5 border border-green-500/10 p-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-[10px] text-green-300">
                <MapPin className="h-3 w-3" />
              </span>
              <span className="text-sm text-slate-300">{resource}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "breathing",
      icon: <Wind className="h-4 w-4" />,
      label: "Breathing Exercise",
      content: (
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-5 border border-cyan-400/20">
          <div className="mb-2 flex items-center gap-2">
            <Wind className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Try This Now</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">{phase.breathingExercise}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Back button & phase header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Mind Map
        </button>

        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
            {phase.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full px-2.5 py-0.5 font-medium"
                style={{
                  backgroundColor: phase.color + "20",
                  color: phase.color,
                }}
              >
                {phase.phaseType === "diagnostic" ? "Diagnostic" : phase.phaseType === "procedure" ? "Procedure" : "Care & Support"}
              </span>
              <span className="text-slate-500">{phase.duration}</span>
            </div>
            <h2 className="mt-1.5 text-2xl font-bold text-white">{phase.title}</h2>
            <p className="text-sm text-slate-400">{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = expandedSection === section.id;
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-blue-300">{section.icon}</span>
                  <span className="text-sm font-medium text-white">{section.label}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emotional Tip */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/5 p-4 border border-pink-400/10">
        <Heart className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-pink-400/80">Emotional Tip</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{phase.emotionalTip}</p>
        </div>
      </div>

      {/* Related Phases */}
      {relatedPhases.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Related Phases</p>
          <div className="flex flex-wrap gap-2">
            {relatedPhases.map((related) => (
              <button
                key={related.id}
                onClick={() => onNavigateToPhase(related.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 transition hover:bg-blue-500/20"
              >
                <span>{related.icon}</span>
                <span>{related.title}</span>
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase details list */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Step Details</p>
        <div className="space-y-2">
          {phase.details.map((detail, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-300">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-300">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
