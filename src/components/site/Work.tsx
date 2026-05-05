import { ProjectCard, type Project } from "./ProjectCard";
import pulse from "@/assets/project-pulse.jpg";
import sonic from "@/assets/project-sonic.jpg";
import transit from "@/assets/project-transit.jpg";
import zine from "@/assets/project-zine.jpg";

const projects: Project[] = [
  {
    index: "001",
    year: "2025",
    title: "Pulse — Wearable Health OS",
    client: "Heliograph Labs",
    summary:
      "A calm interface for a continuous health monitor. Reduced cognitive load by 38% through ambient typography and a single-glance metric system.",
    tags: ["Product Strategy", "Systems", "0→1"],
    image: pulse,
    meta: [
      { label: "Role", value: "Lead PD" },
      { label: "Scope", value: "iOS · Hardware" },
      { label: "Span", value: "11 Months" },
    ],
  },
  {
    index: "002",
    year: "2024",
    title: "Sonic — Independent Radio",
    client: "Lower Parel Sound Co.",
    summary:
      "A community-run streaming platform for South Asian indie artists. Designed the audio engine, contributor tools, and a tactile, vinyl-inspired player.",
    tags: ["Community", "Audio", "Brand"],
    image: sonic,
    meta: [
      { label: "Role", value: "Founding Designer" },
      { label: "Scope", value: "Web · iOS" },
      { label: "Span", value: "18 Months" },
    ],
  },
  {
    index: "003",
    year: "2024",
    title: "Transit — Wayfinding System",
    client: "Mumbai Metro Authority",
    summary:
      "Modular signage and a live arrivals app serving 1.2M daily riders. Built on a 12-column engineering grid, translated into seven languages.",
    tags: ["Systems", "Public", "Wayfinding"],
    image: transit,
    meta: [
      { label: "Role", value: "Design Lead" },
      { label: "Scope", value: "System · App" },
      { label: "Span", value: "2 Years" },
    ],
  },
  {
    index: "004",
    year: "2023",
    title: "Zine — A Newsroom of One",
    client: "Self-Initiated",
    summary:
      "A publishing tool for small writers, blending the physicality of zines with structured CMS logic. Now used by 4,000+ independent voices.",
    tags: ["Product Strategy", "Editorial", "Community"],
    image: zine,
    meta: [
      { label: "Role", value: "Solo" },
      { label: "Scope", value: "Web · CMS" },
      { label: "Span", value: "Ongoing" },
    ],
  },
];

export function Work() {
  return (
    <section id="work" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
        <header className="mb-12 flex items-end justify-between border-b border-border pb-6 md:mb-20">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ↳ 02 / Selected Work
            </div>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight md:text-6xl">
              The Systems Grid.
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            04 Studies / 2023—2025
          </div>
        </header>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.index} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
