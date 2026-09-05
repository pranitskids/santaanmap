import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import RapidIVFGuide from "./RapidIVFGuide";
import { readJourneyAttribution } from "../lib/attribution";

const sentVisits = new Set<string>();

function readCookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

export default function Guide() {
  const { token } = useParams();
  const attribution = useMemo(() => readJourneyAttribution(), []);

  useEffect(() => {
    if (!token || !/^[A-Za-z0-9]{5}$/.test(token)) {
      return;
    }

    const visitKey = `${attribution.journeyId}:${token}`;
    if (sentVisits.has(visitKey)) {
      return;
    }
    sentVisits.add(visitKey);

    const fbp = readCookie("_fbp");
    const fbc = readCookie("_fbc") || (
      attribution.fbclid
        ? `fb.1.${Date.now()}.${attribution.fbclid}`
        : undefined
    );

    void fetch("https://api.crmai.greybrain.ai/api/map/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        token,
        journey_id: attribution.journeyId,
        page_url: window.location.href,
        referrer: document.referrer || null,
        fbclid: attribution.fbclid ?? null,
        fbc: fbc ?? null,
        fbp: fbp ?? null,
        ctwa_clid: attribution.ctwaClid ?? null,
        gclid: attribution.gclid ?? null,
        gbraid: attribution.gbraid ?? null,
        wbraid: attribution.wbraid ?? null,
        utm_source: attribution.utmSource ?? null,
        utm_medium: attribution.utmMedium ?? null,
        utm_campaign: attribution.utmCampaign ?? null,
        utm_content: attribution.utmContent ?? null,
        utm_term: attribution.utmTerm ?? null,
        campaign_id: attribution.campaignId ?? null,
        adset_id: attribution.adsetId ?? null,
        ad_id: attribution.adId ?? null,
        language: navigator.language || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      }),
    }).catch((error) => {
      console.error("map visit failed", error);
    });
  }, [attribution, token]);

  return <RapidIVFGuide />;
}
