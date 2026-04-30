---
title: Quick Start
description: Get your first Worker running in 5 minutes
sidebar:
  order: 1
---

Get your first Worker running in just 5 minutes!

## Prerequisites

- A CoreClaw account ([Sign up here](https://console.coreclaw.com/sign-up))

## Step-by-Step Guide

### 1. Enter the Worker Store

After signing in, you can access the Worker Store from two entry points:

- From the [CoreClaw homepage](https://coreclaw.com), click **Store** in the navigation bar.

![Homepage Store entry](@/assets/docs/49.png)

- From the CoreClaw Console, click **Store** in the sidebar.

![Console Store entry](@/assets/docs/54.png)

### 2. Find a Worker

In the Worker Store, you can browse by category or use the search bar to find the script you need. Click on a Worker card to view its details.

![Worker Store](@/assets/docs/50.png)

On the Worker detail page, you can review the description, input parameters, sample output, and pricing. Click **Use** to proceed.

![Worker detail page](@/assets/docs/51.png)

### 3. Configure and Run

On the configuration page, you can set up the following:

**Input Parameters**

Fill in the parameters for the data you want to scrape, such as target URLs, search keywords, and other options defined by the script.

**Run Options**

- **Proxy Node**: Choose a proxy node in the region that best suits your target website. If not selected, the system will automatically assign a proxy node.
- **Script Version**: Select a specific version of the script to run, or use the latest version by default.
- **Timeout**: Set the maximum execution time for this run.

**API Endpoint**

In the top-right corner, you can find the API endpoint for this Worker, which allows you to integrate the script into your own applications and call it programmatically.

![Configure input parameters](@/assets/docs/52.png)

Once everything is configured, click **Start** to begin the run.

### 4. View Results and Export

After the run completes, you can view:

- **Run Status**: Whether the run succeeded, failed, or is still in progress.
- **Logs**: Detailed execution logs for debugging and monitoring.
- **Output Results**: The extracted data displayed in a structured table with each field clearly labeled.

On the right side of the results page, you can choose to export the data in different formats:

- **JSON** - For developers and API integration
- **CSV** - For spreadsheets and data analysis

![View results and export](@/assets/docs/53.png)
