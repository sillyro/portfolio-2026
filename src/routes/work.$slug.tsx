import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import mintstars from "@/assets/project-mintstars.jpg";
import eventapp from "@/assets/project-eventapp.jpg";
import pulse from "@/assets/project-pulse.jpg";
import sonic from "@/assets/project-sonic.jpg";

type Spec = { label: string; value: string };
type Block = {
  kind: "system" | "flow" | "type" | "color";
  title: string;
  caption: string;
  image?: string;
};

type CaseStudy = {
  slug: string;
  index: string;
  client: string;
  title: string;
  year: string;
  cover: string;
  brief: string[];
  specs: Spec[];
  blocks: Block[];
};

const studies: Record<string, CaseStudy> = {
  mintstars: {
    slug: "mintstars",
    index: "F/01",
    client: "MintStars · Creator Economy",
    title: "Designing a calm monetization surface for independent creators.",
    year: "2025",
    cover: mintstars,
    brief: [
      "MintStars set out to build a subscription platform that took the loudness out of the creator economy. The brief: design a system where money felt incidental, and the work — essays, podcasts, photo journals — sat at the center.",
      "I led product strategy and the design system from 0→1, partnering with two engineers and a founder. We shipped the first paid tier in eleven weeks, validated against a cohort of 40 creators, and then opened the platform to the public.",
      "The work spanned three surfaces: the creator dashboard, the public reader, and the checkout. Each one shared a single design language — a quiet, editorial grid built on a 4pt baseline and a single accent color reserved for money.",
    ],
    specs: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Team", value: "1 PM · 2 Eng · 1 PD" },
      { label: "Tools", value: "Figma · Linear · Origami" },
      { label: "Timeline", value: "11 Weeks · Q1 2025" },
      { label: "Scope", value: "Web · iOS · Brand" },
      { label: "Status", value: "Live · v1.4" },
    ],
    blocks: [
      {
        kind: "system",
        title: "Component Library",
        caption: "32 primitives, 14 patterns, 1 theming layer. Documented in Figma + Storybook.",
        image: pulse,
      },
      {
        kind: "flow",
        title: "Onboarding Flow",
        caption: "Six-step creator setup, optimized for sub-90s completion.",
        image: eventapp,
      },
      {
        kind: "type",
        title: "Type System",
        caption: "Fraunces display paired with Söhne body. A deliberate, editorial cadence.",
        image: sonic,
      },
      {
        kind: "color",
        title: "Color & Money",
        caption: "Neutral surface, single accent. Currency lives in one shade — nowhere else.",
        image: mintstars,
      },
    ],
  },
};

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const study = studies[params.slug];
    if (!study) throw notFound();
    return { study };
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
  component: CaseStudyPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          404 / Case Study
        </div>
        <h1 className="mt-3 font-display text-4xl font-light">Not in the archive.</h1>
        <Link to="/" className="mt-6 inline-block border-b border-foreground pb-1 font-mono text-xs uppercase tracking-[0.2em]">
          ← Back to index
        </Link>
      </div>
    </div>
  ),
});

function CaseStudyPage() {
  const { study } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="bg-blueprint-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
            <div className="mb-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:mb-16">
              <Link to="/" className="inline-flex items-center gap-2 hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                Index
              </Link>
              <span>Case · {study.index}</span>
              <span>{study.year}</span>
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {study.client}
            </div>
            <h1 className="mt-4 max-w-5xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-7xl">
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
              <div className="pointer-events-none absolute inset-4 border border-foreground/10" />
              <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.22em] text-background mix-blend-difference">
                ↳ Cover · {study.index}
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

            {/* Brief */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="border-b border-border pb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  ↳ 01 / Brief
                </div>
                <h2 className="mt-3 font-display text-3xl font-light tracking-tight md:text-5xl">
                  The premise.
                </h2>
              </div>

              <div className="mt-8 space-y-6 md:max-w-3xl">
                {study.brief.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "font-display text-2xl font-light leading-snug tracking-tight md:text-3xl"
                        : "text-base leading-relaxed text-muted-foreground"
                    }
                  >
                    {p}
                  </p>
                ))}
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
                    <span className="col-span-2 md:col-span-1">M/{String(i + 1).padStart(2, "0")}</span>
                    <span className="col-span-6 md:col-span-8 text-foreground">{b.title}</span>
                    <span className="col-span-4 md:col-span-3 text-right">{b.kind}</span>
                  </div>

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
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Index
            </Link>
            <Link
              to="/work/$slug"
              params={{ slug: "mintstars" }}
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
