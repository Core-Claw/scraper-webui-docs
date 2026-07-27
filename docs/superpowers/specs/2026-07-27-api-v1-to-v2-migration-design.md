# API V1 to V2 Migration Documentation Design

## Goal

Add a bilingual migration center that helps existing CoreClaw API V1 consumers move to V2 without relying on undocumented assumptions. The source of truth is the V1-era public contract and documentation preserved at Git tag `v1.0.1`, together with the exported V2 OpenAPI contract.

## Audience

Developers who call one or more V1-era endpoints and need to update an existing server-side integration.

## Information Architecture

Each locale receives three pages under `api/migration`:

1. `v1-to-v2`: ordered migration workflow and release checklist.
2. `endpoint-mapping`: all 13 V1-era public operations mapped to their V2 replacements, plus field-level breaking changes.
3. `examples`: migration examples for Python, Node.js, Java, PHP, and Go.

The three pages appear immediately after the API integration guide in the shared sidebar. The generated API index links to the migration center.

## Accuracy Rules

- Mark V1 as scheduled for retirement and recommend migrating as soon as possible.
- Cover all 13 V1-era public operations: ten `/api/v1` operations and three unversioned public operations.
- Distinguish contract facts from migration recommendations.
- Do not assume that every V1 `scraper_slug` is a valid V2 `workerId`; tell users to resolve and verify the V2 identifier.
- Preserve the response field names such as `scraper_slug` where V2 intentionally retains them for compatibility.
- Use the V2 contract values `ready`, `running`, `succeeded`, `failed`, and `aborting`.

## Maintenance

Migration pages are editorial content, not generated endpoint reference pages. The API generator must preserve `api/migration` while replacing generated API pages. Validation checks must ensure both locales retain all 13 legacy mappings, the five language sections, and the sidebar entries.

## Verification

- Format changed files.
- Run API documentation validation.
- Syntax-check the existing canonical language examples.
- Build the Astro site to catch broken links and MD/MDX errors.
