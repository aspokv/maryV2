import { site } from "./site.config.mjs";
const sources = new Set(["instagram", "google", "direct", "site"]);
const media = new Set([
  "bio",
  "story",
  "highlight",
  "paid_social",
  "organic",
  "referral",
  "cpc",
]);
export function attribution(search = "") {
  const q = new URLSearchParams(search);
  return {
    source: sources.has(q.get("utm_source")) ? q.get("utm_source") : "site",
    medium: media.has(q.get("utm_medium")) ? q.get("utm_medium") : "organic",
    content: /^(bio|story|highlight|ad|maps|profile|cta)[-_a-z0-9]{0,40}$/.test(
      q.get("utm_content") || "",
    )
      ? q.get("utm_content")
      : "",
  };
}
export function whatsappHref({
  label = "minha avaliação",
  position = "hero",
  search = "",
} = {}) {
  const a = attribution(search);
  const message = `Olá, Mariana! Vim pelo site e quero conversar sobre ${label}. Como funciona a avaliação?\nOrigem: ${a.source}/${a.medium}${a.content ? "/" + a.content : ""} · ${position}`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
export function mapHref() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.street}, ${site.suite}, ${site.neighborhood}, ${site.city}, ${site.region}`)}`;
}
export function canRelease(config = site) {
  return Boolean(
    config.registration &&
      config.companyRegistration &&
      config.qualification &&
      config.hours &&
      config.domain &&
      config.privacyContact &&
      config.portraitApproved &&
      config.businessDataApproved &&
      config.clinicalCopyApproved &&
      config.legalScopeApproved &&
      config.privacyApproved,
  );
}
export function schema(origin) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": `${origin}/#clinic`,
        name: site.name,
        url: origin,
        telephone: `+${site.whatsapp}`,
        image: `${origin}${site.portrait}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.street}, ${site.suite}`,
          addressLocality: site.city,
          addressRegion: site.region,
          postalCode: site.postcode,
          addressCountry: "BR",
        },
        sameAs: [site.instagram],
      },
      {
        "@type": "Person",
        "@id": `${origin}/#professional`,
        name: "Mariana Strey",
        jobTitle: site.profession,
        worksFor: { "@id": `${origin}/#clinic` },
        sameAs: [site.instagram],
        ...(site.registration ? { identifier: site.registration } : {}),
      },
    ],
  };
}
