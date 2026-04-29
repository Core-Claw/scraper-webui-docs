---
title: How to run a Worker?
description: Step-by-step guide to running your first Worker
sidebar:
  order: 1
---

Learn how to run a Worker on CoreClaw in a few simple steps.

## Prerequisites

Before running a Worker, make sure you have:

- A CoreClaw account ([Sign up free](https://console.coreclaw.com/sign-up))
- Sufficient account balance (check your dashboard)
- The target website URL or parameters ready

## Step-by-Step Guide

### 1. Find a Worker

Navigate to the **Worker Store** or **Console Worker** page to find a Worker that meets your needs.

You can:
- Browse by category
- Search by website name
- Filter by features

### 2. Review Worker Details

Click on a Worker to see:

| Information     | Description                    |
| --------------- | ------------------------------ |
| **Description** | What the Worker does           |
| **Input**       | Required parameters            |
| **Output**      | Data structure returned        |
| **Pricing**     | Cost per run                   |

### 3. Configure Input

Fill in the required input parameters:

- URLs to scrape
- Search queries
- Pagination settings
- Any other Worker-specific options

### 4. Start the Run

Click **"Run Worker"** to start execution:

1. The system creates a new Run
2. Resources are allocated
3. The Worker begins scraping

### 5. Monitor Progress

Track your run in real-time:

- **Status**: READY → RUNNING → SUCCEEDED
- **Progress**: Items scraped, pages processed
- **Logs**: Live execution logs

### 6. Get Results

Once complete:

- View results in the console
- Download as JSON or CSV
- Access via API

## Tips for Success

:::tip[Best Practices]
- Start with a small test run first
- Check the Worker's sample output
- Review logs if something goes wrong
- Use Tasks for repeated runs
:::

## Related Topics

- [Worker Tasks](/user-guide/run-worker/worker-tasks/) - Save configurations for reuse
- [Input and Output](/user-guide/run-worker/input-output/) - Understand parameters
- [API Calls](/user-guide/run-worker/api-calls/) - Run programmatically
