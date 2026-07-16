---
title: CoreClaw MCP Server
description: Connect AI agents to CoreClaw through Model Context Protocol (MCP) to discover workers, run jobs, monitor runs, and retrieve results.
sidebar:
  order: 0
---

CoreClaw MCP Server exposes the public CoreClaw OpenAPI v2 workflow to AI applications through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Once connected, your AI agent can discover CoreClaw workers, inspect input schemas, run workers or saved tasks, monitor run status, read logs, and export structured results.

## Architecture

```text
User conversation -> AI agent -> MCP protocol -> CoreClaw MCP Server -> CoreClaw OpenAPI v2
                                      HTTP            mcp.coreclaw.com      openapi.coreclaw.com
```

The hosted Streamable HTTP endpoint is:

```text
https://mcp.coreclaw.com/mcp
```

Use the hosted endpoint first. Local stdio and local HTTP transports are available for development or fallback, but most users do not need to install anything locally.

## Prerequisites

- A CoreClaw account. [Sign up](https://console.coreclaw.com/sign-up) if you do not have one.
- A CoreClaw API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations).
- An MCP-compatible client. See [Supported Platforms](#supported-platforms).

## Quick Start

Add this server to your MCP client:

```json
{
  "mcpServers": {
    "coreclaw": {
      "url": "https://mcp.coreclaw.com/mcp",
      "headers": {
        "api-key": "YOUR_CORECLAW_API_KEY"
      }
    }
  }
}
```

After saving the configuration, restart or reload your MCP client if it requires a restart. Your agent can then use CoreClaw tools from the conversation.

## Authentication

The hosted MCP service accepts any of these request headers:

- `api-key: YOUR_CORECLAW_API_KEY`
- `X-API-Key: YOUR_CORECLAW_API_KEY`
- `Authorization: Bearer YOUR_CORECLAW_API_KEY`

The MCP server forwards authentication to CoreClaw OpenAPI v2 as `Authorization: Bearer <token>`.

> Never commit API keys to version control. Use your client's secret or credential storage when available.

## Available Tools

CoreClaw MCP Server exposes **37 tools** — 34 OpenAPI v2 operations (1:1) plus three orchestration helpers. Internal worker-version create/update APIs and internal worker detail APIs are intentionally not exposed.

### Discovery and Preflight

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `list_proxy_regions` | List proxy region codes and names | `GET /api/v2/proxy/region` |
| `list_store_workers` | Search public Store workers | `GET /api/v2/store` |
| `list_workers` | List workers owned by the authenticated user | `GET /api/v2/workers` |
| `get_worker` | Get worker metadata, version, README, and parameters | `GET /api/v2/workers/{workerId}` |
| `get_worker_input_schema` | Get the public input schema for a worker | `GET /api/v2/workers/{workerId}/input-schema` |
| `get_account_info` | Check account balance, traffic quota, and expiration | `GET /api/v2/users/account` |

### Worker Tasks (saved task templates)

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `list_worker_tasks` | List saved worker tasks for the authenticated user | `GET /api/v2/worker-tasks` |
| `get_worker_task` | Get a saved task's details | `GET /api/v2/worker-tasks/{workerTaskId}` |
| `get_worker_task_input` | Get a saved task's input payload | `GET /api/v2/worker-tasks/{workerTaskId}/input` |
| `create_worker_task` | Create a saved task (optional schedule) | `POST /api/v2/worker-tasks` |
| `update_worker_task` | Update a task's metadata/schedule | `PUT /api/v2/worker-tasks/{workerTaskId}` |
| `update_worker_task_input` | Update only a task's input payload | `PUT /api/v2/worker-tasks/{workerTaskId}/input` |
| `delete_worker_task` | Delete a saved task | `DELETE /api/v2/worker-tasks/{workerTaskId}` |

### Orchestration helpers

Three convenience tools that wrap multiple API calls into a single tool invocation.

| Tool | Description | Underlying calls |
|------|-------------|------------------|
| `poll_run` | Poll a run until it reaches a terminal state (or times out) | repeats `GET /api/v2/worker-runs/{runId}` |
| `verify_run` | Return a structured verdict (`PASS` / `NO_DATA` / `FAILED` / `ERROR_RECORD` / `RUNNING` / `SUBMIT_FAIL`) by checking run status, then sniffing the first result row for real data vs. a diagnostic-only record | `get_worker_run` + `list_worker_run_results` |
| `run_workers_batch` | Run up to 50 workers with one call; returns a per-item summary with verdicts. Concurrency 1–10, optional `verify` per item | per item: `POST /api/v2/workers/{workerId}/runs` + `poll_run` (+ optional `verify_run`) |

`poll_run` accepts `timeout_seconds` (1–900, default 300) and `poll_interval_seconds` (1–60, default 5), and can prefetch a small result preview (`limit`) on success. Use it for workers that run longer than a single MCP call window. `verify_run` is how you tell a real pass from a CAPTCHA/403 row that filled the list but has no payload — it flags those as `ERROR_RECORD`. `get_worker_run_log` additionally supports in-process `grep` (pipe-separated, case-insensitive) with `context_lines` and `max_matches`.

### Execution

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `run_worker` | Run a worker with ad-hoc JSON input | `POST /api/v2/workers/{workerId}/runs` |
| `run_worker_task` | Run a saved worker task | `POST /api/v2/worker-tasks/{workerTaskId}/runs` |

### Run Lookup

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `list_worker_runs` | List run history | `GET /api/v2/worker-runs` |
| `get_last_worker_run` | Get the most recent run for the current account | `GET /api/v2/worker-runs/last` |
| `get_worker_run` | Get a specific run by `run_id` | `GET /api/v2/worker-runs/{runId}` |
| `get_worker_last_run` | Get the most recent run for a specific worker | `GET /api/v2/workers/{workerId}/runs/last` |

### Results, Exports, and Logs

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `list_last_worker_run_results` | List results from the account's latest run | `GET /api/v2/worker-runs/last/result` |
| `export_last_worker_run_results` | Export the account's latest run results | `GET /api/v2/worker-runs/last/export` |
| `get_last_worker_run_log` | Read logs for the account's latest run | `GET /api/v2/worker-runs/last/log` |
| `list_worker_run_results` | List results for a specific run | `GET /api/v2/worker-runs/{runId}/result` |
| `export_worker_run_results` | Export results for a specific run | `GET /api/v2/worker-runs/{runId}/result/export` |
| `get_worker_run_log` | Read logs for a specific run | `GET /api/v2/worker-runs/{runId}/log` |
| `list_worker_last_run_results` | List latest results for a specific worker | `GET /api/v2/workers/{workerId}/runs/last/result` |
| `export_worker_last_run_results` | Export latest results for a specific worker | `GET /api/v2/workers/{workerId}/runs/last/export` |
| `get_worker_last_run_log` | Read latest logs for a specific worker | `GET /api/v2/workers/{workerId}/runs/last/log` |

### Repeat and Control

| Tool | Description | CoreClaw API |
|------|-------------|--------------|
| `rerun_last_worker_run` | Rerun the account's latest run | `POST /api/v2/worker-runs/last/rerun` |
| `rerun_worker_run` | Rerun a specific run | `POST /api/v2/worker-runs/{runId}/rerun` |
| `rerun_worker_last_run` | Rerun the latest run for a specific worker | `POST /api/v2/workers/{workerId}/runs/last/rerun` |
| `abort_last_worker_run` | Abort the account's latest active run | `POST /api/v2/worker-runs/last/abort` |
| `abort_worker_run` | Abort a specific active run | `POST /api/v2/worker-runs/{runId}/abort` |
| `abort_worker_last_run` | Abort the latest active run for a specific worker | `POST /api/v2/workers/{workerId}/runs/last/abort` |

## Typical Workflow

For an ad-hoc worker run, the agent should usually follow this order:

```text
list_store_workers(keyword)
  -> get_worker_input_schema(worker_id)
    -> run_worker(worker_id, input_json, is_async=true)
      -> get_worker_run(run_id)
        -> list_worker_run_results(run_id) or export_worker_run_results(run_id)
```

For a saved task, use:

```text
list_worker_tasks(worker_id)
  -> run_worker_task(worker_task_id, is_async=true)
    -> get_worker_run(run_id)
      -> list_worker_run_results(run_id)
```

If a worker input schema asks for a proxy region, call `list_proxy_regions` before running the worker. Use `rerun_*` tools only when repeating an existing run, and `abort_*` tools only when canceling an active run.

## Worker Input

For `run_worker`, pass business fields as `input_json`:

```json
{
  "worker_id": "YOUR_WORKER_ID",
  "version": "latest",
  "input_json": "{\"keyword\":\"coffee\",\"limit\":10}",
  "is_async": true
}
```

The MCP server wraps `input_json` as `input.parameters.custom` for CoreClaw. Advanced callers can use `raw_input_json` to send a complete CoreClaw `input` object directly, but `input_json` and `raw_input_json` must not be combined.

## Supported Platforms

| Platform | Configuration | Guide |
|----------|---------------|-------|
| **Claude Desktop** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/claude-desktop/) |
| **Claude CLI** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/claude-cli/) |
| **Codex Desktop** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/codex-desktop/) |
| **Cursor** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/cursor/) |
| **ChatGPT** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/chatgpt/) |
| **VS Code** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/vscode/) |
| **Windsurf** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/windsurf/) |
| **Cline** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/cline/) |
| **n8n** | Streamable HTTP | [Setup Guide](/integrations/ai/mcp/n8n/) |
| **Generic HTTP** | Any Streamable HTTP MCP client or REST-style tool caller | [Setup Guide](/integrations/ai/mcp/generic-http/) |

