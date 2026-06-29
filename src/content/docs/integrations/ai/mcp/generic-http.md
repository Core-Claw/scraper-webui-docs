---
title: Generic HTTP Client
description: Connect any Streamable HTTP MCP client or REST-style tool caller to CoreClaw MCP Server.
sidebar:
  order: 9
---

Connect any client that supports **Streamable HTTP MCP** to the hosted CoreClaw MCP Server. For platforms that cannot speak MCP JSON-RPC directly, the server also exposes REST-compatible per-tool endpoints.

## Prerequisites

- An MCP client that supports Streamable HTTP, or an HTTP automation platform that can send `POST` requests.
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations).

## MCP Configuration

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

The service also accepts `X-API-Key` and `Authorization: Bearer YOUR_CORECLAW_API_KEY` headers when your client supports those formats better.

## REST Compatible Endpoints

Every MCP tool is also available as:

```text
POST https://mcp.coreclaw.com/mcp/<tool_name>
```

Pass the tool arguments as a JSON object in the request body:

```bash
curl -X POST https://mcp.coreclaw.com/mcp/list_store_workers \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"keyword":"amazon","offset":0,"limit":5}'
```

Authenticated example:

```bash
curl -X POST https://mcp.coreclaw.com/mcp/run_worker \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"worker_id":"YOUR_WORKER_ID","version":"latest","input_json":"{\"keyword\":\"coffee\",\"limit\":10}","is_async":true}'
```

## Available REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/list_proxy_regions` | POST | List proxy region codes |
| `/mcp/list_store_workers` | POST | Search public Store workers |
| `/mcp/list_workers` | POST | List authenticated user's workers |
| `/mcp/get_worker` | POST | Get worker detail |
| `/mcp/get_worker_input_schema` | POST | Get worker input schema |
| `/mcp/list_worker_tasks` | POST | List saved worker tasks |
| `/mcp/get_account_info` | POST | Get account balance and traffic quota |
| `/mcp/run_worker` | POST | Run a worker with ad-hoc input |
| `/mcp/run_worker_task` | POST | Run a saved worker task |
| `/mcp/list_worker_runs` | POST | List run history |
| `/mcp/get_last_worker_run` | POST | Get the account's latest run |
| `/mcp/get_worker_run` | POST | Get a run by `run_id` |
| `/mcp/get_worker_last_run` | POST | Get latest run for a worker |
| `/mcp/list_last_worker_run_results` | POST | List latest account run results |
| `/mcp/export_last_worker_run_results` | POST | Export latest account run results |
| `/mcp/get_last_worker_run_log` | POST | Get latest account run logs |
| `/mcp/list_worker_run_results` | POST | List results for a run |
| `/mcp/export_worker_run_results` | POST | Export results for a run |
| `/mcp/get_worker_run_log` | POST | Get logs for a run |
| `/mcp/list_worker_last_run_results` | POST | List latest results for a worker |
| `/mcp/export_worker_last_run_results` | POST | Export latest results for a worker |
| `/mcp/get_worker_last_run_log` | POST | Get latest logs for a worker |
| `/mcp/rerun_last_worker_run` | POST | Rerun the account's latest run |
| `/mcp/rerun_worker_run` | POST | Rerun a specific run |
| `/mcp/rerun_worker_last_run` | POST | Rerun the latest run for a worker |
| `/mcp/abort_last_worker_run` | POST | Abort the account's latest active run |
| `/mcp/abort_worker_run` | POST | Abort a specific active run |
| `/mcp/abort_worker_last_run` | POST | Abort latest active run for a worker |

## Testing with curl

Initialize the MCP session:

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {"name": "test", "version": "1.0"}
    }
  }'
```

List available tools:

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

Call a tool through MCP JSON-RPC:

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "list_store_workers",
      "arguments": {"keyword": "amazon", "offset": 0, "limit": 5}
    }
  }'
```

## Common Arguments

- `worker_id`: Worker slug or owner path. Encode `owner/name` as `owner~name`.
- `run_id`: Worker run identifier returned by `run_worker`, `run_worker_task`, or run lookup tools.
- `worker_task_id`: Saved worker task slug returned by `list_worker_tasks`.
- `offset` / `limit`: Pagination values. `limit` is usually 1-100.
- `format`: Export format, `csv` or `json`.
- `filter_keys`: Comma-separated output fields to include in an export.
- `input_json`: Worker business input JSON string for `run_worker`.
- `raw_input_json`: Advanced full CoreClaw input object for `run_worker`; do not combine it with `input_json`.

## Troubleshooting

### Connection errors

- Verify the URL is exactly `https://mcp.coreclaw.com/mcp`.
- Ensure your client supports Streamable HTTP MCP.
- For REST-compatible calls, use `POST /mcp/<tool_name>`.

### Authentication errors

- Ensure one supported auth header is present: `api-key`, `X-API-Key`, or `Authorization: Bearer ...`.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

### Tool errors

- Use `list_store_workers` or `list_workers` to confirm `worker_id`.
- Use `get_worker_input_schema` before composing `input_json`.
- Use `get_worker_run_log` when a run fails or stalls.

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
