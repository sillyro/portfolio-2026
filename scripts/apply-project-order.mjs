/**
 * One-shot: set `order` (and dollymix-projects `category`) in project MDX frontmatter.
 * Run: node scripts/apply-project-order.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/projects");

/** slug -> { order, category? } category omitted = leave as-is in file */
const bySlug = {
  "mintstars-ecosystem": { order: 1 },
  "bandcamp-redesign": { order: 2 },
  "honeycomb-ai": { order: 3 },
  aquarium: { order: 4 },
  "match-tune": { order: 5 },
  mintstars: { order: 6 },
  "nda-digital-streaming-platform": { order: 7 },
  "plugin-design": { order: 8 },
  "popp-ai": { order: 9 },
  "wing-io": { order: 10 },
  "2-delta-delta-records": { order: 1 },
  "basement-beats": { order: 2 },
  "dollymix-projects": { order: 3, category: "branding" },
  "dollymix-studios": { order: 4 },
  "event-posters": { order: 5 },
  "off-licence-clobber": { order: 6 },
  "sugar-rush-sounds": { order: 7 },
  "the-riddle-festival-stage": { order: 8 },
  "just-looking": { order: 1 },
  "new-beginning-ep-listening-party": { order: 2 },
};

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const slug = file.replace(/\.mdx$/, "");
  const spec = bySlug[slug];
  if (!spec) {
    console.warn("No order map for", file);
    continue;
  }
  let s = fs.readFileSync(path.join(dir, file), "utf8");
  if (!s.startsWith("---")) continue;

  if (spec.category) {
    s = s.replace(/^category:.*$/m, `category: ${spec.category}`);
  }

  if (/^order:/m.test(s)) {
    s = s.replace(/^order:.*$/m, `order: ${spec.order}`);
  } else {
    s = s.replace(/^(category:.*\n)/m, `$1order: ${spec.order}\n`);
  }

  fs.writeFileSync(path.join(dir, file), s);
  console.log("updated", file);
}
