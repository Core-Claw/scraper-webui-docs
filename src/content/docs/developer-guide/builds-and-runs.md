---
title: Builds & Runs
description: Manage Worker builds and runs
sidebar:
  order: 9
---

Learn about managing Worker builds and runs on CoreClaw.

## Worker Builds

A Build is the process of packaging your Worker code and dependencies into a runnable unit on the platform.

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

### Managing Builds

- **View all builds** in the Worker details page
- **Check build logs** for debugging
- **Rebuild** to retry failed builds

## Worker Runs

A Run is a single execution of a built Worker. Each run executes in a lightweight, process-isolated script runtime environment.

### Run Lifecycle

```
READY → RUNNING → SUCCEEDED/FAILED/ABORTING
```

### Run States

| State         | Description                  |
| ------------- | ---------------------------- |
| **READY**     | Run is queued and waiting    |
| **RUNNING**   | Run is currently executing   |
| **SUCCEEDED** | Run completed successfully   |
| **FAILED**    | Run encountered an error     |
| **ABORTING**  | Run is being stopped         |

### Run Management

- **Monitor** - Watch run progress in real-time
- **Abort** - Stop a running Worker
- **Rerun** - Execute with same parameters
- **View Logs** - Debug execution issues
- **Download Results** - Get output data

## Run History

CoreClaw retains all of your Worker run records. Each run is saved with:

| Field       | Description              |
| ----------- | ------------------------ |
| **Run ID**  | Unique identifier        |
| **Status**  | Current state            |
| **Duration** | Execution time          |
| **Input**   | Parameters used          |
| **Output**  | Results (if succeeded)   |
| **Logs**    | Execution logs           |

## Best Practices

### For Builds

- Keep dependencies minimal
- Pin dependency versions
- Test locally before uploading

### For Runs

- Start with small test runs
- Monitor logs for issues
- Use Tasks for repeated runs
