import type {
  ConcernId,
  HelpId,
  JourneyPositionId,
  LocationId,
} from "../data/journeyMap";
import type { JourneyAttribution } from "./attribution";
import { env } from "./env";

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export interface CrmSignalPayload {
  event: string;
  source: string;
  topicId: string;
  awarenessStage?: string;
  patientStage?: string;
  campaignId?: string;
  qrId?: string;
  mode?: string;
  phone?: string;
  consent?: boolean;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export interface ResourceDeliveryPayload {
  phone: string;
  topicId: string;
  source: string;
  awarenessStage: string;
  patientStage: string;
  campaignId?: string;
  qrId?: string;
  patientName?: string;
  consent: boolean;
  resourceLabel: string;
  summary?: string;
}

export interface ApiMutationResult {
  ok: boolean;
  queued: false;
  deliveredTo?: string;
  error?: string;
}

export interface JourneyLeadPayload {
  submissionId: string;
  journeyId: string;
  action: "whatsapp" | "callback" | "consultation" | "existing-patient";
  name: string;
  phone: string;
  consent: boolean;
  language: "English" | "Odia";
  position: JourneyPositionId;
  concerns: ConcernId[];
  helpRequested: HelpId;
  location: LocationId;
  preferredWindow?: string;
  satisfaction?: "clearer" | "somewhat" | "needs-help";
  question?: string;
  topic: string;
  profileSummary?: string;
  profileEvidence?: {
    ageBand?: string;
    exploringFor?: string;
    attempt?: string;
    treatment?: string;
    experience: string[];
    currentStage?: string;
    exploredSignals: string[];
    exploredCards: string[];
  };
  attribution: JourneyAttribution;
}

export interface JourneyHandoffResult {
  ok: boolean;
  accepted: boolean;
  duplicate: boolean;
  leadId?: string;
  journeyRef?: string;
  message?: string;
  error?: string;
}

export interface PaymentOrderRequest {
  name: string;
  phone: string;
  location: LocationId;
  journey_id: string;
  idempotency_key: string;
  attribution: Record<string, unknown>;
}

export interface PaymentOrderResponse {
  accepted: boolean;
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface PaymentStatusResponse {
  accepted: boolean;
  payment: {
    id: string;
    amount_minor: number;
    currency: string;
    status: "created" | "paid" | "failed" | "cancelled";
    provider_payment_id: string | null;
  };
}

async function postJson<TPayload, TResponse>(path: string, payload: TPayload) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => ({}))) as TResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(result.error || `Request failed: ${response.status}`);
  }

  return result;
}

export async function captureCrmSignal(
  payload: CrmSignalPayload,
): Promise<ApiMutationResult> {
  try {
    await postJson("/map/intent", payload);
    return { ok: true, queued: false };
  } catch (error) {
    return {
      ok: false,
      queued: false,
      error: error instanceof Error ? error.message : "Intent could not be recorded.",
    };
  }
}

export async function requestWhatsAppGuide(
  payload: ResourceDeliveryPayload,
): Promise<ApiMutationResult> {
  try {
    await postJson("/map/intake", {
      submissionId: crypto.randomUUID(),
      journeyId: crypto.randomUUID(),
      action: "whatsapp",
      name: payload.patientName ?? "",
      phone: payload.phone,
      consent: payload.consent,
      language: "English",
      position: payload.patientStage,
      concerns: [],
      helpRequested: "simple-explanation",
      location: "not-sure",
      topic: payload.topicId,
      summary: payload.summary,
      source: payload.source,
      campaignId: payload.campaignId,
      qrId: payload.qrId,
    });
    return {
      ok: true,
      queued: false,
      deliveredTo: payload.phone,
    };
  } catch (error) {
    return {
      ok: false,
      queued: false,
      error: error instanceof Error ? error.message : "Guide request failed.",
    };
  }
}

export async function requestJourneyHandoff(
  payload: JourneyLeadPayload,
): Promise<JourneyHandoffResult> {
  try {
    const result = await postJson<
      JourneyLeadPayload,
      {
        success?: boolean;
        accepted?: boolean;
        duplicate?: boolean;
        leadId?: string;
        journeyRef?: string;
        message?: string;
      }
    >("/map/intake", payload);

    return {
      ok: result.success === true || result.accepted === true,
      accepted: result.accepted === true || result.success === true,
      duplicate: result.duplicate === true,
      leadId: result.leadId,
      journeyRef: result.journeyRef,
      message: result.message,
    };
  } catch (error) {
    return {
      ok: false,
      accepted: false,
      duplicate: false,
      error:
        error instanceof Error
          ? error.message
          : "Santaan could not save this request yet.",
    };
  }
}

export async function createPaymentOrder(payload: PaymentOrderRequest) {
  return postJson<PaymentOrderRequest, PaymentOrderResponse>("/payment/orders", payload);
}

export async function getPaymentStatus(paymentId: string) {
  const response = await fetch(`${env.apiBaseUrl}/payment/orders/${encodeURIComponent(paymentId)}`, {
    headers: { Accept: "application/json" },
  });
  const result = (await response.json().catch(() => ({}))) as PaymentStatusResponse & { error?: string };
  if (!response.ok) throw new Error(result.error || `Request failed: ${response.status}`);
  return result;
}

export function buildWhatsAppLink(message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${env.whatsappNumber}?text=${encodedMessage}`;
}
