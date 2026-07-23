---
title: Concurrency Limits
description: How many Worker runs you can execute at the same time on each plan
sidebar:
  order: 5
---

Each CoreClaw plan allows a maximum number of Worker runs to execute **at the same time**. This keeps execution resources fair across users and keeps the platform stable. The limit applies to how many runs are active concurrently — not to how many you can run in total.

## Concurrent runs per plan

| Plan | Max concurrent runs |
| ---- | ------------------: |
| Free | 2 |
| Starter | 5 |
| Pro | 10 |
| Business | 50 |

## What counts toward the limit

Only runs that are currently executing count toward your concurrency limit. Finished runs — whether they succeeded, failed, or were cancelled — do not.

| Run status | Counts toward limit |
| ---------- | ------------------- |
| `running` | Yes |
| `succeeded` | No |
| `failed` | No |
| `aborting` / cancelled | No |

In other words:

```
Concurrent runs in use = number of runs currently in the "running" state
```

## When you reach the limit

When you start a run while already at your plan's limit, the platform does not create the run and shows a message like:

> **Can't start this run yet**
> You've reached your plan's limit for runs executing at the same time. Please wait for a running task to finish, then try again.

When a run is rejected for this reason:

- No run is created (no Run ID is generated)
- No balance is deducted
- No run quota is consumed

Wait for one of your active runs to finish, then start the run again.

## Freeing up capacity

A run releases its concurrency slot as soon as it leaves the `running` state — that is, when it reaches `succeeded`, `failed`, or after you cancel it. If you cancel a run, its slot is freed immediately once the run moves out of `running`.

## Changing your plan

- **Upgrade** — A higher limit takes effect immediately. New runs use the new limit.
- **Downgrade** — Runs already executing continue uninterrupted. Only new runs use the lower limit.

## Related

- [Run Lifecycle & Status](/api/run-lifecycle/) — the full set of run states
- [Worker Tasks](/user-guide/run-worker/worker-tasks/) — save and reuse run configurations
- [Pricing Rules](/user-guide/run-worker/pricing-rules/) — how runs are billed
