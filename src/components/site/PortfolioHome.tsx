import { useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import type { Project } from "content-collections";
import { ArrowUpRight } from "lucide-react";
import { LazyViewportVideo } from "@/components/media/LazyViewportVideo";
import { Footer } from "@/components/site/Footer";
import { usePortfolioShell } from "@/components/site/portfolioShellContext";
import { resolveProjectMedia } from "@/lib/projectMedia";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ORDER,
  formatProjectCode,
  groupProjectsByCategory,
  type ProjectCategory,
} from "@/lib/projectNav";

const CATEGORY_STRIP: Record<ProjectCategory, string> = {
  product: "// 01 PRODUCT SYSTEMS",
  branding: "// 02 BRANDING ARTIFACTS",
  "side-quest": "// 03 SIDE QUESTS",
};

function coverSrc(p: Project) {
  return resolveProjectMedia(p.cover) ?? p.cover;
}

function videoSrc(p: Project) {
  const v = p.videoUrl?.trim();
  if (!v) return undefined;
  if (v.startsWith("/") || v.startsWith("http")) return v;
  return resolveProjectMedia(v) ?? v;
}

type ProjectPreviewCardProps = { project: Project };

function ProjectPreviewCard({ project }: ProjectPreviewCardProps) {
  const cover = coverSrc(project);
  const video = videoSrc(project);

  return (
    <article
      id={`project-${project.slug}`}
      className="scroll-mt-6 border-b border-border pb-20 pt-12 md:scroll-mt-8 md:pb-28 md:pt-16"
    >
      <div className="mb-6 flex items-start justify-between gap-4 px-6 md:px-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {formatProjectCode(project)} · {project.client}
          </div>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-light leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h2>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {project.role} · {project.year}
          </div>
        </div>
        <Link
          to="/work/$slug"
          params={{ slug: project.slug }}
          className="group mt-1 inline-flex shrink-0 items-center gap-1.5 border-b border-border pb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:border-[color-mix(in_oklab,var(--signal)_50%,var(--border))] hover:text-[var(--signal)]"
        >
          Case study
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>

      <div className="px-6 md:px-10">
        <div
          className={cn(
            "relative overflow-hidden bg-transparent",
            "border border-border shadow-[inset_0_1px_0_color-mix(in_oklab,white_55%,transparent)]",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-cutting-mat opacity-[0.35]" aria-hidden />
          <div className="relative p-3 md:p-6">
            {video ? (
              <LazyViewportVideo
                src={video}
                loop
                muted
                playsInline
                className="aspect-video w-full bg-transparent object-contain md:rounded-sm"
                wrapperClassName="min-h-0"
                aria-label={project.title}
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden md:rounded-sm">
                <img
                  src={
                    project.thumbnail
                      ? (resolveProjectMedia(project.thumbnail) ?? project.thumbnail)
                      : cover
                  }
                  alt=""
                  className="h-full w-full object-contain"
                  width={1920}
                  height={1080}
                />
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-4 border border-[color-mix(in_oklab,var(--foreground)_12%,transparent)] md:inset-6"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function PortfolioHome() {
  const grouped = useMemo(() => groupProjectsByCategory(allProjects), []);
  const { mainScrollRef, setHomeSpiedSlug } = usePortfolioShell();

  const scrollOrderSlugs = useMemo(() => {
    const slugs: string[] = [];
    for (const cat of CATEGORY_ORDER) {
      for (const p of grouped.get(cat) ?? []) slugs.push(p.slug);
    }
    return slugs;
  }, [grouped]);

  useEffect(() => {
    if (scrollOrderSlugs.length === 0) return;

    const elements = scrollOrderSlugs
      .map((slug) => document.getElementById(`project-${slug}`))
      .filter((n): n is HTMLElement => Boolean(n));

    const root = mainScrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting && e.intersectionRatio > 0.12);
        if (visible.length === 0) return;
        const best = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b,
        );
        const id = best.target.getAttribute("id");
        if (id?.startsWith("project-")) {
          setHomeSpiedSlug(id.replace("project-", ""));
        }
      },
      {
        root: root ?? null,
        rootMargin: "-32% 0px -36% 0px",
        threshold: [0, 0.08, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [scrollOrderSlugs, mainScrollRef, setHomeSpiedSlug]);

  const hasAny = CATEGORY_ORDER.some((c) => (grouped.get(c)?.length ?? 0) > 0);

  return (
    <div className="min-h-full bg-background text-foreground">
      {!hasAny ? (
        <div className="flex min-h-[50vh] items-center justify-center px-6 font-mono text-xs text-muted-foreground">
          No projects in content yet.
        </div>
      ) : (
        CATEGORY_ORDER.map((cat) => {
          const list = grouped.get(cat) ?? [];
          if (list.length === 0) return null;
          return (
            <section key={cat} className="relative">
              <div
                className={cn(
                  "sticky top-0 z-30 border-b border-border bg-background/90 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-[2px] md:px-10",
                )}
              >
                {CATEGORY_STRIP[cat]}
              </div>
              {list.map((p) => (
                <ProjectPreviewCard key={p.slug} project={p} />
              ))}
            </section>
          );
        })
      )}
      <Footer />
    </div>
  );
}
