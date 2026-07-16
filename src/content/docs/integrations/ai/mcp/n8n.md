---
title: n8n
description: Connect n8n workflows to CoreClaw MCP Server via Streamable HTTP.
sidebar:
  order: 8
---

Connect [n8n](https://n8n.io) workflows to the CoreClaw MCP Server so your automation pipelines can discover CoreClaw workers, run them, monitor runs, and retrieve results as part of a workflow.

## Prerequisites

- An [n8n](https://n8n.io) instance
- A CoreClaw account with an API key from [Console -> Settings -> API & Integrations](https://console.coreclaw.com/settings/integrations)

## Configuration

n8n supports MCP via **Streamable HTTP** transport through an MCP Client Tool node.

### Step 1: Add an MCP Client Tool Node

1. In your n8n workflow, add an **MCP Client Tool** node.
2. Set the transport to **Streamable HTTP**.

### Step 2: Configure the MCP Server

Fill in the node settings:

- **URL**: `https://mcp.coreclaw.com/mcp`
- **Headers**:
  - `api-key`: `YOUR_CORECLAW_API_KEY`

Replace `YOUR_CORECLAW_API_KEY` with your actual CoreClaw API key.

### Step 3: Connect to Your Workflow

1. Connect the MCP Client Tool node to an AI Agent node.
2. Connect the AI Agent node to downstream processing nodes.

## Verify the Connection

1. Execute the workflow.
2. The AI Agent should be able to call CoreClaw tools such as `list_store_workers`.

## Example Workflow

```text
[Trigger] -> [AI Agent] -> [MCP Client Tool: CoreClaw] -> [Process Results] -> [Save to Database]
```

Example prompt for the AI Agent:

> Find an Amazon product worker on CoreClaw, inspect its input schema, run it with this product URL, and return the product title, price, and rating.

The AI Agent should:

1. Call `list_store_workers` to find an Amazon worker.
2. Call `get_worker_input_schema` to inspect required inputs.
3. Call `run_worker` with `input_json`.
4. Poll `get_worker_run` until the run completes.
5. Call `list_worker_run_results` or `export_worker_run_results` to retrieve data.

## Troubleshooting

### Tools not appearing

- Verify the MCP Client Tool URL is exactly `https://mcp.coreclaw.com/mcp`.
- Ensure the `api-key` header is set.
- Check n8n execution logs for connection errors.

### Authentication errors

- Ensure the `api-key` header value matches your CoreClaw API key exactly.
- Verify your key is active in the [Console](https://console.coreclaw.com/settings/integrations).

## Next Steps

- [Back to MCP overview](/integrations/ai/mcp/)
- [CoreClaw API documentation](/api/)
- [n8n community node](/integrations/workflows-and-notifications/n8n/) — a dedicated CoreClaw node for n8n (no AI agent required)
- [coreclaw-n8n-workflows](https://github.com/Core-Claw/coreclaw-n8n-workflows) — production-ready n8n workflow templates
