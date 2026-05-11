// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
//
// Static assets: Vite’s default folder name is lowercase `public/`. Some environments create `Public/`;
// we resolve whichever exists (on case-sensitive disks they can differ). URLs stay `/images/...` etc.
import fs from "node:fs";
import path from "node:path";
import contentCollections from "@content-collections/vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function resolvePublicDir(): string {
  const root = process.cwd();
  const lower = path.join(root, "public");
  const upper = path.join(root, "Public");
  try {
    if (fs.statSync(lower).isDirectory()) return "public";
  } catch {
    /* not found */
  }
  try {
    if (fs.statSync(upper).isDirectory()) return "Public";
  } catch {
    /* not found */
  }
  return "public";
}

export default defineConfig({
  plugins: [contentCollections()],
  vite: {
    publicDir: resolvePublicDir(),
  },
});
