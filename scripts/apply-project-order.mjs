/**
 * One-shot: set `order` and `category` in project MDX frontmatter to match the definitive archive.
 * Run: node scripts/apply-project-order.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/projects");

/** slug -> { order, category } */
const bySlug = {
  "mintstars-ecosystem": { order: 1, category: "product" },
  "bandcamp-redesign": { order: 2, category: "product" },
  "nda-digital-streaming-platform": { order: 3, category: "product" },
  aquarium: { order: 4, category: "product" },
  "popp-ai": { order: 5, category: "product" },
  "plugin-design": { order: 6, category: "product" },
  "match-tune": { order: 7, category: "product" },
  "wing-io": { order: 8, category: "product" },
  "the-riddle-festival-stage": { order: 1, category: "branding" },
  "2-delta-delta-records": { order: 2, category: "branding" },
  "basement-beats": { order: 3, category: "branding" },
  "dollymix-studios": { order: 4, category: "branding" },
  "event-posters": { order: 5, category: "branding" },
  "off-licence-clobber": { order: 6, category: "branding" },
  "honeycomb-ai": { order: 7, category: "branding" },
  mintstars: { order: 8, category: "branding" },
  "just-looking": { order: 1, category: "side-quest" },
  "new-beginning-ep-listening-party": { order: 2, category: "side-quest" },
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

  s = s.replace(/^category:.*$/m, `category: ${spec.category}`);

  if (/^order:/m.test(s)) {
    s = s.replace(/^order:.*$/m, `order: ${spec.order}`);
  } else {
    s = s.replace(/^(category:.*\n)/m, `$1order: ${spec.order}\n`);
  }

  fs.writeFileSync(path.join(dir, file), s);
  console.log("updated", file);
}
