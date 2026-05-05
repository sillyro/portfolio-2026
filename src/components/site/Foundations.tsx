import { Cog, Compass, CircuitBoard, Ruler, Sigma, Waves } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

const skills = [
  { icon: Cog, label: "Systems Thinking", note: "Design tokens · component APIs" },
  { icon: Ruler, label: "Mechanical CAD", note: "SolidWorks · Fusion 360" },
  { icon: Sigma, label: "Quantitative Research", note: "Statistical UX · A/B" },
  { icon: CircuitBoard, label: "Prototyping", note: "Arduino · Swift · Web" },
  { icon: Compass, label: "Product Strategy", note: "0→1 · Roadmapping" },
  { icon: Waves, label: "Sound Design", note: "Ableton · Field recording" },
];

export function Foundations() {
  return (
    <section id="about" className="relative border-b border-border">
      <div className="bg-blueprint-fine absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ↳ 03 / Engineering Foundations
            </div>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight md:text-5xl">
              Trained as an engineer. <br />
              <span className="italic text-muted-foreground">Practicing as a designer.</span>
            </h2>

            <div className="mt-10 max-w-md space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                B.S. Mechanical Engineering, IIT Bombay (2020). Five years between hardware
                startups, civic systems, and consumer software — always looking for the seam where
                rigor meets feeling.
              </p>
              <p>
                I believe the best products behave like instruments: precise, learnable, and full of
                soul once you know how to play them.
              </p>
            </div>

            <div className="relative mt-12 inline-block crosshair">
              <img
                src={portrait}
                alt="Portrait of Rohan Misra"
                loading="lazy"
                width={320}
                height={400}
                className="w-64 grayscale"
              />
              <div className="absolute -bottom-3 left-2 right-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Frame 04</span>
                <span>35mm · TX-400</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="border border-border bg-card">
              <header className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Hard Skills · Index</span>
                <span>06 / 06</span>
              </header>
              <ul className="grid grid-cols-1 sm:grid-cols-2">
                {skills.map(({ icon: Icon, label, note }, i) => (
                  <li
                    key={label}
                    className={`flex items-start gap-4 border-border px-5 py-6 ${
                      i % 2 === 0 ? "sm:border-r" : ""
                    } ${i < skills.length - 2 ? "border-b" : "sm:border-b-0 border-b last:border-b-0"}`}
                  >
                    <div className="mt-1 flex h-9 w-9 items-center justify-center border border-border">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-display text-lg font-medium tracking-tight">{label}</div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {note}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
