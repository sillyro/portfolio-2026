import { useMemo } from "react";
import { allProjects } from "content-collections";
import { Link } from "@tanstack/react-router";
import { MDXContent } from "@content-collections/mdx/react";
import { ArrowLeft } from "lucide-react";
import { projectMdxComponents } from "@/components/mdx";
import { LazyViewportVideo } from "@/components/media/LazyViewportVideo";
import { Footer } from "@/components/site/Footer";
import { cn } from "@/lib/utils";
import { formatProjectCode, getNextProjectBySlug } from "@/lib/projectNav";

export type Spec = { label: string; value: string };
export type Block = {
  kind: "system" | "flow" | "type" | "color";
  title: string;
  caption: string;
  image?: string;
  beforeImage?: string;
  afterVideo?: string;
  /** Local or remote MP4; renders a full-width loop video for the block. */
  videoSrc?: string;
};

/** Remote https or same-origin static path (e.g. `/images/.../demo.mp4`). */
function isRenderableVideoSrc(src: string | undefined): boolean {
  const s = src?.trim();
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (s.startsWith("/") && /\.(mp4|webm|ogg)$/i.test(s)) return true;
  return false;
}

/** Webflow-style import rows (hex asset id + index, or id + label) — not real module captions. */
function shouldShowBlockCaption(caption: string): boolean {
  const t = caption.trim();
  if (!t) return false;
  if (/^[0-9a-f]{20,}(\s+\d+)+$/i.test(t)) return false;
  if (/^[0-9a-f]{8,}\s+\S/i.test(t)) return false;
  return true;
}

function isProjectLinkOrVideoLabel(label: string): boolean {
  const n = label.trim().replace(/\s+/g, " ").toLowerCase();
  return n === "project link" || n === "video";
}

function SpecTableRow({ spec }: { spec: Spec }) {
  const isUrlRow = isProjectLinkOrVideoLabel(spec.label);

  return (
    <div className="grid grid-cols-3 gap-4 px-5 py-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {spec.label}
      </dt>
      <dd
        className={cn(
          "col-span-2 min-w-0 font-mono text-foreground",
          isUrlRow
            ? "text-xs normal-case tracking-normal"
            : "text-xs uppercase tracking-[0.18em]",
        )}
      >
        <span className={cn("block", isUrlRow ? "break-all leading-snug" : "break-words")}>{spec.value}</span>
      </dd>
    </div>
  );
}

export type CaseStudy = {
  slug: string;
  index: string;
  client: string;
  title: string;
  year: string;
  cover: string;
  /** Hero loop when set (e.g. MintStars Screen Studio clips). */
  videoUrl?: string;
  thumbnail?: string;
  specs: Spec[];
  blocks: Block[];
  mdx: string;
};

type Props = { study: CaseStudy };

