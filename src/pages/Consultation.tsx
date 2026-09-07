import { useMemo, useRef, useState } from "react";
import { CalendarDays, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { locations, type LocationId } from "../data/journeyMap";
import { requestJourneyHandoff } from "../lib/api";
import { readJourneyAttribution, trackMapEvent } from "../lib/attribution";

function localDate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function normaliseIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) {
    return `+${digits}`;
  }
  return "";
}

export default function Consultation() {
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const submissionId = useRef(crypto.randomUUID());
  const today = useMemo(localDate, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<LocationId | "">("");
  const [date, setDate] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || success) return;

    const cleanName = name.trim();
    const cleanPhone = normaliseIndianPhone(phone);
    if (!cleanName) return setError("Please enter your full name.");
    if (!cleanPhone) return setError("Please enter a valid Indian mobile number.");
    if (!location) return setError("Please choose a Santaan centre or location.");
    if (!date || date < today) return setError("Please choose today or a future date.");
    if (!consent) return setError("Please confirm that Santaan may contact you about this request.");

    setSubmitting(true);
    setError("");
    const result = await requestJourneyHandoff({
      submissionId: submissionId.current,
      journeyId: attribution.journeyId,
      action: "consultation",
      name: cleanName,
      phone: cleanPhone,
      consent: true,
      language: "English",
      position: "wondering",
      concerns: [],
      helpRequested: "consultation",
      location,
      preferredWindow: date,
      topic: "first-consultation",
      attribution,
    });
    setSubmitting(false);

    if (!result.ok || !result.accepted) {
      setError(result.error ?? "We could not save your request. Please try again.");
      return;
    }

    setSuccess(true);
    trackMapEvent("consultation_request_submitted", { channel: attribution.channel });
  }

  const selectedLocation = locations.find((item) => item.id === location)?.label;

  if (success) {
    return (
      <main className="min-h-[calc(100vh-9rem)] bg-[#f7f5ef] px-4 py-8 text-slate-900 sm:px-6">
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-800">
            <Check className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Consultation request received</h1>
          <p className="mt-3 leading-6 text-slate-600">
            Santaan will review your request and contact you about availability. This is a request, not a confirmed appointment.
          </p>
          <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            {selectedLocation} · {date}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-9rem)] bg-[#f7f5ef] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Santaan Fertility</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Book a consultation</h1>
          <p className="mt-2 leading-6 text-slate-600">Choose a practical location and preferred date. The care team will confirm availability with you.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
            <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Contact number</span>
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Centre or location</span>
            <select required value={location} onChange={(event) => setLocation(event.target.value as LocationId)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100">
              <option value="">Select a location</option>
              {locations.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Preferred consultation date</span>
            <span className="relative block">
              <input required type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" />
              <CalendarDays className="pointer-events-none absolute right-4 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
            <input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500" />
            <span className="text-sm leading-6 text-slate-600">I agree that Santaan may contact me regarding this consultation request.</span>
          </label>

          {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
          <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60">
            {submitting ? <><LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending request…</> : "Book Consultation"}
          </button>
          <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />Please do not include medical details in this form.</p>
        </form>
      </section>
    </main>
  );
}
