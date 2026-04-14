---
title: Go 脚本
description: 学习如何编写 Go 脚本
---

# Go 脚本示例

## GitHub 仓库

[https://github.com/core-claw/GoScirptDemo](https://github.com/core-claw/GoScirptDemo)

---

## 必需文件（位于项目根目录）

```
├── main.go
├── main
├── input_schema.json
├── README.md
├── go.mod
├── go.sum
└── GoSdk
      ├── sdk.go
      ├── sdk_pd.go
      └── sdk_grpc_pd.go
```

| 文件名              | 说明                                                         |
| ------------------- | ------------------------------------------------------------- |
| `main.go`           | 脚本源代码                                                    |
| `main`              | 脚本入口可执行文件（执行入口点），必须命名为 `main`           |
| `input_schema.json` | UI 输入表单配置                                              |
| `README.md`         | 项目文档                                                     |
| `sdk.go`            | 核心 SDK 功能（位于 `GoSdk` 目录）                           |
| `sdk_pd.go`         | 数据处理增强模块（位于 `GoSdk` 目录）                        |
| `sdk_grpc_pd.go`    | 网络通信模块（位于 `GoSdk` 目录）                            |

---

## Go 脚本必须先构建为可执行文件再上传

```bash
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=amd64
go build -o main ./main.go
```

建议构建后使用 **UPX** 压缩可执行文件，可显著减小文件大小。

---

# 核心 SDK 文件

## 文件概览

以下三个 SDK 文件是必需的，必须放置在脚本的**根目录**中：

| 文件名            | 主要功能               |
| :---------------- | :--------------------- |
| `sdk.go`          | 核心 SDK 功能           |
| `sdk_pd.go`       | 数据处理增强模块        |
| `sdk_grpc_pd.go`  | 网络通信模块            |

这些文件共同构成脚本的**工具箱**，提供爬虫执行和与平台后端通信所需的所有核心能力。

---

## 核心功能使用指南

### 1. 环境参数——获取脚本输入配置

脚本启动时，可从外部传入配置参数（如目标网站 URL 或搜索关键词）。

使用以下方法获取：

```go
// 获取所有输入参数为 JSON 字符串
ctx := context.Background()
inputJSON, _ := coresdk.Parameter.GetInputJSONString(ctx)

// 示例返回值：
// {"website": "example.com", "keyword": "科技新闻"}
```

**使用场景：**
你可以通过更改输入参数来复用同一脚本采集不同网站或数据集，无需修改代码。

---

### 2. 运行日志——记录脚本执行过程

执行过程中，可以记录不同级别的日志，并在平台控制台中展示，便于监控和调试：

```go
ctx := context.Background()

// 调试信息（最详细，用于排查问题）
coresdk.Log.Debug(ctx, "正在连接目标网站...")

// 信息日志（正常工作流）
coresdk.Log.Info(ctx, "成功获取 10 条新闻")

// 警告日志（非关键问题）
coresdk.Log.Warn(ctx, "网络延迟较高，可能影响性能")

// 错误日志（执行失败）
coresdk.Log.Error(ctx, "无法访问目标网站，请检查网络连接")
```

**日志级别：**

* **debug**：详细调试信息（开发期间推荐）
* **info**：正常执行流程
* **warn**：不阻止执行的警告
* **error**：需要关注的关键错误

---

### 3. 结果提交——将数据回传到平台

数据采集完成后，必须通过两步将结果返回平台。

---

### 第一步：定义表头（必填）

在推送数据之前，定义表结构（类似于在 Excel 中定义列标题）：

```go
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

ctx := context.Background()
res, err := coresdk.Result.SetTableHeader(ctx, headers)
```

**字段说明：**

* **Label**：显示给用户的列名
* **Key**：代码中使用的唯一标识符
* **Format**：数据类型，支持的值：
  * `"text"` – 字符串
  * `"integer"` – 整数
  * `"boolean"` – 布尔值
  * `"array"` – 列表
  * `"object"` – 字典/对象

---

### 第二步：逐行推送数据

定义表头后，逐条推送采集到的数据：

```go
type result struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}

resultData := []result{
    {Title: "示例标题 1", Content: "示例内容 1"},
    {Title: "示例标题 2", Content: "示例内容 2"},
}

ctx := context.Background()

for _, datum := range resultData {
    jsonBytes, _ := json.Marshal(datum)

    res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("推送数据失败: %v", err))
        return
    }
    fmt.Printf("PushData 响应: %+v\n", res)
}
```

**注意事项：**

1. 设置表头和推送数据的顺序无关
2. 推送数据中的键必须与表头中定义的键完全匹配
3. 数据必须**逐条推送**
4. 建议每次推送后记录日志以便追踪

---

### 常见问题与注意事项

1. **文件放置**：确保所有 SDK 文件位于脚本目录中
2. **导入**：直接使用 `SDK` 或 `CoreSDK` 访问 SDK 功能
3. **键一致性**：数据键必须与表头键完全匹配
4. **错误处理**：始终检查返回值，特别是推送数据时

---

# 脚本入口文件（main.go）

## 完整代码示例

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

	time.Sleep(2 * time.Second)
	coresdk.Log.Info(ctx, "golang gRPC SDK client started......")

	// 1. 获取输入参数
	inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
	if err != nil {
		coresdk.Log.Error(ctx, fmt.Sprintf("获取输入参数失败: %v", err))
		return
	}
	coresdk.Log.Debug(ctx, fmt.Sprintf("输入参数: %s", inputJSON))

	// 2. 获取代理配置（从环境变量读取，支持灵活部署）
	proxyDomain := os.Getenv("PROXY_DOMAIN")
	if proxyDomain == "" {
		proxyDomain = "proxy-inner.coreclaw.com:6000"
	}
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

	// 4. 业务逻辑处理（示例）
	coresdk.Log.Info(ctx, "开始处理业务逻辑")

	// 创建自定义 HTTP 客户端，支持代理
	httpClient := &http.Client{
		Timeout: time.Second * 30,
	}

	// 如果配置了代理，设置代理传输层
	if proxyURL != "" {
		proxyParsed, err := url.Parse(proxyURL)
		if err != nil {
			coresdk.Log.Error(ctx, fmt.Sprintf("解析代理 URL 失败: %v", err))
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

	// 发送请求到 ipinfo.io
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

	coresdk.Log.Info(ctx, fmt.Sprintf("响应状态码: %d", resp.StatusCode))

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		coresdk.Log.Error(ctx, fmt.Sprintf("读取响应失败: %v", err))
		return
	}

	ip := strings.TrimSpace(string(body))
	coresdk.Log.Info(ctx, fmt.Sprintf("当前 IP 地址: %s", ip))
	coresdk.Log.Info(ctx, "业务逻辑处理完成")

	// 5. 推送结果数据
	type result struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	resultData := []result{
		{Title: "示例标题 1", Content: "示例内容 1"},
		{Title: "示例标题 2", Content: "示例内容 2"},
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

# 自动化数据采集脚本：工作流与原理

## 1. 脚本概览

此脚本是一个自动化脚本，工作方式类似**数字员工**。它自动打开目标网页（如社交媒体网站），提取所需信息，并将数据整理为结构化表格。

---

## 2. 工作原理

整个过程可简化为四个主要阶段：

---

### 步骤一：接收指令（输入参数）

执行前，你提供指令，如：

* 目标页面 URL
* 要采集的记录数量

---

### 步骤二：隐身准备（代理网络配置）

为可靠访问海外或受限网站，脚本自动配置安全代理通道。

**代理环境变量：**

| 环境变量 | 说明 | 示例值 |
| :------- | :--- | :----- |
| `PROXY_DOMAIN` | 代理服务器地址 | `proxy-inner.coreclaw.com:6000` |
| `PROXY_AUTH` | 代理认证信息 | `user:password` |

---

### 步骤三：自动执行（业务逻辑处理）

这是核心阶段，脚本在此：

* 访问目标页面
* 提取标题、内容、图片等所需数据

---

### 步骤四：结果上报（数据推送与表格生成）

采集完成后：

* 原始数据转换为标准化格式
* 结果保存到系统
* 自动生成表头（如"URL"、"内容"）
