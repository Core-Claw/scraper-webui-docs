---
title: 'V1 到 V2 迁移代码示例'
description: '使用 Python、Node.js、Java、PHP 和 Go 将 CoreClaw API V1 请求迁移到 V2'
sidebar:
    order: 3
---

以下示例演示最常见流程的代码变化：异步启动 Worker、保存 `data.run_slug`、读取第一页结果。请把示例 `input` 替换为目标 Worker 的[输入 schema](/zh-cn/api/workers/input-schema/)所定义的字段。

运行示例前设置以下环境变量：

```text
CORECLAW_API_KEY=your-api-key
CORECLAW_WORKER_ID=your-worker-id
```

不要直接复用 V1 的 `scraper_slug`。`CORECLAW_WORKER_ID` 必须是已验证的 V2 Worker slug，或编码为 `owner~name` 的 `owner/name` 路径。

| 语言    | 完整 V2 示例                                          |
| ------- | ----------------------------------------------------- |
| Python  | [认证、运行、轮询与结果](/zh-cn/api/examples/python/) |
| Node.js | [认证、运行、轮询与结果](/zh-cn/api/examples/nodejs/) |
| Java    | [认证、运行、轮询与结果](/zh-cn/api/examples/java/)   |
| PHP     | [认证、运行、轮询与结果](/zh-cn/api/examples/php/)    |
| Go      | [认证、运行、轮询与结果](/zh-cn/api/examples/go/)     |

下面的精简迁移片段只突出请求构造的变化。生产环境中的轮询、退避、终态处理和诊断请使用上表链接的完整示例。

## Python

V1 把 `scraper_slug`、`page_index`、`page_size` 放在请求体中。V2 把 Worker 标识移入路径，并使用 `offset` 和 `limit`：

```python
import os

import requests

base_url = "https://openapi.coreclaw.com"
api_key = os.environ["CORECLAW_API_KEY"]
worker_id = os.environ["CORECLAW_WORKER_ID"]
headers = {"Authorization": f"Bearer {api_key}"}

run_response = requests.post(
    f"{base_url}/api/v2/workers/{worker_id}/runs",
    headers=headers,
    json={
        "input": {
            "parameters": {
                "custom": {"keywords": ["coffee"]},
            }
        },
        "is_async": True,
        "offset": 1,
        "limit": 20,
    },
    timeout=60,
)
run_response.raise_for_status()
run_payload = run_response.json()
if run_payload.get("code") != 0:
    raise RuntimeError(run_payload)

run_id = run_payload["data"]["run_slug"]
result_response = requests.get(
    f"{base_url}/api/v2/worker-runs/{run_id}/result",
    headers=headers,
    params={"offset": 1, "limit": 20},
    timeout=60,
)
result_response.raise_for_status()
print(result_response.json())
```

生产环境应等到运行状态为 `succeeded` 后再读取结果，完整实现见 [Python 示例](/zh-cn/api/examples/python/)。

## Node.js

Node.js 18 及以上版本内置 `fetch`：

```js
const baseUrl = 'https://openapi.coreclaw.com'
const apiKey = process.env.CORECLAW_API_KEY
const workerId = process.env.CORECLAW_WORKER_ID

if (!apiKey || !workerId)
    throw new Error('Set CORECLAW_API_KEY and CORECLAW_WORKER_ID.')

const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
}

const runResponse = await fetch(
    `${baseUrl}/api/v2/workers/${encodeURIComponent(workerId)}/runs`,
    {
        method: 'POST',
        headers,
        body: JSON.stringify({
            input: { parameters: { custom: { keywords: ['coffee'] } } },
            is_async: true,
            offset: 1,
            limit: 20,
        }),
    }
)
if (!runResponse.ok)
    throw new Error(`HTTP ${runResponse.status}: ${await runResponse.text()}`)

const runPayload = await runResponse.json()
if (runPayload.code !== 0) throw new Error(JSON.stringify(runPayload))
const runId = runPayload.data.run_slug

const resultUrl = new URL(
    `${baseUrl}/api/v2/worker-runs/${encodeURIComponent(runId)}/result`
)
resultUrl.search = new URLSearchParams({ offset: '1', limit: '20' })
const resultResponse = await fetch(resultUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
})
if (!resultResponse.ok)
    throw new Error(
        `HTTP ${resultResponse.status}: ${await resultResponse.text()}`
    )
console.log(await resultResponse.json())
```

