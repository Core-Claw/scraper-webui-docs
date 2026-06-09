---
title: ChatGPT / OpenAI
description: Connect ChatGPT to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 4
---

Connect ChatGPT (via OpenAI's platform) to the CoreClaw MCP Server so you can search for scrapers, run them, and retrieve data directly from your ChatGPT conversations.

## Prerequisites

- An OpenAI account with ChatGPT access
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

ChatGPT supports MCP connectors through its **Apps & Connectors** feature (available to ChatGPT Plus/Pro users with Developer Mode enabled). You'll create a custom connector pointing to CoreClaw's MCP server.

### Step 1: Enable Developer Mode

1. Open ChatGPT settings
2. Navigate to **Developer Mode** and enable it
3. The message input box should now have an orange outline

### Step 2: Create an MCP connector

1. In ChatGPT, go to **Settings > Apps & Connectors > Create**
2. Fill in the fields:
   - **Name**: `coreclaw-mcp`
   - **Description**: CoreClaw MCP Server for web scraping
   - **MCP Server URL**: `https://mcp.coreclaw.com/mcp`
   - **Authentication**: Select OAuth or API Key (if available)
3. Add the header:
   - **Header name**: `api-key`
   - **Header value**: `scraper_api_YOUR_KEY_HERE`

### Step 3: Save and authorize

1. Select **Create**
2. Authorize the connection when prompted

## Verify the connection

1. Open a **new chat** in ChatGPT
2. Click **+** near the message composer → **More**
3. Select your **CoreClaw MCP** connector
4. Ask: *"Search for Amazon scrapers on CoreClaw"*
5. ChatGPT should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask ChatGPT to perform scraping tasks:

> **You:** Find a Google Maps scraper and extract restaurant data near Times Square, New York.
>
> **ChatGPT:** I'll search for a Google Maps scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Limitations

- MCP integration in ChatGPT is **beta** and may have limited availability
- Requires ChatGPT Plus or Pro subscription
- Tool selection/execution can be **slow**
- **Custom connectors** require Developer mode
- Some scrapers may trigger **Safety Scan** warnings

## Troubleshooting

### Connector not appearing

- Ensure Developer Mode is enabled
- Check that the MCP Server URL is exactly `https://mcp.coreclaw.com/mcp`
- Verify your API key is correct

### Tools fail to load

- ChatGPT may silently downgrade or disable connectors
- Try removing and re-adding the connector
- Check ChatGPT's status page for MCP service availability

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
