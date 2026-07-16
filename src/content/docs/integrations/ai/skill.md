---
title: CoreClaw Skill
description: Install the CoreClaw Skill as a Claude Code plugin to run Workers from your AI coding assistant.
sidebar:
  order: 12
---

The [CoreClaw Skill](https://github.com/Core-Claw/CoreClaw-Skill) packages the full CoreClaw OpenAPI v2 workflow as an AI-agent skill — discover Workers, inspect input schemas, run Workers and tasks, poll runs, fetch results, export data, and read logs, all from inside your AI assistant. It is MCP-first and v2-only.

It ships as a **Claude Code plugin** (the recommended path) and can also be used as a standalone skill or a Codex skill.

## What you can do

- **Discover** Workers in the Store or your private workspace.
- **Inspect** a Worker's input schema before running it.
- **Run** a Worker or a saved task (async by default), with batch runs supported.
- **Poll & verify** — `poll_run` waits for completion; `verify_run` returns a structured verdict.
- **Retrieve results** — paginated rows, or export as CSV/JSON (eight formats, default `csv`).
- **Read logs** with in-process `grep` filtering, plus reruns and aborts.

The skill exposes **37 tools** — the 34 OpenAPI v2 operations plus three orchestration helpers (`poll_run`, `verify_run`, `run_workers_batch`). It calls the hosted MCP endpoint (`https://mcp.coreclaw.com/mcp`) and falls back to the REST API (`https://openapi.coreclaw.com`) with your `CORECLAW_API_KEY`.

## Prerequisites

- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed
- A CoreClaw account with an API key from [Console → Settings → API & Integrations](https://console.coreclaw.com/settings/integrations)

## Install as a Claude Code plugin (recommended)

Two commands:

```bash
claude plugin marketplace add Core-Claw/CoreClaw-Skill
claude plugin install coreclaw@coreclaw-skill
```

Then set your API key as an environment variable:

```bash
export CORECLAW_API_KEY=YOUR_CORECLAW_API_KEY
```

Once installed, the skill is available under the `/coreclaw-skill:coreclaw` namespace in Claude Code.

## Use it

Ask Claude Code to do CoreClaw work in natural language:

> Find a Google Maps worker on CoreClaw, inspect its input schema, run it for coffee shops near Times Square, and return the name, address, and rating for the top 10.

Claude Code will call `list_store_workers` → `get_worker_input_schema` → `run_worker` → `poll_run` → `list_worker_run_results` on your behalf.

## Other installation modes

- **Standalone skill** — clone the repo into `~/.claude/skills/coreclaw`; it loads as `/coreclaw`.
- **Codex Desktop** — symlink `skills/coreclaw` from the repo into Codex's skills directory.

See the [CoreClaw-Skill README](https://github.com/Core-Claw/CoreClaw-Skill) for full details.

## Next steps

- [MCP Server overview](/integrations/ai/mcp/) — connect other AI clients (Cursor, Codex, ChatGPT, …)
- [CoreClaw API documentation](/api/)
