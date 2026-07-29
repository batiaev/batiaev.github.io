/*
 * Writes public/sitemap.xml from the same registry the router and prerenderer
 * use, so a page cannot exist on the site and be missing from the sitemap.
 */
import fs from 'node:fs'
import path from 'node:path'
import { ALL_PAGES, learnPath, orphanedNotes } from '../src/learn/registry'

const ORIGIN = 'https://batiaev.com'

const orphans = orphanedNotes()
if (orphans.length > 0) {
  console.error(`Strategy notes with no matching preset: ${orphans.join(', ')}`)
  process.exit(1)
}

const entries: { loc: string; priority: string }[] = [
  { loc: '/', priority: '1.0' },
  { loc: '/tools', priority: '0.9' },
  { loc: '/tools/options-pnl', priority: '0.9' },
  { loc: '/tools/hedging', priority: '0.8' },
  { loc: '/tools/take-home', priority: '0.8' },
  { loc: '/tools/offer', priority: '0.8' },
  { loc: '/learn', priority: '0.9' },
  ...ALL_PAGES.map((page) => ({ loc: learnPath(page.slug), priority: '0.7' })),
  { loc: '/advisory', priority: '0.6' },
]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(({ loc, priority }) =>
    [
      '  <url>',
      `    <loc>${ORIGIN}${loc}</loc>`,
      '    <changefreq>monthly</changefreq>',
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n')

const target = path.resolve('public/sitemap.xml')
fs.writeFileSync(target, xml)
console.log(`Wrote ${entries.length} URLs to public/sitemap.xml`)
