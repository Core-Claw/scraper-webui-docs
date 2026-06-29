---
title: "Go Example"
description: "CoreClaw API v2 integration code example"
sidebar:
  order: 5
---

The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.

`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker's input schema; fields differ by Worker.

The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.

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

const apiBaseURL = "https://openapi.coreclaw.com"

type envelope struct {
    Code    int             `json:"code"`
    Message string          `json:"message"`
    Data    json.RawMessage `json:"data"`
}

type runData struct {
    RunSlug string `json:"run_slug"`
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
        // Replace this object with fields from the Worker's input schema.
        "input": map[string]any{"keyword": "coffee", "limit": 10},
        "is_async": true,
        "version": "latest",
        "offset": 0,
        "limit": 20,
    }
    run := coreclawRequest(apiKey, "POST", "/api/v2/workers/"+url.PathEscape(workerID)+"/runs", nil, runPayload)

    var runInfo runData
    if err := json.Unmarshal(run.Data, &runInfo); err != nil {
        panic(err)
    }
    fmt.Println("Run ID:", runInfo.RunSlug)

    results := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runInfo.RunSlug)+"/result", url.Values{
        "offset": {"0"},
        "limit":  {"20"},
    }, nil)
    fmt.Println("Results:", string(results.Data))
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
