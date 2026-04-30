---
title: Builds and Runs
description: Understand how Workers run on the CoreClaw platform
sidebar:
  order: 3
---

Understand how Workers run on the CoreClaw platform.

## No Build Required — Lightweight Script Mode

CoreClaw's execution flow is:

```
User Code → Script Runtime → Remote Fingerprint Browser Pool (CDP) → Target Website
```

CoreClaw uses **lightweight process isolation**, not container isolation:

- **Runtime is pre-provisioned**: Python/Node runtimes and base dependencies are already installed in the shared environment.
- **Browser is remotely hosted**: No need to build a browser environment locally. Instead, connect to the remote fingerprint browser pool via CDP.
- **Dependency installation is automatic**: The platform automatically installs dependencies based on `requirements.txt` / `package.json` — no manual image building required.

So all you need to do is: **Upload your script (or find one in the Store) → Click Run**. The platform handles dependency installation and execution automatically.

**In short**: CoreClaw has no Build step because it provides **platform-level hosting** for both the runtime and the browser. Users don't need to worry about environment setup — this is CoreClaw's advantage: **upload and run**.

## Run Lifecycle

```
READY → RUNNING → SUCCEEDED / FAILED / ABORTING
```

| Status | Description |
| ------ | ----------- |
| **READY** | Run is queued and waiting to start |
| **RUNNING** | Script is currently executing |
| **SUCCEEDED** | Run completed successfully |
| **FAILED** | Run encountered an error |
| **ABORTING** | Run is being stopped |

## Run Management

- **Monitor** - View real-time run progress
- **Abort** - Stop a running Worker
- **Rerun** - Execute again with the same parameters
- **View Logs** - Debug execution issues

## Run History

CoreClaw retains all your Worker run records. Each run saves:

- Unique Run ID
- Timestamp
- Duration
- Status
- Input parameters
- Output data
- Logs

You can view run records in the Console.
