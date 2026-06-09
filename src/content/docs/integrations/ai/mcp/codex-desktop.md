---
title: Codex Desktop
description: Connect OpenAI Codex Desktop App to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 2
---

Connect [OpenAI Codex](https://openai.com/codex) Desktop App to the CoreClaw MCP Server so you can search for scrapers, run them, and retrieve data directly from your Codex conversations.

## Prerequisites

- [Codex Desktop App](https://openai.com/codex) installed
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Codex Desktop supports MCP via **Streamable HTTP** transport. You can configure it through the graphical interface.

### Step 1: Open Settings

1. Open Codex Desktop
2. Click on your profile icon → **Settings**
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

![Codex Desktop MCP Configuration](@/assets/docs/mcp-1.png)

### Step 3: Save and restart

1. Click **Save**
2. **Restart Codex Desktop** for the changes to take effect

## Verify the connection

1. Open Codex Desktop and start a new conversation
2. Look for the **tool icon** in the message input area — this indicates MCP tools are available
3. Ask: *"Search for Amazon scrapers on CoreClaw"*
4. Codex should invoke `search_scrapers` and return results

## Example conversation

Once connected, you can ask Codex to perform scraping tasks:

> **You:** Find a Twitter scraper and extract the latest tweets from @elonmusk
>
> **Codex:** I'll search for a Twitter scraper and run it for you. *[Calls `search_scrapers` → `get_scraper_details` → `run_scraper` → polls status → returns results]*

## Troubleshooting

### Tools not appearing

- **Restart Codex Desktop** — MCP changes require a full restart
- Verify your API key is correct and active

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
