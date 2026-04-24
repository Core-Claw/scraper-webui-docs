---
title: Worker Pricing Rules
description: You only pay for the actual platform resources consumed during Worker runs.
sidebar:
    order: 3
---

### Pricing Model: Pay Per Usage

You only pay for the **actual platform resources consumed** during Worker runs.
There are no hidden or additional fees.

### Billing Scope

Charges cover various aspects of platform resource usage, including:

- Number of running instances and execution duration
- Network traffic consumption

Pricing is dynamically calculated based on the **selected memory configuration**.
The final cost is determined by the **actual execution time of the script** and the **amount of data processed**, including traffic usage.

![Worker pricing configuration](@/assets/docs/img_4.jpg)

### How to Estimate Costs?

While it is difficult to precisely predict resource consumption before a run, you can always review a **detailed billing breakdown** after each execution.

### Cost Usage Records

![Cost usage records](@/assets/docs/img_25.jpg)

:::note[Best Practices]

- We recommend starting with small-scale test runs (for example, scraping only a limited number of pages).
- By running trial tasks, you can clearly evaluate resource consumption and better estimate the budget required for large-scale executions.
  :::

:::tip[Feedback & Support]
If you encounter any issues while using Worker, feel free to contact us at:[support@coreclaw.com](mailto:support@coreclaw.com)
:::
