import { Link } from "@tanstack/react-router";
import { Waveform } from "./Waveform";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-lg font-medium tracking-tight">Rohan Misra</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:inline">
            / Product Designer
          </span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/80 transition hover:text-foreground"
          >
            Work
          </a>
          <a
            href="#about"
            className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/80 transition hover:text-foreground"
          >
            About
          </a>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 md:flex">
            <Waveform className="h-3 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Now Playing
            </span>
            <span className="font-mono text-[10px] tracking-tight text-foreground/80">
              Sade — Cherish
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
