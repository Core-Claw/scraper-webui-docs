import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, render } from 'astro:content'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import reactRenderer from '@astrojs/react/server.js'
import TurndownService from 'turndown'

export const getStaticPaths: GetStaticPaths = async () => {
    const docs = await getCollection('docs')
    return docs
        .filter(d => {
            if (!d.id) return false
            // Starlight maps `home.mdx` to `/` and `zh-cn/home.mdx` to `/zh-cn/`.
            // We don't generate a `.md` for the locale roots.
            if (d.id === 'home' || d.id === 'zh-cn/home') return false
            // Splash landing pages (`index.md` and `zh-cn/index.md`) are
            // pure marketing chrome — skip them too.
            if (d.id === 'index' || d.id === 'zh-cn/index') return false
            return true
        })
        .map(d => ({
            // Starlight collapses `foo/index.md` to slug `foo`; mirror that here
            // so the .md endpoint resolves at `/foo.md` instead of `/foo/index.md`.
            params: { slug: d.id.replace(/(^|\/)index$/i, '') },
            props: { entryId: d.id },
        }))
}

// Build a single Container instance lazily and reuse it.
let containerPromise: Promise<InstanceType<typeof AstroContainer>> | null = null
async function getContainer() {
    if (!containerPromise) {
        containerPromise = (async () => {
            const c = await AstroContainer.create()
            // The site has @astrojs/react installed; some MDX pages may
            // depend on the React renderer being available even if they
            // don't render React components directly.
            try {
                c.addServerRenderer({ name: '@astrojs/react', renderer: reactRenderer as any })
            } catch {
                // ignore — renderer may already be registered
            }
            return c
        })()
    }
    return containerPromise
}

function buildTurndown() {
    const td = new TurndownService({
        codeBlockStyle: 'fenced',
        headingStyle: 'atx',
        bulletListMarker: '-',
        emDelimiter: '_',
    })

    // Preserve fenced code blocks with the language hint Starlight injects via Shiki.
    td.addRule('fencedCodeBlock', {
        filter: (node: any) =>
            node.nodeName === 'PRE' &&
            node.firstChild &&
            node.firstChild.nodeName === 'CODE',
        replacement: (_content: string, node: any) => {
            const code = node.firstChild as HTMLElement
            const className = code.getAttribute('class') || ''
            const langMatch = className.match(/language-(\S+)/)
            const lang = langMatch ? langMatch[1] : ''
            const text = (code.textContent || '').replace(/\n$/, '')
            return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`
        },
    })

    // Strip Starlight chrome that leaks into rendered output (anchor links, copy buttons, etc.).
    td.remove(['script', 'style', 'noscript', 'svg'])
    td.addRule('stripStarlightAnchors', {
        filter: (node: any) =>
            node.nodeName === 'A' &&
            (node.getAttribute('class') || '').includes('anchor-link'),
        replacement: () => '',
    })

    return td
}

/**
 * Render a content collection entry to plain Markdown.
 *
 * Two-stage strategy:
 *   1. Use Astro's experimental Container API to render the MDX/MD entry to
 *      HTML, then convert with turndown. This produces output that reflects
 *      Starlight components (Steps, Tabs, Cards) as the user sees them.
 *   2. If Container rendering fails (some MDX pages with raw HTML or
 *      integrations that haven't been registered can throw), fall back to
 *      the entry's raw markdown body so the user always gets *something*.
 */
async function renderEntryToMarkdown(entry: any): Promise<string> {
    try {
        const { Content } = await render(entry)
        const container = await getContainer()
        const html = await container.renderToString(Content)
        const td = buildTurndown()
        return td.turndown(html)
    } catch (err) {
        console.warn(
            `[copy-for-llms] Container render failed for "${entry.id}", ` +
                `falling back to raw body. Error: ${err instanceof Error ? err.message : err}`
        )
        // Fall back to the raw markdown source. Strip MDX import/JSX lines
        // best-effort so the LLM doesn't see component machinery.
        const raw = (entry.body || '') as string
        const stripped = raw
            // Drop ESM imports MDX files put at the top
            .replace(/^\s*import[^\n]*\n/gm, '')
            // Drop self-closing JSX tags on their own line
            .replace(/^\s*<[A-Z][^>]*\/>\s*$/gm, '')
        return stripped
    }
}

export const GET: APIRoute = async ({ params, props, site }) => {
    const slug = params.slug || ''
    const docs = await getCollection('docs')
    // Prefer the `entryId` prop captured at getStaticPaths time, since the
    // public slug (e.g. "api") may differ from the entry id (e.g. "api/index").
    const entryId = (props as { entryId?: string } | undefined)?.entryId
    const entry =
        (entryId && docs.find(d => d.id === entryId)) ||
        docs.find(d => d.id === slug)

    if (!entry) {
        return new Response(`Not found: ${slug}`, { status: 404 })
    }

    const title = (entry.data as { title?: string }).title || slug
    const description = (entry.data as { description?: string }).description
    const header = description
        ? `# ${title}\n\n> ${description}\n\n`
        : `# ${title}\n\n`

    let body: string
    try {
        body = await renderEntryToMarkdown(entry)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.warn(`[copy-for-llms] markdown render failed for "${slug}": ${message}`)
        const sourceUrl = site
            ? new URL(`/${slug}/`, site).toString()
            : `/${slug}/`
        body =
            `_This page could not be rendered as Markdown. ` +
            `Visit the source at ${sourceUrl} for the full content._\n`
    }

    // Build-time guard: if rendering produced no usable body, surface a
    // visible warning into the output so reviewers notice during a manual
    // smoke test instead of silently shipping a half-empty document.
    const trimmed = body.trim()
    if (trimmed.length === 0) {
        body =
            `_Rendered Markdown for this page is empty. ` +
            `This is likely a regression in the Markdown export pipeline._\n`
    }

    return new Response(header + body, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
        },
    })
}
