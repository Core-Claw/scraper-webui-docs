---
title: n8n
description: Connect n8n workflows to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 8
---

Connect [n8n](https://n8n.io) workflows to the CoreClaw MCP Server so your automation pipelines can search for scrapers, run them, and retrieve data as part of your workflow.

## Prerequisites

- [n8n](https://n8n.io) instance (self-hosted or cloud)
- A CoreClaw account with an API key — get it from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

n8n supports MCP via **Streamable HTTP** transport. You can configure it via the MCP Client Tool node.

### Step 1: Add an MCP Client Tool node

1. In your n8n workflow, add an **MCP Client Tool** node
2. Set the transport to **Streamable HTTP**

### Step 2: Configure the MCP server

Fill in the node settings:

- **URL**: `https://mcp.coreclaw.com/mcp`
- **Headers**:
  - `api-key`: `scraper_api_YOUR_KEY_HERE`

Replace `scraper_api_YOUR_KEY_HERE` with your actual CoreClaw API key.

### Step 3: Connect to your workflow

1. Connect the MCP Client Tool node to an AI Agent node
2. Connect the AI Agent node to subsequent processing nodes

## Verify the connection

1. Execute the workflow
2. The AI Agent should be able to call CoreClaw tools like `search_scrapers`

## Example workflow

A typical n8n workflow with CoreClaw MCP:

```
[Trigger] → [AI Agent] → [MCP Client Tool: CoreClaw] → [Process Results] → [Save to Database]
```

**Example prompt for the AI Agent:**

> Search for an Amazon product scraper on CoreClaw, run it with this URL: https://www.amazon.com/dp/B0CHHSFMRL, and return the product title, price, and rating.

The AI Agent will automatically:
1. Call `search_scrapers` to find an Amazon scraper
2. Call `get_scraper_details` to get the parameter schema
3. Call `run_scraper` with the URL
4. Poll `get_run_status` until completion
5. Call `get_run_results` to retrieve the data

## Troubleshooting

### Tools not appearing

- Verify the MCP Client Tool node URL is correct
- Ensure the `api-key` header is set
- Check n8n logs for connection errors

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations)

## Next steps

- [→ Back to MCP overview](/integrations/ai/mcp/)
- [→ CoreClaw API documentation](/api/)
