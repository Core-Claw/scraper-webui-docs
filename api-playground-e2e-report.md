# CoreClaw API Playground E2E Audit Report

Date: 2026-06-30

Scope: `scraper-webui-docs` API v2 documentation playgrounds and runnable examples. Source of truth used for regeneration: `D:\Coreclaw_Work\github\exported-api-docs\openapi.json`.

## Executive Summary

- All 28 public API v2 operations are documented and have an `ApiPlayground` instance.
- Live E2E audit passed for all 28 public endpoints against `https://openapi.coreclaw.com` with the provided test API key.
- The user-reported `400 / 50003 / the worker version is not available` is reproducible when sending `version: "latest"` explicitly. It is not an API key issue and not a playground routing issue.
- Runnable examples were updated to omit `version` by default and to use the current Worker input shape: `input.parameters.custom`.
- The docs repository changed and should be committed/deployed. The MCP server repository has no local changes from this investigation.

## Root Cause: `version: "latest"`

The old default example:

```json
{
  "callback_url": "https://client.example.com/openapi/callback",
  "input": {
    "keyword": "coffee",
    "limit": 10
  },
  "is_async": true,
  "limit": 20,
  "offset": 0,
  "version": "latest"
}
```

is unsafe for the current Google Maps Worker.

Live probes confirmed:

| Probe | Result |
| --- | --- |
| `POST /api/v2/workers/coreclaw~google-maps-scraper/runs` with safe `input.parameters.custom` and no `version` | `200 / code 0` |
| Same endpoint with explicit `version: "latest"` | `400 / code 50003 / the worker version is not available` |
| Same endpoint with flat `input.keyword` | `400 / code 11000 / invalid argument` |

Conclusion: `version` should be treated as optional. Docs now say to omit it unless a concrete available version has been confirmed for that Worker. `latest` is not documented as a universal explicit value.

## Old Worker And Saved Task Findings

- The old saved task `01KSFDXRNYGKT3NNE11EMR4W5X` is not runnable now. Live probe returned `404 / code 11004 / not found`.
- The current valid task discovered for the test account is `01KWA10VGEZF0VRE21NVAZR0NA`, with:
  - `worker_slug`: `01KPD6M5YQADCQKGVKPDZVYC63`
  - `worker_path`: `coreclaw/google-maps-scraper`
  - `version`: `v1.2.3`
  - numeric `worker_id`: `32707111693320190`
- Numeric task fields such as `worker_id=32707111693320193` are internal database identifiers, not public Worker identifiers. Live probe using `GET /api/v2/workers/32707111693320193` returned `404 / code 11004 / not found`.
- `coreclaw/google-maps-scraper-tool` should not be used in examples. It is not returned by Store search for that exact keyword, and the old saved task tied to it is gone. Current examples should use `coreclaw/google-maps-scraper`.

## Live Endpoint Matrix

Audit command:

```bash
CORECLAW_API_KEY=*** node scripts/live-api-v2-playground-audit.mjs
```

Run result:

- `public_operations_total`: 28
- `public_operations_checked`: 28
- `checks_passed`: 28
- `checks_failed`: 0
- `probes_passed`: 6
- `probes_failed`: 0

Validated public endpoints:

| # | Endpoint | Live result |
| --- | --- | --- |
| 1 | `GET /api/v2/proxy/region` | `200 / code 0` |
| 2 | `GET /api/v2/store` | `200 / code 0` |
| 3 | `GET /api/v2/users/account` | `200 / code 0` |
| 4 | `GET /api/v2/workers` | `200 / code 0` |
| 5 | `GET /api/v2/workers/{workerId}` | `200 / code 0` |
| 6 | `GET /api/v2/workers/{workerId}/input-schema` | `200 / code 0` |
| 7 | `POST /api/v2/workers/{workerId}/runs` | `200 / code 0` |
| 8 | `GET /api/v2/worker-runs` | `200 / code 0` |
| 9 | `GET /api/v2/worker-runs/{runId}` | `200 / code 0` |
| 10 | `GET /api/v2/worker-runs/{runId}/log` | `200 / code 0` |
| 11 | `GET /api/v2/worker-runs/{runId}/result` | `200 / code 0` |
| 12 | `GET /api/v2/worker-runs/{runId}/result/export` | `200 / code 0` |
| 13 | `GET /api/v2/worker-runs/last` | `200 / code 0` |
| 14 | `GET /api/v2/worker-runs/last/log` | `200 / code 0` |
| 15 | `GET /api/v2/worker-runs/last/result` | `200 / code 0` |
| 16 | `GET /api/v2/worker-runs/last/export` | `200 / code 0` |
| 17 | `GET /api/v2/workers/{workerId}/runs/last` | `200 / code 0` |
| 18 | `GET /api/v2/workers/{workerId}/runs/last/log` | `200 / code 0` |
| 19 | `GET /api/v2/workers/{workerId}/runs/last/result` | `200 / code 0` |
| 20 | `GET /api/v2/workers/{workerId}/runs/last/export` | `200 / code 0` |
| 21 | `GET /api/v2/worker-tasks` | `200 / code 0` |
| 22 | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | `200 / code 0` |
| 23 | `POST /api/v2/worker-runs/{runId}/rerun` | `200 / code 0` |
| 24 | `POST /api/v2/worker-runs/last/rerun` | `200 / code 0` |
| 25 | `POST /api/v2/workers/{workerId}/runs/last/rerun` | `200 / code 0` |
| 26 | `POST /api/v2/worker-runs/{runId}/abort` | `200 / code 0` |
| 27 | `POST /api/v2/worker-runs/last/abort` | `200 / code 0` |
| 28 | `POST /api/v2/workers/{workerId}/runs/last/abort` | `200 / code 0` |

## Repository Changes

Changed docs behavior:

- `public/openapi.json`: direct Worker run request examples now use `input.parameters.custom` and omit `version`.
- `src/content/docs/api/workers/run.mdx` and zh-CN equivalent: `version` guidance now says optional; omit unless a concrete version is confirmed.
- `src/content/docs/api/callbacks.md` and zh-CN equivalent: callback request example now uses the same runnable direct Worker body.
- API SDK examples for Python, Node.js, Java, PHP, and Go now use a runnable `input.parameters.custom` body and no explicit `version`.

Added validation:

- `scripts/check-api-runnable-examples.mjs`: prevents runnable request examples from reintroducing `version: "latest"` or flat `input.keyword`.
- `scripts/live-api-v2-playground-audit.mjs`: real API E2E audit for all 28 public endpoints, plus negative probes.
- `package.json`: build now includes the runnable-example regression check.

## Verification Evidence

Commands run successfully:

```bash
node scripts/check-api-runnable-examples.mjs
node scripts/check-api-playground-worker-id.mjs
node scripts/validate-api-v2-docs.mjs
node scripts/verify-api-examples.mjs
CORECLAW_API_KEY=*** node scripts/live-api-v2-playground-audit.mjs
npm run build
```

Build note: `check-copy-for-llms` printed existing fallback warnings for some zh-CN pages, but `npm run build` exited with code 0.

## Deployment Answer

- Docs repository: yes, commit and push these changes, then let the docs deploy run.
- MCP repository: no MCP code changes were made for this issue. No MCP redeploy is required for this specific playground/example fix.
- Server/API backend: no backend change is required for the docs fix. Backend may still consider whether `version: "latest"` should be accepted as an alias, but current docs should not rely on it.
