---
title: Go 示例
description: 使用 Go 构建 Worker
sidebar:
  order: 3
---

学习如何使用 Go 构建 Worker。

## GitHub 仓库

Go 脚本示例仓库：
[GoScirptDemo](https://github.com/core-claw/GoScirptDemo)

---

## 项目结构

```
├── main.go              # 主入口文件
├── go.mod               # Go 模块文件
├── go.sum               # 依赖校验
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
├── README.md            # 文档
└── GoSdk/               # CoreClaw SDK
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

`GoSdk/` 目录包含三个必需的 SDK 文件。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

---

## 脚本入口文件（main.go）

### 示例

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

    // 1. 获取输入参数
    inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("获取输入参数失败: %v", err))
        return
    }
    coresdk.Log.Debug(ctx, fmt.Sprintf("输入参数: %s", inputJSON))

    // 2. 代理配置（从环境变量读取）
    proxyDomain := os.Getenv("PROXY_DOMAIN")
    coresdk.Log.Info(ctx, fmt.Sprintf("代理域名: %s", proxyDomain))

    var proxyAuth string
    proxyAuth = os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("代理认证信息: %s", proxyAuth))

    // 3. 拼接代理 URL
    var proxyURL string
    if proxyAuth != "" {
        proxyURL = fmt.Sprintf("socks5://%s@%s", proxyAuth, proxyDomain)
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("代理地址: %s", proxyURL))

    // 4. 业务逻辑处理
    coresdk.Log.Info(ctx, "开始处理业务逻辑")

    // 创建自定义 HTTP 客户端，支持代理
    httpClient := &http.Client{
        Timeout: time.Second * 30,
    }

    if proxyURL != "" {
        proxyParsed, err := url.Parse(proxyURL)
        if err != nil {
            coresdk.Log.Error(ctx, fmt.Sprintf("解析代理URL失败: %v", err))
            return
        }

        httpClient.Transport = &http.Transport{
            Proxy: http.ProxyURL(proxyParsed),
            TLSClientConfig: &tls.Config{
                InsecureSkipVerify: true,
            },
        }

        coresdk.Log.Info(ctx, "已配置代理客户端")
    }

    // 发送请求
    targetURL := "https://ipinfo.io/ip"
    req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("创建请求失败: %v", err))
        return
    }

    coresdk.Log.Info(ctx, fmt.Sprintf("开始请求: %s", targetURL))

    resp, err := httpClient.Do(req)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("请求失败: %v", err))
        return
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("读取响应失败: %v", err))
        return
    }

    ip := strings.TrimSpace(string(body))
    coresdk.Log.Info(ctx, fmt.Sprintf("当前IP地址: %s", ip))

    coresdk.Log.Info(ctx, "业务逻辑处理完成")

    // 5. 推送结果数据
    type result struct {
        Title   string `json:"title"`
        Content string `json:"content"`
    }

    resultData := []result{
        {Title: "示例标题1", Content: "示例内容1"},
        {Title: "示例标题2", Content: "示例内容2"},
    }

    for _, datum := range resultData {
        jsonBytes, _ := json.Marshal(datum)
        res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
        if err != nil {
            coresdk.Log.Error(ctx, fmt.Sprintf("推送数据失败: %v", err))
            return
        }
        fmt.Printf("PushData Response: %+v\n", res)
    }

    // 6. 设置表格表头
    headers := []*coresdk.TableHeaderItem{
        {
            Label:  "标题",
            Key:    "title",
            Format: "text",
        },
        {
            Label:  "内容",
            Key:    "content",
            Format: "text",
        },
    }

    res, err := coresdk.Result.SetTableHeader(ctx, headers)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("设置表头失败: %v", err))
        return
    }
    fmt.Printf("SetTableHeader Response: %+v\n", res)

    coresdk.Log.Info(ctx, "脚本执行完成")
}

func main() {
    run()
}
```

---

## Go 模块（go.mod）

此文件声明了运行脚本所需的所有 Go 依赖。

### 示例

```go
module test

go 1.24.6

require (
    google.golang.org/grpc v1.78.0
    google.golang.org/protobuf v1.36.11
)
```

### 注意事项

- **google.golang.org/grpc** 和 **google.golang.org/protobuf** 必须包含（SDK 所需）
- 模块名可以自定义
- 所有第三方库必须列出
