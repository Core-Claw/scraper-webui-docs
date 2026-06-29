---
title: Cline
description: Connect Cline VS Code extension to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 7
---

Connect [Cline](https://github.com/cline/cline) VS Code extension to the CoreClaw MCP Server so your AI coding assistant can discover CoreClaw workers, run them, monitor runs, and retrieve results directly within VS Code.

## Prerequisites

- VS Code with the [Cline extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) installed
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Cline supports MCP via **Streamable HTTP** transport. Configure it in the Cline settings panel.

### Step 1: Open Cline Settings

1. Open VS Code.
2. Click the Cline icon in the sidebar.
3. Go to **Settings -> MCP Servers**.
4. Click **Add MCP Server**.

### Step 2: Add the CoreClaw MCP Configuration

Fill in the form:

- **Name**: `coreclaw`
- **Transport**: `HTTP`
- **URL**: `https://mcp.coreclaw.com/mcp`
- **Headers**:
  - `api-key`: `YOUR_CORECLAW_API_KEY`

Replace `YOUR_CORECLAW_API_KEY` with your actual CoreClaw API key.

### Step 3: Save and Restart

1. Click **Save**.
2. Restart VS Code for the changes to take effect.

## Verify the Connection

1. Open VS Code and start a new Cline chat.
2. Ask: *"Find Amazon workers on CoreClaw."*
3. Cline should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Times Square, New York.
>
> **Cline:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### Tools not appearing

- Restart VS Code after MCP config changes.
- Ensure the MCP server URL is exactly `https://mcp.coreclaw.com/mcp`.
- Check that the `api-key` header is set.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
