import type { MDXComponents } from "mdx/types";
import { Video } from "./Video";

/**
 * Components passed to project MDX (`<MDXContent components={…} />`).
 * Use in MDX as `<Video src="…" />`, optional `className`, etc.
 */
export const projectMdxComponents: MDXComponents = {
  Video,
};
