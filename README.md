# CoreClaw Documentation

CoreClaw documentation repository built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/), providing both English and Simplified Chinese documentation.

This repository contains the documentation content, sidebar configuration, landing pages, custom UI components, and theme styling for the CoreClaw docs site. It is used for local development, content maintenance, version updates, and static site deployment.

For the Chinese version of this repository guide, see [`README.zh-CN.md`](./README.zh-CN.md).

## Overview

- Documentation framework: Astro + Starlight
- UI customization: custom header, banner, table of contents, mobile footer, and related components
- Languages:
  - English (default)
  - Simplified Chinese (`/zh-cn/`)
- Main content areas:
  - Getting Started
  - User Guide
  - Developer Guide
  - API Reference
  - Website Events
  - Platform Policies
  - FAQ
  - Changelog

## Tech Stack

- [Astro](https://astro.build/)
- [Starlight](https://starlight.astro.build/)
- [React](https://react.dev/) for selected extension points
- `starlight-image-zoom`
- `sharp`

## Repository Structure

```text
.
├── public/                         # Static files copied as-is
├── src/
│   ├── assets/                     # Build-time assets (images, logos, etc.)
│   │   ├── docs/
│   │   └── logo.png
│   ├── components/                 # Custom Starlight components
│   │   ├── Banner.astro
│   │   ├── Header.astro
│   │   ├── MobileMenuFooter.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   └── docs/                   # Documentation content root
│   │       ├── about-coreclaw/
│   │       ├── api/
│   │       ├── developer-guide/
│   │       ├── faq/
│   │       ├── getting-started/
│   │       ├── platform-policies/
│   │       ├── user-guide/
│   │       ├── website-events/
│   │       ├── changelog.mdx
│   │       ├── index.md            # English landing page
│   │       └── zh-cn/              # Simplified Chinese docs
│   └── styles/
│       └── common.css              # Global styles
├── astro.config.mjs                # Astro / Starlight configuration
├── package.json                    # Scripts and dependencies
├── package-lock.json
├── tsconfig.json
├── README.md                       # English repository guide
└── README.zh-CN.md                 # Chinese repository guide
```

## Content Organization Rules

### 1. Documentation Directories

English documentation lives in:

- `src/content/docs/`

Chinese documentation lives in:

- `src/content/docs/zh-cn/`

In most cases, the English and Chinese directory structures should stay aligned to keep navigation and maintenance consistent.

### 2. Responsibility of `index` Files

Each documentation group commonly uses `index.md` or `index.mdx` as the overview page for that directory.

Recommended conventions:

- English overview title: `Overview`
- Chinese overview title: `概述`
- If the overview page must appear first in the sidebar, set:

```yaml
sidebar:
  order: 0
```

### 3. Frontmatter Conventions

Typical frontmatter fields:

```yaml
---
title: Overview
description: Page description
sidebar:
  order: 0
---
```

Field notes:

- `title`: page title and default sidebar label
- `description`: page summary used for SEO and page metadata
- `sidebar.order`: ordering among sibling pages
- `.mdx` pages may import components, images, and interactive content

## Internationalization Configuration

Multilingual settings are defined in `astro.config.mjs`.

- Default locale: `root` (English)
- Chinese locale: `zh-cn`
- Default path: `/`
- Chinese path: `/zh-cn/`

The current configuration also includes:

- custom sidebar definitions
- custom Header / Banner / TOC components
- custom CSS
- explicit `site` configuration

## Sidebar Strategy

Sidebar behavior is primarily controlled by the `sidebar` configuration in `astro.config.mjs`.

This repository uses two patterns:

1. `autogenerate`
   - Best for clean directory-driven sections
2. explicit `items`
   - Best when you need strict control over order, labels, overview pages, and nested entries

If an overview page is displayed incorrectly in the sidebar, check these first:

- the `title` in that directory’s `index.*`
- `sidebar.order`
- whether `astro.config.mjs` uses explicit `items` for that section

## Local Development

### Requirements

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Default local URL:

- <http://localhost:4321>

### Production Build

```bash
npm run build
```

Build output directory:

- `dist/`

### Preview Build Output

```bash
npm run preview
```

## Common Maintenance Workflows

### Add a New Documentation Page

1. Create a new `.md` or `.mdx` file in the correct language directory
2. Add frontmatter
3. Set `sidebar.order` if ordering matters
4. Use `index.md` / `index.mdx` if it is the overview page of a section
5. Run `npm run dev` and verify rendering and sidebar order

### Add Image Assets

If an image needs to be used safely in `.mdx`, place it under:

- `src/assets/docs/`

Then import it explicitly:

```mdx
import demoImage from '@/assets/docs/example.png'

<img src={demoImage.src} alt="example" />
```

Do not rely on alias paths directly inside Markdown image syntax such as:

```md
![](@/assets/docs/example.png)
```

That pattern can cause content rendering errors.

### Adjust Navigation Structure

Prefer updating:

- `astro.config.mjs`

Typical use cases:

- explicitly defining the displayed label of an overview page
- changing sidebar hierarchy for a section
- replacing fully automatic generation with explicit `items`
- resolving multilingual title mismatches

## Recommended Quality Checks

After content updates, at minimum run:

```bash
npm run build
```

Key things to verify:

- no content rendering errors
- no missing asset or image references
- correct sidebar order
- English and Chinese pages stay aligned where required

## Known Notes

- Content under `src/content/docs/` must remain consistent with sidebar rules in `astro.config.mjs`, otherwise you may see:
  - unexpected sidebar labels
  - pages that exist but do not show up in navigation
  - overview pages not appearing first
- In `.mdx`, images should be imported explicitly instead of referenced through Markdown alias paths
- If build logs contain non-blocking wrapper-level warnings, treat successful build output as the primary source of truth

## Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the static site |
| `npm run preview` | Preview the built output |

## Release and Push Workflow

Recommended workflow:

1. Update content locally
2. Run `npm run build`
3. Verify pages and navigation
4. Commit changes
5. Push to GitHub

Remote repository:

- `https://github.com/Core-Claw/scraper-webui-docs`

## Maintenance Recommendations

- Keep English and Chinese directory structures aligned
- Standardize overview page titles:
  - English: `Overview`
  - Chinese: `概述`
- For navigation-sensitive sections, prefer explicit `items` instead of relying entirely on auto-generation
- When changing the homepage, changelog, or event pages, verify both language versions together

## References

- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Integration Guide](https://docs.astro.build/en/guides/integrations-guide/)