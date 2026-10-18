import { site } from "./site.config.mjs";
let consent = { analytics: false, marketing: false };
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("ms-consent-v1"));
  } catch {
    return null;
  }
}
function loadScript(id, src) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}
export function applyConsent(value, persist = true) {
  consent = {
    analytics: Boolean(value?.analytics),
    marketing: Boolean(value?.marketing),
  };
  if (persist) {
    try {
      localStorage.setItem(
        "ms-consent-v1",
        JSON.stringify({ ...consent, at: new Date().toISOString() }),
      );
    } catch {}
  }
  if (site.analytics.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window[`ga-disable-${site.analytics.ga4}`] = !consent.analytics;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (consent.analytics && !document.getElementById("ms-ga4")) {
      window.gtag("js", new Date());
      window.gtag("config", site.analytics.ga4, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      loadScript(
        "ms-ga4",
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.analytics.ga4)}`,
      );
      window.gtag("event", "page_view", {
        page_location: location.origin + "/",
        page_title: "Site institucional",
        page_referrer: "",
      });
    }
  }
  // Clarity remains disabled until an institutional-only route is approved.
  // Pixel and CAPI remain disabled: a generic label does not remove health context.
  // No patient data, procedure interest, form field, raw URL or WhatsApp text is sent.
  if (!consent.analytics)
    for (const name of document.cookie
      .split(";")
      .map((x) => x.trim().split("=")[0])) {
      if (name.startsWith("_ga")) {
        for (const domain of [location.hostname, "." + location.hostname])
          document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    }
}
export function track(name, detail = {}) {
  if (
    typeof window === "undefined" ||
    !consent.analytics ||
    typeof window.gtag !== "function"
  )
    return;
  const allowed = [
    "contact_click",
    "scroll_depth",
    "map_click",
    "instagram_click",
  ];
  if (!allowed.includes(name)) return;
  const payload = {};
  if (
    [
      "hero",
      "header",
      "procedure",
      "evaluation",
      "about",
      "proof",
      "location",
      "final",
      "sticky",
      "bio",
    ].includes(detail.position)
  )
    payload.position = detail.position;
  if ([25, 50, 75, 90].includes(detail.depth)) payload.depth = detail.depth;
  window.gtag("event", name, {
    ...payload,
    page_location: location.origin + "/",
    page_title: "Site institucional",
    page_referrer: "",
  });
}
