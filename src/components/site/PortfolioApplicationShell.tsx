import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useParams, useRouterState } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import { PortfolioShellProvider, usePortfolioShell } from "@/components/site/portfolioShellContext";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ORDER,
  formatProjectCode,
  groupProjectsByCategory,
  type ProjectCategory,
} from "@/lib/projectNav";

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  product: "Product",
  branding: "Branding",
  "side-quest": "Side Quests",
};

const navLinkHover =
  "transition-colors hover:text-[var(--signal)] hover:border-[color-mix(in_oklab,var(--signal)_45%,var(--border))]";

function ProjectNav({
  grouped,
  activeSlug,
}: {
  grouped: Map<ProjectCategory, Project[]>;
  activeSlug: string | null;
}) {
  return (
    <nav className="flex flex-col gap-8" aria-label="Projects">
      {CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <div key={cat}>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {CATEGORY_LABEL[cat]}
            </div>
            <ul className="space-y-1.5">
              {list.map((p) => {
                const isActive = activeSlug === p.slug;
                const code = formatProjectCode(p);
                const label = (
                  <span className="flex gap-2 leading-snug transition-colors">
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] tabular-nums tracking-[0.12em] text-muted-foreground",
                        isActive && "text-[var(--signal)]",
                      )}
                    >
                      {code}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1",
                        isActive
                          ? "font-medium text-[var(--signal)]"
                          : "text-foreground/80 hover:text-foreground",
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                );

                return (
                  <li key={p.slug}>
                    <Link
                      to="/work/$slug"
                      params={{ slug: p.slug }}
                      className={cn("block text-xs", navLinkHover)}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Bio({
  pathname,
  scrollMainToTop,
}: {
  pathname: string;
  scrollMainToTop: (behavior?: ScrollBehavior) => void;
}) {
  return (
    <div className="mb-10 border-b border-border pb-8">
      <p className="text-xs leading-relaxed text-foreground/90">
        <Link
          to="/"
          className={cn(
            "group inline-block text-left outline-none",
            "transition-colors hover:text-[var(--signal)] focus-visible:text-[var(--signal)]",
          )}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (pathname === "/") {
              e.preventDefault();
              scrollMainToTop("smooth");
            }
          }}
        >
          <span className="block font-bold transition-colors group-hover:text-[var(--signal)]">
            Rohan Misra
          </span>
        </Link>
        <span className="mt-1 block text-muted-foreground">
          — Building products at the intersection of systems, sound, and lived-in interfaces.
        </span>
      </p>
    </div>
  );
}

function SidebarBody({ grouped, activeSlug }: { grouped: Map<ProjectCategory, Project[]>; activeSlug: string | null }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollMainToTop } = usePortfolioShell();

  return (
    <>
      <Bio pathname={pathname} scrollMainToTop={scrollMainToTop} />
      <ProjectNav grouped={grouped} activeSlug={activeSlug} />
    </>
  );
}

function ShellLayoutInner() {
  const { mainScrollRef, scrollMainToTop, homeSpiedSlug, setHomeSpiedSlug } = usePortfolioShell();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const params = useParams({ strict: false }) as { slug?: string };
  const prevPathRef = useRef<string | null>(null);

  const grouped = useMemo(() => groupProjectsByCategory(allProjects), []);

  const activeSlugForNav = pathname.startsWith("/work/") ? (params.slug ?? null) : homeSpiedSlug;

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setHomeSpiedSlug(null);
    } else if (prevPathRef.current !== null && prevPathRef.current !== "/" && pathname === "/") {
      scrollMainToTop("instant");
    }
    prevPathRef.current = pathname;
  }, [pathname, scrollMainToTop, setHomeSpiedSlug]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const navProps = { grouped, activeSlug: activeSlugForNav };

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-cutting-mat opacity-[0.45]" aria-hidden />

      <aside className="fixed left-0 top-0 z-20 hidden h-dvh w-[28%] flex-col border-r border-border bg-background md:flex">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10 md:px-7">
          <SidebarBody {...navProps} />
        </div>
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)] backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,20rem)] flex-col border-r border-border bg-background shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Index
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-[var(--signal)]"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
              <SidebarBody {...navProps} />
            </div>
          </aside>
        </div>
      ) : null}

      <div
        ref={mainScrollRef}
        className="relative z-10 ml-0 min-h-dvh w-full overflow-y-auto pb-24 md:ml-[28%] md:h-dvh md:w-[72%] md:pb-0"
      >
        <Outlet />
      </div>

      {!menuOpen ? (
        <button
          type="button"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-border bg-background px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground shadow-md transition-colors hover:border-[color-mix(in_oklab,var(--signal)_40%,var(--border))] hover:text-[var(--signal)] md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-expanded={false}
        >
          Menu
        </button>
      ) : null}
    </div>
  );
}

export function PortfolioApplicationShell() {
  return (
    <PortfolioShellProvider>
      <ShellLayoutInner />
    </PortfolioShellProvider>
  );
}
