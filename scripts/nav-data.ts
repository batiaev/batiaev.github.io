/*
 * Writes src/data/nav.generated.json — the shell's slice of the site copy.
 * See src/lib/buildNavData.ts for why it exists. Run after changing the
 * registry, the tools list, the name, the chip or the social links.
 */
import fs from 'node:fs'
import path from 'node:path'
import { serialiseNavData } from '../src/lib/buildNavData'

const target = path.resolve('src/data/nav.generated.json')
fs.writeFileSync(target, serialiseNavData())
console.log(`Wrote ${path.relative(process.cwd(), target)}`)
