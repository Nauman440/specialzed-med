/**
 * URLs shared by static partials. Keep default in sync with web/src/config/urls.js
 * (Gatsby uses GATSBY_PATIENT_PORTAL_URL on Netlify).
 */
export const PATIENT_PORTAL_URL =
  typeof process !== "undefined" && process.env.GATSBY_PATIENT_PORTAL_URL
    ? process.env.GATSBY_PATIENT_PORTAL_URL
    : "https://sft.specialized-med-business.com/specMed/"
