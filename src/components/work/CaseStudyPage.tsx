import { allProjects } from "content-collections";
import { Link } from "@tanstack/react-router";
import { MDXContent } from "@content-collections/mdx/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectMdxComponents } from "@/components/mdx";
import { LazyViewportVideo } from "@/components/media/LazyViewportVideo";
import { Footer } from "@/components/site/Footer";

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

export type CaseStudy = {
  slug: string;
  index: string;
  client: string;
  title: string;
  year: string;
  cover: string;
  specs: Spec[];
  blocks: Block[];
  mdx: string;
};

type Props = { study: CaseStudy };

export function CaseStudyPage({ study }: Props) {
  const i = allProjects.findIndex((p) => p.slug === study.slug);
  const nextSlug = allProjects[i >= 0 ? (i + 1) % allProjects.length : 0]?.slug ?? study.slug;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3 md:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-[var(--signal)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Index
          </Link>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            {study.year}
          </span>
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

            <div className="relative mt-12 aspect-[16/9] overflow-hidden border border-border bg-muted md:mt-16">
              <img
                src={study.cover}
                alt={study.client}
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
              />
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
                  {study.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-3 gap-4 px-5 py-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>

            {/* Brief (MDX body) */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="border-b border-border pb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  ↳ 01 / Brief
                </div>
                <h2 className="mt-3 font-display text-3xl font-light tracking-tight md:text-5xl">
                  The premise.
                </h2>
              </div>

              <div className="mt-8 space-y-6 md:max-w-3xl [&_p:first-of-type]:font-display [&_p:first-of-type]:text-2xl [&_p:first-of-type]:font-light [&_p:first-of-type]:leading-snug [&_p:first-of-type]:tracking-tight [&_p:first-of-type]:md:text-3xl [&_p:not(:first-of-type)]:text-base [&_p:not(:first-of-type)]:leading-relaxed [&_p:not(:first-of-type)]:text-muted-foreground">
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
                        src={b.videoSrc}
                        loop
                        muted
                        playsInline
                        className="w-full rounded-xl shadow-lg border border-white/10"
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
                              className="max-h-[min(85vh,920px)] w-auto max-w-full object-contain"
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
                              src={b.afterVideo}
                              loop
                              muted
                              playsInline
                              className="max-h-[min(85vh,920px)] w-auto max-w-full object-contain"
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
                    <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
                      {b.image && (
                        <img
                          src={b.image}
                          alt={b.title}
                          loading="lazy"
                          width={1920}
                          height={820}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="bg-blueprint-fine pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" />
                      <div className="pointer-events-none absolute inset-4 border border-foreground/10" />
                    </div>
                  )}

                  <div className="px-5 py-5 md:px-8 md:py-6">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {b.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Next */}
        <section>
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-16 md:px-10 md:py-24">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Index
            </Link>
            <Link
              to="/work/$slug"
              params={{ slug: nextSlug }}
              className="group inline-flex items-center gap-2 border-b border-foreground pb-1 font-mono text-xs uppercase tracking-[0.2em]"
            >
              Next Case Study
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
