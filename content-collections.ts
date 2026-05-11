import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const blockSchema = z.object({
  kind: z.enum(["system", "flow", "type", "color"]),
  title: z.string(),
  caption: z.string(),
  /** Basename of a file in `src/assets` (e.g. `project-pulse.jpg`) or an absolute URL/path. */
  image: z.string().optional(),
  /** Public path (e.g. `/images/projects/.../before.png`) or bundled asset basename. */
  beforeImage: z.string().optional(),
  /** Direct video URL (`https://...mp4`). Placeholder tokens like `PASTE_URL_1` hide the player until replaced. */
  afterVideo: z.string().optional(),
  /** Single full-width loop video for a block (e.g. `/images/projects/.../clip.mp4`). Takes precedence over `image` when set. */
  videoSrc: z.string().optional(),
});

const extraSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.mdx",
  schema: z.object({
    content: z.string(),
    slug: z.string(),
    index: z.string(),
    client: z.string(),
    title: z.string(),
    year: z.string(),
    cover: z.string(),
    role: z.string(),
    methodology: z.string().optional(),
    tools: z.string(),
    timeline: z.string(),
    extraSpecs: z.array(extraSpecSchema).optional(),
    blocks: z.array(blockSchema),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return { ...document, mdx };
  },
});

export default defineConfig({
  content: [projects],
});
