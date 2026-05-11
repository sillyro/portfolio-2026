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
import { nitro } from "nitro/vite";

/**
 * Nitro (Vercel preset) must run instead of the Cloudflare plugin for deploys to Vercel.
 * - `VERCEL=1` is set on Vercel only if "System Environment Variables" is enabled for the project.
 * - `USE_VERCEL_NITRO=1` is set by `vercel.json` buildCommand so local `vercel build` and all deploys work regardless.
 */
const useVercelNitro =
  process.env.USE_VERCEL_NITRO === "1" ||
  process.env.USE_VERCEL_NITRO === "true" ||
  process.env.VERCEL === "1";

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
  // Lovable config injects @cloudflare/vite-plugin on `vite build` by default; that output is for Workers, not Vercel.
  cloudflare: useVercelNitro ? false : undefined,
  plugins: [contentCollections(), ...(useVercelNitro ? [nitro()] : [])],
  vite: {
    publicDir: resolvePublicDir(),
    // TanStack’s server packages use Vite-only `#…` import specifiers; keep them bundled in SSR output.
    ssr: {
      noExternal: [/^@tanstack\//],
    },
    // Preset lives on Vite’s `nitro` key (read by the Nitro plugin), not on `nitro()`’s argument.
    ...(useVercelNitro
      ? {
          nitro: {
            preset: "vercel",
            // With an `index.html` renderer template, Nitro skips auto-injection of the Vite SSR
            // bridge; without this, HTML never reaches TanStack and you get a static shell only.
            renderer: {
              entry: path.join(process.cwd(), "src/nitro-ssr-bridge.ts"),
            },
          },
        }
      : {}),
  },
});
