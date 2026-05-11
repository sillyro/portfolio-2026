/**
 * TanStack Start resolves `/work/:slug` via `src/routes/work.$slug.tsx` (file-based router).
 * This file mirrors the familiar Next.js App Router path: use it as a stable import target
 * for the case study template (`CaseStudyPage`) if you split routes later.
 */
export { CaseStudyPage as default, type CaseStudy } from "@/components/work/CaseStudyPage";
