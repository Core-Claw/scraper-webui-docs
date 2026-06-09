---
title: Generic HTTP Client
description: Connect any MCP-compatible HTTP client to CoreClaw MCP Server.
sidebar:
  order: 9
---

Connect any MCP-compatible client that supports **Streamable HTTP** transport to the CoreClaw MCP Server.

## Prerequisites

- An MCP client that supports Streamable HTTP transport
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Any MCP client that supports Streamable HTTP can connect to CoreClaw using the following configuration:

```json
{
  "mcpServers": {
    "coreclaw": {
      "url": "https://mcp.coreclaw.com/mcp",
      "headers": {
        "api-key": "scraper_api_YOUR_KEY_HERE"
      }
    }
  }
}
```

Replace `scraper_api_YOUR_KEY_HERE` with your actual CoreClaw API key.

## REST Compatible Endpoints

In addition to the standard MCP endpoint at `/mcp`, CoreClaw MCP Server also exposes REST-compatible endpoints at `/mcp/<tool_name>` for clients that prefer per-tool HTTP APIs:

```bash
# Example: Search scrapers via REST
curl -X POST https://mcp.coreclaw.com/mcp/search_scrapers \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"query": "amazon", "limit": 5}'
```

### Available REST endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/search_scrapers` | POST | Search CoreClaw Store |
| `/mcp/get_scraper_details` | POST | Get scraper details |
| `/mcp/run_scraper` | POST | Run a scraper |
| `/mcp/get_run_status` | POST | Check run status |
| `/mcp/get_run_results` | POST | Get run results |
| `/mcp/export_run_results` | POST | Export results |
| `/mcp/list_runs` | POST | List historical runs |
| `/mcp/abort_run` | POST | Abort a run |
| `/mcp/get_run_logs` | POST | Get run logs |
| `/mcp/run_task` | POST | Run a saved task |
| `/mcp/rerun` | POST | Re-run a previous run |
| `/mcp/get_account_info` | POST | Get account info |

## Testing with curl

You can test the MCP connection using curl:

```bash
# Test connection (initialize)
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
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

# List available tools
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# Call a tool (search scrapers)
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_scrapers",
      "arguments": {"query": "amazon", "limit": 5}
    }
  }'
```

## Troubleshooting

### Connection errors

- Verify the URL is exactly `https://mcp.coreclaw.com/mcp`
- Ensure the `api-key` header is set correctly
- Check that your client supports Streamable HTTP transport

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

### Tools not loading

- Confirm your client supports MCP protocol version `2024-11-05`
- Check client logs for detailed error messages
- Try the REST endpoints as a fallback

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
