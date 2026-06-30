---
title: "Node.js Example"
description: "CoreClaw API v2 integration code example"
sidebar:
  order: 2
---

The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.

`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker's input schema; fields differ by Worker.

The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.

```js
const API_BASE_URL = "https://openapi.coreclaw.com";
const API_KEY = process.env.CORECLAW_API_KEY;
const WORKER_ID = process.env.CORECLAW_WORKER_ID ?? "YOUR_WORKER_ID";

if (!API_KEY) throw new Error("Set CORECLAW_API_KEY first.");

async function coreclawRequest(path, { method = "GET", query, body } = {}) {
  const url = new URL(API_BASE_URL + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  if (payload.code !== 0) throw new Error(JSON.stringify(payload));
  return payload;
}

const account = await coreclawRequest("/api/v2/users/account");
console.log("Account:", account.data);

const run = await coreclawRequest(`/api/v2/workers/${WORKER_ID}/runs`, {
  method: "POST",
  body: {
    // Replace input.parameters.custom with fields from the Worker's input schema.
    input: {
      parameters: {
        custom: {
          keywords: ["coffee"],
          base_location: "New York,USA",
          max_results: 1,
        },
      },
    },
    is_async: true,
    offset: 0,
    limit: 20,
  },
});

const runId = run.data.run_slug;
console.log("Run ID:", runId);

const results = await coreclawRequest(`/api/v2/worker-runs/${runId}/result`, {
  query: { offset: 0, limit: 20 },
});
console.log(results.data);
```
