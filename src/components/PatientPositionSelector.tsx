import { useState } from "react";
import { patientPositions, PatientPosition } from "../data/site";
import { ChevronDown, MapPin } from "lucide-react";

interface PatientPositionSelectorProps {
  onSelectPosition: (position: PatientPosition | null) => void;
  selectedPosition: PatientPosition | null;
}

export default function PatientPositionSelector({ onSelectPosition, selectedPosition }: PatientPositionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-300">Where are you in your journey?</p>
              <p className="text-sm font-medium text-white">
                {selectedPosition ? selectedPosition.label : "Select your current stage"}
              </p>
              {selectedPosition && (
                <p className="mt-0.5 text-xs text-slate-400">{selectedPosition.description}</p>
              )}
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-2 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden">
            {patientPositions.map((pos) => {
              const isSelected = selectedPosition?.id === pos.id;
              return (
                <button
                  key={pos.id}
                  onClick={() => {
                    onSelectPosition(pos);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                    isSelected
                      ? "bg-blue-500/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{pos.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isSelected ? "text-blue-300" : "text-white"}`}>
                      {pos.label}
                    </p>
                    <p className="text-xs text-slate-500">{pos.description}</p>
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}