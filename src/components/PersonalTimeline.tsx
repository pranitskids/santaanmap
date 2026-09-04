import { useState } from "react";
import { ivfSteps, patientPositions } from "../data/site";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin } from "lucide-react";

interface PersonalTimelineProps {
  selectedPositionId: string | null;
  completedPhaseIds: string[];
  currentPhaseId: string | null;
  onJumpToPhase: (phaseId: string) => void;
}

export default function PersonalTimeline({
  selectedPositionId,
  completedPhaseIds,
  currentPhaseId,
  onJumpToPhase,
}: PersonalTimelineProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 5;

  // Determine which phases are highlighted based on position
  const position = patientPositions.find((p) => p.id === selectedPositionId);
  const highlightedIds = position?.highlightedPhaseIds || [];

  // Determine the "you are here" phase
  const herePhase = currentPhaseId || (highlightedIds.length > 0 ? highlightedIds[0] : null);

  // Progress calculation
  const totalPhases = ivfSteps.length;
  const completedCount = completedPhaseIds.length;
  const progressPercent = Math.round((completedCount / totalPhases) * 100);

  const handleScroll = (dir: "left" | "right") => {
    if (dir === "left" && scrollIndex > 0) setScrollIndex(scrollIndex - 1);
    if (dir === "right" && scrollIndex < ivfSteps.length - visibleCount) setScrollIndex(scrollIndex + 1);
  };

  const visiblePhases = ivfSteps.slice(scrollIndex, scrollIndex + visibleCount);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-blue-300">Your Journey Progress</span>
          <span className="text-xs font-medium text-slate-400">{completedCount}/{totalPhases} phases completed</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 text-center text-[10px] text-slate-500">{progressPercent}% complete</div>
      </div>

      {/* Phase Name Indicator */}
      {herePhase && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2 border border-blue-400/20">
          <MapPin className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium text-blue-200">
            You Are Here:{" "}
            <span className="text-blue-100">{ivfSteps.find((s) => s.id === herePhase)?.title || herePhase}</span>
          </span>
        </div>
      )}

      {/* Horizontal Timeline */}
      <div className="relative">
        {/* Scroll buttons */}
        {scrollIndex > 0 && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 transition shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {scrollIndex < ivfSteps.length - visibleCount && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 transition shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex gap-2 overflow-hidden py-1">
          {visiblePhases.map((phase) => {
            const isCompleted = completedPhaseIds.includes(phase.id);
            const isHere = herePhase === phase.id;
            const isFuture = !isCompleted && !isHere;
            const isHighlighted = highlightedIds.includes(phase.id);

            return (
              <button
                key={phase.id}
                onClick={() => onJumpToPhase(phase.id)}
                className={`group flex flex-col items-center gap-1.5 transition-all duration-300 min-w-[80px] max-w-[90px] ${
                  isHere
                    ? "scale-105"
                    : isFuture
                    ? "opacity-50 hover:opacity-80"
                    : ""
                }`}
              >
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                    isHere
                      ? "border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/30"
                      : isCompleted
                      ? "border-green-500/60 bg-green-500/15"
                      : isHighlighted
                      ? "border-cyan-400/40 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 group-hover:border-white/30"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <span className="text-lg">{phase.icon}</span>
                  )}
                  {isHere && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white ring-2 ring-slate-950">
                      ●
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-medium leading-tight text-center ${
                    isHere ? "text-blue-200" : isCompleted ? "text-green-300" : "text-slate-400"
                  }`}
                >
                  {phase.title.length > 12 ? phase.title.slice(0, 12) + "..." : phase.title}
                </span>
                {isHere && (
                  <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">You are here</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
