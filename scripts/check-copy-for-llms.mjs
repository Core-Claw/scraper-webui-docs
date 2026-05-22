#!/usr/bin/env node
/**
 * Smoke-test the Copy-for-LLMs Markdown endpoint output after `astro build`.
 *
 * Walks the build output (`dist/`) and inspects every `.md` file generated
 * by `src/pages/[...slug].md.ts`. Each generated Markdown file must:
 *   1. Exist for every docs collection entry (no missing slugs)
 *   2. Be at least MIN_BYTES bytes (cheap "not empty" check)
 *   3. Contain a top-level `# ` heading
 *
 * Failures are summarised at the end. The script exits with code 1 on any
 * failure so CI/`pnpm build` can fail loudly. Set COPY_LLMS_CHECK=warn to
 * downgrade failures to warnings if you need to ship anyway.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const DIST = path.join(ROOT, 'dist')
const CONTENT = path.join(ROOT, 'src', 'content', 'docs')

const MIN_BYTES = 80 // header alone is ~30 bytes; expect at least some body
const WARN_ONLY = process.env.COPY_LLMS_CHECK === 'warn'

async function walk(dir, predicate) {
    const out = []
    let entries
    try {
        entries = await readdir(dir, { withFileTypes: true })
    } catch (err) {
        if (err.code === 'ENOENT') return out
        throw err
    }
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            out.push(...(await walk(full, predicate)))
        } else if (predicate(full)) {
            out.push(full)
        }
    }
    return out
}

function toSlug(absPath, baseDir) {
    const rel = path.relative(baseDir, absPath).replace(/\\/g, '/')
    // Strip extension
    let slug = rel.replace(/\.(md|mdx)$/i, '')
    // Starlight collapses `foo/index` entries to slug `foo`, matching the
    // routing behaviour where `/api/index.md` becomes the `/api/` page.
    slug = slug.replace(/(^|\/)index$/i, '')
    return slug
}

function distMdPathForSlug(slug) {
    // Astro emits the .md endpoint as `dist/<slug>.md`. For an empty slug
    // (root index), that's `dist/.md` which is unusual but valid; we don't
    // expect the root home page to publish a Markdown export anyway.
    if (!slug) return path.join(DIST, 'index.md')
    return path.join(DIST, `${slug}.md`)
}

async function main() {
    const sourceFiles = await walk(CONTENT, p => /\.(md|mdx)$/i.test(p))
    if (sourceFiles.length === 0) {
        console.error('[copy-for-llms-check] No source docs found under', CONTENT)
        process.exit(1)
    }

    const expectedSlugs = sourceFiles
        .map(p => toSlug(p, CONTENT))
        // The Astro placeholder file we couldn't delete earlier has its own slug
        .filter(slug => !slug.endsWith('integration-placeholder'))
        // Skip locale roots — we don't generate .md for `home.mdx` /
        // `zh-cn/home.mdx`. The page chrome around them isn't useful as
        // Markdown for an LLM.
        .filter(slug => slug !== 'home' && slug !== 'zh-cn/home')
        // Skip the splash landing pages (`index.md` and `zh-cn/index.md`).
        // After `toSlug` collapses `index` they become '' and 'zh-cn'
        // respectively. Those pages are pure marketing chrome and don't
        // export a meaningful Markdown body.
        .filter(slug => slug !== '' && slug !== 'zh-cn')

    const missing = []
    const tooSmall = []
    const noHeading = []

    for (const slug of expectedSlugs) {
        const mdPath = distMdPathForSlug(slug)
        let st
        try {
            st = await stat(mdPath)
        } catch (err) {
            if (err.code === 'ENOENT') {
                missing.push({ slug, mdPath })
                continue
            }
            throw err
        }
        if (st.size < MIN_BYTES) {
            tooSmall.push({ slug, size: st.size, mdPath })
            continue
        }
        const body = await readFile(mdPath, 'utf8')
        if (!/^#\s+\S/m.test(body)) {
            noHeading.push({ slug, mdPath })
        }
    }

    const fail = missing.length + tooSmall.length + noHeading.length
    if (fail === 0) {
        console.log(
            `[copy-for-llms-check] OK — ${expectedSlugs.length} doc(s) verified`
        )
        return
    }

    console.error(
        `[copy-for-llms-check] ${fail} issue(s) across ${expectedSlugs.length} docs:`
    )
    if (missing.length) {
        console.error(`  Missing .md output (${missing.length}):`)
        for (const m of missing) console.error(`    - ${m.slug}  (expected ${path.relative(ROOT, m.mdPath)})`)
    }
    if (tooSmall.length) {
        console.error(`  .md output suspiciously small (< ${MIN_BYTES} bytes) (${tooSmall.length}):`)
        for (const m of tooSmall) console.error(`    - ${m.slug}  (${m.size} bytes)`)
    }
    if (noHeading.length) {
        console.error(`  .md output has no top-level heading (${noHeading.length}):`)
        for (const m of noHeading) console.error(`    - ${m.slug}`)
    }

    if (WARN_ONLY) {
        console.warn('[copy-for-llms-check] COPY_LLMS_CHECK=warn set — exiting 0 anyway')
        return
    }
    process.exit(1)
}

main().catch(err => {
    console.error('[copy-for-llms-check] fatal:', err)
    process.exit(1)
})
