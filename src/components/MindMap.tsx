import { useState } from "react";
import { ivfSteps, StepPhase } from "../data/site";
import { Sparkles, Heart, Stethoscope, Dna, Eye, Flower2, Baby, Clock, CheckCircle } from "lucide-react";

interface MindMapProps {
  onSelectPhase: (phase: StepPhase) => void;
  highlightedPhaseIds?: string[];
  selectedPhaseId?: string | null;
  completedPhaseIds?: string[];
  currentPhaseId?: string | null;
}

const phaseIcons: Record<string, React.ReactNode> = {
  "initial-consultation": <Stethoscope className="h-5 w-5" />,
  "ovarian-stimulation": <Dna className="h-5 w-5" />,
  "egg-retrieval": <Eye className="h-5 w-5" />,
  fertilization: <Sparkles className="h-5 w-5" />,
  "embryo-culture": <Flower2 className="h-5 w-5" />,
  "pgt-testing": <Dna className="h-5 w-5" />,
  "embryo-transfer": <Baby className="h-5 w-5" />,
  "two-week-wait": <Clock className="h-5 w-5" />,
  "post-procedure": <Heart className="h-5 w-5" />,
};

export default function MindMap({ onSelectPhase, highlightedPhaseIds, selectedPhaseId, completedPhaseIds = [], currentPhaseId }: MindMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "diagnostic" | "procedure" | "care">("all");

  const filtered = activeTab === "all"
    ? ivfSteps
    : ivfSteps.filter((s) => s.phaseType === activeTab);

  const getPhaseTypeLabel = (type: string) => {
    switch (type) {
      case "diagnostic": return "Diagnostic";
      case "procedure": return "Procedure";
      case "care": return "Care & Support";
      default: return type;
    }
  };

  // Radial layout calculation
  const centerX = 50;
  const centerY = 50;
  const radius = 38;

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all" as const, label: "All Phases" },
          { id: "diagnostic" as const, label: "Diagnostic" },
          { id: "procedure" as const, label: "Procedures" },
          { id: "care" as const, label: "Care & Support" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Radial Mind Map */}
      <div className="relative mx-auto w-full max-w-3xl">
        {/* SVG connecting lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Connections from center to each node */}
          {filtered.map((_, i) => {
            const angle = (i / filtered.length) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(59, 130, 246, 0.15)"
                strokeWidth="0.3"
                className="transition-all duration-500"
              />
            );
          })}
          {/* Center glow circle */}
          <circle cx={centerX} cy={centerY} r="4" fill="rgba(59, 130, 246, 0.15)" />
          <circle cx={centerX} cy={centerY} r="2.5" fill="rgba(59, 130, 246, 0.3)" />
          <circle cx={centerX} cy={centerY} r="1.2" fill="#3b82f6" />
        </svg>

        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <p className="mt-1 text-center text-[10px] font-medium text-blue-300">Your Journey</p>
        </div>

        {/* Radial nodes */}
        <div className="relative" style={{ height: "500px" }}>
          {filtered.map((step, i) => {
            const angle = (i / filtered.length) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const isHighlighted = highlightedPhaseIds?.includes(step.id);
            const isSelected = selectedPhaseId === step.id;
            const isHovered = hoveredId === step.id;
            const isCompleted = completedPhaseIds.includes(step.id);
            const isCurrentPhase = currentPhaseId === step.id;
            const isFuturePhase = !isCompleted && !isCurrentPhase && !isHighlighted;

            // Convert percentage to pixel position
            const left = `${x}%`;
            const top = `${y}%`;

            return (
              <button
                key={step.id}
                onClick={() => onSelectPhase(step)}
                onMouseEnter={() => setHoveredId(step.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left, top }}
              >
                <div
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isHovered || isSelected ? "scale-110" : "scale-100"
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20"
                        : isCurrentPhase
                        ? "border-blue-400/80 bg-blue-500/20 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/30"
                        : isCompleted
                        ? "border-green-500/60 bg-green-500/15"
                        : isHighlighted
                        ? "border-cyan-400/60 bg-cyan-500/15 shadow-md shadow-cyan-500/10"
                        : isHovered
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-white/5"
                    } ${isFuturePhase ? "opacity-50" : ""}`}
                  >
                    <span className={`transition-all duration-300 ${
                      isSelected ? "text-blue-300" : isCurrentPhase ? "text-blue-200" : isCompleted ? "text-green-300" : isHighlighted ? "text-cyan-300" : "text-slate-300"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        phaseIcons[step.id] || <span className="text-lg">{step.icon}</span>
                      )}
                    </span>
                  </div>
                  <span className={`mt-1.5 text-center text-[10px] font-medium leading-tight transition-all duration-300 ${
                    isSelected ? "text-blue-300" : isCurrentPhase ? "text-blue-200" : isCompleted ? "text-green-300" : isHighlighted ? "text-cyan-300" : "text-slate-400"
                  } ${isFuturePhase ? "opacity-50" : ""}`}>
                    {step.title.length > 15 ? step.title.slice(0, 14) + "…" : step.title}
                  </span>
                  {isCurrentPhase && (
                    <span className="mt-0.5 rounded-full bg-blue-500/20 px-2 py-0.5 text-[7px] font-bold text-blue-300 uppercase tracking-wider">You Are Here</span>
                  )}
                  {isCompleted && (
                    <span className="mt-0.5 text-[7px] font-medium text-green-400">✓ Completed</span>
                  )}
                  <span className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-medium ${
                    step.phaseType === "diagnostic" ? "bg-blue-500/10 text-blue-300" :
                    step.phaseType === "procedure" ? "bg-purple-500/10 text-purple-300" :
                    "bg-amber-500/10 text-amber-300"
                  }`}>
                    {getPhaseTypeLabel(step.phaseType)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500/50" />
            <span>Diagnostic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500/50" />
            <span>Procedure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
            <span>Care & Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
