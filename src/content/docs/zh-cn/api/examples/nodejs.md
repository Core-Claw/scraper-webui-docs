---
title: "Node.js 示例"
description: "CoreClaw API v2 集成代码示例"
sidebar:
  order: 2
---

下面示例覆盖认证检查、启动 Worker、用返回的 `run_slug` 查询结果三步。

示例中的 `YOUR_WORKER_ID` 是占位符。请替换为要运行的 Worker slug，或把 `owner/name` 路径写成 `owner~name`。`input` 必须按该 Worker 的输入 schema 构造；不同 Worker 的字段不一定相同。

默认使用 `is_async: true` 异步提交并轮询结果。如需等待执行完成，把 `is_async` 改为 `false`，并用 `offset` / `limit` 控制同步返回的数据窗口。

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

async function waitForRun(runId, timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs;
  let delayMs = 2_000;
  while (Date.now() < deadline) {
    const detail = await coreclawRequest(`/api/v2/worker-runs/${runId}`);
    const runData = detail.data;
    if (runData.status === "succeeded") return runData;
    if (["failed", "aborting"].includes(runData.status)) {
      const logs = await coreclawRequest(`/api/v2/worker-runs/${runId}/log`);
      throw new Error(JSON.stringify({
        status: runData.status,
        err_msg: runData.err_msg,
        request_id: detail.request_id,
        logs: logs.data,
      }));
    }
    if (!["ready", "running"].includes(runData.status)) {
      throw new Error(`Unexpected run status: ${runData.status}`);
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
    delayMs = Math.min(delayMs * 2, 15_000);
  }
  throw new Error(`Timed out waiting for run ${runId}`);
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

const completedRun = await waitForRun(runId);

const results = await coreclawRequest(`/api/v2/worker-runs/${runId}/result`, {
  query: { offset: 0, limit: 20 },
});
console.log({ status: completedRun.status, results: results.data });
```
