---
title: Windsurf
description: Connect Windsurf IDE to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 6
---

Connect [Windsurf](https://windsurf.com) IDE to the CoreClaw MCP Server so your AI coding assistant can search for scrapers, run them, and retrieve data directly within your editor.

## Prerequisites

- [Windsurf](https://windsurf.com) installed
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Windsurf supports MCP via **Streamable HTTP** transport. You can configure it via the MCP settings panel.

### Step 1: Open MCP settings

1. Open Windsurf
2. Go to **Settings → MCP**
3. Click **Add MCP Server**

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
2. **Restart Windsurf** for the changes to take effect

## Verify the connection

1. Open Windsurf and start a new Cascade chat
2. Ask: *"Search for Amazon scrapers on CoreClaw"*
3. Windsurf should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask Windsurf to perform scraping tasks:

> **You:** Find a Google Maps scraper and extract restaurant data near Times Square, New York.
>
> **Windsurf:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart Windsurf** — MCP changes require a restart
- Ensure the MCP server URL is correct
- Check that the `api-key` header is set

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
