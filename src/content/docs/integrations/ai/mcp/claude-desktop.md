---
title: Claude Desktop
description: Connect Claude Desktop to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 1
---

Connect [Claude Desktop](https://claude.ai/download) to the CoreClaw MCP Server so Claude can search for scrapers, run them, and retrieve data directly from your conversations.

## Prerequisites

- [Claude Desktop](https://claude.ai/download) installed (macOS, Windows, or Linux)
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Claude Desktop supports MCP via **Streamable HTTP** transport. You can configure it through the graphical interface.

### Step 1: Open Settings

1. Open Claude Desktop
2. Click on your profile icon (bottom left) → **Settings**
3. Navigate to **Connectors & Extensions**

### Step 2: Add MCP Server

1. Click **Add MCP Server** or **+**
2. Fill in the form:
   - **Name**: `CoreClaw`
   - **Transport**: `HTTP`
   - **URL**: `https://mcp.coreclaw.com/mcp`
   - **Headers**:
     - `api-key`: `scraper_api_YOUR_KEY_HERE`

Replace `scraper_api_YOUR_KEY_HERE` with your actual CoreClaw API key.

![Claude Desktop MCP Configuration](@/assets/docs/mcp-2.png)

### Step 3: Save and restart

1. Click **Save**
2. **Restart Claude Desktop** for the changes to take effect

## Verify the connection

1. Open a new conversation in Claude Desktop
2. Look for the **tool icon** (hammer 🔨) in the message input area — this indicates MCP tools are available
3. Ask Claude: *"Search for Amazon scrapers on CoreClaw"*
4. Claude should call `search_scrapers` and return results

## Example conversation

Once connected, you can ask Claude to perform scraping tasks naturally:

> **You:** Find a Google Maps scraper and extract restaurant data near Times Square, New York.
>
> **Claude:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart Claude Desktop** — MCP changes require a full restart
- Check the [Claude Desktop logs](#claude-desktop-logs) for connection errors
- Verify your API key is correct and active

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Check that your key hasn't expired in the [Console](https://console.coreclaw.com/settings/integrations)

### Claude Desktop logs

| Platform | Log location |
|----------|-------------|
| macOS | `~/Library/Logs/Claude/` |
| Windows | `%APPDATA%\Claude\logs\` |
| Linux | `~/.config/Claude/logs/` |

Look for files with `mcp` in the name.

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
