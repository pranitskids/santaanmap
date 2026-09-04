import { useState } from "react";
import { EmotionalCheckIn, emotionalResources } from "../data/site";
import { Heart, Brain } from "lucide-react";

interface EmotionalCheckInPanelProps {
  checkIns: EmotionalCheckIn[];
  onAddCheckIn: (checkIn: EmotionalCheckIn) => void;
}

const moodOptions: { value: EmotionalCheckIn["mood"]; label: string; emoji: string; color: string }[] = [
  { value: "calm", label: "Calm", emoji: "😊", color: "text-green-400 border-green-500/30 bg-green-500/10" },
  { value: "hopeful", label: "Hopeful", emoji: "🌟", color: "text-blue-300 border-blue-400/30 bg-blue-500/10" },
  { value: "anxious", label: "Anxious", emoji: "😟", color: "text-amber-300 border-amber-400/30 bg-amber-500/10" },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "😔", color: "text-red-300 border-red-400/30 bg-red-500/10" },
  { value: "sad", label: "Sad", emoji: "😢", color: "text-purple-300 border-purple-400/30 bg-purple-500/10" },
];

export default function EmotionalCheckInPanel({ checkIns, onAddCheckIn }: EmotionalCheckInPanelProps) {
  const [selectedMood, setSelectedMood] = useState<EmotionalCheckIn["mood"] | null>(null);
  const [note, setNote] = useState("");
  const [showResources, setShowResources] = useState(false);
  const [saved, setSaved] = useState(false);

  const todayCheckIn = checkIns.find(
    (c) => new Date(c.date).toDateString() === new Date().toDateString()
  );

  const handleSave = () => {
    if (!selectedMood) return;
    const checkIn: EmotionalCheckIn = {
      mood: selectedMood,
      date: new Date().toISOString(),
      note: note.trim(),
    };
    onAddCheckIn(checkIn);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const latestMood = todayCheckIn?.mood || (checkIns.length > 0 ? checkIns[checkIns.length - 1].mood : null);
  const resources = latestMood ? emotionalResources[latestMood] || [] : [];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-4 w-4 text-pink-400" />
        <h3 className="text-sm font-semibold text-white">Emotional Check-In</h3>
      </div>

      {todayCheckIn ? (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 mb-3">
          <p className="text-xs text-green-300">
            Checked in today: {moodOptions.find((m) => m.value === todayCheckIn.mood)?.emoji}{" "}
            {moodOptions.find((m) => m.value === todayCheckIn.mood)?.label}
          </p>
          {todayCheckIn.note && (
            <p className="mt-1 text-[11px] text-slate-400 italic">"{todayCheckIn.note}"</p>
          )}
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-slate-400">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedMood === mood.value
                    ? mood.color + " ring-1 ring-white/20"
                    : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                <span>{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>

          {selectedMood && (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)..."
                className="mb-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-blue-400/40"
                rows={2}
              />
              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-2 text-xs font-medium text-white transition hover:shadow-lg hover:shadow-blue-500/20"
              >
                {saved ? "Saved ✓" : "Save Check-In"}
              </button>
            </>
          )}
        </>
      )}

      {/* Resources based on mood */}
      {resources.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowResources(!showResources)}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-300 transition mb-2"
          >
            <Brain className="h-3.5 w-3.5" />
            Suggested resources for you
            <span className="text-[10px] text-slate-500">({resources.length})</span>
          </button>
          {showResources && (
            <div className="space-y-2">
              {resources.map((res, i) => (
                <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
                  <p className="text-xs font-medium text-slate-200">{res.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{res.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {checkIns.length > 1 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Recent check-ins</p>
          <div className="flex gap-1.5">
            {checkIns.slice(-5).map((c, i) => {
              const m = moodOptions.find((m) => m.value === c.mood);
              return (
                <div key={i} className="flex flex-col items-center gap-0.5" title={c.date}>
                  <span className="text-base">{m?.emoji}</span>
                  <span className="text-[8px] text-slate-500">
                    {new Date(c.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
