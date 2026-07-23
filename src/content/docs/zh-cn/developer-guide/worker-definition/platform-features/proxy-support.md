---
title: HTTP/Socks5 网络代理
description: 为确保脚本在全球范围内稳定访问目标网站，平台会在运行时提供一条加密通道代理服务器。
sidebar:
  order: 1
---

## 代理环境说明

为确保脚本在全球范围内稳定访问目标网站，平台会在运行时提供一条加密通道（代理服务器）。

**脚本无需自行购买或维护代理**，只需读取平台注入的代理认证信息，并在 HTTP 请求中正确配置即可。

### 代理配置说明

- **协议**：`SOCKS5`
- **域名**：运行时从 `PROXY_DOMAIN` 环境变量读取（`host:port`）
- **认证方式**：
    - 环境变量名：`PROXY_AUTH`
    - 格式：`username:password`
- **配置方式**：代理由平台在运行时分配并注入，脚本无需自行购买、部署或配置代理。

:::caution[切勿打印代理凭据]
`PROXY_AUTH` 是实时密钥，拼接后的代理 URL 也包含密码。请勿以任何形式打印或记录这两者，只记录“是否已配置代理”（布尔值）即可，如下所示。
:::

### Python 示例

用 `requests` 走 SOCKS5 需要安装 `PySocks`（`pip install "requests[socks]"`）。使用 `socks5h` 协议头，让 DNS 也通过代理解析。

```python
import os
import requests

# 1. 读取代理地址（host:port）与认证信息（username:password）
proxy_domain = os.environ.get("PROXY_DOMAIN")
proxy_auth = os.environ.get("PROXY_AUTH")
print(f"是否已配置代理: {bool(proxy_auth and proxy_domain)}")

# 2. 拼接 SOCKS5 代理 URL（切勿打印该值——它包含密码）
proxy_url = (
    f"socks5h://{proxy_auth}@{proxy_domain}"
    if proxy_auth and proxy_domain
    else None
)

# 3. 创建走代理的会话
session = requests.Session()
if proxy_url:
    session.proxies = {"http": proxy_url, "https": proxy_url}

# 4. 示例请求
response = session.get("https://ipinfo.io/ip", timeout=30)
print(f"状态码: {response.status_code}")
print(f"当前出口 IP: {response.text.strip()}")
```

### Go 示例

Go 标准库的 `http.Transport.Proxy` **不支持** SOCKS5。请使用 `golang.org/x/net/proxy`（`go get golang.org/x/net/proxy`）提供的 SOCKS5 dialer，并保持 TLS 校验开启。

```go
// 1. 读取代理地址（host:port）与认证信息（username:password）
proxyDomain := os.Getenv("PROXY_DOMAIN")
proxyAuth := os.Getenv("PROXY_AUTH")
coresdk.Log.Info(ctx, fmt.Sprintf("是否已配置代理: %v", proxyAuth != "" && proxyDomain != ""))

httpClient := &http.Client{Timeout: 30 * time.Second}

// 2. 构建 SOCKS5 dialer 并注入 HTTP transport
if proxyAuth != "" && proxyDomain != "" {
    var auth *proxy.Auth
    if user, pass, ok := strings.Cut(proxyAuth, ":"); ok {
        auth = &proxy.Auth{User: user, Password: pass}
    }

    dialer, err := proxy.SOCKS5("tcp", proxyDomain, auth, proxy.Direct)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("创建 SOCKS5 dialer 失败: %v", err))
        return
    }

    contextDialer := dialer.(proxy.ContextDialer)
    httpClient.Transport = &http.Transport{
        DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
            return contextDialer.DialContext(ctx, network, addr)
        },
    }
}

// 3. 示例业务请求
req, err := http.NewRequestWithContext(ctx, "GET", "https://ipinfo.io/ip", nil)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("创建请求失败: %v", err))
    return
}

resp, err := httpClient.Do(req)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("请求失败: %v", err))
    return
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
coresdk.Log.Info(ctx, fmt.Sprintf("响应状态码: %d", resp.StatusCode))
coresdk.Log.Info(ctx, fmt.Sprintf("当前出口 IP: %s", strings.TrimSpace(string(body))))
```

### Node.js 示例

**步骤 1：安装依赖**

```sh
npm install axios socks-proxy-agent
```

**步骤 2：示例代码**

```js
import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

// 1. 获取代理服务地址（仅从运行环境读取）
const proxyDomain = process.env.PROXY_DOMAIN

// 2. 读取代理认证信息（username:password）
const proxyAuth = process.env.PROXY_AUTH
await coresdk.log.info(`是否已配置代理: ${Boolean(proxyAuth && proxyDomain)}`)

// 3. 拼接 SOCKS5 代理 URL（切勿记录该值——它包含密码）
const proxyUrl =
    proxyAuth && proxyDomain ? `socks5://${proxyAuth}@${proxyDomain}` : null

// 4. 创建 HTTP Client 配置
const axiosConfig = {
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
}

// 5. 如果存在代理，配置 Agent
if (proxyUrl) {
    const agent = new SocksProxyAgent(proxyUrl)
    axiosConfig.httpAgent = agent
    axiosConfig.httpsAgent = agent
    axiosConfig.proxy = false // 必须禁用 axios 默认代理处理
}

// 6. 示例业务请求
try {
    const response = await axios.get('https://ipinfo.io/ip', axiosConfig)
    await coresdk.log.info(`响应状态码: ${response.status}`)
    await coresdk.log.info(`当前出口 IP: ${String(response.data).trim()}`)
} catch (err) {
    await coresdk.log.error(`请求失败: ${err.message}`)
}
```

:::note[注意事项]

- 不要硬编码、打印或记录代理账号、密码或完整代理 URL——只记录“是否已配置代理”即可。
- 始终使用平台注入的 `PROXY_AUTH` 与 `PROXY_DOMAIN`。
- Node.js 中必须设置 `proxy = false`，否则 SOCKS 代理不会生效。

:::

## 执行区域

代理可以从指定的国家或地区出口。可用的区域代码由 API 返回，且可能随时间变化，因此请在运行时查询，而不要依赖硬编码列表：

- **API**：[列出代理区域](/zh-cn/api/proxy/region/) —— `GET /api/v2/proxy/region`
- **MCP**：`list_proxy_regions`

将所选区域代码通过 Worker 的系统参数传入（例如当 Worker 的输入 schema 暴露了 `proxy_region` 字段时）。未指定区域时，平台会选择一个默认出口。
