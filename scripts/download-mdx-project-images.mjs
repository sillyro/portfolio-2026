/**
 * Finds http(s) image URLs in content/projects/*.mdx, downloads them under
 * public/images/projects/_imported/, and rewrites MDX to use local /images/... paths.
 *
 * Run: node scripts/download-mdx-project-images.mjs
 * Optional: --dry-run (list URLs only, no download / no write)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const projectsDir = path.join(root, "content", "projects");
const outDir = path.join(root, "public", "images", "projects", "_imported");

/** Match absolute image URLs (not videos). Body + YAML. */
const HTTP_IMAGE_RE =
  /https?:\/\/[^\s"'`<>\])]+?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s"'`<>\])]*)?/gi;

const dryRun = process.argv.includes("--dry-run");

function shortHash(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 10);
}

function fileNameFromUrl(url) {
  let pathname;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return `asset-${shortHash(url)}.bin`;
  }
  const decoded = decodeURIComponent(pathname.split("/").pop() || "image");
  const safe = decoded
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 100);
  return safe || `image-${shortHash(url)}.png`;
}

function isSkippable(url) {
  const u = url.toLowerCase();
  if (u.includes(".mp4") || u.includes(".webm") || u.includes(".mov")) return true;
  return false;
}

function collectUrlsFromMdx(text) {
  const set = new Set();
  for (const m of text.matchAll(HTTP_IMAGE_RE)) {
    const url = m[0];
    if (isSkippable(url)) continue;
    if (url.includes("/images/projects/")) continue;
    set.add(url);
  }
  return [...set];
}

async function downloadToFile(url, destPath) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "rohan-misra-portfolio-image-mirror/1.0",
      Accept: "image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("text/html")) {
    throw new Error(`Got HTML instead of image for ${url}`);
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

async function main() {
  if (!fs.existsSync(projectsDir)) {
    console.error("Missing", projectsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const filePaths = files.map((f) => path.join(projectsDir, f));

  /** @type {Map<string, string>} */
  const urlToLocal = new Map();

  for (const fp of filePaths) {
    const text = fs.readFileSync(fp, "utf8");
    for (const url of collectUrlsFromMdx(text)) {
      if (!urlToLocal.has(url)) {
        const base = fileNameFromUrl(url);
        const localName = `${shortHash(url)}_${base}`;
        const webPath = `/images/projects/_imported/${localName}`;
        urlToLocal.set(url, webPath);
      }
    }
  }

  console.log(`Found ${urlToLocal.size} unique image URL(s) across ${files.length} MDX file(s).`);
  if (dryRun) {
    for (const [u, p] of urlToLocal) console.log(" ", p, "<-", u);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  let ok = 0;
  let fail = 0;
  for (const [url, webPath] of [...urlToLocal.entries()]) {
    const localName = path.basename(webPath);
    const diskPath = path.join(outDir, localName);
    try {
      if (fs.existsSync(diskPath) && fs.statSync(diskPath).size > 0) {
        console.log("skip (exists):", localName);
      } else {
        console.log("download:", localName);
        await downloadToFile(url, diskPath);
      }
      ok += 1;
    } catch (e) {
      console.error("FAIL:", url, e.message);
      fail += 1;
      urlToLocal.delete(url);
    }
  }

  let updatedFiles = 0;
  for (const fp of filePaths) {
    let text = fs.readFileSync(fp, "utf8");
    let changed = false;
    for (const [url, webPath] of urlToLocal) {
      if (!text.includes(url)) continue;
      const next = text.split(url).join(webPath);
      if (next !== text) {
        text = next;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(fp, text, "utf8");
      updatedFiles += 1;
      console.log("updated:", path.relative(root, fp));
    }
  }

  console.log(`Done. Downloaded OK: ${ok}, failed: ${fail}, MDX files updated: ${updatedFiles}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
