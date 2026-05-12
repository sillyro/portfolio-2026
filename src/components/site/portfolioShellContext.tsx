import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type PortfolioShellValue = {
  mainScrollRef: RefObject<HTMLDivElement | null>;
  scrollMainToTop: (behavior?: ScrollBehavior) => void;
  /** Active project id on homepage (scroll-spy); ignored on case study routes for highlight logic. */
  homeSpiedSlug: string | null;
  setHomeSpiedSlug: (slug: string | null) => void;
};

const PortfolioShellContext = createContext<PortfolioShellValue | null>(null);

export function PortfolioShellProvider({ children }: { children: ReactNode }) {
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const [homeSpiedSlug, setHomeSpiedSlug] = useState<string | null>(null);

  const scrollMainToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior });
  }, []);

  const value = useMemo(
    () => ({
      mainScrollRef,
      scrollMainToTop,
      homeSpiedSlug,
      setHomeSpiedSlug,
    }),
    [scrollMainToTop, homeSpiedSlug],
  );

  return <PortfolioShellContext.Provider value={value}>{children}</PortfolioShellContext.Provider>;
}

export function usePortfolioShell() {
  const ctx = useContext(PortfolioShellContext);
  if (!ctx) throw new Error("usePortfolioShell must be used within PortfolioShellProvider");
  return ctx;
}
