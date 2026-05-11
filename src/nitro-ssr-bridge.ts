/**
 * Nitro only auto-wires the Vite SSR bridge when there is no HTML renderer template.
 * With `index.html` present, set `nitro.renderer.entry` to this file so requests hit
 * `fetch(req, { viteEnv: "ssr" })` (see `nitro/runtime/internal/vite/ssr-renderer.mjs`).
 */
export default function nitroSsrBridge({ req }: { req: Request }) {
  return globalThis.fetch(req, { viteEnv: "ssr" } as RequestInit & { viteEnv: string });
}
