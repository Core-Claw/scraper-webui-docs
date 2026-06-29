---
title: Claude CLI
description: Connect Claude CLI (Claude Code) to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 11
---

Connect [Claude CLI](https://github.com/anthropics/claude-code) (Claude Code) to the CoreClaw MCP Server so you can discover CoreClaw workers, run them, monitor runs, and retrieve results directly from terminal conversations.

## Prerequisites

- [Claude CLI](https://github.com/anthropics/claude-code) installed (`npm install -g @anthropics/claude-code`)
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Claude CLI supports MCP via **Streamable HTTP** transport. Configure it with a JSON config file.

### Step 1: Create or edit the MCP configuration file

Create a file named `claude-mcp.json` in your project directory, or use your preferred MCP config location:

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

### Step 2: Launch Claude CLI with the MCP config

```bash
claude --mcp-config claude-mcp.json
```

Alternatively, place the config at `~/.config/claude/mcp.json` on macOS/Linux or `%APPDATA%\claude\mcp.json` on Windows if your Claude installation loads that path automatically.

## Verify the Connection

1. Start Claude CLI with the MCP configuration.
2. Ask Claude: *"Find Amazon workers on CoreClaw."*
3. Claude should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Times Square, New York.
>
> **Claude:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Troubleshooting

### MCP config not loading

- Verify the JSON file path passed to `--mcp-config`.
- Ensure the JSON is valid.
- Restart the Claude session after config changes.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- The hosted MCP service also accepts `X-API-Key` and `Authorization: Bearer YOUR_CORECLAW_API_KEY`.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

### Tools not available

- Confirm Claude CLI supports Streamable HTTP MCP.
- Check the Claude session logs for MCP connection errors.

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
