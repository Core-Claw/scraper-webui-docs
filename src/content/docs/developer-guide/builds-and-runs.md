---
title: Builds & Runs
description: Understand how Workers build and run on CoreClaw
sidebar:
  order: 9
---

Understand how Workers build and run on the CoreClaw platform.

## No Build Step — Lightweight Script Mode

CoreClaw does not have a traditional Build step. Unlike container-based platforms that require Docker image building, CoreClaw uses **lightweight process isolation** — your script runs directly in a pre-provisioned runtime environment.

### Execution Flow

```
Your Code (ZIP) → Auto Dependency Install → Script Runtime → Remote Browser Pool (CDP) → Target Website
```

### Why No Build?

CoreClaw eliminates the Build step through **platform-level hosting**:

- **Runtime is pre-provisioned** — Python/Node.js runtimes and base dependencies are already installed in the shared environment. You don't need to build or configure a runtime image.
- **Browser is remotely hosted** — No need to package a browser into your project. Connect to the remote fingerprint browser pool via the `ChromeWs` environment variable (CDP/WebSocket). See [Browser Fingerprinting](/developer-guide/worker-definition/platform-features/browser-fingerprinting/) for details.
- **Dependencies install automatically** — The platform reads your `requirements.txt` or `package.json` and installs dependencies before execution. No manual image building required.
- **Network is sandboxed** — The runtime is an isolated network sandbox. HTTP request scripts must use the built-in SOCKS5 proxy (via `PROXY_AUTH` environment variable). See [Proxy Support](/developer-guide/worker-definition/platform-features/proxy-support/) for details.

**In short**: Upload your ZIP package → The platform handles the rest. This is CoreClaw's advantage: **upload and run**.

### What Happens When You Upload

When you upload a ZIP package to CoreClaw:

1. **Validation** — The platform checks the ZIP structure (entry file, `input_schema.json`, `output_schema.json`)
2. **Dependency Resolution** — Reads `requirements.txt` / `package.json` and resolves dependencies
3. **Environment Preparation** — Prepares the script runtime with your dependencies
4. **Ready** — Your Worker is ready to run

This process is automatic and typically completes within seconds.

## Run Lifecycle

Each Run is a single execution of your Worker. The lifecycle is:

```
READY → RUNNING → SUCCEEDED / FAILED / ABORTING
```

| Status | Code | Description |
| ------ | ---- | ----------- |
| **READY** | 1 | Run is queued and waiting to start |
| **RUNNING** | 2 | Script is currently executing |
| **SUCCEEDED** | 3 | Run completed successfully |
| **FAILED** | 4 | Run encountered an error |
| **ABORTING** | 5 | Run is being stopped |

## Run Environment

Each run executes in a lightweight, process-isolated environment with:

- **Pre-installed runtime** — Python 3.x or Node.js, depending on your project
- **Automatic dependencies** — Packages from `requirements.txt` / `package.json`
- **Environment variables**:
  - `PROXY_AUTH` — SOCKS5 proxy credentials (username:password) for HTTP requests
  - `ChromeWs` — WebSocket address for connecting to the remote fingerprint browser
- **SDK communication** — gRPC channel to the CoreClaw platform (127.0.0.1:20086)

## Run Management

You can manage runs from the Console or via the API:

- **Monitor** — Watch run progress and logs in real-time
- **Abort** — Stop a running Worker via the Console or `POST /api/v1/runs/{run_slug}/abort`
- **Rerun** — Execute again with the same parameters via `POST /api/v1/runs/{run_slug}/rerun`
- **View Logs** — Access execution logs via `GET /api/v1/runs/{run_slug}/logs`
- **Export Results** — Download output data in JSON or CSV via `POST /api/v1/runs/{run_slug}/export`

## Run History

CoreClaw retains all your Worker run records. Each run saves:

- Unique Run ID and Run Slug
- Timestamp
- Duration
- Status and status code
- Input parameters
- Output data (accessible via `GET /api/v1/runs/{run_slug}/results`)
- Execution logs

You can list all runs via `GET /api/v1/runs` and view detailed records in the Console.

## Best Practices

### Before Uploading

- Keep dependencies minimal to speed up automatic installation
- Pin dependency versions in `requirements.txt` / `package.json`
- Test your core logic locally before uploading
- Ensure `input_schema.json` and `output_schema.json` are correctly configured

### During Development

- Start with small test runs to validate functionality
- Monitor logs to catch errors early
- Use the `CoreSDK.Log` module to add meaningful log messages
- Test both HTTP request and browser automation paths

### For Production

- Use Tasks for repeated runs — see [Worker Tasks](/developer-guide/develop-worker/worker-tasks/)
- Set appropriate timeout values for long-running scripts
- Handle errors gracefully with try/except and meaningful error messages
