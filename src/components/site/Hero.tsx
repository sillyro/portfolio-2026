import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-blueprint-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-20 md:px-10 md:pb-40 md:pt-32">
        {/* meta line */}
        <div className="mb-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:mb-20">
          <span>Index — 001 / Portfolio</span>
          <span className="hidden md:inline">Rev. 2026.05 — Bombay × Brooklyn</span>
          <span>EST. 1998</span>
        </div>

        <h1 className="font-display text-[15vw] font-light leading-[0.92] tracking-[-0.04em] md:text-[10rem]">
          Systems,<br />
          <span className="italic text-foreground/90">Sound,</span>
          <span className="text-muted-foreground"> &amp; </span>
          <span className="font-medium">Soul.</span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-12 md:mt-20">
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ↳ 01 / Brief
            </div>
          </div>
          <p className="max-w-2xl font-display text-2xl font-light leading-snug tracking-tight md:col-span-7 md:text-3xl">
            Product Designer exploring the intersection of engineering logic and cultural intuition.
            I build interfaces that feel measured, lived-in, and human.
          </p>
          <div className="flex items-end justify-start md:col-span-3 md:justify-end">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 border-b border-foreground pb-1 font-mono text-xs uppercase tracking-[0.2em]"
            >
              View Selected Work
              <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
