# Next-step integration guide

Two pieces of infrastructure are scaffolded and ready to use. This doc
covers what's done, what's pending, and what to flip on next.

---

## API Playground (B3)

**Where**: `src/components/ApiPlayground.astro`

**Status**: component built and styled, not yet embedded on any page.

### What it does

Renders one OpenAPI operation as a try-it-out form. Reads
`public/openapi.json` at build time, so the form schema, defaults, and
examples stay in sync with the source-of-truth spec — no runtime fetch.

For a given operation it shows:

- METHOD + path header (color-coded by verb)
- API-key field (only if the op declares `security: [{ apiKey: [] }]`),
  password-typed, persisted to `sessionStorage` so the user doesn't
  re-paste between operations within the same tab
- Query / path parameter inputs with placeholders pulled from the spec
- JSON body editor pre-filled with the first declared example
- Send Request → real `fetch` to production
- Response panel: status badge (green/orange/red), latency, pretty JSON

### How to embed it

#### Step 1 — convert the target page from `.md` to `.mdx`

```bash
mv src/content/docs/api/account/info.md src/content/docs/api/account/info.mdx
```

#### Step 2 — add the import below the frontmatter

```mdx
import ApiPlayground from '../../../components/ApiPlayground.astro'
```

Adjust the `../` count to match the file's depth.

#### Step 3 — drop the component anywhere in the body

```mdx
<ApiPlayground method="POST" path="/api/v1/account/info" />
```

That's it. The component looks the operation up in `openapi.json` and
renders the form. If the op isn't in the spec, the component shows a
visible inline error in dev — no silent failure.

### Critical: CORS

The browser will call `https://openapi.coreclaw.com` from
`https://docs.coreclaw.com`. The API needs to respond with:

```
Access-Control-Allow-Origin: https://docs.coreclaw.com
Access-Control-Allow-Headers: api-key, content-type
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

If CORS is missing, the playground surfaces a "Network error" status
with the browser's CORS message in the response panel. Coordinate with
the API team to allowlist the docs origin before going live.

### Recommended rollout

1. Pick **one** safe operation to dogfood first — `/api/v1/account/info`
   is a good candidate (read-only, low blast radius).
2. Verify CORS, then expand to the rest of the worker / run / task ops.
3. Consider adding a banner in dev/staging like
   "Requests will hit production" so users don't accidentally trigger
   real Worker runs.

### Future polish

- Pre-flight balance check before "Send Request" on operations that
  cost credits
- Save request history per operation in `localStorage`
- Generate curl / Python / Node code snippets below the form, rebuilt
  from current form values

---

## Edit on GitHub (B10) — already live

`astro.config.mjs` has:

```js
editLink: {
  baseUrl: 'https://github.com/Core-Claw/scraper-webui-docs/edit/main/',
}
```

Each page footer renders an "Edit page" link that opens GitHub's web
editor on the source file. No further action unless the repo moves.

---

## File map (current state)

| Path | Purpose |
|------|---------|
| `src/pages/[...slug].md.ts` | Markdown export endpoint (Container API + turndown) |
| `src/components/CopyForLLMs.astro` | Header dropdown — Copy / View / ChatGPT / Claude |
| `src/components/PageTitle.astro` | Header slot override (places button next to H1) |
| `src/components/Footer.astro` | Footer slot override — default EditLink + Pagination only |
| `src/components/ApiPlayground.astro` | Embeddable try-it-out form (B3, ready to use) |
| `scripts/check-copy-for-llms.mjs` | `pnpm build` post-check: every doc has a non-empty .md export |
| `astro.config.mjs` | Slot overrides + editLink + Expressive Code theme |
| `src/styles/common.css` | Code-block visual upgrade + aside/details polish + content-width tightening |
