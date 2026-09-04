import { useState } from "react";
import { MedicalHistory } from "../data/site";
import { Save, User, ClipboardList } from "lucide-react";

interface MedicalHistoryFormProps {
  history: MedicalHistory;
  onSave: (history: MedicalHistory) => void;
}

export default function MedicalHistoryForm({ history, onSave }: MedicalHistoryFormProps) {
  const [form, setForm] = useState<MedicalHistory>(history);

  const fields: { key: keyof MedicalHistory; label: string; placeholder: string; type: string }[] = [
    { key: "age", label: "Age", placeholder: "e.g. 32", type: "text" },
    { key: "bmi", label: "BMI (if known)", placeholder: "e.g. 24.5", type: "text" },
    { key: "infertilityDuration", label: "Duration of Infertility", placeholder: "e.g. 2 years", type: "text" },
    { key: "previousTreatments", label: "Previous Treatments", placeholder: "e.g. IUI × 2 cycles", type: "text" },
    { key: "medicalConditions", label: "Medical Conditions", placeholder: "e.g. PCOS, endometriosis, thyroid", type: "text" },
    { key: "medications", label: "Current Medications", placeholder: "e.g. Metformin, folic acid", type: "text" },
    { key: "priorSurgeries", label: "Prior Surgeries", placeholder: "e.g. Laparoscopy, fibroid removal", type: "text" },
    { key: "priorIVFAttempts", label: "Prior IVF Attempts", placeholder: "e.g. 1 fresh cycle, 0 FET", type: "text" },
  ];

  const handleChange = (key: keyof MedicalHistory, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ ...form, createdAt: new Date().toISOString() });
  };

  const hasData = Object.entries(form).some(([key, val]) => key !== "createdAt" && val);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">My Medical Profile</h3>
      </div>

      {!hasData ? (
        <p className="mb-3 text-xs text-slate-400">
          Enter your details to personalize your journey timeline and get tailored guidance.
        </p>
      ) : null}

      <div className="space-y-2.5">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-[11px] font-medium text-slate-400">{field.label}</label>
            <input
              type={field.type}
              value={form[field.key] as string}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 text-xs font-medium text-white transition hover:shadow-lg hover:shadow-blue-500/20"
      >
        <Save className="h-3.5 w-3.5" />
        Save My Profile
      </button>

      {hasData && (
        <div className="mt-4 rounded-xl border border-blue-400/20 bg-blue-500/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <User className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-200">Profile Summary</span>
          </div>
          <div className="space-y-1">
            {fields
              .filter((f) => form[f.key])
              .map((f) => (
                <div key={f.key} className="flex items-start gap-2">
                  <span className="text-[10px] font-medium text-slate-500 min-w-[80px]">{f.label}:</span>
                  <span className="text-[11px] text-slate-300">{form[f.key]}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
