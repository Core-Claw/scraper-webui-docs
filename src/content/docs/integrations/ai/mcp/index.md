---
title: CoreClaw MCP Server
description: Connect AI agents to CoreClaw via Model Context Protocol (MCP) — search scrapers, run tasks, and retrieve data through natural language.
sidebar:
  order: 0
---

CoreClaw MCP Server enables AI applications to interact with the CoreClaw platform through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Once connected, your AI agent can search for scrapers in CoreClaw Store, run them with custom parameters, and retrieve structured data — all through natural language conversations.

## Architecture

```
User Conversation → AI Agent → MCP Protocol → coreclaw-mcp-server → CoreClaw REST API
                                    (HTTP)         (Go binary)      (openapi.coreclaw.com)
```

The server is deployed at **`https://mcp.coreclaw.com`** and supports **Streamable HTTP** transport, allowing any MCP-compatible client to connect without installing local dependencies.

## Prerequisites

- A CoreClaw account — [sign up](https://console.coreclaw.com/sign-up) if you don't have one
- A CoreClaw API key — get it from **Settings → API & Integrations** in the [CoreClaw Console](https://console.coreclaw.com/settings/integrations)
- An MCP-compatible client — see [supported platforms](#supported-platforms) below

> **API Key Format:** Your API key looks like `scraper_api_XXX...`. Keep it secure and never share it publicly.

## Quick Start

Add the following configuration to your MCP client:

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

That's it — your AI agent can now discover and run CoreClaw scrapers.

## Authentication

CoreClaw MCP Server uses **per-request API key authentication** via the `api-key` header:

- Each request must include `"api-key": "scraper_api_..."` in the headers
- The key is validated against CoreClaw's backend on every request
- No local environment variables or OAuth flows required

> **Security Note:** Never commit your API key to version control. Use your client's secure credential storage.

## Available Tools

CoreClaw MCP Server exposes **12 tools** covering the full CoreClaw API:

### Discovery (No API Key Required)

| Tool | Description | Corresponding API |
|------|-------------|-----------------|
| `search_scrapers` | Search CoreClaw Store by keyword | `GET /api/store` |
| `get_scraper_details` | Get scraper version, schema, and README | `GET /api/scraper` |

### Execution (Requires API Key)

| Tool | Description | Corresponding API |
|------|-------------|-----------------|
| `run_scraper` | Start an asynchronous scraper run | `POST /api/v1/scraper/run` |
| `get_run_status` | Check run status (Ready/Running/Succeeded/Failed) | `POST /api/v1/run/detail` |
| `get_run_results` | Get paginated result data | `POST /api/v1/run/result/list` |
| `export_run_results` | Export results as CSV/JSON file | `POST /api/v1/run/result/export` |

### Management (Requires API Key)

| Tool | Description | Corresponding API |
|------|-------------|-----------------|
| `list_runs` | List historical runs with filters | `POST /api/v1/run/list` |
| `abort_run` | Abort a running scraper | `POST /api/v1/scraper/abort` |
| `get_run_logs` | Get execution logs for debugging | `POST /api/v1/run/last/log` |
| `run_task` | Run a saved task template | `POST /api/v1/task/run` |
| `rerun` | Re-run a previous run with same parameters | `POST /api/v1/rerun` |
| `get_account_info` | Check balance, traffic, and expiry | `POST /api/v1/account/info` |

## Typical Workflow

When you ask your AI agent to scrape data, it typically follows this flow:

```
search_scrapers("amazon") 
  → get_scraper_details("amazon-product-scraper")
    → run_scraper(slug, version, custom_params)
      → get_run_status(run_slug) [poll until status=3]
        → get_run_results(run_slug)
```

**Example conversation:**

> **You:** Find an Amazon scraper and extract product data from this URL: https://www.amazon.com/dp/B0CHHSFMRL
>
> **AI:** I'll search for an Amazon scraper, check its parameters, and run it for you. *[proceeds through the workflow above]*

## Supported Platforms

Configure CoreClaw MCP on your favorite AI agent platform:

| Platform | Configuration | Guide |
|----------|--------------|-------|
| **Claude Desktop** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/claude-desktop/) |
| **Claude CLI** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/claude-cli/) |
| **Codex Desktop** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/codex-desktop/) |
| **Cursor** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/cursor/) |
| **ChatGPT** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/chatgpt/) |
| **VS Code** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/vscode/) |
| **Windsurf** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/windsurf/) |
| **Cline** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/cline/) |
| **n8n** | Streamable HTTP | [→ Setup Guide](/integrations/ai/mcp/n8n/) |
| **Generic HTTP** | Any MCP client | [→ Setup Guide](/integrations/ai/mcp/generic-http/) |

## REST Compatible Endpoints

In addition to the standard MCP endpoint at `/mcp`, CoreClaw MCP Server also exposes REST-compatible endpoints at `/mcp/<tool_name>` for platforms that prefer per-tool HTTP APIs:

```bash
# Example: Search scrapers via REST
curl -X POST https://mcp.coreclaw.com/mcp/search_scrapers \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"query": "amazon", "limit": 5}'
```

This is particularly useful for integration with platforms like **Coze** that use HTTP plugin models.

## Rate Limits & Performance

- **30 requests/second per user**
- Exceeding the limit returns HTTP `429` — implement exponential backoff
- Results are streamed in real-time; large datasets may take longer

## Troubleshooting

### Connection Errors

| Symptom | Cause | Solution |
|---------|-------|----------|
| `Invalid API key` (code 20001) | Key is wrong or expired | Verify key in Console → Settings → API & Integrations |
| `Rate limit exceeded` (code 4290) | Too many requests | Add retry logic with exponential backoff |
| `Worker does not exist` (code 50001) | Wrong scraper_slug | Check slug from search_scrapers results |
| Tools not loading | Client doesn't support HTTP transport | Use stdio mode or update client |

### Debug Checklist

1. **Verify API Key:** Run a quick test with `get_account_info`
2. **Check Transport:** Ensure your client supports Streamable HTTP
3. **Validate Headers:** Confirm `api-key` header is set correctly
4. **Review Logs:** Check your MCP client logs for detailed error messages

## Limitations

- **HTTP Mode Only:** CoreClaw MCP Server only supports Streamable HTTP transport. Clients that only support stdio (local process) need to run the binary locally.
- **No OAuth:** Authentication is via API key header only — no OAuth or token refresh flows.
- **Beta Status:** MCP protocol and tool availability may evolve. Check the [changelog](/changelog/) for updates.

## Next Steps

- [→ Set up Claude Desktop](/integrations/ai/mcp/claude-desktop/)
- [→ Set up Codex Desktop](/integrations/ai/mcp/codex-desktop/)
- [→ Browse all platform guides](/integrations/ai/mcp/)
- [→ Read the CoreClaw API documentation](/api/)