## REST Compatible Endpoints

In addition to the standard MCP endpoint at `/mcp`, the server exposes a REST compatibility shim at `/mcp/<tool_name>` for platforms that prefer per-tool HTTP calls:

```bash
curl -X POST https://mcp.coreclaw.com/mcp/list_store_workers \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"keyword":"amazon","offset":0,"limit":5}'
```

See [Generic HTTP Client](/integrations/ai/mcp/generic-http/) for JSON-RPC and REST examples.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Invalid API key` | Missing, expired, or incorrect key | Verify the key in Console -> Settings -> API & Integrations |
| `Worker does not exist` (`50001`) | Wrong `worker_id` | Use `list_store_workers` or `list_workers` and pass the returned slug/path |
| No tools appear | Client did not load Streamable HTTP MCP config | Restart the client and check the MCP config path |
| Run starts but no rows appear | Run is still active or failed | Poll `get_worker_run`; if failed, call `get_worker_run_log` |
| Proxy input rejected | Invalid proxy region | Call `list_proxy_regions` and use a returned region code |

## Limitations

- The hosted service uses Streamable HTTP. Clients that only support local stdio need a local `coreclaw-mcp-server` binary.
- Authentication is API-key based; OAuth is not required for the hosted endpoint.
- Excluded internal APIs are not available through MCP: worker version create/update and worker internal detail.

## Next Steps

- [Set up Claude Desktop](/integrations/ai/mcp/claude-desktop/)
- [Set up Codex Desktop](/integrations/ai/mcp/codex-desktop/)
- [Set up Generic HTTP](/integrations/ai/mcp/generic-http/)
- [Read the CoreClaw API documentation](/api/)
