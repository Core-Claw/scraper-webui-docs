---
title: Builds and Runs
description: Learn about Worker builds and run management
sidebar:
  order: 3
---

Understand how Workers are built and executed on the CoreClaw platform.

## Worker Builds

Before a Worker can run, it must be built on the platform. The build process packages your Worker code and dependencies into a runnable unit.

### Build Process

1. **Code Upload** - Worker code is uploaded as a ZIP archive
2. **Dependency Install** - Required packages are installed on the platform
3. **Environment Setup** - The script runtime environment is prepared
4. **Ready State** - Worker is ready to run

### Build States

| State         | Description                    |
| ------------- | ------------------------------ |
| **PENDING**   | Build is queued                |
| **BUILDING**  | Build is in progress           |
| **SUCCESS**   | Build completed successfully   |
| **FAILED**    | Build encountered an error     |

### Build Logs

View build logs to debug build failures:

- Dependency errors
- Syntax errors
- Configuration issues

## Worker Runs

A Run is a single execution of a built Worker. Each run executes in a lightweight, process-isolated script runtime environment.

### Run Lifecycle

```
READY → RUNNING → SUCCEEDED/FAILED/ABORTING
```

### Run Management

- **Monitor** - Watch run progress in real-time
- **Abort** - Stop a running Worker
- **Rerun** - Execute the same Worker with same parameters
- **View Logs** - Debug execution issues

## Run History

CoreClaw retains all of your Worker run records. Each run is saved with:

- Unique Run ID
- Timestamp
- Duration
- Status
- Input parameters
- Output data
- Logs
