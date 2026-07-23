---
title: Go 示例
description: 使用 Go 构建 Worker
sidebar:
  order: 3
---

学习如何使用 Go 构建 Worker。

## GitHub 仓库

Go 脚本示例仓库：
[Go-Worker-Demo](https://github.com/Core-Claw/Go-Worker-Demo)

---

## 必需文件（源码项目根目录）

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

## 必需文件（上传 ZIP 根目录）

```text
├── main                 # 编译后的 Linux amd64 可执行文件
├── input_schema.json    # 输入表单配置
└── output_schema.json   # 输出表格配置
```

如果 Worker 运行时需要其他资源文件，也可以一起放入上传 ZIP；但 `main` 必须位于 ZIP 根目录，并且在 Linux 上具有可执行权限。

### 文件概览

| 文件 | 说明 |
| ---- | ---- |
| **main.go** | 脚本源码入口文件 |
| **go.mod** | Go 模块定义文件 |
| **go.sum** | 依赖校验和文件 |
| **input_schema.json** | UI 输入表单配置文件 |
| **output_schema.json** | 输出表格结构配置文件 |
| **GoSdk/sdk.go** | 核心 SDK 功能 |
| **GoSdk/sdk.pb.go** | 增强数据处理模块 |
| **GoSdk/sdk_grpc.pb.go** | 网络通信模块 |

`GoSdk/` 目录包含三个必需的 SDK 文件。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

## 源码、上传包与运行时结构

Go Worker 需要区分三层结构：

| 层级 | 必需内容 |
| ---- | -------- |
| 源码项目 | `main.go`、`go.mod`、`go.sum`、`GoSdk/`、`input_schema.json`、`output_schema.json` |
| 上传 ZIP | ZIP 根目录下名为 `main` 的 Linux amd64 可执行文件 |
| 平台运行时 | 编译后的 `main` 进程，以及打包时明确保留的运行时文件 |

源码入口是 `main.go`。上传和运行入口是编译后的可执行文件 `main`。平台启动 Worker 后，不要假设 `main.go`、`go.mod`、`go.sum` 或 `GoSdk/` 等源码文件仍存在于当前工作目录。

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

:::caution[Windows 打包注意事项]
部分普通 Windows 压缩工具可能会丢失 Go `main` 二进制文件的 Linux executable bit。如果该权限位丢失，Worker 可能在用户代码启动前失败，有时不会产生 Worker 日志。Go ZIP 上传建议在 Linux 或 WSL 中执行 `chmod +x main` 后再创建最终压缩包。
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
- 必须先设置表头，再推送数据
- 推送数据时，结构体中的 key 必须与表头中定义的 key 完全一致
- 数据需要**逐条推送**，以 JSON 字符串格式
- 建议在每次推送后记录日志，方便跟踪执行进度

#### 第三步：更新或插入数据（Upsert）

使用 `UpsertData` 根据唯一键更新现有记录或插入新记录。这在需要重新采集并更新已有数据时非常有用：

```go
data := map[string]any{
    "id":          "test-1",
    "title":       "更新后的标题",
    "description": "更新后的描述",
}
res, err := coresdk.Result.UpsertData(ctx, data, "id")
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("更新或插入数据失败: %v", err))
    return
}
```

**工作原理**：
- 如果存在相同唯一键的记录，则更新该记录
- 如果找不到匹配记录，则插入新记录
- 唯一键必须存在于数据 map 中
- **重要**：唯一键字段必须在 `output_schema.json` 中定义，否则平台无法正确匹配和更新行
- **重要**：唯一键字段必须在 `output_schema.json` 中定义，否则平台无法正确匹配和更新行

---

## 源码入口文件（main.go）

### 完整示例

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net"
    "net/http"
    "os"
    "strings"
    "time"

    coresdk "test/GoSdk"
    "golang.org/x/net/proxy"
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
    // PROXY_DOMAIN 是代理地址（host:port），PROXY_AUTH 是 username:password。
    proxyDomain := os.Getenv("PROXY_DOMAIN")
    proxyAuth := os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("是否已配置代理: %v", proxyAuth != "" && proxyDomain != ""))

    // 3. 业务逻辑 - 创建带 SOCKS5 拨号器的 HTTP 客户端。
    // Go 的 http.Transport.Proxy 不支持 SOCKS5，需改用
    // golang.org/x/net/proxy 拨号，并保持 TLS 校验开启。
    httpClient := &http.Client{
        Timeout: time.Second * 30,
    }

    if proxyAuth != "" && proxyDomain != "" {
        var auth *proxy.Auth
        if user, pass, ok := strings.Cut(proxyAuth, ":"); ok {
            auth = &proxy.Auth{User: user, Password: pass}
        }

        dialer, err := proxy.SOCKS5("tcp", proxyDomain, auth, proxy.Direct)
        if err != nil {
            coresdk.Log.Error(ctx, fmt.Sprintf("创建 SOCKS5 拨号器失败: %v", err))
            return
        }

        contextDialer := dialer.(proxy.ContextDialer)
        httpClient.Transport = &http.Transport{
            DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
                return contextDialer.DialContext(ctx, network, addr)
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

    // 5. 设置表格表头
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

    // 6. 推送结果数据
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
4. **上报结果** — 先设置表格表头，再将采集数据推送回平台

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

**问：PushData 和 UpsertData 有什么区别？**
答：`PushData` 始终追加新行。`UpsertData` 如果唯一键匹配则更新现有行，如果不匹配则插入新行。当需要更新已采集的数据时，使用 `UpsertData`。
