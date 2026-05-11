import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type LazyViewportVideoProps = Omit<
  React.ComponentPropsWithoutRef<"video">,
  "preload" | "src"
> & {
  src: string;
  /**
   * Passed to IntersectionObserver; a bottom margin preloads shortly before
   * the clip scrolls into view.
   */
  rootMargin?: string;
  /** When false, playback continues after the first time the clip enters view. Default true. */
  pauseWhenOutOfView?: boolean;
  /** Class on the wrapper used for visibility measurement. */
  wrapperClassName?: string;
  preload?: "none" | "metadata" | "auto";
};

/**
 * Defers attaching `src` and starting playback until the wrapper intersects the viewport.
 * Pauses when scrolled away (optional) to limit CPU and decode work off-screen.
 */
export const LazyViewportVideo = forwardRef<HTMLVideoElement, LazyViewportVideoProps>(
  function LazyViewportVideo(
    {
      src,
      className,
      wrapperClassName,
      rootMargin = "0px 0px 160px 0px",
      pauseWhenOutOfView = true,
      muted = true,
      loop = true,
      playsInline = true,
      controls = false,
      preload: preloadProp,
      ...rest
    },
    forwardedRef,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [inView, setInView] = useState(false);

    const setVideoRef = useCallback(
      (node: HTMLVideoElement | null) => {
        videoRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
        }
      },
      [forwardedRef],
    );

    useEffect(() => {
      const root = containerRef.current;
      if (!root) return;

      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            setShouldLoad(true);
            setInView(true);
          } else {
            setInView(false);
          }
        },
        { root: null, rootMargin, threshold: 0.01 },
      );

      io.observe(root);
      return () => io.disconnect();
    }, [rootMargin]);

    useEffect(() => {
      const v = videoRef.current;
      if (!v || !shouldLoad) return;

      const sync = () => {
        if (inView) {
          void v.play().catch(() => {
            /* autoplay policies / not yet decodable */
          });
        } else if (pauseWhenOutOfView) {
          v.pause();
        }
      };

      sync();
      v.addEventListener("loadeddata", sync);
      v.addEventListener("canplay", sync);
      return () => {
        v.removeEventListener("loadeddata", sync);
        v.removeEventListener("canplay", sync);
      };
    }, [shouldLoad, inView, pauseWhenOutOfView]);

    const preload =
      preloadProp ?? (shouldLoad ? ("metadata" as const) : ("none" as const));

    return (
      <div
        ref={containerRef}
        className={cn(
          "w-full",
          /* Non-zero box so IntersectionObserver can detect modules below the fold before src attaches */
          "min-h-[12rem] md:min-h-[16rem]",
          wrapperClassName,
        )}
      >
        <video
          ref={setVideoRef}
          src={shouldLoad ? src : undefined}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={preload}
          className={cn("w-full max-w-full object-contain", className)}
          {...rest}
        />
      </div>
    );
  },
);
