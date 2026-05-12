import type { MDXComponents } from "mdx/types";
import { Video } from "./Video";
import { cn } from "@/lib/utils";

/**
 * Components passed to project MDX (`<MDXContent components={…} />`).
 * Use in MDX as `<Video src="…" />`, optional `className`, etc.
 */
export const projectMdxComponents: MDXComponents = {
  Video,
  img: ({ className, alt, ...rest }) => (
    <img
      alt={alt ?? ""}
      className={cn(
        "mx-auto my-6 block h-auto max-h-[80vh] w-full max-w-full object-contain",
        className,
      )}
      {...rest}
    />
  ),
};
