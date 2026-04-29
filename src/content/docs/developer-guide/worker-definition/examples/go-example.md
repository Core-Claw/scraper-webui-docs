---
title: Go Example
description: Build a Worker using Go
sidebar:
  order: 3
---

Learn how to build a Worker using Go.

## GitHub Repository

Go script example repository:
[GoScirptDemo](https://github.com/core-claw/GoScirptDemo)

---

## Project Structure

```
├── main.go              # Main entry file
├── go.mod               # Go module
├── go.sum               # Dependencies checksum
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
├── README.md            # Documentation
└── GoSdk/               # CoreClaw SDK
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

The `GoSdk/` directory contains the three required SDK files. Together they form the script's **toolbox**, providing all essential capabilities required for Worker execution and interaction with the platform backend.

---

## Script Entry File (main.go)

### Example

```go
package main

import (
    "context"
    "crypto/tls"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "strings"
    coresdk "test/GoSdk"
    "time"
)

func run() {
    ctx := context.Background()

    coresdk.Log.Info(ctx, "golang gRPC SDK client started......")

    // 1. Get input parameters
    inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to get input params: %v", err))
        return
    }
    coresdk.Log.Debug(ctx, fmt.Sprintf("Input params: %s", inputJSON))

    // 2. Proxy configuration (read from environment variables)
    proxyDomain := os.Getenv("PROXY_DOMAIN")
    coresdk.Log.Info(ctx, fmt.Sprintf("Proxy domain: %s", proxyDomain))

    var proxyAuth string
    proxyAuth = os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("Proxy auth info: %s", proxyAuth))

    // 3. Construct proxy URL
    var proxyURL string
    if proxyAuth != "" {
        proxyURL = fmt.Sprintf("socks5://%s@%s", proxyAuth, proxyDomain)
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("Proxy URL: %s", proxyURL))

    // 4. Business logic
    coresdk.Log.Info(ctx, "Starting business logic processing")

    // Create custom HTTP client with proxy support
    httpClient := &http.Client{
        Timeout: time.Second * 30,
    }

    if proxyURL != "" {
        proxyParsed, err := url.Parse(proxyURL)
        if err != nil {
            coresdk.Log.Error(ctx, fmt.Sprintf("Failed to parse proxy URL: %v", err))
            return
        }

        httpClient.Transport = &http.Transport{
            Proxy: http.ProxyURL(proxyParsed),
            TLSClientConfig: &tls.Config{
                InsecureSkipVerify: true,
            },
        }

        coresdk.Log.Info(ctx, "Proxy client configured")
    }

    // Send request
    targetURL := "https://ipinfo.io/ip"
    req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to create request: %v", err))
        return
    }

    coresdk.Log.Info(ctx, fmt.Sprintf("Sending request: %s", targetURL))

    resp, err := httpClient.Do(req)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Request failed: %v", err))
        return
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to read response: %v", err))
        return
    }

    ip := strings.TrimSpace(string(body))
    coresdk.Log.Info(ctx, fmt.Sprintf("Current IP: %s", ip))

    coresdk.Log.Info(ctx, "Business logic processing completed")

    // 5. Push result data
    type result struct {
        Title   string `json:"title"`
        Content string `json:"content"`
    }

    resultData := []result{
        {Title: "Sample Title 1", Content: "Sample Content 1"},
        {Title: "Sample Title 2", Content: "Sample Content 2"},
    }

    for _, datum := range resultData {
        jsonBytes, _ := json.Marshal(datum)
        res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
        if err != nil {
            coresdk.Log.Error(ctx, fmt.Sprintf("Failed to push data: %v", err))
            return
        }
        fmt.Printf("PushData Response: %+v\n", res)
    }

    // 6. Set table headers
    headers := []*coresdk.TableHeaderItem{
        {
            Label:  "Title",
            Key:    "title",
            Format: "text",
        },
        {
            Label:  "Content",
            Key:    "content",
            Format: "text",
        },
    }

    res, err := coresdk.Result.SetTableHeader(ctx, headers)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to set table header: %v", err))
        return
    }
    fmt.Printf("SetTableHeader Response: %+v\n", res)

    coresdk.Log.Info(ctx, "Script execution completed")
}

func main() {
    run()
}
```

---

## Go Module (go.mod)

This file declares all Go dependencies required to run the script.

### Example

```go
module test

go 1.24.6

require (
    google.golang.org/grpc v1.78.0
    google.golang.org/protobuf v1.36.11
)
```

### Important Notes

- **google.golang.org/grpc** and **google.golang.org/protobuf** are required (needed by the SDK)
- The module name can be customized
- All third-party libraries must be listed
