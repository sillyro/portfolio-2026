/** Canonical origin for absolute URLs (Open Graph, canonicals). No trailing slash. */
export const SITE_ORIGIN =
  typeof import.meta.env.VITE_SITE_ORIGIN === "string" && import.meta.env.VITE_SITE_ORIGIN.trim()
    ? import.meta.env.VITE_SITE_ORIGIN.trim().replace(/\/$/, "")
    : "https://rohanmisra.studio";

/** Default social preview when a page does not set its own `og:image`. */
export const SITE_DEFAULT_OG_IMAGE_PATH = "/images/projects/mintstars/cover.png";

export function absoluteUrl(pathOrUrl: string): string {
  const t = pathOrUrl.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("//")) return `https:${t}`;
  const path = t.startsWith("/") ? t : `/${t}`;
  return `${SITE_ORIGIN}${path}`;
}
