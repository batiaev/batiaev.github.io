/*
 * Bundles a script and runs it under Node.
 *
 * The npm scripts used to call the esbuild CLI directly, but MDX needs a
 * plugin and plugins are only available through the JS API — so every
 * build-time script goes through here to keep one definition of how the
 * project compiles.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import mdx from "@mdx-js/esbuild";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const entry = process.argv[2];
if (!entry) {
  console.error("usage: node scripts/run.mjs <entry.ts|tsx>");
  process.exit(1);
}

const name = path.basename(entry).replace(/\.(tsx?|mjs)$/, "");
const outfile = path.resolve(`node_modules/.cache/${name}.mjs`);

await esbuild.build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  jsx: "automatic",
  logLevel: "error",
  // React and friends stay external so the bundle uses the installed copies
  // rather than a second instance, which breaks hooks.
  packages: "external",
  alias: { "@": path.resolve("src") },
  loader: { ".css": "empty" },
  // remark-gfm gives MDX tables, which plain CommonMark does not have.
  plugins: [mdx({ jsxImportSource: "react", remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] })],
});

await import(pathToFileURL(outfile).href);
