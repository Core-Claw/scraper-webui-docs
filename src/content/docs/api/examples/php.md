---
title: PHP Example
description: Complete PHP example for CoreClaw API integration
sidebar:
  order: 4
---

Complete PHP example showing how to run a Worker and retrieve results.

## Prerequisites

No external dependencies required. Uses PHP's built-in `curl` extension.

## Complete Example

```php
<?php
/**
 * CoreClaw API Example: Run a Worker and retrieve results
 */

// API Configuration
const API_BASE_URL = "https://openapi.coreclaw.com";
const API_KEY = "YOUR_API_KEY";
const TIMEOUT = 30;

/**
 * Start an async Worker run
 */
function runScraperAsync(array $params, string $apiKey): array
{
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => API_BASE_URL . "/api/v1/scraper/run",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => TIMEOUT,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($params),
        CURLOPT_HTTPHEADER => [
            "api-key: " . $apiKey,
            "Content-Type: application/json"
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ["success" => false, "run_slug" => null, "error" => "cURL error: " . $error];
    }

    if ($httpCode !== 200) {
        return ["success" => false, "run_slug" => null, "error" => "HTTP " . $httpCode];
    }

    $result = json_decode($response, true);
    if ($result["code"] !== 0) {
        return ["success" => false, "run_slug" => null, "error" => $result["message"]];
    }

    return ["success" => true, "run_slug" => $result["data"]["run_slug"], "error" => null];
}

/**
 * Get run status
 */
function getRunStatus(string $runSlug, string $apiKey): array
{
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => API_BASE_URL . "/api/v1/run/detail",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => TIMEOUT,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(["run_slug" => $runSlug]),
        CURLOPT_HTTPHEADER => [
            "api-key: " . $apiKey,
            "Content-Type: application/json"
        ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    if ($result["code"] !== 0) {
        return ["success" => false, "status" => null, "error" => $result["message"]];
    }

    return [
        "success" => true,
        "status" => $result["data"]["status"],
        "results" => $result["data"]["results"] ?? 0,
        "error" => null
    ];
}

/**
 * Poll until complete
 * Status: 1=Ready, 2=Running, 3=Succeeded, 4=Failed, 5=Aborting
 */
function pollUntilComplete(string $runSlug, string $apiKey, int $maxWait = 300): array
{
    $terminalStates = [3, 4, 5];
    $startTime = time();

    while (time() - $startTime < $maxWait) {
        $statusResult = getRunStatus($runSlug, $apiKey);

        if (!$statusResult["success"]) {
            return $statusResult;
        }

        $status = $statusResult["status"];

        if (in_array($status, $terminalStates)) {
            return $statusResult;
        }

        echo "Status: $status (Running...)\n";
        sleep(5);
    }

    return ["success" => false, "status" => null, "error" => "Timeout"];
}

/**
 * Get result data
 */
function getResults(string $runSlug, string $apiKey): array
{
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => API_BASE_URL . "/api/v1/run/result/list",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => TIMEOUT,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(["run_slug" => $runSlug, "page_index" => 1, "page_size" => 20]),
        CURLOPT_HTTPHEADER => [
            "api-key: " . $apiKey,
            "Content-Type: application/json"
        ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    if ($result["code"] !== 0) {
        return ["success" => false, "data" => null, "error" => $result["message"]];
    }

    return ["success" => true, "count" => $result["data"]["count"], "list" => $result["data"]["list"], "error" => null];
}

// Build request params
$requestParams = [
    "scraper_slug" => "YOUR_SCRAPER_SLUG",
    "version" => "v1.0.0",  // Get from /api/scraper
    "is_async" => true,
    "input" => [
        "parameters" => [
            "system" => [
                "cpus" => 0.125,
                "memory" => 512,
                "execute_limit_time_seconds" => 1800,
                "max_total_charge" => 0,
                "max_total_traffic" => 0
            ],
            "custom" => [
                // Build from /api/scraper response
            ]
        ]
    ]
];

// Step 1: Start Worker
echo "Starting scraper...\n";
$runResult = runScraperAsync($requestParams, API_KEY);

if (!$runResult["success"]) {
    echo "Failed to start: " . $runResult["error"] . "\n";
    exit(1);
}

$runSlug = $runResult["run_slug"];
echo "Started! Run ID: $runSlug\n";

// Step 2: Poll status
echo "Polling status...\n";
$finalStatus = pollUntilComplete($runSlug, API_KEY);

if (!$finalStatus["success"]) {
    echo "Polling failed: " . $finalStatus["error"] . "\n";
    exit(1);
}

$status = $finalStatus["status"];

if ($status === 3) {  // Succeeded
    echo "Completed! Results: " . $finalStatus["results"] . "\n";

    // Step 3: Get results
    $results = getResults($runSlug, API_KEY);

    if ($results["success"]) {
        echo "Got " . $results["count"] . " records\n";
    }
} elseif ($status === 4) {
    echo "Run failed!\n";
}
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
- [Go Example](/api/examples/go/)