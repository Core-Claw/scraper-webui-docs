---
title: Codex CLI
description: Connect OpenAI Codex CLI to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 10
---

Connect [OpenAI Codex CLI](https://github.com/openai/codex) to the CoreClaw MCP Server so you can discover CoreClaw workers, run them, monitor runs, and retrieve results directly from your terminal conversations.

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) installed (`npm install -g @openai/codex`)
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

Codex CLI supports MCP via **Streamable HTTP** transport. You can configure it with a JSON config file.

### Step 1: Create or edit the MCP configuration file

Create a file named `codex-mcp.json` in your project directory, or use your preferred MCP config location:

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

### Step 2: Launch Codex with the MCP config

```bash
codex --mcp-config codex-mcp.json
```

Alternatively, place the config at `~/.config/codex/mcp.json` on macOS/Linux or `%APPDATA%\codex\mcp.json` on Windows if your Codex installation loads that path automatically.

## Verify the Connection

1. Start Codex with the MCP configuration.
2. Ask Codex: *"Find Amazon workers on CoreClaw."*
3. Codex should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Times Square, New York.
>
> **Codex:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Useful Tool Flow

- Use `list_store_workers` to find public marketplace workers.
- Use `get_worker_input_schema` before composing `run_worker` input.
- Use `run_worker` with `input_json` for ad-hoc runs.
- Use `get_worker_run` to poll run status.
- Use `list_worker_run_results`, `export_worker_run_results`, or `get_worker_run_log` after the run starts.

## Troubleshooting

### MCP config not loading

- Verify the JSON file path passed to `--mcp-config`.
- Ensure the JSON is valid.
- Restart the Codex session after config changes.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- The hosted MCP service also accepts `X-API-Key` and `Authorization: Bearer YOUR_CORECLAW_API_KEY`.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

### Tools not available

- Confirm Codex CLI supports Streamable HTTP MCP.
- Check the Codex session logs for MCP connection errors.

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
