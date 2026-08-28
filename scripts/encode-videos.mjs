/**
 * One-off: re-encodes the portfolio masters into public/assets/video/.
 *
 * These films used to be delivered by Cloudinary under a `w_540,q_auto`
 * transformation, which is why nothing here ships a master: no grid on the site
 * shows a film wider than ~380 CSS px, so 540 keeps it 1.5x oversampled. The
 * Cloudinary account is gone, so the same resize now happens once, here, and
 * the result is committed.
 *
 * Audio is dropped: every tile renders through <AutoVideo>, which is hard-muted
 * and exposes no controls, so not one byte of it was ever audible.
 *
 * Kept in the repo rather than run and deleted so the next film can be added
 * with the same settings instead of a guess. Not part of `npm run build` —
 * run it by hand:  node scripts/encode-videos.mjs
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'assets', 'video')

/** The width Cloudinary was asked for, and the width work.js still defaults to. */
const WIDTH = 540

const D = '/home/ajmal/Downloads'
const G = `${D}/drive-download-20260702T084850Z-3-001`

/** work.js id -> [master, output slug]. Masters, not the pre-optimised copies. */
const SOURCES = {
  v24: [`${G}/IMG_4782 (1).MOV`, 'img-4782'],
  v23: [`${G}/Arveen Perfume.MOV`, 'arveen-perfume'],
  v25: [`${D}/bici.mp4`, 'bici'],
  v1: [`${D}/WhatsApp Video 2026-07-01 at 6.33.30 PM.mp4`, 'whatsapp-video-01'],
  v26: [`${D}/2nd Trial.mp4`, '2nd-trial'],
  v7: [`${D}/WhatsApp Video 2026-07-01 at 6.34.08 PM.mp4`, 'whatsapp-video-03'],
  v8: [`${D}/WhatsApp Video 2026-07-01 at 6.34.03 PM.mp4`, 'whatsapp-video-04'],
  v6: [`${D}/WhatsApp Video 2026-07-01 at 6.34.09 PM.mp4`, 'whatsapp-video-02'],
  v11: [`${G}/Video-938.mp4`, 'video-938'],
  v12: [`${G}/Video-680.mp4`, 'video-680'],
  v14: [`${G}/paris panini.mp4`, 'paris-panini'],
  v15: [`${G}/hf_20260207_103020_648c7540-620a-4197-ad27-4d5ffc906909.mp4`, 'ai-film-01'],
  v16: [`${D}/MARKI's (advertisement).mp4`, 'markis-advertisement'],
  v17: [`${G}/hf_20260207_073652_de7f4965-6c37-447e-a466-a77726abf560.mp4`, 'ai-film-02'],
  v20: [`${G}/Lakme AD.mov`, 'lakme-ad'],
  v21: [`${G}/Lenskart.mp4`, 'lenskart'],
}

const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args])
const mb = (p) => (statSync(p).size / 1048576).toFixed(1)

mkdirSync(outDir, { recursive: true })

let totalIn = 0
let totalOut = 0

for (const [id, [src, slug]] of Object.entries(SOURCES)) {
  if (!existsSync(src)) {
    console.log(`${id.padEnd(4)} ${slug.padEnd(22)} SOURCE MISSING — ${src}`)
    continue
  }
  const mp4 = join(outDir, `${slug}.mp4`)
  const jpg = join(outDir, `${slug}.jpg`)

  // -2 keeps the height even (H.264 needs it) while preserving the true aspect,
  // which is what Cloudinary's w_540 did. The declared width/height in work.js
  // drive CSS layout only and are deliberately left alone.
  ff([
    '-i', src,
    '-vf', `scale=${WIDTH}:-2`,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '26',
    '-profile:v', 'main', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-an',
    mp4,
  ])

  // The poster replaces Cloudinary's `so_0` .jpg derivative, so a tile paints
  // before a byte of video moves.
  ff(['-i', src, '-vf', `scale=${WIDTH}:-2`, '-frames:v', '1', '-q:v', '4', jpg])

  totalIn += statSync(src).size
  totalOut += statSync(mp4).size + statSync(jpg).size
  console.log(
    `${id.padEnd(4)} ${slug.padEnd(22)} ${mb(src).padStart(6)} MB -> ` +
      `${mb(mp4).padStart(5)} MB mp4 + ${mb(jpg).padStart(4)} MB jpg`,
  )
}

console.log(
  `\nmasters ${(totalIn / 1048576).toFixed(0)} MB -> shipped ` +
    `${(totalOut / 1048576).toFixed(1)} MB in public/assets/video/`,
)
