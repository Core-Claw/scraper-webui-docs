---
title: ChatGPT / OpenAI
description: Connect ChatGPT to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 4
---

Connect ChatGPT through a custom MCP connector to the CoreClaw MCP Server so you can discover CoreClaw workers, run them, monitor runs, and retrieve results directly from ChatGPT conversations.

## Prerequisites

- An OpenAI account with ChatGPT access
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

ChatGPT supports MCP connectors through its **Apps & Connectors** feature when available for your account. Create a custom connector that points to CoreClaw's hosted MCP endpoint.

### Step 1: Enable Developer Mode

1. Open ChatGPT settings.
2. Navigate to **Developer Mode** and enable it.
3. Confirm that custom connector creation is available.

### Step 2: Create an MCP Connector

1. In ChatGPT, go to **Settings > Apps & Connectors > Create**.
2. Fill in the fields:
   - **Name**: `coreclaw-mcp`
   - **Description**: CoreClaw MCP Server for worker discovery, execution, results, exports, and logs
   - **MCP Server URL**: `https://mcp.coreclaw.com/mcp`
   - **Authentication**: choose API key or custom header if available
3. Add the header:
   - **Header name**: `api-key`
   - **Header value**: `YOUR_CORECLAW_API_KEY`

### Step 3: Save and Authorize

1. Select **Create**.
2. Authorize the connection when prompted.

## Verify the Connection

1. Open a new chat in ChatGPT.
2. Select your **CoreClaw MCP** connector from the composer tools or connectors menu.
3. Ask: *"Find Amazon workers on CoreClaw."*
4. ChatGPT should call `list_store_workers` and return matching workers.

## Example Conversation

> **You:** Find a Google Maps worker and extract restaurant data near Times Square, New York.
>
> **ChatGPT:** I'll find a Google Maps worker, inspect its input schema, and run it for you. *[Calls `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## Limitations

- MCP connector availability in ChatGPT can vary by account and plan.
- Tool selection and execution can be slower than a direct API integration.
- Custom connectors may require Developer Mode.
- Some worker runs may trigger safety or confirmation prompts.

## Troubleshooting

### Connector not appearing

- Ensure Developer Mode is enabled.
- Check that the MCP Server URL is exactly `https://mcp.coreclaw.com/mcp`.
- Verify your API key is correct.

### Tools fail to load

- Try removing and re-adding the connector.
- Confirm the connector sends the `api-key` header.
- Check ChatGPT service status and connector logs if available.

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
