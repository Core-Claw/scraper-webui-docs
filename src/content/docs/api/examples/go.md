---
title: Go Example
description: Complete Go example for CoreClaw API integration
sidebar:
  order: 5
---

Complete Go example showing how to run a Worker and retrieve results.

## Prerequisites

No external dependencies required. Uses Go's built-in `net/http` package.

## Complete Example

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

// API Configuration
const API_BASE_URL = "https://openapi.coreclaw.com"
const API_KEY = "YOUR_API_KEY"
const TIMEOUT = 30

// Response structures
type ApiResponse struct {
    Code    int             `json:"code"`
    Message string          `json:"message"`
    Data    json.RawMessage `json:"data"`
}

type RunData struct {
    RunSlug string `json:"run_slug"`
}

type StatusData struct {
    Status   int `json:"status"`
    Results  int `json:"results"`
    Duration int `json:"duration"`
}

type ResultData struct {
    Count int                      `json:"count"`
    List  []map[string]interface{} `json:"list"`
}

func main() {
    // Build request params
    requestParams := map[string]interface{}{
        "scraper_slug": "YOUR_SCRAPER_SLUG",
        "version":      "<version>", // Get from /api/scraper
        "is_async":     true,
        "input": map[string]interface{}{
            "parameters": map[string]interface{}{
                "system": map[string]interface{}{
                    "cpus":                       0.125,
                    "memory":                     512,
                    "execute_limit_time_seconds": 1800,
                    "max_total_charge":           0,
                    "max_total_traffic":          0,
                },
                "custom": map[string]interface{}{
                    // Build from /api/scraper response
                },
            },
        },
    }

    // Step 1: Start Worker
    fmt.Println("Starting scraper...")
    runSlug, err := runScraperAsync(requestParams)
    if err != nil {
        fmt.Printf("Failed to start: %v\n", err)
        return
    }

    fmt.Printf("Started! Run ID: %s\n", runSlug)

    // Step 2: Poll status
    fmt.Println("Polling status...")
    status, statusData, err := pollUntilComplete(runSlug)
    if err != nil {
        fmt.Printf("Polling failed: %v\n", err)
        return
    }

    // Status: 1=Ready, 2=Running, 3=Succeeded, 4=Failed, 5=Aborting
    if status == 3 {
        fmt.Printf("Completed! Results: %d, Duration: %ds\n", statusData.Results, statusData.Duration)

        // Step 3: Get results
        results, err := getResults(runSlug)
        if err != nil {
            fmt.Printf("Failed to get results: %v\n", err)
            return
        }

        fmt.Printf("Got %d records\n", results.Count)
    } else if status == 4 {
        fmt.Println("Run failed!")
    }
}

func runScraperAsync(params map[string]interface{}) (string, error) {
    body, _ := json.Marshal(params)

    client := &http.Client{Timeout: time.Duration(TIMEOUT) * time.Second}
    req, _ := http.NewRequest("POST", API_BASE_URL+"/api/v1/scraper/run", bytes.NewBuffer(body))
    req.Header.Set("api-key", API_KEY)
    req.Header.Set("Content-Type", "application/json")

    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    respBody, _ := io.ReadAll(resp.Body)

    if resp.StatusCode != 200 {
        return "", fmt.Errorf("HTTP %d", resp.StatusCode)
    }

    var result ApiResponse
    json.Unmarshal(respBody, &result)

    if result.Code != 0 {
        return "", fmt.Errorf("%s (code: %d)", result.Message, result.Code)
    }

    var runData RunData
    json.Unmarshal(result.Data, &runData)

    return runData.RunSlug, nil
}

func getRunStatus(runSlug string) (int, *StatusData, error) {
    body, _ := json.Marshal(map[string]string{"run_slug": runSlug})

    client := &http.Client{Timeout: time.Duration(TIMEOUT) * time.Second}
    req, _ := http.NewRequest("POST", API_BASE_URL+"/api/v1/run/detail", bytes.NewBuffer(body))
    req.Header.Set("api-key", API_KEY)
    req.Header.Set("Content-Type", "application/json")

    resp, err := client.Do(req)
    if err != nil {
        return -1, nil, err
    }
    defer resp.Body.Close()

    respBody, _ := io.ReadAll(resp.Body)

    var result ApiResponse
    json.Unmarshal(respBody, &result)

    if result.Code != 0 {
        return -1, nil, fmt.Errorf("%s", result.Message)
    }

    var statusData StatusData
    json.Unmarshal(result.Data, &statusData)

    return statusData.Status, &statusData, nil
}

func pollUntilComplete(runSlug string) (int, *StatusData, error) {
    terminalStates := []int{3, 4, 5}
    maxWait := 300 * time.Second
    startTime := time.Now()

    for time.Since(startTime) < maxWait {
        status, statusData, err := getRunStatus(runSlug)
        if err != nil {
            return -1, nil, err
        }

        for _, terminal := range terminalStates {
            if status == terminal {
                return status, statusData, nil
            }
        }

        fmt.Printf("Status: %d (Running...)\n", status)
        time.Sleep(5 * time.Second)
    }

    return -1, nil, fmt.Errorf("timeout")
}

func getResults(runSlug string) (*ResultData, error) {
    body, _ := json.Marshal(map[string]interface{}{
        "run_slug":   runSlug,
        "page_index": 1,
        "page_size":  20,
    })

    client := &http.Client{Timeout: time.Duration(TIMEOUT) * time.Second}
    req, _ := http.NewRequest("POST", API_BASE_URL+"/api/v1/run/result/list", bytes.NewBuffer(body))
    req.Header.Set("api-key", API_KEY)
    req.Header.Set("Content-Type", "application/json")

    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    respBody, _ := io.ReadAll(resp.Body)

    var result ApiResponse
    json.Unmarshal(respBody, &result)

    if result.Code != 0 {
        return nil, fmt.Errorf("%s", result.Message)
    }

    var resultData ResultData
    json.Unmarshal(result.Data, &resultData)

    return &resultData, nil
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