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
import { homeCategorySectionId, type ProjectCategory } from "@/lib/projectNav";

type PortfolioShellValue = {
  mainScrollRef: RefObject<HTMLDivElement | null>;
  scrollMainToTop: (behavior?: ScrollBehavior) => void;
  scrollToHomeCategory: (category: ProjectCategory, behavior?: ScrollBehavior) => void;
  queueHomeCategoryScroll: (category: ProjectCategory) => void;
  takePendingHomeCategoryScroll: () => ProjectCategory | null;
  /** Active project id on homepage (scroll-spy); ignored on case study routes for highlight logic. */
  homeSpiedSlug: string | null;
  setHomeSpiedSlug: (slug: string | null) => void;
};

const PortfolioShellContext = createContext<PortfolioShellValue | null>(null);

export function PortfolioShellProvider({ children }: { children: ReactNode }) {
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const pendingHomeCategoryRef = useRef<ProjectCategory | null>(null);
  const [homeSpiedSlug, setHomeSpiedSlug] = useState<string | null>(null);

  const scrollMainToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior });
  }, []);

  const scrollToHomeCategory = useCallback((category: ProjectCategory, behavior: ScrollBehavior = "smooth") => {
    const root = mainScrollRef.current;
    if (!root) return;

    if (category === "product") {
      root.scrollTo({ top: 0, behavior });
      return;
    }

    const target = document.getElementById(homeCategorySectionId(category));
    if (!target) return;

    const top = root.scrollTop + target.getBoundingClientRect().top - root.getBoundingClientRect().top;
    root.scrollTo({ top, behavior });
  }, []);

  const queueHomeCategoryScroll = useCallback((category: ProjectCategory) => {
    pendingHomeCategoryRef.current = category;
  }, []);

  const takePendingHomeCategoryScroll = useCallback(() => {
    const category = pendingHomeCategoryRef.current;
    pendingHomeCategoryRef.current = null;
    return category;
  }, []);

  const value = useMemo(
    () => ({
      mainScrollRef,
      scrollMainToTop,
      scrollToHomeCategory,
      queueHomeCategoryScroll,
      takePendingHomeCategoryScroll,
      homeSpiedSlug,
      setHomeSpiedSlug,
    }),
    [scrollMainToTop, scrollToHomeCategory, queueHomeCategoryScroll, takePendingHomeCategoryScroll, homeSpiedSlug],
  );

  return <PortfolioShellContext.Provider value={value}>{children}</PortfolioShellContext.Provider>;
}

export function usePortfolioShell() {
  const ctx = useContext(PortfolioShellContext);
  if (!ctx) throw new Error("usePortfolioShell must be used within PortfolioShellProvider");
  return ctx;
}
