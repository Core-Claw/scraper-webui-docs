---
title: Test Environment
description: Learn how to use the test environment to validate your scraping logic before a production run.
sidebar:
    order: 7
---

## What is the Test Environment?

The test environment is an isolated runtime environment used for:

- Validating scraping parameters
- Debugging data fields
- Checking anti-scraping conditions
- Optimizing scraping logic
- Previewing data structure

This environment **does not affect production task data** and does not overwrite official run records.

## Test Environment vs. Production Environment

| Item | Test Environment | Production Environment |
|------|-----------------|----------------------|
| Data Scale | Small sample | Full dataset |
| Run Purpose | Debug & validate | Production scraping |
| Execution Frequency | Temporary runs | Scheduled runs available |
| Data Retention | Short-term | Per platform policy |
| Cost | Low consumption or limited | Billed by actual resource usage |

:::note[Recommendation]
Always validate run results in the test environment before deploying to production.
:::

## How to Use the Test Environment

### Step 1: Navigate to the Script Page

1. Log in to your account
2. Go to the Console
3. Click "My Scripts"
4. Select the Script you want to test

### Step 2: Configure Test Parameters

- In the input parameters area, it is recommended to use default parameters.

### Step 3: Review Test Results

After the test completes, you can review:

- Data preview
- Field structure
- Execution logs
- Error messages

Once you confirm the data structure is correct, proceed with a production run.

## Important Notes

- The test environment is for debugging only; it is not recommended for formal data delivery.
- Test data may only be retained for a limited time.
- Test runs may also consume a small amount of resources.
- If failures occur frequently, check log information or contact technical support.
