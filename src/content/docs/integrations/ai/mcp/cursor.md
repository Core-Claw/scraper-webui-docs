---
title: Cursor
description: Connect Cursor IDE to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 3
---

Connect [Cursor](https://cursor.com) IDE to the CoreClaw MCP Server so your AI coding assistant can discover CoreClaw workers, run them, monitor runs, and retrieve results directly within your editor.

## Prerequisites

- [Cursor](https://cursor.com) installed
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Cursor supports MCP via **Streamable HTTP** transport. Configure it by creating an `mcp.json` file in your project or global settings.

### Step 1: Create the MCP Configuration File

Project-level:

```text
.your-project/.cursor/mcp.json
```

Global:

```text
~/.cursor/mcp.json
```

### Step 2: Add the CoreClaw MCP Configuration

```json
{
  "mcpServers": {
    "coreclaw": {
      "url": "https://mcp.coreclaw.com/mcp",
      "headers": {
        "api-key": "YOUR_CORECLAW_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_CORECLAW_API_KEY` with your actual CoreClaw API key.

![Cursor IDE MCP Configuration](@/assets/docs/mcp-4.png)

### Step 3: Restart Cursor

After saving the configuration, restart Cursor for the changes to take effect.

## Verify the Connection

1. Open Cursor and start a new chat.
2. Switch to **Agent** mode.
3. Ask: *"Find Amazon workers on CoreClaw."*
4. Cursor should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Central Park, New York.
>
> **Cursor:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### Tools not appearing

- Restart Cursor after MCP config changes.
- Ensure you are in **Agent** mode.
- Check that `mcp.json` is in the correct location.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
