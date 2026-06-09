---
title: VS Code
description: Connect VS Code with GitHub Copilot to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 5
---

Connect VS Code with GitHub Copilot to the CoreClaw MCP Server so your AI coding assistant can search for scrapers, run them, and retrieve data directly within your editor.

## Prerequisites

- [VS Code](https://code.visualstudio.com) installed
- GitHub Copilot extension with **Agent mode** enabled
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

VS Code with Copilot supports MCP via **Streamable HTTP** transport. You can configure it via the MCP configuration panel.

### Step 1: Open MCP configuration

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
3. Type and select **"MCP: Add Server"** or **"MCP: Open User Configuration"**
4. This opens your `mcp.json` file

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

### Step 3: Restart VS Code

After saving the configuration, **restart VS Code** for the changes to take effect.

## Verify the connection

1. Open VS Code and start a new Copilot chat
2. Switch to **Agent** mode
3. Ask: *"Search for Amazon scrapers on CoreClaw"*
4. Copilot should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask Copilot to perform scraping tasks:

> **You:** Find a Google Maps scraper and extract restaurant data near Central Park, New York.
>
> **Copilot:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart VS Code** — MCP changes require a restart
- Ensure you're in **Agent** mode (not Ask or Edit mode)
- Check that the `mcp.json` file is saved correctly

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
