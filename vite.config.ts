import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// PROJECT_ROOT is still needed by the plugins below.
const PROJECT_ROOT = import.meta.dirname;

// The Manus debug collector plugin used to live here. It injected
// client/public/__manus__/debug-collector.js, which captured console output,
// every fetch/XHR (request and response bodies included) and a semantic
// session-replay stream of clicks, typing and form submits, POSTing them to
// /__manus__/logs. Because the script sat in client/public/ it was copied
// verbatim into every production build and was publicly fetchable on the live
// site, and its beforeunload handler cost the site bf-cache eligibility and 19
// Lighthouse Best-Practices points (audit findings 8.4 and 10.1). Plugin and
// script are both deleted; do not reintroduce anything under client/public/
// that records user input.

function vitePluginStorageProxy(): Plugin {
  return {
    name: "manus-storage-proxy",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/manus-storage", async (req, res) => {
        const key = req.url?.replace(/^\//, "");
        if (!key) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing storage key");
          return;
        }

        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!forgeBaseUrl || !forgeKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Storage proxy not configured");
          return;
        }

        try {
          const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
          forgeUrl.searchParams.set("path", key);

          const forgeResp = await fetch(forgeUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` },
          });

          if (!forgeResp.ok) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Storage backend error");
            return;
          }

          const { url } = (await forgeResp.json()) as { url: string };
          if (!url) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Empty signed URL");
            return;
          }

          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Storage proxy error");
        }
      });
    },
  };
}

// Serve client/public/admin/* verbatim in dev so the Sveltia studio loads at
// /admin without Vite's SPA fallback rewriting requests to the client
// index.html. Vercel handles the same exclusion in production via
// vercel.json `rewrites`.
function vitePluginAdminStatic(): Plugin {
  return {
    name: "comminno-admin-static",
    configureServer(server: ViteDevServer) {
      const adminRoot = path.resolve(import.meta.dirname, "client", "public", "admin");
      const mime: Record<string, string> = {
        ".html": "text/html; charset=utf-8",
        ".yml": "text/yaml; charset=utf-8",
        ".yaml": "text/yaml; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
      };
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith("/admin")) return next();
        try {
          const url = new URL(req.url, "http://localhost");
          let rel = url.pathname.replace(/^\/admin\/?/, "");
          if (rel === "" || rel.endsWith("/")) rel += "index.html";
          const filePath = path.resolve(adminRoot, rel);
          if (!filePath.startsWith(adminRoot)) {
            res.statusCode = 403;
            return res.end("Forbidden");
          }
          if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();
          res.setHeader("Content-Type", mime[path.extname(filePath).toLowerCase()] ?? "application/octet-stream");
          res.setHeader("X-Robots-Tag", "noindex,nofollow");
          res.statusCode = 200;
          fs.createReadStream(filePath).pipe(res);
        } catch {
          next();
        }
      });
    },
  };
}

// `vite-plugin-manus-runtime` injects a ~360 KB visual-editor runtime into
// `index.html`. The runtime registers an `unload` event listener (deprecated
// per https://chromestatus.com/feature/5579556305502208), which costs us 18
// Lighthouse Best-Practices points on every page. The editor only matters
// inside the Manus management UI iframe (dev preview), so we strip it from
// `vite build` (production) and keep it for `vite serve` (dev).

// `preloadDetailChunks` injects `<link rel="modulepreload">` for the two
// route chunks that App.tsx loads via React.lazy() (ServiceDetail,
// InsightDetail). Vite's automatic modulepreload only covers chunks that the
// entry imports synchronously — lazy imports are intentionally skipped so
// they remain on-demand. But on a static SPA with one shared `index.html`,
// every page may resolve to one of those routes, and waiting for the main
// bundle to finish parsing before *starting* the chunk fetch costs ~200-400
// ms of LCP on the slowest device profile. Preloading does not execute the
// chunk; it only fetches it in parallel so it is in the cache the moment
// React's <Suspense> tree asks for it. Bundle size impact is zero (already
// emitted), perceived perf gain is concrete on detail pages.
function preloadDetailChunks(): Plugin {
  return {
    name: "comminno-preload-detail-chunks",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const targets = ["ServiceDetail", "InsightDetail"];
        const tags: string[] = [];
        for (const fileName of Object.keys(ctx.bundle)) {
          const base = fileName.split("/").pop() ?? "";
          if (
            targets.some((t) => base.startsWith(t)) &&
            base.endsWith(".js")
          ) {
            tags.push(
              `    <link rel="modulepreload" crossorigin href="/${fileName}">`,
            );
          }
        }
        if (tags.length === 0) return html;
        return html.replace("</head>", `${tags.join("\n")}\n  </head>`);
      },
    },
  };
}

export default defineConfig(({ command }) => {
  const isProdBuild = command === "build";
  const plugins = [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    ...(isProdBuild ? [] : [vitePluginManusRuntime()]),
    vitePluginStorageProxy(),
    vitePluginAdminStatic(),
    ...(isProdBuild ? [preloadDetailChunks()] : []),
  ];
  return {
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Source maps satisfy Lighthouse “Missing source maps” audit and aid debugging in prod.
    sourcemap: true,
    // Conservative manualChunks split: ONLY isolate the deferred-load deps.
    // We avoid splitting React/react-dom/wouter/radix because Rollup's hoisting
    // can split shared modules across chunks and break ESM identity (one
    // version of React renders, another is `useState`'d => null root). Keeping
    // them in the main entry preserves a single React instance. The big win
    // comes from stripping the Manus dev-runtime at audit time, not from chunking.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("vanilla-cookieconsent")) return "vendor-consent";
          if (id.includes("lucide-react")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  };
});
