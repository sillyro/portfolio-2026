import type { Project } from "content-collections";

export const CATEGORY_ORDER = ["product", "branding", "side-quest"] as const;
export type ProjectCategory = (typeof CATEGORY_ORDER)[number];

export function normalizeCategory(category: string): ProjectCategory {
  return (CATEGORY_ORDER as readonly string[]).includes(category)
    ? (category as ProjectCategory)
    : "side-quest";
}

/** Category block first, then ascending `order`, then title. */
export function sortProjectsByCategoryAndOrder(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ca = normalizeCategory(a.category);
    const cb = normalizeCategory(b.category);
    const ia = CATEGORY_ORDER.indexOf(ca);
    const ib = CATEGORY_ORDER.indexOf(cb);
    if (ia !== ib) return ia - ib;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function categoryPrefix(cat: ProjectCategory): "P" | "B" | "S" {
  if (cat === "product") return "P";
  if (cat === "branding") return "B";
  return "S";
}

export function formatProjectCode(p: Project): string {
  const letter = categoryPrefix(normalizeCategory(p.category));
  return `${letter}.${String(p.order).padStart(2, "0")}`;
}
