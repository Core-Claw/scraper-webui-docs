---
title: Go 示例
description: CoreClaw API 集成的完整 Go 示例
sidebar:
  order: 5
---

完整的 Go 示例，展示如何运行 Worker 并获取结果。

## 环境准备

无需外部依赖。使用 Go 内置的 `net/http` 包。

## 完整示例

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

// API 配置
const API_BASE_URL = "https://openapi.coreclaw.com"
const API_KEY = "YOUR_API_KEY"
const TIMEOUT = 30

// 响应结构
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
    // 构建请求参数
    requestParams := map[string]interface{}{
        "scraper_slug": "YOUR_SCRAPER_SLUG",
        "version":      "v1.0.0", // 从 /api/scraper 获取
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
                    // 从 /api/scraper 响应构建
                },
            },
        },
    }

    // 步骤 1：启动 Worker
    fmt.Println("正在启动爬虫...")
    runSlug, err := runScraperAsync(requestParams)
    if err != nil {
        fmt.Printf("启动失败: %v\n", err)
        return
    }

    fmt.Printf("已启动！运行 ID: %s\n", runSlug)

    // 步骤 2：轮询状态
    fmt.Println("正在轮询状态...")
    status, statusData, err := pollUntilComplete(runSlug)
    if err != nil {
        fmt.Printf("轮询失败: %v\n", err)
        return
    }

    // 状态：1=就绪, 2=运行中, 3=成功, 4=失败, 5=中止中
    if status == 3 {
        fmt.Printf("完成！结果数: %d，耗时: %d秒\n", statusData.Results, statusData.Duration)

        // 步骤 3：获取结果
        results, err := getResults(runSlug)
        if err != nil {
            fmt.Printf("获取结果失败: %v\n", err)
            return
        }

        fmt.Printf("获取到 %d 条记录\n", results.Count)
    } else if status == 4 {
        fmt.Println("运行失败！")
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

        fmt.Printf("状态: %d (运行中...)\n", status)
        time.Sleep(5 * time.Second)
    }

    return -1, nil, fmt.Errorf("超时")
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