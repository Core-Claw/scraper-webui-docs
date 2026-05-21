---
title: Node.js Example
description: Complete Node.js example for CoreClaw API integration
sidebar:
  order: 2
---

Complete Node.js example showing how to run a Worker and retrieve results.

## Prerequisites

Install the axios library:

```bash
npm install axios
```

## Complete Example

```javascript
/**
 * CoreClaw API Example: Run a Worker and retrieve results
 */
const axios = require("axios");

// API Configuration
const API_BASE_URL = "https://openapi.coreclaw.com";
const API_KEY = "YOUR_API_KEY";
const TIMEOUT = 30000;

/**
 * Start an async Worker run
 */
async function runScraperAsync(params) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/scraper/run`,
            params,
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, runSlug: null, error: `${message} (code: ${code})` };
        }

        return { success: true, runSlug: data.run_slug, error: null };
    } catch (error) {
        if (error.response) {
            return { success: false, runSlug: null, error: `HTTP ${error.response.status}` };
        }
        return { success: false, runSlug: null, error: error.message };
    }
}

/**
 * Get run status
 */
async function getRunStatus(runSlug) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/run/detail`,
            { run_slug: runSlug },
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, status: null, error: message };
        }

        return {
            success: true,
            status: data.status,
            results: data.results || 0,
            duration: data.duration || 0,
            error: null
        };
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}

/**
 * Poll until complete (success or failure)
 * Status: 1=Ready, 2=Running, 3=Succeeded, 4=Failed, 5=Aborting
 */
async function pollUntilComplete(runSlug, maxWaitMs = 300000) {
    const terminalStates = [3, 4, 5];
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        const statusResult = await getRunStatus(runSlug);

        if (!statusResult.success) {
            return statusResult;
        }

        const { status } = statusResult;

        if (terminalStates.includes(status)) {
            return statusResult;
        }

        console.log(`Status: ${status} (Running...)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return { success: false, status: null, error: `Timeout after ${maxWaitMs / 1000}s` };
}

/**
 * Get result data
 */
async function getResults(runSlug, pageIndex = 1, pageSize = 20) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/run/result/list`,
            { run_slug: runSlug, page_index: pageIndex, page_size: pageSize },
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, data: null, error: message };
        }

        return {
            success: true,
            count: data.count,
            headers: data.headers,
            list: data.list,
            error: null
        };
    } catch (error) {
        return { success: false, data: null, error: error.message };
    }
}

/**
 * Main function
 */
async function main() {
    // Build request params (based on /api/scraper schema)
    const requestParams = {
        scraper_slug: "YOUR_SCRAPER_SLUG",
        version: "v1.0.0",  // Get from /api/scraper
        is_async: true,
        input: {
            parameters: {
                system: {
                    cpus: 0.125,
                    memory: 512,
                    execute_limit_time_seconds: 1800,
                    max_total_charge: 0,
                    max_total_traffic: 0
                },
                custom: {
                    // Build from /api/scraper response
                }
            }
        }
    };

    // Step 1: Start Worker
    console.log("Starting scraper...");
    const runResult = await runScraperAsync(requestParams);

    if (!runResult.success) {
        console.log(`Failed to start: ${runResult.error}`);
        return;
    }

    const { runSlug } = runResult;
    console.log(`Started! Run ID: ${runSlug}`);

    // Step 2: Poll status
    console.log("Polling status...");
    const finalStatus = await pollUntilComplete(runSlug);

    if (!finalStatus.success) {
        console.log(`Polling failed: ${finalStatus.error}`);
        return;
    }

    const { status } = finalStatus;

    if (status === 3) {  // Succeeded
        console.log(`Completed! Results: ${finalStatus.results}, Duration: ${finalStatus.duration}s`);

        // Step 3: Get results
        const results = await getResults(runSlug);

        if (results.success) {
            console.log(`Got ${results.count} records`);
            // Process results...
        } else {
            console.log(`Failed to get results: ${results.error}`);
        }
    } else if (status === 4) {  // Failed
        console.log("Run failed!");
    } else {
        console.log(`Run aborted (status: ${status})`);
    }
}

// Execute
main().catch(console.error);
```

## Key Functions

| Function | Purpose |
|----------|---------|
| `runScraperAsync()` | Start an async Worker run |
| `getRunStatus()` | Get current run status |
| `pollUntilComplete()` | Poll until terminal state (success/failure) |
| `getResults()` | Retrieve result data with pagination |

## Status Codes

| Code | Status |
|------|--------|
| 1 | Ready |
| 2 | Running |
| 3 | Succeeded |
| 4 | Failed |
| 5 | Aborting |

## Next Steps

- [Back to Integration Guide](/api/integration/)
- [Java Example](/api/examples/java/)