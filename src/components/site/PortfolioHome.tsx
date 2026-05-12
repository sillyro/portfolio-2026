import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import type { Project } from "content-collections";
import { ArrowUpRight } from "lucide-react";
import { LazyViewportVideo } from "@/components/media/LazyViewportVideo";
import { Footer } from "@/components/site/Footer";
import { resolveProjectMedia } from "@/lib/projectMedia";
import { cn } from "@/lib/utils";
import { formatProjectCode, sortProjectsByCategoryAndOrder } from "@/lib/projectNav";

const CATEGORY_ORDER = ["product", "branding", "side-quest"] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const CATEGORY_LABEL: Record<Category, string> = {
  product: "Product",
  branding: "Branding",
  "side-quest": "Side Quests",
};

function isCategory(c: string): c is Category {
  return (CATEGORY_ORDER as readonly string[]).includes(c);
}

function groupByCategory(projects: Project[]) {
  const sorted = sortProjectsByCategoryAndOrder(projects);
  const map = new Map<Category, Project[]>();
  for (const c of CATEGORY_ORDER) map.set(c, []);
  for (const p of sorted) {
    const cat = isCategory(p.category) ? p.category : "side-quest";
    map.get(cat)!.push(p);
  }
  return map;
}

function coverSrc(p: Project) {
  return resolveProjectMedia(p.cover) ?? p.cover;
}

function videoSrc(p: Project) {
  const v = p.videoUrl?.trim();
  if (!v) return undefined;
  if (v.startsWith("/") || v.startsWith("http")) return v;
  return resolveProjectMedia(v) ?? v;
}

type NavPanelProps = {
  activeSlug: string | null;
  grouped: Map<Category, Project[]>;
  featuredSlugs: Set<string>;
  onPickFeatured: (slug: string) => void;
};

function ProjectNav({ activeSlug, grouped, featuredSlugs, onPickFeatured }: NavPanelProps) {
  return (
    <nav className="flex flex-col gap-8" aria-label="Projects">
      {CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <div key={cat}>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {CATEGORY_LABEL[cat]}
            </div>
            <ul className="space-y-1.5">
              {list.map((p) => {
                const isFeatured = featuredSlugs.has(p.slug);
                const isActive = isFeatured && activeSlug === p.slug;
                const code = formatProjectCode(p);
                const label = (
                  <span className="flex gap-2 leading-snug transition-colors">
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] tabular-nums tracking-[0.12em] text-muted-foreground",
                        isActive ? "text-[var(--signal)]" : "",
                      )}
                    >
                      {code}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1",
                        isActive ? "font-medium text-[var(--signal)]" : "text-foreground/80 hover:text-foreground",
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                );

                if (isFeatured) {
                  return (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => onPickFeatured(p.slug)}
                        className="w-full text-left text-xs"
                      >
                        {label}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={p.slug}>
                    <Link to="/work/$slug" params={{ slug: p.slug }} className="block text-xs">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Bio() {
  return (
    <div className="mb-10 border-b border-border pb-8">
      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="block font-medium">Rohan Misra — Building products</span>
        <span className="mt-1 block text-muted-foreground">
          at the intersection of systems, sound, and lived-in interfaces.
        </span>
      </p>
    </div>
  );
}

type FeaturedCardProps = { project: Project };

function FeaturedCard({ project }: FeaturedCardProps) {
  const cover = coverSrc(project);
  const video = videoSrc(project);

  return (
    <article
      id={`featured-${project.slug}`}
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
          className="group mt-1 inline-flex shrink-0 items-center gap-1.5 border-b border-border pb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition hover:border-[var(--signal)] hover:text-[var(--signal)]"
        >
          Case study
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>

      <div className="px-6 md:px-10">
        <div
          className={cn(
            "relative overflow-hidden bg-[color-mix(in_oklab,var(--card)_88%,var(--muted))]",
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
                className="aspect-video w-full bg-muted/30 object-contain md:rounded-sm"
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

function SidebarBody(props: NavPanelProps) {
  return (
    <>
      <Bio />
      <ProjectNav {...props} />
    </>
  );
}

export function PortfolioHome() {
  const featured = useMemo(
    () => sortProjectsByCategoryAndOrder(allProjects.filter((p) => p.featured)),
    [],
  );
  const grouped = useMemo(() => groupByCategory(allProjects), []);
  const featuredSlugs = useMemo(() => new Set(featured.map((p) => p.slug)), [featured]);

  const [activeSlug, setActiveSlug] = useState<string | null>(featured[0]?.slug ?? null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToFeatured = useCallback((slug: string) => {
    document.getElementById(`featured-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
    setActiveSlug(slug);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    if (featured.length === 0) return;

    const elements = featured
      .map((p) => document.getElementById(`featured-${p.slug}`))
      .filter((n): n is HTMLElement => Boolean(n));

    /** Viewport root so active state updates for both body scroll (mobile) and nested column scroll (desktop). */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting && e.intersectionRatio > 0.12);
        if (visible.length === 0) return;
        const best = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b,
        );
        const id = best.target.getAttribute("id");
        if (id?.startsWith("featured-")) {
          setActiveSlug(id.replace("featured-", ""));
        }
      },
      {
        root: null,
        rootMargin: "-32% 0px -36% 0px",
        threshold: [0, 0.08, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [featured]);

  const navProps: NavPanelProps = {
    activeSlug,
    grouped,
    featuredSlugs,
    onPickFeatured: scrollToFeatured,
  };

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-cutting-mat opacity-[0.45]" aria-hidden />

      <aside className="fixed left-0 top-0 z-20 hidden h-dvh w-[28%] flex-col border-r border-border bg-background md:flex">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10 md:px-7">
          <SidebarBody {...navProps} />
        </div>
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)] backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,20rem)] flex-col border-r border-border bg-background shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Index
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
              <SidebarBody {...navProps} />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="relative z-10 ml-0 min-h-dvh w-full overflow-y-auto pb-24 md:ml-[28%] md:h-dvh md:w-[72%] md:pb-0">
        {featured.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center px-6 font-mono text-xs text-muted-foreground">
            No featured projects yet — mark entries featured in MDX.
          </div>
        ) : (
          featured.map((p) => <FeaturedCard key={p.slug} project={p} />)
        )}
        <Footer />
      </main>

      {!menuOpen ? (
        <button
          type="button"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-border bg-background px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground shadow-md md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-expanded={false}
        >
          Menu
        </button>
      ) : null}
    </div>
  );
}
