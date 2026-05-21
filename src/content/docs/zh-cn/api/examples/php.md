---
title: PHP 示例
description: CoreClaw API 集成的完整 PHP 示例
sidebar:
  order: 4
---

完整的 PHP 示例，展示如何运行 Worker 并获取结果。

## 环境准备

无需外部依赖。使用 PHP 内置的 `curl` 扩展。

## 完整示例

```php
<?php
/**
 * CoreClaw API 示例：运行 Worker 并获取结果
 */

// API 配置
const API_BASE_URL = "https://openapi.coreclaw.com";
const API_KEY = "YOUR_API_KEY";
const TIMEOUT = 30;

/**
 * 启动异步 Worker 运行
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
        return ["success" => false, "run_slug" => null, "error" => "cURL 错误: " . $error];
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
 * 获取运行状态
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
 * 轮询直到完成
 * 状态：1=就绪, 2=运行中, 3=成功, 4=失败, 5=中止中
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

        echo "状态: $status (运行中...)\n";
        sleep(5);
    }

    return ["success" => false, "status" => null, "error" => "超时"];
}

/**
 * 获取结果数据
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

// 构建请求参数
$requestParams = [
    "scraper_slug" => "YOUR_SCRAPER_SLUG",
    "version" => "v1.0.0",  // 从 /api/scraper 获取
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
                // 从 /api/scraper 响应构建
            ]
        ]
    ]
];

// 步骤 1：启动 Worker
echo "正在启动爬虫...\n";
$runResult = runScraperAsync($requestParams, API_KEY);

if (!$runResult["success"]) {
    echo "启动失败: " . $runResult["error"] . "\n";
    exit(1);
}

$runSlug = $runResult["run_slug"];
echo "已启动！运行 ID: $runSlug\n";

// 步骤 2：轮询状态
echo "正在轮询状态...\n";
$finalStatus = pollUntilComplete($runSlug, API_KEY);

if (!$finalStatus["success"]) {
    echo "轮询失败: " . $finalStatus["error"] . "\n";
    exit(1);
}

$status = $finalStatus["status"];

if ($status === 3) {  // 成功
    echo "完成！结果数: " . $finalStatus["results"] . "\n";

    // 步骤 3：获取结果
    $results = getResults($runSlug, API_KEY);

    if ($results["success"]) {
        echo "获取到 " . $results["count"] . " 条记录\n";
    }
} elseif ($status === 4) {
    echo "运行失败！\n";
}
```

## 核心函数

| 函数 | 用途 |
|------|------|
| `runScraperAsync()` | 启动异步 Worker 运行 |
| `getRunStatus()` | 获取当前运行状态 |
| `pollUntilComplete()` | 轮询直到终态（成功/失败） |
| `getResults()` | 分页获取结果数据 |

## 状态码

| 代码 | 状态 |
|------|------|
| 1 | 就绪 |
| 2 | 运行中 |
| 3 | 成功 |
| 4 | 失败 |
| 5 | 中止中 |

## 下一步

- [返回集成指南](/zh-cn/api/integration/)
- [Go 示例](/zh-cn/api/examples/go/)