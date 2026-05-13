import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import type { Project } from "content-collections";
import { CaseStudyPage, type CaseStudy, type Spec } from "@/components/work/CaseStudyPage";
import { resolveBandcampRedesignImage } from "@/lib/bandcampRedesignAssets";
import { resolveProjectMedia } from "@/lib/projectMedia";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site";

function resolveCaseStudyImage(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const bandcamp = resolveBandcampRedesignImage(ref);
  if (bandcamp) return bandcamp;
  return resolveProjectMedia(ref);
}

function normalizeLabel(l: string) {
  return l.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Drop legacy rows, merge duplicate `Category` extras into a single line. */
function normalizeExtraSpecs(raw: Project["extraSpecs"]): Spec[] {
  const list = raw ?? [];
  const categoryValues: string[] = [];
  const out: Spec[] = [];

  for (const e of list) {
    const nl = normalizeLabel(e.label);
    if (nl === "ux portfolio" || nl === "draft") continue;
    if (nl === "category") {
      const v = e.value.trim();
      if (v) categoryValues.push(v);
      continue;
    }
    out.push({ label: e.label, value: e.value });
  }

  if (categoryValues.length > 0) {
    out.push({ label: "Category", value: categoryValues.join(" · ") });
  }

  return out;
}

function projectToCaseStudy(p: Project): CaseStudy {
  const extraSpecs = normalizeExtraSpecs(p.extraSpecs);

  const specs: Spec[] = [
    { label: "Role", value: p.role },
    ...(p.methodology ? [{ label: "Methodology", value: p.methodology }] : []),
    { label: "Tools", value: p.tools },
    { label: "Timeline", value: p.timeline },
    ...extraSpecs,
  ];

  return {
    slug: p.slug,
    index: p.index,
    client: p.client,
    title: p.title,
    year: p.year,
    role: p.role,
    cover: resolveCaseStudyImage(p.cover) ?? p.cover,
    videoUrl: p.videoUrl?.trim()
      ? (resolveProjectMedia(p.videoUrl.trim()) ?? p.videoUrl.trim())
      : undefined,
    thumbnail: p.thumbnail?.trim()
      ? (resolveProjectMedia(p.thumbnail.trim()) ?? p.thumbnail.trim())
      : undefined,
    specs,
    blocks: p.blocks.map((b) => ({
      ...b,
      image: resolveProjectMedia(b.image),
      beforeImage: resolveCaseStudyImage(b.beforeImage),
      afterVideo: b.afterVideo?.trim() || undefined,
      videoSrc: resolveProjectMedia(b.videoSrc)?.trim() || undefined,
    })),
    mdx: p.mdx,
  };
}

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const doc = allProjects.find((p) => p.slug === params.slug);
    if (!doc) throw notFound();
    return { study: projectToCaseStudy(doc) };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData?.study;
    const title = s
      ? `${s.client} — Case Study · Rohan Misra · rohanmisra.studio`
      : "Case Study · Rohan Misra · rohanmisra.studio";
    const description = s?.title ?? "Selected product design case study — rohanmisra.studio.";
    const caseUrl = `${SITE_ORIGIN}/work/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: caseUrl },
        ...(s ? [{ property: "og:image", content: absoluteUrl(s.cover) }] : []),
        ...(s
          ? [{ name: "twitter:card", content: "summary_large_image" }, { name: "twitter:image", content: absoluteUrl(s.cover) }]
          : []),
      ],
    };
  },
  component: WorkCaseStudyRoute,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          404 / Case Study
        </div>
        <h1 className="mt-3 font-display text-4xl font-light">Not in the archive.</h1>
        <Link
          to="/"
          className="mt-6 inline-block border-b border-foreground pb-1 font-mono text-xs uppercase tracking-[0.2em]"
        >
          ← Back to index
        </Link>
      </div>
    </div>
  ),
});

function WorkCaseStudyRoute() {
  const { study } = Route.useLoaderData() as { study: CaseStudy };
  return <CaseStudyPage study={study} />;
}
