# CoreClaw Documentation

This repository contains the source content and configuration for the CoreClaw documentation site at [docs.coreclaw.com](https://docs.coreclaw.com/), built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

For the Chinese version of this guide, see [`README.zh-CN.md`](./README.zh-CN.md).

## Documentation Architecture

The CoreClaw docs are organized into distinct content areas, each serving a specific audience:

### Content Areas

| Section | Audience | Purpose |
| --- | --- | --- |
| Getting Started | New users | Platform overview, account setup, first Worker run |
| User Guide | End users | Running Workers, viewing results, pricing, API calls |
| Developer Guide | Worker developers | Building, testing, publishing, and monetizing Workers |
| API Reference | API consumers | Complete endpoint documentation with request/response schemas |
| Website Events | All users | Platform events and promotions |
| Platform Policies | All users | Terms, privacy, and usage policies |
| FAQ | All users | Common questions and troubleshooting |
| Changelog | All users | Platform and documentation updates |

### Multi-Language Structure

- **English** (`/`) — default language, authoritatively maintained
- **Simplified Chinese** (`/zh-cn/`) — full translation maintained in parallel

All content directories under `src/content/docs/` and `src/content/docs/zh-cn/` mirror each other. When adding or updating content, both language versions should be kept in sync.

## Key Conventions

### Worker / Scraper Terminology

The CoreClaw platform uses two terms for the same concept:

- **Worker** — used throughout the documentation and UI to refer to a data extraction script
- **Scraper** — used in API paths and field names for backward compatibility (`scraper_slug`, `/api/v1/scraper/run`)

### API Documentation

The API reference is structured around endpoint groups:

- **Worker** — `/api/v1/scraper/*` endpoints for starting, aborting, and inspecting Worker runs
- **Runs** — `/api/v1/run/*` endpoints for history, results, logs, and exports
- **Tasks** — `/api/v1/task/*` endpoints for saved Task templates
- **Account** — `/api/v1/account/*` endpoints for user account information

Each endpoint page documents the HTTP method, path, request parameters, response schema, and error codes. The [API index page](https://docs.coreclaw.com/api/) includes a complete endpoint quick reference table.

An `openapi.swagger.json` file is kept locally for API schema reference but is excluded from version control (see `.gitignore`).

### Sidebar Configuration

Navigation is defined manually in `astro.config.mjs` using explicit `items` arrays. This gives full control over:
- Section labels and ordering
- Translation of labels across languages
- Collapsible groups and nesting depth
- Badge annotations (e.g., "Required")

## Repository Structure

```text
.
├── public/                         # Static assets served as-is
├── src/
│   ├── assets/                     # Images and logos used at build time
│   ├── components/                 # Custom Astro components (Header, Banner, TOC)
│   ├── content/docs/               # English documentation (default locale)
│   │   ├── api/                    #   API reference
│   │   ├── developer-guide/        #   Developer documentation
│   │   ├── user-guide/             #   End-user documentation
│   │   ├── getting-started/        #   Onboarding
│   │   ├── website-events/         #   Events and promotions
│   │   ├── platform-policies/      #   Legal and policy pages
│   │   ├── faq/                    #   Frequently asked questions
│   │   ├── changelog.mdx           #   Changelog
│   │   └── zh-cn/                  # Simplified Chinese mirror
│   └── styles/common.css           # Global CSS overrides
├── astro.config.mjs                # Astro + Starlight configuration
├── package.json
└── tsconfig.json
```

## Tech Stack

| Component | Role |
| --- | --- |
| [Astro](https://astro.build/) | Static site generator |
| [Starlight](https://starlight.astro.build/) | Documentation theme (sidebar, search, i18n) |
| [React](https://react.dev/) | Interactive UI components |
| `starlight-image-zoom` | Image zoom plugin |
| `sharp` | Image optimization |

## Local Development

```bash
npm install          # Install dependencies (Node.js 18+, npm 9+)
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Build to dist/
npm run preview      # Preview built output
```

## Quality Checks

Before committing, run `npm run build` and verify:

- No content rendering errors
- Sidebar order matches expectations in both languages
- English and Chinese pages are structurally aligned
- No broken internal links or missing asset references

## References

- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [CoreClaw Docs (live)](https://docs.coreclaw.com/)