生产环境应先轮询运行状态，完整实现见 [Node.js 示例](/zh-cn/api/examples/nodejs/)。

## Java

下面的 Java 11+ 片段只使用标准 HTTP 客户端。生产客户端应使用项目中的 JSON 库解析响应，不要沿用这里用于压缩篇幅的提取函数。

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CoreClawV2Migration {
    private static final String BASE_URL = "https://openapi.coreclaw.com";

    public static void main(String[] args) throws Exception {
        String apiKey = requireEnv("CORECLAW_API_KEY");
        String workerId = requireEnv("CORECLAW_WORKER_ID");
        HttpClient client = HttpClient.newHttpClient();

        String body = "{\"input\":{\"parameters\":{\"custom\":{"
            + "\"keywords\":[\"coffee\"]}}},"
            + "\"is_async\":true,\"offset\":1,\"limit\":20}";

        HttpRequest runRequest = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/v2/workers/" + encode(workerId) + "/runs"))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
        HttpResponse<String> runResponse = client.send(runRequest, HttpResponse.BodyHandlers.ofString());
        requireSuccess(runResponse);
        String runId = extract(runResponse.body(), "\\\"run_slug\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");

        String resultUrl = BASE_URL + "/api/v2/worker-runs/" + encode(runId)
            + "/result?offset=1&limit=20";
        HttpRequest resultRequest = HttpRequest.newBuilder()
            .uri(URI.create(resultUrl))
            .header("Authorization", "Bearer " + apiKey)
            .GET()
            .build();
        HttpResponse<String> resultResponse = client.send(resultRequest, HttpResponse.BodyHandlers.ofString());
        requireSuccess(resultResponse);
        System.out.println(resultResponse.body());
    }

    static String requireEnv(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Set " + name + ".");
        return value;
    }

    static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    static String extract(String value, String regex) {
        Matcher matcher = Pattern.compile(regex).matcher(value);
        if (!matcher.find()) throw new IllegalStateException("run_slug missing: " + value);
        return matcher.group(1);
    }

    static void requireSuccess(HttpResponse<String> response) {
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("HTTP " + response.statusCode() + ": " + response.body());
        }
    }
}
```

生产环境应先轮询运行，并通过 JSON 解析器检查业务 `code`，完整实现见 [Java 示例](/zh-cn/api/examples/java/)。

## PHP

PHP 示例使用 cURL 扩展：

```php
<?php
$baseUrl = "https://openapi.coreclaw.com";
$apiKey = getenv("CORECLAW_API_KEY");
$workerId = getenv("CORECLAW_WORKER_ID");
if (!$apiKey || !$workerId) {
    throw new RuntimeException("Set CORECLAW_API_KEY and CORECLAW_WORKER_ID.");
}

function request(string $method, string $url, string $apiKey, ?array $body = null): array
{
    $headers = ["Authorization: Bearer " . $apiKey];
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
    ];
    if ($body !== null) {
        $headers[] = "Content-Type: application/json";
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    }
    $options[CURLOPT_HTTPHEADER] = $headers;

    $curl = curl_init($url);
    curl_setopt_array($curl, $options);
    $raw = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);
    if ($raw === false || $status < 200 || $status >= 300) {
        throw new RuntimeException("HTTP " . $status . ": " . $raw);
    }
    $payload = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
    if (($payload["code"] ?? null) !== 0) throw new RuntimeException($raw);
    return $payload;
}

