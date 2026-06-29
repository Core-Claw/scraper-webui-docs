---
title: Claude Desktop
description: Connect Claude Desktop to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 1
---

Connect [Claude Desktop](https://claude.ai/download) to the CoreClaw MCP Server so Claude can discover CoreClaw workers, run them, monitor runs, and retrieve results directly from your conversations.

## Prerequisites

- [Claude Desktop](https://claude.ai/download) installed
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Claude Desktop supports MCP via **Streamable HTTP** transport. Configure it through the graphical interface.

### Step 1: Open Settings

1. Open Claude Desktop.
2. Click your profile icon -> **Settings**.
3. Navigate to **Connectors & Extensions**.

### Step 2: Add MCP Server

1. Click **Add MCP Server** or **+**.
2. Fill in the form:
   - **Name**: `CoreClaw`
   - **Transport**: `HTTP`
   - **URL**: `https://mcp.coreclaw.com/mcp`
   - **Headers**:
     - `api-key`: `YOUR_CORECLAW_API_KEY`

Replace `YOUR_CORECLAW_API_KEY` with your actual CoreClaw API key.

![Claude Desktop MCP Configuration](@/assets/docs/mcp-2.png)

### Step 3: Save and Restart

1. Click **Save**.
2. Restart Claude Desktop for the changes to take effect.

## Verify the Connection

1. Open a new conversation in Claude Desktop.
2. Look for the tool icon in the message input area.
3. Ask Claude: *"Find Amazon workers on CoreClaw."*
4. Claude should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Times Square, New York.
>
> **Claude:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### Tools not appearing

- Restart Claude Desktop after MCP config changes.
- Check the [Claude Desktop logs](#claude-desktop-logs) for connection errors.
- Verify your API key is correct and active.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- Check that your key has not expired in the [Console](https://console.coreclaw.com/settings/integrations).

### Claude Desktop Logs

| Platform | Log location |
|----------|--------------|
| macOS | `~/Library/Logs/Claude/` |
| Windows | `%APPDATA%\Claude\logs\` |
| Linux | `~/.config/Claude/logs/` |

Look for files with `mcp` in the name.

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
