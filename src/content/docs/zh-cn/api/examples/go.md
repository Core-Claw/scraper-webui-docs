---
title: "Go 示例"
description: "CoreClaw API v2 集成代码示例"
sidebar:
  order: 5
---

下面示例覆盖认证检查、启动 Worker、用返回的 `run_slug` 查询结果三步。

示例中的 `YOUR_WORKER_ID` 是占位符。请替换为要运行的 Worker slug，或把 `owner/name` 路径写成 `owner~name`。`input` 必须按该 Worker 的输入 schema 构造；不同 Worker 的字段不一定相同。

默认使用 `is_async: true` 异步提交并轮询结果。如需等待执行完成，把 `is_async` 改为 `false`，并用 `offset` / `limit` 控制同步返回的数据窗口。

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
    "time"
)

const apiBaseURL = "https://openapi.coreclaw.com"

type envelope struct {
    Code    int             `json:"code"`
    Message string          `json:"message"`
    Data    json.RawMessage `json:"data"`
}

type runData struct {
    RunSlug string `json:"run_slug"`
}

type runDetail struct {
    Status string `json:"status"`
    ErrMsg string `json:"err_msg"`
}

func main() {
    apiKey := os.Getenv("CORECLAW_API_KEY")
    if apiKey == "" {
        panic("Set CORECLAW_API_KEY first.")
    }
    workerID := os.Getenv("CORECLAW_WORKER_ID")
    if workerID == "" {
        workerID = "YOUR_WORKER_ID"
    }

    account := coreclawRequest(apiKey, "GET", "/api/v2/users/account", nil, nil)
    fmt.Println("Account:", string(account.Data))

    runPayload := map[string]any{
        // Replace input.parameters.custom with fields from the Worker's input schema.
        "input": map[string]any{
            "parameters": map[string]any{
                "custom": map[string]any{
                    "keywords":      []string{"coffee"},
                    "base_location": "New York,USA",
                    "max_results":   1,
                },
            },
        },
        "is_async": true,
        "offset": 0,
        "limit": 20,
    }
    run := coreclawRequest(apiKey, "POST", "/api/v2/workers/"+url.PathEscape(workerID)+"/runs", nil, runPayload)

    var runInfo runData
    if err := json.Unmarshal(run.Data, &runInfo); err != nil {
        panic(err)
    }
    fmt.Println("Run ID:", runInfo.RunSlug)

    completedRun := waitForRun(apiKey, runInfo.RunSlug, 300*time.Second)
    results := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runInfo.RunSlug)+"/result", url.Values{
        "offset": {"0"},
        "limit":  {"20"},
    }, nil)
    fmt.Println("Status:", completedRun.Status, "Results:", string(results.Data))
}

func waitForRun(apiKey, runID string, timeout time.Duration) runDetail {
    deadline := time.Now().Add(timeout)
    delay := 2 * time.Second
    for time.Now().Before(deadline) {
        detail := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runID), nil, nil)
        var run runDetail
        if err := json.Unmarshal(detail.Data, &run); err != nil {
            panic(err)
        }
        if run.Status == "succeeded" {
            return run
        }
        if run.Status == "failed" || run.Status == "aborting" {
            logs := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runID)+"/log", nil, nil)
            panic(fmt.Sprintf("run status=%s err_msg=%s request_id=%s logs=%s", run.Status, run.ErrMsg, detail.Message, logs.Data))
        }
        if run.Status != "ready" && run.Status != "running" {
            panic("Unexpected run status: " + run.Status)
        }
        time.Sleep(delay)
        if delay < 15*time.Second {
            delay *= 2
        }
    }
    panic("Timed out waiting for run " + runID)
}

func coreclawRequest(apiKey, method, path string, query url.Values, body any) envelope {
    endpoint := apiBaseURL + path
    if len(query) > 0 {
        endpoint += "?" + query.Encode()
    }

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

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    raw, err := io.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }
    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        panic(fmt.Sprintf("HTTP %d: %s", resp.StatusCode, raw))
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
```
