/**
 * Bandcamp case study “before” frames live in `src/assets/projects/bandcamp-redesign/*.png`.
 * Vite emits hashed URLs so images load in TanStack Start dev (where `/images/...` from `public/`
 * alone can 404). MDX may still use `/images/projects/bandcamp-redesign/<file>.png` — we match by basename.
 */
const bandcampImages = import.meta.glob<string>("../assets/projects/bandcamp-redesign/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const byFileName: Record<string, string> = {};
for (const [fullPath, url] of Object.entries(bandcampImages)) {
  const base = fullPath.split("/").pop();
  if (base) byFileName[base] = url;
}

export function resolveBandcampRedesignImage(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const normalized = ref.trim();
  const base = normalized.split("/").pop()?.split("?")[0];
  if (!base) return undefined;
  return byFileName[base];
}
