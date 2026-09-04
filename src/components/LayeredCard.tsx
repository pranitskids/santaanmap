import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Clock, Heart } from "lucide-react";

interface LayeredCardProps {
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  details: string[];
  duration: string;
  emotionalTip: string;
  index: number;
  totalSteps: number;
}

export function LayeredCard({
  title,
  subtitle,
  icon,
  summary,
  details,
  duration,
  emotionalTip,
  index,
  totalSteps,
}: LayeredCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-3xl border transition-all duration-500 ease-out
        ${isOpen
          ? "border-blue-400/40 bg-gradient-to-br from-blue-950/60 to-slate-900/80 shadow-2xl shadow-blue-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
        }
        ${isAnimating ? "scale-[1.02]" : "scale-100"}
      `}
    >
      {/* Layer indicator — iPhone-style stack dots */}
      <div className="absolute -top-3 left-6 flex items-center gap-1.5">
        {Array.from({ length: Math.min(details.length, 5) }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              isOpen
                ? "bg-blue-400 opacity-100"
                : "bg-white/20 opacity-60 group-hover:opacity-80"
            }`}
          />
        ))}
        {details.length > 5 && (
          <span className="ml-1 text-[10px] text-blue-400/60">+{details.length - 5}</span>
        )}
      </div>

      {/* Main clickable header */}
      <button
        onClick={toggleOpen}
        className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-3xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-blue-300/80">
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                Step {index + 1} of {totalSteps}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {duration}
              </span>
            </div>
            <h3 className="mt-1.5 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{summary}</p>
          </div>
          <div className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-blue-400/50 bg-blue-500/20"
              : "border-white/10 bg-white/5"
          }`}>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-blue-300" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable content — layered iPhone-style reveal */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/5 px-6 pb-6">
          <div className="mt-4 space-y-2">
            {details.map((detail, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-300">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-300">{detail}</p>
              </div>
            ))}
          </div>

          {/* Emotional tip — iPhone-style highlight */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/5 p-4">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-pink-400/80">
                Emotional Tip
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-200">{emotionalTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}