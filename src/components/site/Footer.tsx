import { Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[color-mix(in_oklab,var(--background)_92%,var(--muted))]">
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Available for select product and design work. Based in London / remote.
            </p>
            <a
              href="mailto:rohan@dollymixstudios.com"
              className="mt-6 inline-flex items-center gap-2 border-b border-border font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/85 transition hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              <Mail className="h-3.5 w-3.5" />
              rohan@dollymixstudios.com
            </a>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Elsewhere</div>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
              <li>
                <a
                  href="https://www.instagram.com/rohanmisra.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-[var(--signal)]"
                >
                  <Instagram className="h-3.5 w-3.5 opacity-70" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/rohanmisra1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-[var(--signal)]"
                >
                  <Linkedin className="h-3.5 w-3.5 opacity-70" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>© 2026 Rohan Misra</span>
        </div>
      </div>
    </footer>
  );
}
