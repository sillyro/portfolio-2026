import { ArrowUpRight } from "lucide-react";
import mintstars from "@/assets/project-mintstars.jpg";
import eventapp from "@/assets/project-eventapp.jpg";

type Featured = {
  index: string;
  title: string;
  client: string;
  year: string;
  summary: string;
  tags: string[];
  image: string;
};

const featured: Featured[] = [
  {
    index: "F/01",
    title: "MintStars",
    client: "Creator Economy Platform",
    year: "2025",
    summary:
      "A subscription platform for independent creators. Led product strategy, design system, and the monetization surface from 0→1.",
    tags: ["Product Strategy", "Systems", "0→1"],
    image: mintstars,
  },
  {
    index: "F/02",
    title: "Event App",
    client: "Live Ticketing & Discovery",
    year: "2025",
    summary:
      "A tactile ticketing experience for live music and culture. Designed the discovery loop, wallet, and on-the-door check-in flow.",
    tags: ["Product Strategy", "Community", "iOS"],
    image: eventapp,
  },
];

export function Featured() {
  return (
    <section id="featured" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <header className="mb-10 flex items-end justify-between border-b border-border pb-6 md:mb-16">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ↳ 02 / Featured Work
            </div>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight md:text-6xl">
              High-Signal, in Motion.
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            02 Studies / Live
          </div>
        </header>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {featured.map((p) => (
            <article
              key={p.index}
              className="group relative bg-card p-6 transition hover:bg-background md:p-8"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{p.index}</span>
                <span>{p.year}</span>
              </div>

              <div className="relative mt-6 aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-3 border border-foreground/10" />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {p.client}
                  </div>
                  <h3 className="mt-1 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
                    {p.title}
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-foreground/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {p.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
