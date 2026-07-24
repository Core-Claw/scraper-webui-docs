---
title: Worker Development & Submission Standards
description: Quality standards every Worker must meet before upload — runnable defaults, clean output, safe failures, and versioning
sidebar:
  order: 11
---

These standards define what a production-ready CoreClaw Worker must satisfy before you upload it. They exist so that every published Worker runs out-of-the-box, returns clean data, bills accurately, and stays maintainable. Workers that violate these standards may be rejected during review or removed after publication.

This page is the quality gate between [Test Your Worker](/developer-guide/test-your-worker/) and [Publish Your Worker](/developer-guide/publishing-and-monetization/publish-your-worker/).

## 1. Concurrency and request control

CoreClaw supports running multiple tasks, and a single run can be split into multiple tasks via `input_schema.json`. Be careful not to confuse two separate layers of concurrency:

| Layer | What it controls | Where it is configured |
| --- | --- | --- |
| Platform task splitting | How one run is split into parallel tasks | `input_schema.json` → `concurrency.fields` (see [Input Schema](/developer-guide/worker-definition/input-schema/)) |
| In-script request concurrency | How many HTTP requests your code issues at the same time | Inside your script — you must limit this yourself |

You **must** limit in-script request concurrency and request rate. Unbounded requests trigger target-site bans, platform rate limits, or `429` responses.

:::caution[Limit requests inside your script]
Use a concurrency limiter (semaphore) and a request-rate cap. For browser automation Workers, also limit the number of pages or tabs open at once — each consumes remote-browser resources.
:::

## 2. Failed data handling

**Never push failed or empty data as a result.** Only valid, successfully collected rows should be passed to `push_data`.

Why this matters:

- It pollutes the user's result table and exports.
- It is counted in `results`, which affects billing — users are billed based on successful results, so error rows distort the count.
- It breaks downstream pipelines that assume every row is real data.

Errors must go to logs only, never to the output table.

```python
from sdk import CoreSDK

# WRONG — pushing an error object as a result row
CoreSDK.Result.push_data({"url": url, "error": str(e), "status": "failed"})

# RIGHT — log the error, skip the row; only push successful rows
CoreSDK.Log.error(f"Failed to process {url}: {e}")
```

If a run cannot produce any valid data, let it end with `results: 0` and a clear error in the logs rather than fabricating result rows.

## 3. Default parameters

Default values come from `input_schema.json` → `properties[].default`, and the platform pre-fills them in the form and API playground. Users often run a Worker without changing anything, so defaults must be production-ready.

### Defaults must run directly

A one-click run with defaults must not produce:

- Missing parameters
- Parameter format errors
- Invalid input
- Empty results

### Defaults must return valid data

A default run must satisfy:

- `results > 0`
- Every returned row conforms to the declared [Output Schema](/developer-guide/worker-definition/output-schema/)

### No test data in defaults

Default values must point at real, publicly accessible targets. Do not use:

- Test keywords (e.g., `test`, `example`)
- Fictional URLs (e.g., `https://example.com`)
- Invalid or placeholder accounts
- Deleted or private pages
- Data that is not publicly accessible

:::tip
Defaults are your Worker's first impression. If a user runs defaults and gets zero results or an error, they will not run it again.
:::

## 4. Output field design

How you shape output fields directly affects how the platform renders, filters, and exports data. Follow these principles:

| Field type | Principle | Example |
| --- | --- | --- |
| Simple fields | Use primitive types; the platform renders them as table columns | name, URL, number, date |
| Long text | Return the full content; the platform truncates for display and offers a detail view | description, reviews |
| Arrays | Keep the original array structure; do not join into a string | tags, categories |
| Structured fields | Split into independent columns when users need to filter or export; keep as an object only for detail-only data | address → street/city/zip |

### Map field types to `set_table_header` formats

Each output field's type should pair with the `format` used in `set_table_header` (see [SDK Modules](/developer-guide/worker-definition/sdk-modules/) and [Output Schema](/developer-guide/worker-definition/output-schema/)):

| Schema `type` | Header `format` |
| --- | --- |
| `string` | `text` |
| `number` | `number` |
| `integer` | `integer` |
| `boolean` | `boolean` |
| `array` | `array` |
| `object` | `object` |

### Example

Recommended output:

```json
{
  "profile_name": "LinkedIn",
  "followers": 4659188,
  "profile_url": "https://linkedin.com/company/linkedin",
  "categories": ["Technology", "Software"]
}
```

Platform display:

| Profile Name | Followers | Profile URL | Categories |
| --- | --- | --- | --- |
| LinkedIn | 4659188 | link | 2 items |

## 5. Exception handling

Your Worker must handle the common failure modes gracefully:

- Network exceptions
- Request timeouts
- Data parsing failures
- Source website unreachable or changed

Requirements:

- **Auto-retry** transient errors — use a bounded number of retries with backoff (for example 3 attempts with increasing delay) to avoid triggering `429` rate limits.
- **Log errors** via `Log.warn` / `Log.error` — never as result rows.
- **Keep successful results** — if some items succeed and others fail, push the successful rows and log the failures; do not fail the whole run unless no data could be collected.

:::note[Distinguish retryable vs fatal errors]
Retryable: timeouts, transient 5xx, network blips. Fatal: invalid input, schema mismatch, authentication failure. For fatal errors, fail the run with a clear log message instead of pushing error rows.
:::

## 6. Version management

Every update must be traceable.

- **Record what changed** — maintain a `README.md` or changelog describing each version's changes.
- **History is traceable** — when you import from GitHub, each branch, tag, or commit maps to a version, and previous versions remain available until you remove them. See [Deployment](/developer-guide/deployment/).
- **Bump the version on breaking changes** — if you change input fields, output schema, or behavior in a way that affects existing saved tasks, publish a new version rather than overwriting, so existing tasks keep working.

See [Publish Your Worker](/developer-guide/publishing-and-monetization/publish-your-worker/) for the update workflow.

## 7. Pre-submission checklist

Before uploading, confirm every item:

- [ ] Default parameters run directly and return `results > 0`
- [ ] No test data in defaults (real, public targets only)
- [ ] Failed or empty data is never pushed as a result
- [ ] Errors go to logs only
- [ ] Output fields match the declared schema and `set_table_header` keys
- [ ] In-script request concurrency and rate are limited
- [ ] Proxy is configured from `PROXY_AUTH` / `PROXY_DOMAIN` (HTTP Workers); no proxy credentials are logged
- [ ] TLS verification is not disabled (no `InsecureSkipVerify` / `verify=False`)
- [ ] No hardcoded credentials or secrets in code
- [ ] Version and change notes are recorded

Validate all of this in the [test environment](/developer-guide/test-your-worker/) before submitting for review.

## 8. Review red lines

The following will cause a Worker to be rejected during review or removed after publication:

- Pushing failed/error data as result rows
- Default parameters that return no results or fail to run
- Test or fictional data in defaults
- Hardcoded credentials or secrets in the code
- Disabling TLS verification (`InsecureSkipVerify`, `verify=False`, `rejectUnauthorized=false`)
- Logging proxy credentials (`PROXY_AUTH`) or the full proxy URL
- Referencing undocumented features

For the full review process, see [Publish Your Worker](/developer-guide/publishing-and-monetization/publish-your-worker/).