$run = request("POST", $baseUrl . "/api/v2/workers/" . rawurlencode($workerId) . "/runs", $apiKey, [
    "input" => ["parameters" => ["custom" => ["keywords" => ["coffee"]]]],
    "is_async" => true,
    "offset" => 1,
    "limit" => 20,
]);
$runId = $run["data"]["run_slug"];

$query = http_build_query(["offset" => 1, "limit" => 20]);
$results = request(
    "GET",
    $baseUrl . "/api/v2/worker-runs/" . rawurlencode($runId) . "/result?" . $query,
    $apiKey,
);
print_r($results);
```

生产环境应先轮询运行状态，完整实现见 [PHP 示例](/zh-cn/api/examples/php/)。

## Go

Go 示例只使用标准库：

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
)

type envelope struct {
    Code      int             `json:"code"`
    Message   string          `json:"message"`
    RequestID string          `json:"request_id"`
    Data      json.RawMessage `json:"data"`
}

type runData struct {
    RunSlug string `json:"run_slug"`
}

func main() {
    apiKey := requireEnv("CORECLAW_API_KEY")
    workerID := requireEnv("CORECLAW_WORKER_ID")
    baseURL := "https://openapi.coreclaw.com"

    runBody := map[string]any{
        "input": map[string]any{
            "parameters": map[string]any{
                "custom": map[string]any{"keywords": []string{"coffee"}},
            },
        },
        "is_async": true,
        "offset":   1,
        "limit":    20,
    }
    run := request("POST", baseURL+"/api/v2/workers/"+url.PathEscape(workerID)+"/runs", apiKey, runBody)
    var info runData
    if err := json.Unmarshal(run.Data, &info); err != nil {
        panic(err)
    }

    query := url.Values{"offset": {"1"}, "limit": {"20"}}
    resultURL := baseURL + "/api/v2/worker-runs/" + url.PathEscape(info.RunSlug) + "/result?" + query.Encode()
    results := request("GET", resultURL, apiKey, nil)
    fmt.Println(string(results.Data))
}

func request(method, endpoint, apiKey string, body any) envelope {
    var reader io.Reader
    if body != nil {
        raw, err := json.Marshal(body)
        if err != nil {
            panic(err)
        }
        reader = bytes.NewReader(raw)
    }
    req, err := http.NewRequest(method, endpoint, reader)
    if err != nil {
        panic(err)
    }
    req.Header.Set("Authorization", "Bearer "+apiKey)
    if body != nil {
        req.Header.Set("Content-Type", "application/json")
    }

    response, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer response.Body.Close()
    raw, err := io.ReadAll(response.Body)
    if err != nil {
        panic(err)
    }
    if response.StatusCode < 200 || response.StatusCode >= 300 {
        panic(fmt.Sprintf("HTTP %d: %s", response.StatusCode, raw))
    }

    var payload envelope
    if err := json.Unmarshal(raw, &payload); err != nil {
        panic(err)
    }
    if payload.Code != 0 {
        panic(string(raw))
    }
    return payload
}

func requireEnv(name string) string {
    value := os.Getenv(name)
    if value == "" {
        panic("Set " + name + ".")
    }
    return value
}
```

生产环境应先轮询运行状态，完整实现见 [Go 示例](/zh-cn/api/examples/go/)。

## 其他常用替换

运行接口迁移完成后，后续操作统一复用同一个 `{runId}`：

```text
GET  /api/v2/worker-runs/{runId}               # 详情和状态
GET  /api/v2/worker-runs/{runId}/log           # 日志
GET  /api/v2/worker-runs/{runId}/result        # 分页结果
GET  /api/v2/worker-runs/{runId}/result/export # 下载导出文件
POST /api/v2/worker-runs/{runId}/rerun         # 创建一次重跑
POST /api/v2/worker-runs/{runId}/abort         # 请求中止
```
