import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Waveform } from "./Waveform";

const track = {
  title: "Cherish the Day",
  artist: "Sade",
  album: "Lovers Rock — 2000",
  time: "03:48 / 05:20",
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div className="bg-blueprint-grid absolute inset-0 opacity-[0.06]" aria-hidden="true" />

      {/* marquee */}
      <div className="overflow-hidden border-b border-background/10 py-4">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-5xl font-light tracking-tight md:text-7xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10 pr-10">
              Available for select work — Q3 2026
              <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 py-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/50">
            ↳ 04 / Soul
          </div>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
            Let&apos;s build something <br />
            <span className="italic">with feeling.</span>
          </h2>
          <a
            href="mailto:hello@rohanmisra.studio"
            className="mt-8 inline-flex items-center gap-3 border-b border-background pb-1 font-mono text-xs uppercase tracking-[0.2em]"
          >
            <Mail className="h-4 w-4" />
            hello@rohanmisra.studio
          </a>
        </div>

        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/50">
            Elsewhere
          </div>
          <ul className="mt-6 space-y-3 font-display text-xl">
            <li>
              <a href="#" className="group inline-flex items-center gap-3 hover:opacity-70">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a href="#" className="group inline-flex items-center gap-3 hover:opacity-70">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a href="#" className="group inline-flex items-center gap-3 hover:opacity-70">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="border border-background/15 bg-background/5 p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">
              <span>Currently Listening</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-background animate-pulse" />
                Live
              </span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Waveform className="h-10 w-12 text-background" />
              <div className="min-w-0">
                <div className="truncate font-display text-lg leading-tight">{track.title}</div>
                <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-background/60">
                  {track.artist} · {track.album}
                </div>
              </div>
            </div>
            <div className="mt-5 h-px w-full bg-background/15">
              <div className="h-px w-[68%] bg-background" />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] tracking-tight text-background/50">
              <span>{track.time.split(" / ")[0]}</span>
              <span>{track.time.split(" / ")[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-background/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 md:flex-row md:items-center md:px-10">
          <span>© 2026 Rohan Misra · Built in Bombay & Brooklyn</span>
          <span>Set in Fraunces, Inter & JetBrains Mono</span>
          <span>v 2.6 · Paper Edition</span>
        </div>
      </div>
    </footer>
  );
}