export function CaseStudyPage({ study }: Props) {
  const nextProject = useMemo(() => getNextProjectBySlug(allProjects, study.slug), [study.slug]);

  const heroVideo =
    study.videoUrl?.trim() && isRenderableVideoSrc(study.videoUrl) ? study.videoUrl.trim() : null;

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3 md:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-[var(--signal)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Index
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6">
            <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              {study.year}
            </span>
            {nextProject ? (
              <Link
                to="/work/$slug"
                params={{ slug: nextProject.slug }}
                className="group inline-flex max-w-[min(56vw,20rem)] items-center gap-1.5 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-[var(--signal)] md:max-w-none"
              >
                <span className="shrink-0">Next Project</span>
                <span className="text-foreground/35 transition-colors group-hover:text-[var(--signal)]">→</span>
                <span className="min-w-0 truncate text-foreground/80 transition-colors group-hover:text-[var(--signal)]">
                  {formatProjectCode(nextProject)} / {nextProject.client}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-cutting-mat opacity-[0.35]" aria-hidden="true" />

          <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
            <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:mb-10">
              <span className="text-foreground/70">{study.client}</span>
              <span className="mx-2 text-border">/</span>
              <span>Case {study.index}</span>
            </div>

            <h1 className="mt-2 max-w-5xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-7xl">
              {study.title}
            </h1>

            <div className="relative mt-12 overflow-hidden border border-border bg-muted md:mt-16">
              {heroVideo ? (
                <div className="flex min-h-[12rem] items-center justify-center p-4 md:min-h-[16rem] md:p-8">
                  <LazyViewportVideo
                    src={heroVideo}
                    loop
                    muted
                    playsInline
                    pauseWhenOutOfView={false}
                    className="max-h-[80vh] w-full max-w-full object-contain"
                    wrapperClassName="min-h-0 w-full max-w-full flex justify-center"
                    aria-label={`${study.client} — preview`}
                  />
                </div>
              ) : (
                <div className="flex max-h-[80vh] min-h-[12rem] items-center justify-center p-4 md:p-8">
                  <img
                    src={study.cover}
                    alt={study.client}
                    width={1920}
                    height={1080}
                    className="max-h-[80vh] w-auto max-w-full object-contain"
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-4 border border-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
              <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Cover · {study.index}
              </div>
            </div>
          </div>
        </section>

        {/* Specs + Brief */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-10 md:py-24">
            {/* System Specs sidebar */}
            <aside className="md:col-span-4 lg:col-span-3">
              <div className="sticky top-24 border border-border">
                <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  System Specs
                </div>
                <dl className="divide-y divide-border">
                  {study.specs.map((s, i) => (
                    <SpecTableRow key={`${s.label}-${i}`} spec={s} />
                  ))}
                </dl>
              </div>
            </aside>

            {/* Brief (MDX body) */}
            <div className="min-w-0 md:col-span-8 lg:col-span-9">
              <div className="border-b border-border pb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  ↳ 01 / Brief
                </div>
                <h2 className="mt-3 font-display text-3xl font-light tracking-tight md:text-5xl">
                  The premise.
                </h2>
              </div>

              <div className="mt-8 max-w-none space-y-6 overflow-visible break-words md:max-w-3xl [&_p:first-of-type]:font-display [&_p:first-of-type]:text-2xl [&_p:first-of-type]:font-light [&_p:first-of-type]:leading-snug [&_p:first-of-type]:tracking-tight [&_p:first-of-type]:md:text-3xl [&_p:not(:first-of-type)]:text-base [&_p:not(:first-of-type)]:leading-relaxed [&_p:not(:first-of-type)]:text-muted-foreground">
                <MDXContent code={study.mdx} components={projectMdxComponents} />
              </div>
            </div>
          </div>
        </section>

        {/* Component Breakdowns */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
            <header className="mb-10 flex items-end justify-between border-b border-border pb-6 md:mb-16">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  ↳ 02 / Component Breakdowns
                </div>
                <h2 className="mt-3 font-display text-3xl font-light tracking-tight md:text-5xl">
                  The system, in pieces.
                </h2>
              </div>
              <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
                {study.blocks.length} Modules
              </div>
            </header>

            <div className="space-y-px bg-border">
              {study.blocks.map((b, i) => (
                <article key={b.title} className="bg-card">
                  <div className="grid grid-cols-12 items-center gap-4 border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="col-span-2 md:col-span-1">
                      M/{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="col-span-6 md:col-span-8 text-foreground">{b.title}</span>
                    <span className="col-span-4 md:col-span-3 text-right">{b.kind}</span>
                  </div>

                  {b.videoSrc && isRenderableVideoSrc(b.videoSrc) ? (
                    <div className="relative bg-muted p-4 md:p-8">
                      <LazyViewportVideo
                        src={b.videoSrc!}
                        loop
                        muted
                        playsInline
                        className="w-full max-h-[80vh] rounded-xl border border-white/10 object-contain shadow-lg"
                        aria-label={b.title}
                      />
                    </div>
                  ) : b.beforeImage || b.afterVideo ? (
                    <div className="divide-y divide-border bg-muted">
                      <div className="relative">
                        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          <span>Before</span>
                          {b.beforeImage ? (
                            <span className="text-foreground/50">Static</span>
                          ) : null}
                        </div>
                        {b.beforeImage ? (
                          <div className="relative flex justify-center bg-muted p-4 md:p-6">
                            <img
                              src={b.beforeImage}
                              alt={`${b.title} — before`}
                              loading="lazy"
                              width={1170}
                              height={2532}
                              className="max-h-[80vh] w-auto max-w-full object-contain"
                            />
                            <div className="pointer-events-none absolute inset-4 border border-foreground/10" />
                          </div>
                        ) : null}
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          <span>After</span>
                          {isRenderableVideoSrc(b.afterVideo) ? (
                            <span className="text-foreground/50">Motion</span>
                          ) : null}
                        </div>
                        <div className="relative flex justify-center bg-muted p-4 md:p-6">
                          {isRenderableVideoSrc(b.afterVideo) ? (
                            <LazyViewportVideo
                              src={b.afterVideo!}
                              loop
                              muted
                              playsInline
                              className="max-h-[80vh] w-auto max-w-full object-contain"
                              aria-label={`${b.title} — after`}
                            />
                          ) : (
                            <div className="flex min-h-[200px] w-full max-w-md flex-col items-center justify-center gap-3 border border-dashed border-border bg-card px-6 py-12 text-center">
                              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                                After video
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Add an <code className="text-foreground">afterVideo</code> URL or
                                path ending in <code className="text-foreground">.mp4</code> (e.g.{" "}
                                <code className="text-foreground">https://…</code> or{" "}
                                <code className="text-foreground">/images/…/clip.mp4</code>).
                              </p>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-4 border border-foreground/10" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex min-h-[12rem] w-full justify-center overflow-hidden bg-muted py-6 md:py-10">
                      {b.image && (
                        <img
                          src={b.image}
                          alt={b.title}
                          loading="lazy"
                          width={1920}
                          height={820}
                          className="max-h-[80vh] w-auto max-w-full object-contain"
                        />
                      )}
                      <div className="bg-blueprint-fine pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" />
                      <div className="pointer-events-none absolute inset-4 border border-foreground/10" />
                    </div>
                  )}

                  {shouldShowBlockCaption(b.caption) ? (
                    <div className="px-5 py-5 md:px-8 md:py-6">
                      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        {b.caption}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-[1400px] items-center justify-start gap-6 px-6 py-16 md:px-10 md:py-24">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-[var(--signal)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Index
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
