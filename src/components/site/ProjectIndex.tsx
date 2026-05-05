import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import pulse from "@/assets/project-pulse.jpg";
import sonic from "@/assets/project-sonic.jpg";
import transit from "@/assets/project-transit.jpg";
import zine from "@/assets/project-zine.jpg";

type Entry = {
  ref: string;
  title: string;
  role: string;
  year: string;
  discipline: string;
  image: string;
};

const past: Entry[] = [
  { ref: "P/01", title: "Pulse — Wearable Health OS", role: "Lead Product Designer", year: "2024", discipline: "Product · Systems", image: pulse },
  { ref: "P/02", title: "Sonic — Independent Radio", role: "Founding Designer", year: "2023", discipline: "Product · Brand", image: sonic },
  { ref: "P/03", title: "Transit — Wayfinding System", role: "Design Lead", year: "2022", discipline: "Systems · Public", image: transit },
  { ref: "P/04", title: "Heliograph Identity", role: "Art Director", year: "2022", discipline: "Brand · Print", image: zine },
  { ref: "P/05", title: "Lower Parel Sound Co.", role: "Design Partner", year: "2021", discipline: "Brand · Editorial", image: sonic },
];

const side: Entry[] = [
  { ref: "S/01", title: "Zine — A Newsroom of One", role: "Solo", year: "2023", discipline: "Editorial · Tooling", image: zine },
  { ref: "S/02", title: "Field Notes, Vol. 03", role: "Editor / Designer", year: "2022", discipline: "Print · Risograph", image: pulse },
  { ref: "S/03", title: "Type Specimen — Monsoon", role: "Type Design", year: "2021", discipline: "Typography", image: transit },
  { ref: "S/04", title: "Bombay Mixtape Covers", role: "Illustration", year: "2020", discipline: "Graphic · Music", image: sonic },
];

export function ProjectIndex() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ src: string; alt: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <section id="index" className="border-b border-border">
      <div
        ref={containerRef}
        onMouseMove={onMove}
        className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28"
      >
        <header className="mb-10 flex items-end justify-between border-b border-border pb-6 md:mb-16">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ↳ 03 / Project Index
            </div>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight md:text-6xl">
              The Engineering Log.
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            {past.length + side.length} Entries / 2020—2024
          </div>
        </header>

        <Group
          label="Past Work"
          caption="Product · Brand · Systems"
          entries={past}
          onEnter={(e) => setHover({ src: e.image, alt: e.title })}
          onLeave={() => setHover(null)}
        />

        <div className="h-12 md:h-20" />

        <Group
          label="Side Quests"
          caption="Self-initiated · Print · Type"
          entries={side}
          onEnter={(e) => setHover({ src: e.image, alt: e.title })}
          onLeave={() => setHover(null)}
        />

        {/* Floating preview */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 hidden md:block transition-opacity duration-200 ${hover ? "opacity-100" : "opacity-0"}`}
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(24px, -50%)",
          }}
        >
          <div className="h-48 w-64 overflow-hidden border border-border bg-card shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--ink)_30%,transparent)]">
            {hover && (
              <img
                src={hover.src}
                alt=""
                width={512}
                height={384}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({
  label,
  caption,
  entries,
  onEnter,
  onLeave,
}: {
  label: string;
  caption: string;
  entries: Entry[];
  onEnter: (e: Entry) => void;
  onLeave: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between border-b border-border pb-3">
        <div className="font-display text-2xl font-light tracking-tight md:text-3xl">{label}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {caption}
        </div>
      </div>

      <ul className="divide-y divide-border">
        {entries.map((entry) => (
          <li
            key={entry.ref}
            onMouseEnter={() => onEnter(entry)}
            onMouseLeave={onLeave}
            className="group grid cursor-pointer grid-cols-12 items-baseline gap-4 py-5 transition hover:bg-foreground/[0.02]"
          >
            <span className="col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:col-span-1">
              {entry.ref}
            </span>
            <span className="col-span-10 font-display text-xl font-light tracking-tight md:col-span-5 md:text-2xl">
              {entry.title}
            </span>
            <span className="col-span-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:col-span-3">
              {entry.role}
            </span>
            <span className="col-span-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:col-span-2">
              {entry.discipline}
            </span>
            <span className="col-span-3 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:col-span-1">
              {entry.year}
              <ArrowUpRight className="h-3.5 w-3.5 text-foreground/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
