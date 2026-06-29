---
title: "PHP 示例"
description: "CoreClaw API v2 集成代码示例"
sidebar:
  order: 4
---

下面示例覆盖认证检查、启动 Worker、用返回的 `run_slug` 查询结果三步。

示例中的 `YOUR_WORKER_ID` 是占位符。请替换为要运行的 Worker slug，或把 `owner/name` 路径写成 `owner~name`。`input` 必须按该 Worker 的输入 schema 构造；不同 Worker 的字段不一定相同。

默认使用 `is_async: true` 异步提交并轮询结果。如需等待执行完成，把 `is_async` 改为 `false`，并用 `offset` / `limit` 控制同步返回的数据窗口。

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

$account = coreclaw_request("GET", "/api/v2/users/account");
print_r($account["data"]);

$run = coreclaw_request("POST", "/api/v2/workers/" . rawurlencode($workerId) . "/runs", null, [
    // Replace this array with fields from the Worker's input schema.
    "input" => ["keyword" => "coffee", "limit" => 10],
    "is_async" => true,
    "version" => "latest",
    "offset" => 0,
    "limit" => 20,
]);
$runId = $run["data"]["run_slug"];
echo "Run ID: " . $runId . PHP_EOL;

$results = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId) . "/result", [
    "offset" => 0,
    "limit" => 20,
]);
print_r($results["data"]);
```
