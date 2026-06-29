---
title: Codex Desktop
description: Connect OpenAI Codex Desktop App to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 2
---

Connect [OpenAI Codex](https://openai.com/codex) Desktop App to the CoreClaw MCP Server so you can discover CoreClaw workers, run them, monitor runs, and retrieve results directly from Codex conversations.

## Prerequisites

- [Codex Desktop App](https://openai.com/codex) installed
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Codex Desktop supports MCP via **Streamable HTTP** transport. Configure it through the graphical interface.

### Step 1: Open Settings

1. Open Codex Desktop.
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

![Codex Desktop MCP Configuration](@/assets/docs/mcp-1.png)

### Step 3: Save and Restart

1. Click **Save**.
2. Restart Codex Desktop for the changes to take effect.

## Verify the Connection

1. Open Codex Desktop and start a new conversation.
2. Look for the tool icon in the message input area.
3. Ask: *"Find Amazon workers on CoreClaw."*
4. Codex should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Central Park, New York.
>
> **Codex:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### Tools not appearing

- Restart Codex Desktop after changing MCP settings.
- Verify the MCP URL is exactly `https://mcp.coreclaw.com/mcp`.
- Verify your API key is correct and active.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- The hosted MCP service also accepts `X-API-Key` and `Authorization: Bearer YOUR_CORECLAW_API_KEY`.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
