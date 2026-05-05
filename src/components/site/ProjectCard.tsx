import { ArrowUpRight } from "lucide-react";

export type Project = {
  index: string;
  year: string;
  title: string;
  client: string;
  summary: string;
  tags: string[];
  image: string;
  meta: { label: string; value: string }[];
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative border border-border bg-card transition hover:border-foreground/40">
      {/* corners */}
      <Corner className="-left-px -top-px" />
      <Corner className="-right-px -top-px rotate-90" />
      <Corner className="-bottom-px -left-px -rotate-90" />
      <Corner className="-bottom-px -right-px rotate-180" />

      <header className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Case · {project.index}</span>
        <span>{project.year}</span>
      </header>

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
        />
        {/* schematic overlay */}
        <div className="pointer-events-none absolute inset-0 bg-blueprint-fine opacity-30 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-3 border border-foreground/10" />
      </div>

      <div className="grid grid-cols-3 border-b border-border font-mono text-[10px] uppercase tracking-[0.18em]">
        {project.meta.map((m) => (
          <div key={m.label} className="border-r border-border px-5 py-3 last:border-r-0">
            <div className="text-muted-foreground">{m.label}</div>
            <div className="mt-1 text-foreground">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-5 px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.client}
            </div>
            <h3 className="mt-1 font-display text-3xl font-light leading-tight tracking-tight">
              {project.title}
            </h3>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-foreground/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.map((t) => (
            <span
              key={t}
              className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-2.5 w-2.5 border-l border-t border-foreground ${className}`}
    />
  );
}
