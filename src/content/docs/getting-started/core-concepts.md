---
title: Core Concepts
description: Understand the fundamental concepts of CoreClaw
sidebar:
  order: 3
---

Understanding these core concepts will help you make the most of CoreClaw.

## Worker

A **Worker** is a program that extracts data from websites. In CoreClaw:

- Workers are pre-built and ready to use
- You can also create your own Workers
- Workers run in the cloud

### Types of Workers

| Type        | Description                         | Use Case               |
| ----------- | ----------------------------------- | ---------------------- |
| **Static**  | Scrapes static HTML pages           | Simple websites, blogs |
| **Dynamic** | Handles JavaScript-rendered content | SPAs, modern websites  |
| **API**     | Directly calls website APIs         | Sites with public APIs |

## Task

A **Task** is a saved configuration for running a Worker:

- Pre-configured input parameters
- Can be scheduled for automatic runs
- Reusable for repeated data collection

### Task Benefits

- **Automation**: Schedule runs at specific intervals
- **Consistency**: Use the same parameters every time
- **Monitoring**: Track task performance over time

## Run

A **Run** is a single execution of a Worker:

- Each run has a unique ID
- Contains logs and results
- Can be monitored in real-time

### Run States

| State         | Description                |
| ------------- | -------------------------- |
| **READY**     | Run is queued and waiting  |
| **RUNNING**   | Run is currently executing |
| **SUCCEEDED** | Run completed successfully |
| **FAILED**    | Run encountered an error   |
| **ABORTED**   | Run was manually stopped   |

## Web Unlocker

**Web Unlocker** is CoreClaw's anti-detection technology:

- Bypasses CAPTCHAs automatically
- Rotates proxies to avoid IP blocks
- Handles browser fingerprinting
- Manages cookies and sessions

### When to Use Web Unlocker

- Target site has anti-bot protection
- You encounter CAPTCHAs
- IP blocking is an issue
- Geographic restrictions apply

## Data Storage

CoreClaw provides several storage options:

| Storage Type        | Description                       | Best For                 |
| ------------------- | --------------------------------- | ------------------------ |
| **Dataset**         | Structured data in tabular format | Tabular data, CSV export |
| **Key-Value Store** | Files and arbitrary data          | Images, PDFs, JSON       |
| **Request Queue**   | URLs to be scraped                | Crawling multiple pages  |

## Pricing Model

CoreClaw uses a usage-based pricing model:

### Compute Units

- Charged per Worker run
- Based on execution time and resources
- Different Workers have different costs

### Data Transfer

- Charged per GB of data transferred
- Includes both input and output data

### Storage

- Charged per GB/month
- For stored datasets and results

:::tip[Cost Optimization]
See [Pricing Rules](/user-guide/worker-pricing-rules/) for detailed pricing and cost optimization tips.
:::

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Input     │────▶│   Worker   │────▶│   Output    │
│  Parameters │     │   Runtime   │     │    Data     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Task     │
                    │  Scheduler  │
                    └─────────────┘
```

## Next Steps

- [User Guide](/user-guide/) - Learn how to use these concepts
- [API Documentation](/api/basic/base/) - Integrate with your applications
- [Developer Guide](/developer-guide/worker/what-is-worker/) - Build your own Workers
