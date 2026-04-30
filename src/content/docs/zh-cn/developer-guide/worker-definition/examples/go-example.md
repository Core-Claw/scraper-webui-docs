---
title: Go 示例
description: 使用 Go 构建 Worker
sidebar:
  order: 3
---

学习如何使用 Go 构建 Worker。

## GitHub 仓库

Go 脚本示例仓库：
[GoScirptDemo](https://github.com/Core-Claw/GoScirptDemo)

---

## 必需文件（项目根目录）

```text
├── main.go              # 脚本源码文件
├── go.mod               # Go 模块定义
├── go.sum               # 依赖校验和
├── input_schema.json    # 输入表单配置
├── output_schema.json   # 输出表格配置
└── GoSdk/               # CoreClaw SDK 目录
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

### 文件概览

| 文件 | 说明 |
| ---- | ---- |
| **main.go** | 脚本源码文件（执行入口） |
| **go.mod** | Go 模块定义文件 |
| **go.sum** | 依赖校验和文件 |
| **input_schema.json** | UI 输入表单配置文件 |
| **output_schema.json** | 输出表格结构配置文件 |
| **GoSdk/sdk.go** | 核心 SDK 功能 |
| **GoSdk/sdk.pb.go** | 增强数据处理模块 |
| **GoSdk/sdk_grpc.pb.go** | 网络通信模块 |

`GoSdk/` 目录包含三个必需的 SDK 文件。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

:::important
Go 脚本必须先编译再上传。构建 Linux 可执行文件并包含在 ZIP 包中：

```bash
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=amd64
go build -o main ./main.go
```

建议使用 [UPX](https://upx.github.io/) 压缩可执行文件，显著减小体积。
:::

---

## 核心 SDK 使用说明

CoreClaw SDK（`coresdk`）提供每个 Worker 都需要的三大核心能力：

### 1. 环境参数获取 — 获取脚本启动时的配置信息

当 Worker 启动时，平台会传入一些配置参数（比如要采集的网站地址、搜索关键词等）。使用以下方法获取这些参数：

```go
import coresdk "your_module/GoSdk"

ctx := context.Background()

// 获取所有传入的参数，以 JSON 字符串形式返回
inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("获取输入参数失败: %v", err))
    return
}
```

**使用场景**：通过传入不同的参数来采集不同网站的数据，无需修改代码。

### 2. 运行日志 — 记录脚本执行过程

脚本执行过程中，可以记录不同级别的日志信息。这些日志会显示在控制台界面，方便查看执行状态和问题排查：

```go
ctx := context.Background()

// 调试信息（最详细，用于问题排查）
coresdk.Log.Debug(ctx, "正在连接目标网站...")

// 一般信息（正常流程记录）
coresdk.Log.Info(ctx, "成功获取10条数据")

// 警告信息（需要注意但非错误的情况）
coresdk.Log.Warn(ctx, "网络连接较慢，可能影响采集速度")

// 错误信息（执行出错时使用）
coresdk.Log.Error(ctx, "无法访问目标网站")
```

**日志级别说明**：
- **debug** — 最详细的调试信息，适合开发时使用
- **info** — 正常的流程记录，推荐在关键步骤使用
- **warn** — 警告信息，表示可能有问题但程序还能运行
- **error** — 错误信息，表示出现了需要关注的问题

### 3. 结果返回 — 将采集的数据发送回平台

脚本采集到数据后，需要通过以下两个步骤将数据返回给平台：

#### 第一步：设置表格表头

在推送具体数据之前，先定义数据的表格结构，就像 Excel 中先定义列标题一样：

```go
headers := []*coresdk.TableHeaderItem{
    {Label: "标题", Key: "title", Format: "text"},
    {Label: "链接", Key: "url", Format: "text"},
    {Label: "分类", Key: "category", Format: "text"},
}
res, err := coresdk.Result.SetTableHeader(ctx, headers)
```

**字段说明**：
- **Label** — 表格中显示的列标题（用户可见）
- **Key** — 数据的唯一标识符（代码中使用，需与 PushData 中的 key 一致）
- **Format** — 数据类型：`"text"`、`"integer"`、`"boolean"`、`"array"`、`"object"`

#### 第二步：逐条推送数据

设置好表头后，逐条推送采集到的数据（JSON 字符串格式）：

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
        coresdk.Log.Error(ctx, fmt.Sprintf("推送数据失败: %v", err))
        return
    }
}
```

**重要提醒**：
- 设置表头与推送数据的顺序可以颠倒
- 推送数据时，结构体中的 key 必须与表头中定义的 key 完全一致
- 数据需要**逐条推送**，以 JSON 字符串格式
- 建议在每次推送后记录日志，方便跟踪执行进度

---

## 脚本入口文件（main.go）

### 完整示例

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
    proxyAuth := os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("代理认证信息: %s", proxyAuth))

    // 3. 拼接代理 URL
    var proxyURL string
    if proxyAuth != "" {
        proxyURL = fmt.Sprintf("socks5://%s@proxy-inner.coreclaw.com:6000", proxyAuth)
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("代理地址: %s", proxyURL))

    // 4. 业务逻辑 - 创建带代理的 HTTP 客户端
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
        {Label: "标题", Key: "title", Format: "text"},
        {Label: "内容", Key: "content", Format: "text"},
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

### 工作原理

脚本遵循四个阶段：

1. **接收指令** — 从平台获取输入参数（URL、关键词等）
2. **网络配置** — 通过 `PROXY_AUTH` 环境变量配置代理，访问外部网站
3. **执行任务** — 在目标页面上运行核心采集逻辑
4. **上报结果** — 将采集数据推送回平台并设置表格表头

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

#### 必需依赖

- **google.golang.org/grpc** 和 **google.golang.org/protobuf** 是必需的（SDK 所需）
- 模块名可以自定义

#### 构建要求

- 必须构建为 Linux 可执行文件（`GOOS=linux GOARCH=amd64`），因为平台运行在 Linux 上
- 禁用 CGO（`CGO_ENABLED=0`）以生成静态二进制文件
- 输出二进制文件必须命名为 `main`
- 建议使用 UPX 压缩以减小文件体积

---

## 常见问题

**问：为什么必须构建为 Linux 版本？**
答：CoreClaw 平台运行在 Linux 上，Go 脚本必须编译为 Linux 可执行文件后才能上传。

**问：如何添加新依赖？**
答：在本地运行 `go get <package>`，提交更新后的 `go.mod` 和 `go.sum`，重新构建二进制文件并上传 ZIP 包。

**问：构建失败怎么办？**
答：检查 `go.mod` 和 `go.sum` 中的依赖是否正确，确认使用 `CGO_ENABLED=0 GOOS=linux GOARCH=amd64` 构建。