---
title: Go Example
description: Build a Worker using Go
sidebar:
  order: 3
---

Learn how to build a Worker using Go.

## GitHub Repository

Go Script Demo Repository:
[GoScirptDemo](https://github.com/Core-Claw/GoScirptDemo)

---

## Required Files (Project Root Directory)

```text
├── main.go              # Script source file
├── go.mod               # Go module definition
├── go.sum               # Dependencies checksum
├── input_schema.json    # Input form configuration
├── output_schema.json   # Output table configuration
└── GoSdk/               # CoreClaw SDK directory
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

### File Overview

| File | Description |
| ---- | ----------- |
| **main.go** | Script source file (execution entry) |
| **go.mod** | Go module definition file |
| **go.sum** | Dependencies checksum file |
| **input_schema.json** | UI input form configuration file |
| **output_schema.json** | Output table structure configuration file |
| **GoSdk/sdk.go** | Core SDK functionality |
| **GoSdk/sdk.pb.go** | Enhanced data processing module |
| **GoSdk/sdk_grpc.pb.go** | Network communication module |

The `GoSdk/` directory contains the three required SDK files. Together they form the script's **toolbox**, providing all essential capabilities for Worker execution and interaction with the platform backend.

:::important
Go scripts must be compiled before uploading. Build a Linux executable and include it in the ZIP package:

```bash
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=amd64
go build -o main ./main.go
```

It is recommended to use [UPX](https://upx.github.io/) to compress the executable and significantly reduce file size.
:::

---

## Core SDK Usage

The CoreClaw SDK (`coresdk`) provides three core capabilities that every Worker needs:

### 1. Parameter Retrieval — Get Input Configuration

When a Worker starts, the platform passes input parameters (such as URLs, keywords, etc.). Use the following method to retrieve them:

```go
import coresdk "your_module/GoSdk"

ctx := context.Background()

// Get all input parameters as a JSON string
inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("Failed to get input params: %v", err))
    return
}
```

**Use case**: Pass different parameters for different tasks without modifying code.

### 2. Logging — Record Execution Progress

Record different levels of log messages during execution. These logs appear in the Console, making it easy to monitor status and debug issues:

```go
ctx := context.Background()

// Debug info (most detailed, for troubleshooting)
coresdk.Log.Debug(ctx, "Connecting to target website...")

// General info (normal process recording)
coresdk.Log.Info(ctx, "Successfully retrieved 10 data items")

// Warning (notable but non-error situations)
coresdk.Log.Warn(ctx, "Slow network connection, may affect speed")

// Error (execution failures)
coresdk.Log.Error(ctx, "Cannot access target website")
```

**Log levels**:
- **debug** — Most detailed, ideal for development
- **info** — Normal process recording, recommended for key steps
- **warn** — Warning, indicates potential issues
- **error** — Error, requires attention

### 3. Result Output — Push Data Back to Platform

After collecting data, push it back to the platform in two steps:

#### Step 1: Set Table Headers

Define the table structure before pushing data, similar to defining column headers in a spreadsheet:

```go
headers := []*coresdk.TableHeaderItem{
    {Label: "Title", Key: "title", Format: "text"},
    {Label: "URL", Key: "url", Format: "text"},
    {Label: "Category", Key: "category", Format: "text"},
}
res, err := coresdk.Result.SetTableHeader(ctx, headers)
```

**Field descriptions**:
- **Label** — Column title displayed to users
- **Key** — Unique identifier used in code (match with PushData keys)
- **Format** — Data type: `"text"`, `"integer"`, `"boolean"`, `"array"`, `"object"`

#### Step 2: Push Data Row by Row

Push each collected data item individually as a JSON string:

```go
type result struct {
    Title   string `json:"title"`
    URL     string `json:"url"`
    Category string `json:"category"`
}

for _, item := range collectedData {
    jsonBytes, _ := json.Marshal(item)
    res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to push data: %v", err))
        return
    }
}
```

**Important**:
- Setting headers and pushing data can be done in any order
- Keys in PushData must match keys in table headers exactly
- Data must be pushed **one row at a time** as a JSON string
- Add logging after each push to track progress

---

## Script Entry File (main.go)

### Complete Example

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
    proxyAuth := os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("Proxy auth: %s", proxyAuth))

    // 3. Construct proxy URL
    var proxyURL string
    if proxyAuth != "" {
        proxyURL = fmt.Sprintf("socks5://%s@proxy-inner.coreclaw.com:6000", proxyAuth)
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("Proxy URL: %s", proxyURL))

    // 4. Business logic - create HTTP client with proxy
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
        {Label: "Title", Key: "title", Format: "text"},
        {Label: "Content", Key: "content", Format: "text"},
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

### How It Works

The script follows four stages:

1. **Receive instructions** — Get input parameters (URLs, keywords, etc.) from the platform
2. **Network setup** — Configure proxy via `PROXY_AUTH` environment variable for accessing external websites
3. **Execute task** — Run the core scraping logic on target pages
4. **Report results** — Push collected data back to the platform and set table headers

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

#### Required Dependencies

- **google.golang.org/grpc** and **google.golang.org/protobuf** are required (needed by the SDK)
- The module name can be customized to match your project

#### Build Requirements

- Build for Linux (`GOOS=linux GOARCH=amd64`) since the platform runs on Linux
- Disable CGO (`CGO_ENABLED=0`) for a static binary
- The output binary must be named `main`
- Use UPX compression to reduce file size

---

## FAQ

**Q: Why must I build for Linux?**
A: The CoreClaw platform runs on Linux. Your Go script must be compiled as a Linux executable before uploading.

**Q: How do I add new dependencies?**
A: Run `go get <package>` locally, then commit the updated `go.mod` and `go.sum`. Rebuild the binary and re-upload the ZIP package.

**Q: What if the build fails?**
A: Check that all dependencies are correctly listed in `go.mod` and `go.sum`. Verify that you are building with `CGO_ENABLED=0 GOOS=linux GOARCH=amd64`.