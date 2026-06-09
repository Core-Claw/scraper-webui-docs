---
title: Claude CLI
description: Connect Claude CLI (Claude Code) to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 11
---

Connect [Claude CLI](https://github.com/anthropics/claude-code) (also known as Claude Code) to the CoreClaw MCP Server so you can search for scrapers, run them, and retrieve data directly from your terminal conversations.

## Prerequisites

- [Claude CLI](https://github.com/anthropics/claude-code) installed (`npm install -g @anthropics/claude-code`)
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Claude CLI supports MCP via **Streamable HTTP** transport. You can configure it via a JSON config file.

### Step 1: Create or edit the MCP configuration file

Create a file named `claude-mcp.json` in your project directory (or anywhere you prefer):

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

### Step 2: Launch Claude CLI with the MCP config

```bash
claude --mcp-config claude-mcp.json
```

Alternatively, you can place the config at `~/.config/claude/mcp.json` (macOS/Linux) or `%APPDATA%\claude\mcp.json` (Windows) for automatic loading.

## Verify the connection

1. Start Claude CLI with the MCP configuration
2. Ask Claude: *"Search for Amazon scrapers on CoreClaw"*
3. Claude should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can perform scraping tasks directly from your terminal:

> **You:** Find a Twitter scraper and extract the latest tweets from @elonmusk
>
> **Claude:** I'll search for a Twitter scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### MCP config not loading

- Verify the JSON file path is correct when using `--mcp-config`
- Ensure the JSON is valid (no trailing commas, proper quotes)
- Check Claude CLI version — MCP support requires recent versions

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

### Tools not available

- Confirm Claude CLI supports Streamable HTTP transport
- Try restarting the Claude session after config changes

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
