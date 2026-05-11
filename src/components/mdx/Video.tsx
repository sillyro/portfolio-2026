import { forwardRef } from "react";
import { LazyViewportVideo } from "@/components/media/LazyViewportVideo";

export type VideoProps = React.ComponentPropsWithoutRef<typeof LazyViewportVideo>;

/**
 * HTML5 video for MDX case studies: muted loop clips that load and play only when
 * near the viewport (see `LazyViewportVideo`).
 */
export const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(props, ref) {
  return <LazyViewportVideo ref={ref} {...props} />;
});
