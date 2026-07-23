---
title: Pricing Rules
description: Pay only for the platform resources actually consumed during Worker runs, with no hidden fees.
sidebar:
  order: 7
---

## Pay per usage

You only pay for the platform resources **actually consumed** during Worker runs, with no hidden fees. Pricing is transparent.

Billing is based on successful results — you are not charged for results a run did not produce. A run that is rejected before it starts (for example, when you are at your plan's [concurrency limit](/user-guide/run-worker/concurrency-limits/)) does not deduct any balance. To see exactly what a run cost, check its cost record in Run History.

View your subscription plan — different plans offer different discounts and feature support.

## Subscriptions become usable balance

When you pay for a subscription plan, that amount is **not** an extra fee on top of usage. It is converted into usable account balance, which is then consumed by your Worker runs based on actual resource usage. In other words, the subscription preloads the balance your scripts bill against — there is no separate subscription charge beyond what you spend on runs.

![Subscription plan](@/assets/docs/69.png)

![Plan details](@/assets/docs/70.png)

:::note
The prices shown are for reference only and may be adjusted according to platform policies. For detailed pricing information, visit [coreclaw.com/pricing](https://www.coreclaw.com/pricing) or [console.coreclaw.com/wallet](https://console.coreclaw.com/wallet).
:::

## How to estimate costs?

While it's difficult to predict resource consumption precisely before a run, you can view the cost records in the Run History section of the Console after each run.

![Cost records](@/assets/docs/71.png)

:::note[Best practice]
We recommend running a small-scale test (e.g., scraping only a few pages). Through a trial run, you can directly evaluate resource consumption and extrapolate the budget for a large-scale run.
:::

:::tip[Feedback & Support]
If you encounter any issues while using Workers, feel free to email: [support@coreclaw.com](mailto:support@coreclaw.com)
:::
