/**
 * Reads data/webflow-projects.csv and writes content/projects/<slug>.mdx
 * Run: node scripts/migrate-webflow-csv.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "data", "webflow-projects.csv");
const outDir = path.join(root, "content", "projects");

const KINDS = ["system", "flow", "type", "color"];

const MAIN_CATEGORY_TO_ROLE = {
  "user-interface-design": "UI Designer",
  "user-experience-design": "UX Designer",
  "ux-research": "UX Researcher",
  "dolorem-itaque": "Brand & Visual Designer",
  "eveniet-unde": "Event & Experience Design",
  "poster-design": "Graphic Designer",
  "creative-project": "Creative Director",
  "fashion-design": "Fashion Designer",
  "event-documentation": "Documentation & Content",
  placeat: "Product Designer",
  "magni-ducimus": "Product Designer",
  "et-autem-molestiae": "Product Designer",
};

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function roleFromMainCategory(main) {
  const key = (main ?? "").trim().toLowerCase();
  if (!key) return "Designer";
  return MAIN_CATEGORY_TO_ROLE[key] ?? humanizeSlug(key);
}

function parseBool(v) {
  if (v === undefined || v === null || v === "") return false;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function yearFromProjectDate(projectDate) {
  if (!projectDate) return "—";
  const m = String(projectDate).match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : "—";
}

function htmlToMarkdown(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  s = s.replace(/<p[^>]*>/gi, "");
  s = s.replace(/<\/p>/gi, "\n\n");
  s = s.replace(/<ul[^>]*>/gi, "\n");
  s = s.replace(/<\/ul>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "- ");
  s = s.replace(/<\/li>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function yamlDoubleQuoted(s) {
  if (s === undefined || s === null) return '""';
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "")}"`;
}

function galleryUrls(galleryCell) {
  if (!galleryCell) return [];
  return String(galleryCell)
    .split(";")
    .map((u) => u.trim())
    .filter(Boolean);
}

function captionFromUrl(url, i) {
  try {
    const u = new URL(url);
    const last = decodeURIComponent(u.pathname.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
    if (last) return last.replace(/[-_]+/g, " ").slice(0, 120);
  } catch {
    /* ignore */
  }
  return `Gallery frame ${String(i + 1).padStart(2, "0")}`;
}

function buildBlocks(galleryCell, coverUrl) {
  const urls = galleryUrls(galleryCell);
  if (urls.length === 0) {
    const img = coverUrl?.trim();
    return [
      {
        kind: "system",
        title: "Overview",
        caption: img ? "Portfolio card and key visual from the archive." : "Gallery assets were not exported for this entry.",
        image: img || undefined,
      },
    ];
  }
  return urls.map((image, i) => ({
    kind: KINDS[i % KINDS.length],
    title: `Gallery ${String(i + 1).padStart(2, "0")}`,
    caption: captionFromUrl(image, i),
    image,
  }));
}

function indexFromRow(row, i) {
  const po = parseInt(String(row["Portfolio order"] ?? "").trim(), 10);
  if (!Number.isNaN(po) && po >= 0) return `F/${String(po).padStart(2, "0")}`;
  return `W/${String(i + 1).padStart(2, "0")}`;
}

function buildExtraSpecs(row, archived, draft) {
  const specs = [{ label: "Status", value: archived ? "Archived" : "Live" }];
  if (draft) specs.push({ label: "Draft", value: "Yes" });
  const link = (row["Link to project"] ?? "").trim();
  if (link) specs.push({ label: "Project link", value: link });
  const live = (row["Live Project"] ?? "").trim();
  if (live) specs.push({ label: "Live", value: live });
  const vid = (row["Video Link"] ?? "").trim();
  if (vid) specs.push({ label: "Video", value: vid });
  const ux = (row["UX portfolio?"] ?? "").trim();
  if (ux) specs.push({ label: "UX portfolio", value: ux });
  const c2 = (row["Category 2"] ?? "").trim();
  const c3 = (row["Category 3"] ?? "").trim();
  const c4 = (row["Category 4"] ?? "").trim();
  if (c2) specs.push({ label: "Category", value: humanizeSlug(c2) });
  if (c3) specs.push({ label: "Category", value: humanizeSlug(c3) });
  if (c4) specs.push({ label: "Category", value: humanizeSlug(c4) });
  return specs;
}

function buildMdx(row, i) {
  const slug = (row.Slug ?? "").trim();
  if (!slug) throw new Error(`Row ${i + 2}: missing Slug`);

  const name = (row.Name ?? "").trim();
  const title = name || humanizeSlug(slug);
  const client = title;
  const descriptionRaw = (row.Description ?? "").trim();
  const deliverablesRaw = (row.Deliverables ?? "").trim();
  const descMd = htmlToMarkdown(descriptionRaw);
  const delMd = htmlToMarkdown(deliverablesRaw);

  let body = descMd || "_Details to follow._";
  if (delMd) {
    body += `\n\n## Deliverables\n\n${delMd}`;
  }

  if (body.includes("\n---\n")) {
    body = body.replace(/\n---\n/g, "\n\\---\n");
  }
  if (body.startsWith("---")) {
    body = `\\---${body.slice(3)}`;
  }

  const year = yearFromProjectDate(row["Project date"]);
  const cover = (row["Card image"] ?? "").trim() || "https://uploads-ssl.webflow.com/651da38491f4e10b7daa6409/651da38491f4e10b7daa6449_Placeholder-Image.svg";
  const role = roleFromMainCategory(row["Main category"]);
  const tools = "Figma · Webflow";
  const timeline = year !== "—" ? year : "—";
  const index = indexFromRow(row, i);
  const archived = parseBool(row.Archived);
  const draft = parseBool(row.Draft);
  const blocks = buildBlocks(row.Gallery, cover);
  const extraSpecs = buildExtraSpecs(row, archived, draft);

  const blocksYaml = blocks
    .map((b) => {
      const imgLine = b.image ? `\n    image: ${yamlDoubleQuoted(b.image)}` : "";
      return `  - kind: ${b.kind}
    title: ${yamlDoubleQuoted(b.title)}
    caption: ${yamlDoubleQuoted(b.caption)}${imgLine}`;
    })
    .join("\n");

  const extrasYaml = extraSpecs
    .map((e) => `  - label: ${yamlDoubleQuoted(e.label)}\n    value: ${yamlDoubleQuoted(e.value)}`)
    .join("\n");

  return `---
slug: ${slug}
index: ${index}
client: ${yamlDoubleQuoted(client)}
title: ${yamlDoubleQuoted(title)}
year: ${yamlDoubleQuoted(year)}
cover: ${yamlDoubleQuoted(cover)}
role: ${yamlDoubleQuoted(role)}
tools: ${yamlDoubleQuoted(tools)}
timeline: ${yamlDoubleQuoted(timeline)}
extraSpecs:
${extrasYaml}
blocks:
${blocksYaml}
---

${body}
`;
}

const raw = fs.readFileSync(csvPath, "utf8");
const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: false,
});

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let n = 0;
for (let i = 0; i < records.length; i++) {
  const row = records[i];
  const slug = (row.Slug ?? "").trim();
  if (!slug) continue;
  const mdx = buildMdx(row, i);
  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), mdx, "utf8");
  n += 1;
}

console.log(`Wrote ${n} MDX files to ${path.relative(root, outDir)}`);
