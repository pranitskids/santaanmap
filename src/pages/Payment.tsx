import { useMemo, useRef, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { locations, type LocationId } from "../data/journeyMap";
import { createPaymentOrder, getPaymentStatus } from "../lib/api";
import { readJourneyAttribution, trackMapEvent } from "../lib/attribution";

type PaymentState = "idle" | "creating" | "opening" | "verifying" | "cancelled" | "failed" | "timeout" | "success";
type RazorpayOptions = { key: string; amount: number; currency: string; name: string; description: string; order_id: string; handler: () => void; modal: { ondismiss: () => void } };
type RazorpayInstance = { open: () => void };

declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => RazorpayInstance; } }

let razorpayScript: Promise<void> | null = null;

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (!razorpayScript) {
    razorpayScript = new Promise((resolve, reject) => {
      const existing = document.getElementById("razorpay-checkout");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Razorpay could not be loaded.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay could not be loaded."));
      document.head.appendChild(script);
    });
  }
  return razorpayScript;
}

function normaliseIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) return `+${digits}`;
  return "";
}

function wait(milliseconds: number) { return new Promise((resolve) => window.setTimeout(resolve, milliseconds)); }

export default function Payment() {
  const attribution = useMemo(() => readJourneyAttribution(), []);
  const idempotencyKey = useRef(crypto.randomUUID());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<LocationId | "">("");
  const [state, setState] = useState<PaymentState>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  async function verify(paymentId: string) {
    setState("verifying");
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (attempt > 0) await wait(1500);
      try {
        const result = await getPaymentStatus(paymentId);
        if (result.payment.status === "paid") {
          setReference(result.payment.provider_payment_id ?? result.payment.id);
          setState("success");
          trackMapEvent("payment_verified", { channel: attribution.channel });
          return;
        }
        if (result.payment.status === "failed" || result.payment.status === "cancelled") {
          setState("failed");
          setMessage("The payment was not completed. You can try again.");
          return;
        }
      } catch {
        // A delayed webhook can still be observed by the next poll.
      }
    }
    setState("timeout");
    setMessage("Payment is still being verified. Please try again in a moment.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (["creating", "opening", "verifying", "success"].includes(state)) return;
    setMessage("");
    const cleanName = name.trim();
    const cleanPhone = normaliseIndianPhone(phone);
    if (!cleanName) return setMessage("Please enter your full name.");
    if (!cleanPhone) return setMessage("Please enter a valid Indian mobile number.");
    if (!location) return setMessage("Please choose a Santaan centre or location.");

    setState("creating");
    try {
      const order = await createPaymentOrder({
        name: cleanName,
        phone: cleanPhone,
        location,
        journey_id: attribution.journeyId,
        idempotency_key: idempotencyKey.current,
        attribution: {
          source: attribution.source,
          channel: attribution.channel,
          campaign_name: attribution.campaignName,
          campaign_id: attribution.campaignId,
          adset_id: attribution.adsetId,
          ad_id: attribution.adId,
          fbclid: attribution.fbclid,
          gclid: attribution.gclid,
          gbraid: attribution.gbraid,
          wbraid: attribution.wbraid,
          ctwa_clid: attribution.ctwaClid,
          utm_source: attribution.utmSource,
          utm_medium: attribution.utmMedium,
          utm_campaign: attribution.utmCampaign,
          utm_content: attribution.utmContent,
          utm_term: attribution.utmTerm,
        },
      });
      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay could not be loaded.");
      setState("opening");
      new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Santaan Fertility",
        description: "Prepaid Couple Fertility Screening",
        order_id: order.order_id,
        handler: () => void verify(order.payment_id),
        modal: { ondismiss: () => { setState("cancelled"); setMessage("Payment was cancelled. You can try again."); } },
      }).open();
      trackMapEvent("payment_checkout_opened", { channel: attribution.channel });
    } catch (error) {
      setState("failed");
      setMessage(error instanceof Error ? error.message : "Payment could not be started. You can try again.");
    }
  }

  const selectedLocation = locations.find((item) => item.id === location)?.label;
  const busy = ["creating", "opening", "verifying"].includes(state);

  if (state === "success") return <main className="min-h-[calc(100vh-9rem)] bg-[#f7f5ef] px-4 py-8 text-slate-900 sm:px-6"><section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-800">✓</span><h1 className="mt-5 text-2xl font-bold text-slate-950">Payment successful</h1><p className="mt-3 leading-6 text-slate-600">₹1,000 has been verified. Santaan will contact you with the next steps; this payment does not by itself confirm an appointment.</p><p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Reference: {reference}</p></section></main>;

  return <main className="min-h-[calc(100vh-9rem)] bg-[#f7f5ef] px-4 py-6 text-slate-900 sm:px-6 sm:py-10"><section className="mx-auto max-w-xl"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Santaan Fertility</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Prepaid Couple Fertility Screening</h1><p className="mt-2 text-2xl font-bold text-teal-800">₹1,000</p><p className="mt-2 leading-6 text-slate-600">Complete the details below to continue to secure hosted payment checkout.</p></div><form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Contact number</span><input required value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Centre or location</span><select required value={location} onChange={(event) => setLocation(event.target.value as LocationId)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"><option value="">Select a location</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-950"><p className="font-bold">Package summary</p><p className="mt-1">Prepaid Couple Fertility Screening · ₹1,000</p></div><label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"><input required type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500" /><span className="text-sm leading-6 text-slate-600">I acknowledge that Santaan may use these details for this payment request.</span></label>{message ? <p role="alert" className={`rounded-xl p-3 text-sm ${state === "cancelled" ? "border border-amber-200 bg-amber-50 text-amber-900" : "border border-red-200 bg-red-50 text-red-800"}`}>{message}</p> : null}<button type="submit" disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"><LockKeyhole className="h-5 w-5" aria-hidden="true" />{state === "creating" ? "Creating secure order…" : state === "opening" ? "Opening checkout…" : state === "verifying" ? "Verifying payment…" : "Pay ₹1,000"}</button><p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />No card, UPI, or bank details are collected by this page.</p></form>{selectedLocation ? <p className="mt-4 text-center text-xs text-slate-500">Selected location: {selectedLocation}</p> : null}</section></main>;
}
