---
title: Cursor
description: Connect Cursor IDE to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 3
---

Connect [Cursor](https://cursor.com) IDE to the CoreClaw MCP Server so your AI coding assistant can search for scrapers, run them, and retrieve data directly within your editor.

## Prerequisites

- [Cursor](https://cursor.com) installed
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Cursor supports MCP via **Streamable HTTP** transport. You can configure it via a project-level or global configuration file.

### Step 1: Create the MCP configuration file

**Project-level** (recommended for team sharing):
```
.your-project/.cursor/mcp.json
```

**Global** (applies to all projects):
```
~/.cursor/mcp.json
```

### Step 2: Add the CoreClaw MCP configuration

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

### Step 3: Restart Cursor

After saving the configuration, **restart Cursor** for the changes to take effect.

## Verify the connection

1. Open Cursor and start a new chat (Cmd/Ctrl + L)
2. Switch to **Agent** mode
3. Ask: *"Search for Amazon scrapers on CoreClaw"*
4. Cursor should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask Cursor to perform scraping tasks:

> **You:** Find a Google Maps scraper and extract restaurant data near Central Park, New York.
>
> **Cursor:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart Cursor** — MCP changes require a restart
- Ensure you're in **Agent** mode (not Chat mode)
- Check that the `mcp.json` file is in the correct location

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
