const JOURNEY_ID_KEY = "santaan_map_journey_id";

export interface JourneyAttribution {
  journeyId: string;
  source: string;
  channel: string;
  embed: boolean;
  contentUrn?: string;
  campaignId?: string;
  campaignName?: string;
  adsetId?: string;
  adsetName?: string;
  adId?: string;
  adName?: string;
  placement?: string;
  fbclid?: string;
  ctwaClid?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage: string;
  referrer?: string;
}

function clean(value: string | null, max = 500) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function createJourneyId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `map-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function journeyId() {
  if (typeof window === "undefined") {
    return createJourneyId();
  }

  const existing = window.localStorage.getItem(JOURNEY_ID_KEY);
  if (existing) {
    return existing;
  }

  const generated = createJourneyId();
  window.localStorage.setItem(JOURNEY_ID_KEY, generated);
  return generated;
}

const PATH_EVENT_MAP: Record<string, string | undefined> = {
  path_opened: "path_opened",
  path_stage_viewed: "stage_viewed",
  path_section_read: "stage_engaged",
  path_topic_opened: "question_viewed",
  path_whatsapp_requested: "whatsapp_requested",
  path_callback_requested: "callback_requested",
};

function recordPathEngagement(
  event: string,
  detail: Record<string, string | number | boolean | undefined>,
) {
  const eventType = PATH_EVENT_MAP[event];
  if (!eventType) return;
  const attribution = readJourneyAttribution();
  const stage = typeof detail.stage === "string" ? detail.stage : undefined;
  const section = typeof detail.section === "string" ? detail.section : undefined;
  const topic = typeof detail.topic === "string" ? detail.topic : undefined;
  const contentPart = section ?? topic ?? stage;

  void fetch("https://api.crmai.greybrain.ai/api/path/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      event_id: `path:${createJourneyId()}`,
      journey_id: attribution.journeyId,
      event_type: eventType,
      stage_id: stage,
      content_urn: contentPart ? `urn:santaan:path:${contentPart}` : attribution.contentUrn,
      source: attribution.source,
      channel: attribution.channel,
      campaign_id: attribution.campaignId,
      adset_id: attribution.adsetId,
      ad_id: attribution.adId,
      occurred_at: new Date().toISOString(),
    }),
  }).catch(() => {
    // Engagement telemetry must never interrupt the educational experience.
  });
}

export function readJourneyAttribution(): JourneyAttribution {
  if (typeof window === "undefined") {
    return {
      journeyId: createJourneyId(),
      source: "direct",
      channel: "website",
      embed: false,
      landingPage: "https://map.santaan.in/",
    };
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const utmSource = clean(params.get("utm_source"), 120);
  const explicitSource = clean(params.get("source"), 120);
  const channel = clean(params.get("channel"), 80) ?? "website";

  return {
    journeyId: journeyId(),
    source: explicitSource ?? utmSource ?? "direct",
    channel,
    embed: params.get("embed") === "1" || params.get("embed") === "true",
    contentUrn: clean(params.get("content_urn"), 180),
    campaignId: clean(params.get("campaign_id"), 120),
    campaignName: clean(params.get("campaign_name"), 250),
    adsetId: clean(params.get("adset_id"), 120),
    adsetName: clean(params.get("adset_name"), 250),
    adId: clean(params.get("ad_id"), 120),
    adName: clean(params.get("ad_name"), 250),
    placement: clean(params.get("placement"), 120),
    fbclid: clean(params.get("fbclid"), 250),
    ctwaClid: clean(params.get("ctwa_clid"), 250),
    gclid: clean(params.get("gclid"), 250),
    gbraid: clean(params.get("gbraid"), 250),
    wbraid: clean(params.get("wbraid"), 250),
    utmSource,
    utmMedium: clean(params.get("utm_medium"), 120),
    utmCampaign: clean(params.get("utm_campaign"), 180),
    utmContent: clean(params.get("utm_content"), 180),
    utmTerm: clean(params.get("utm_term"), 180),
    landingPage: url.toString(),
    referrer: clean(document.referrer, 1000),
  };
}

export function isEmbedMode() {
  if (typeof window === "undefined") {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("embed") === "1" || params.get("embed") === "true";
}

export function trackMapEvent(
  event: string,
  detail: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const safeDetail = Object.fromEntries(
    Object.entries(detail).filter(([, value]) => value !== undefined),
  );
  const dataLayerWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  dataLayerWindow.dataLayer = dataLayerWindow.dataLayer ?? [];
  dataLayerWindow.dataLayer.push({
    event,
    map_event: event,
    map_journey_id: journeyId(),
    ...safeDetail,
  });
  recordPathEngagement(event, safeDetail);

  if (window.parent !== window) {
    let parentOrigin: string | null = null;
    try {
      const referrer = new URL(document.referrer);
      if (["santaan.in", "www.santaan.in"].includes(referrer.hostname)) {
        parentOrigin = referrer.origin;
      }
    } catch {
      parentOrigin = null;
    }
    if (!parentOrigin) {
      return;
    }
    window.parent.postMessage(
      {
        type: "santaan-map-event",
        event,
        detail: safeDetail,
      },
      parentOrigin,
    );
  }
}

export function postEmbedHeight(height: number) {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }

  let parentOrigin: string | null = null;
  try {
    const referrer = new URL(document.referrer);
    if (["santaan.in", "www.santaan.in"].includes(referrer.hostname)) {
      parentOrigin = referrer.origin;
    }
  } catch {
    parentOrigin = null;
  }

  if (parentOrigin) {
    window.parent.postMessage(
      {
        type: "santaan-map-resize",
        height: Math.max(560, Math.ceil(height)),
      },
      parentOrigin,
    );
  }
}
