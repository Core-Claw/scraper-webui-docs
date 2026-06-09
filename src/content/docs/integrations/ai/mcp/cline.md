---
title: Cline
description: Connect Cline VS Code extension to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 7
---

Connect [Cline](https://github.com/cline/cline) VS Code extension to the CoreClaw MCP Server so your AI coding assistant can search for scrapers, run them, and retrieve data directly within VS Code.

## Prerequisites

- VS Code with [Cline extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) installed
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Cline supports MCP via **Streamable HTTP** transport. You can configure it via the Cline settings panel.

### Step 1: Open Cline settings

1. Open VS Code
2. Click the Cline icon in the sidebar
3. Go to **Settings → MCP Servers**
4. Click **Add MCP Server**

### Step 2: Add the CoreClaw MCP configuration

Fill in the form:

- **Name**: `coreclaw`
- **Transport**: `HTTP`
- **URL**: `https://mcp.coreclaw.com/mcp`
- **Headers**:
  - `api-key`: `scraper_api_YOUR_KEY_HERE`

Replace `scraper_api_YOUR_KEY_HERE` with your actual CoreClaw API key.

### Step 3: Save and restart

1. Click **Save**
2. **Restart VS Code** for the changes to take effect

## Verify the connection

1. Open VS Code and start a new Cline chat
2. Ask: *"Search for Amazon scrapers on CoreClaw"*
3. Cline should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask Cline to perform scraping tasks:

> **You:** Find a Google Maps scraper and extract restaurant data near Times Square, New York.
>
> **Cline:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart VS Code** — MCP changes require a restart
- Ensure the MCP server URL is correct
- Check that the `api-key` header is set

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
