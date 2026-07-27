---
title: 'V1 to V2 Migration Examples'
description: 'CoreClaw API V1 to V2 request migrations in Python, Node.js, Java, PHP, and Go'
sidebar:
    order: 3
---

These examples show the code changes for the most common flow: start a Worker asynchronously, save `data.run_slug`, and read the first result page. Replace the sample `input` with fields from the target Worker's [input schema](/api/workers/input-schema/).

Set these environment variables before running an example:

```text
CORECLAW_API_KEY=your-api-key
CORECLAW_WORKER_ID=your-worker-id
```

The V1 `scraper_slug` value is not blindly reused. `CORECLAW_WORKER_ID` must contain a verified V2 Worker slug, or an `owner/name` path encoded as `owner~name`.

| Language | Complete V2 example                                                |
| -------- | ------------------------------------------------------------------ |
| Python   | [Authentication, run, polling, and results](/api/examples/python/) |
| Node.js  | [Authentication, run, polling, and results](/api/examples/nodejs/) |
| Java     | [Authentication, run, polling, and results](/api/examples/java/)   |
| PHP      | [Authentication, run, polling, and results](/api/examples/php/)    |
| Go       | [Authentication, run, polling, and results](/api/examples/go/)     |

The compact migration snippets below intentionally focus on changed request construction. Use the linked complete examples for production polling, backoff, terminal-state handling, and diagnostics.

## Python

V1 sent `scraper_slug`, `page_index`, and `page_size` in the request body. V2 moves the Worker identifier to the path and uses `offset` and `limit`:

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
        "offset": 0,
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
    params={"offset": 0, "limit": 20},
    timeout=60,
)
result_response.raise_for_status()
print(result_response.json())
```

In production, poll run detail until `status == "succeeded"` before reading results. See the [complete Python example](/api/examples/python/).

## Node.js

Node.js 18 and later include `fetch`:

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
            offset: 0,
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
resultUrl.search = new URLSearchParams({ offset: '0', limit: '20' })
const resultResponse = await fetch(resultUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
})
if (!resultResponse.ok)
    throw new Error(
        `HTTP ${resultResponse.status}: ${await resultResponse.text()}`
    )
console.log(await resultResponse.json())
```

Poll the run before reading results in production. See the [complete Node.js example](/api/examples/nodejs/).

## Java

This Java 11+ snippet uses only the standard HTTP client. A production client should parse JSON with its normal JSON library instead of using the compact extraction helper shown here.

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
            + "\"is_async\":true,\"offset\":0,\"limit\":20}";

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
            + "/result?offset=0&limit=20";
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

Poll the run and inspect application `code` with a JSON parser in production. See the [complete Java example](/api/examples/java/).

## PHP

The PHP example uses the cURL extension:

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
    "offset" => 0,
    "limit" => 20,
]);
$runId = $run["data"]["run_slug"];

$query = http_build_query(["offset" => 0, "limit" => 20]);
$results = request(
    "GET",
    $baseUrl . "/api/v2/worker-runs/" . rawurlencode($runId) . "/result?" . $query,
    $apiKey,
);
print_r($results);
```

Poll the run before reading results in production. See the [complete PHP example](/api/examples/php/).

## Go

The Go example uses the standard library:

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
        "offset":   0,
        "limit":    20,
    }
    run := request("POST", baseURL+"/api/v2/workers/"+url.PathEscape(workerID)+"/runs", apiKey, runBody)
    var info runData
    if err := json.Unmarshal(run.Data, &info); err != nil {
        panic(err)
    }

    query := url.Values{"offset": {"0"}, "limit": {"20"}}
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

Poll the run before reading results in production. See the [complete Go example](/api/examples/go/).

## Other common replacements

Once the run call is migrated, use the same `{runId}` for these operations:

```text
GET  /api/v2/worker-runs/{runId}               # detail and status
GET  /api/v2/worker-runs/{runId}/log           # logs
GET  /api/v2/worker-runs/{runId}/result        # paginated results
GET  /api/v2/worker-runs/{runId}/result/export # downloadable export
POST /api/v2/worker-runs/{runId}/rerun         # create another run
POST /api/v2/worker-runs/{runId}/abort         # request cancellation
```
