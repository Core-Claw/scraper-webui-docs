---
title: "PHP Example"
description: "CoreClaw API v2 integration code example"
sidebar:
  order: 4
---

The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.

`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker's input schema; fields differ by Worker.

The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.

```php
<?php
$apiBaseUrl = "https://openapi.coreclaw.com";
$apiKey = getenv("CORECLAW_API_KEY");
$workerId = getenv("CORECLAW_WORKER_ID") ?: "YOUR_WORKER_ID";

if (!$apiKey) {
    throw new RuntimeException("Set CORECLAW_API_KEY first.");
}

function coreclaw_request(string $method, string $path, ?array $query = null, ?array $body = null): array
{
    global $apiBaseUrl, $apiKey;

    $url = $apiBaseUrl . $path;
    if ($query) {
        $url .= "?" . http_build_query($query);
    }

    $headers = ["Authorization: Bearer " . $apiKey];
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
    ];

    if ($body !== null) {
        $headers[] = "Content-Type: application/json";
        $options[CURLOPT_HTTPHEADER] = $headers;
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);
    $raw = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($raw === false || $status < 200 || $status >= 300) {
        throw new RuntimeException("HTTP " . $status . ": " . $raw);
    }

    $payload = json_decode($raw, true);
    if (($payload["code"] ?? null) !== 0) {
        throw new RuntimeException($raw);
    }
    return $payload;
}

function wait_for_run(string $runId, int $timeoutSeconds = 300): array
{
    $deadline = microtime(true) + $timeoutSeconds;
    $delaySeconds = 2;
    while (microtime(true) < $deadline) {
        $detail = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId));
        $runData = $detail["data"];
        $status = $runData["status"] ?? null;
        if ($status === "succeeded") {
            return $runData;
        }
        if (in_array($status, ["failed", "aborting"], true)) {
            $logs = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId) . "/log");
            throw new RuntimeException(json_encode([
                "status" => $status,
                "err_msg" => $runData["err_msg"] ?? null,
                "request_id" => $detail["request_id"] ?? null,
                "logs" => $logs["data"] ?? null,
            ]));
        }
        if (!in_array($status, ["ready", "running"], true)) {
            throw new RuntimeException("Unexpected run status: " . $status);
        }
        sleep($delaySeconds);
        $delaySeconds = min($delaySeconds * 2, 15);
    }
    throw new RuntimeException("Timed out waiting for run " . $runId);
}

$account = coreclaw_request("GET", "/api/v2/users/account");
print_r($account["data"]);

$run = coreclaw_request("POST", "/api/v2/workers/" . rawurlencode($workerId) . "/runs", null, [
    // Replace input.parameters.custom with fields from the Worker's input schema.
    "input" => [
        "parameters" => [
            "custom" => [
                "keywords" => ["coffee"],
                "base_location" => "New York,USA",
                "max_results" => 1,
            ],
        ],
    ],
    "is_async" => true,
    "offset" => 0,
    "limit" => 20,
]);
$runId = $run["data"]["run_slug"];
echo "Run ID: " . $runId . PHP_EOL;

$completedRun = wait_for_run($runId);

$results = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId) . "/result", [
    "offset" => 0,
    "limit" => 20,
]);
print_r(["status" => $completedRun["status"], "results" => $results["data"]]);
```
