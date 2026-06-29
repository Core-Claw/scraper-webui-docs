---
title: VS Code
description: Connect VS Code with GitHub Copilot to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 5
---

Connect VS Code with GitHub Copilot to the CoreClaw MCP Server so your AI coding assistant can discover CoreClaw workers, run them, monitor runs, and retrieve results directly within your editor.

## Prerequisites

- [VS Code](https://code.visualstudio.com) installed
- GitHub Copilot extension with **Agent mode** enabled
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

VS Code with Copilot supports MCP via **Streamable HTTP** transport. Configure it through the MCP configuration panel.

### Step 1: Open MCP Configuration

1. Open VS Code.
2. Press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS.
3. Select **MCP: Add Server** or **MCP: Open User Configuration**.
4. Open or create your `mcp.json` file.

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

### Step 3: Restart VS Code

After saving the configuration, restart VS Code for the changes to take effect.

## Verify the Connection

1. Open VS Code and start a new Copilot chat.
2. Switch to **Agent** mode.
3. Ask: *"Find Amazon workers on CoreClaw."*
4. Copilot should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Central Park, New York.
>
> **Copilot:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### Tools not appearing

- Restart VS Code after MCP config changes.
- Ensure you are in **Agent** mode.
- Check that `mcp.json` is saved correctly.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
