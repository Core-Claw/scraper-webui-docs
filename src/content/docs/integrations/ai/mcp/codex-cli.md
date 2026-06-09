---
title: Codex CLI
description: Connect OpenAI Codex CLI to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 10
---

Connect [OpenAI Codex CLI](https://github.com/openai/codex) to the CoreClaw MCP Server so you can search for scrapers, run them, and retrieve data directly from your terminal conversations.

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) installed (`npm install -g @openai/codex`)
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Codex CLI supports MCP via **Streamable HTTP** transport. You can configure it via a JSON config file.

### Step 1: Create or edit the MCP configuration file

Create a file named `codex-mcp.json` in your project directory (or anywhere you prefer):

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

### Step 2: Launch Codex with the MCP config

```bash
codex --mcp-config codex-mcp.json
```

Alternatively, you can place the config at `~/.config/codex/mcp.json` (macOS/Linux) or `%APPDATA%\codex\mcp.json` (Windows) for automatic loading.

## Verify the connection

1. Start Codex with the MCP configuration
2. Ask Codex: *"Search for Amazon scrapers on CoreClaw"*
3. Codex should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can perform scraping tasks directly from your terminal:

> **You:** Find a Twitter scraper and extract the latest tweets from @elonmusk
>
> **Codex:** I'll search for a Twitter scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### MCP config not loading

- Verify the JSON file path is correct when using `--mcp-config`
- Ensure the JSON is valid (no trailing commas, proper quotes)
- Check Codex CLI version — MCP support requires recent versions

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

### Tools not available

- Confirm Codex CLI supports Streamable HTTP transport
- Try restarting the Codex session after config changes

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
