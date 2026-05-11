import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import type { Project } from "content-collections";
import { CaseStudyPage, type CaseStudy, type Spec } from "@/components/work/CaseStudyPage";
import { resolveBandcampRedesignImage } from "@/lib/bandcampRedesignAssets";
import { resolveProjectMedia } from "@/lib/projectMedia";

function resolveCaseStudyImage(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const bandcamp = resolveBandcampRedesignImage(ref);
  if (bandcamp) return bandcamp;
  return resolveProjectMedia(ref);
}

function projectToCaseStudy(p: Project): CaseStudy {
  const specs: Spec[] = [
    { label: "Role", value: p.role },
    ...(p.methodology ? [{ label: "Methodology", value: p.methodology }] : []),
    { label: "Tools", value: p.tools },
    { label: "Timeline", value: p.timeline },
    ...(p.extraSpecs ?? []),
  ];

  return {
    slug: p.slug,
    index: p.index,
    client: p.client,
    title: p.title,
    year: p.year,
    cover: resolveCaseStudyImage(p.cover) ?? p.cover,
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
  head: ({ loaderData }) => {
    const s = loaderData?.study;
    const title = s ? `${s.client} — Case Study · Rohan Misra` : "Case Study · Rohan Misra";
    const description = s?.title ?? "Selected product design case study.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(s ? [{ property: "og:image", content: s.cover }] : []),
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
