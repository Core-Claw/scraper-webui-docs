---
title: HTTP/Socks5 Network Proxy
description: To ensure stable access to target websites worldwide, the platform provides an encrypted network channel (proxy server) at runtime.
sidebar:
  order: 1
---

## Proxy Environment Overview

To ensure stable access to target websites worldwide, the platform provides an encrypted network channel (proxy server) at runtime.

**You do not need to purchase, deploy, or maintain proxies yourself.**

Simply read the proxy credentials injected by the platform and configure them correctly in your HTTP requests.

### Proxy Configuration

- **Protocol**: `SOCKS5`
- **Endpoint**: read from the `PROXY_DOMAIN` environment variable at runtime (`host:port`)
- **Authentication**:
    - **Environment Variable**: `PROXY_AUTH`
    - **Format**: `username:password`
- **Setup**: The platform provisions and injects the proxy at runtime — you do not purchase, deploy, or configure proxies yourself.

:::caution[Never log proxy credentials]
`PROXY_AUTH` is a live secret and the full proxy URL contains the password. Do not print or log either one. Log only whether a proxy is present (a boolean) or a masked host, as shown below.
:::

### Python Example

Routing `requests` through SOCKS5 requires the `PySocks` extra (`pip install "requests[socks]"`). Use the `socks5h` scheme so DNS is resolved through the proxy.

```python
import os
import requests

# 1. Read proxy endpoint (host:port) and credentials (username:password)
proxy_domain = os.environ.get("PROXY_DOMAIN")
proxy_auth = os.environ.get("PROXY_AUTH")
print(f"Proxy configured: {bool(proxy_auth and proxy_domain)}")

# 2. Build the SOCKS5 proxy URL (never log this value — it contains the password)
proxy_url = (
    f"socks5h://{proxy_auth}@{proxy_domain}"
    if proxy_auth and proxy_domain
    else None
)

# 3. Create a session that routes through the proxy
session = requests.Session()
if proxy_url:
    session.proxies = {"http": proxy_url, "https": proxy_url}

# 4. Example request
response = session.get("https://ipinfo.io/ip", timeout=30)
print(f"Status code: {response.status_code}")
print(f"Current exit IP: {response.text.strip()}")
```

### Go Example

Go's standard `http.Transport.Proxy` does **not** speak SOCKS5. Use a SOCKS5 dialer from `golang.org/x/net/proxy` (`go get golang.org/x/net/proxy`) and keep TLS verification enabled.

```go
package main

import (
    "context"
    "fmt"
    "net"
    "net/http"
    "os"
    "strings"
    "time"

    "golang.org/x/net/proxy"
)

func main() {
    ctx := context.Background()

    // 1. Read proxy endpoint (host:port) and credentials (username:password)
    proxyDomain := os.Getenv("PROXY_DOMAIN")
    proxyAuth := os.Getenv("PROXY_AUTH")
    fmt.Printf("Proxy configured: %v\n", proxyAuth != "" && proxyDomain != "")

    httpClient := &http.Client{Timeout: 30 * time.Second}

    // 2. Build a SOCKS5 dialer and wrap it in the HTTP transport
    if proxyAuth != "" && proxyDomain != "" {
        var auth *proxy.Auth
        if user, pass, ok := strings.Cut(proxyAuth, ":"); ok {
            auth = &proxy.Auth{User: user, Password: pass}
        }

        dialer, err := proxy.SOCKS5("tcp", proxyDomain, auth, proxy.Direct)
        if err != nil {
            fmt.Printf("Failed to create SOCKS5 dialer: %v\n", err)
            return
        }

        contextDialer := dialer.(proxy.ContextDialer)
        httpClient.Transport = &http.Transport{
            DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
                return contextDialer.DialContext(ctx, network, addr)
            },
        }
    }

    // 3. Example request
    req, err := http.NewRequestWithContext(ctx, "GET", "https://ipinfo.io/ip", nil)
    if err != nil {
        fmt.Printf("Failed to create request: %v\n", err)
        return
    }

    resp, err := httpClient.Do(req)
    if err != nil {
        fmt.Printf("Request failed: %v\n", err)
        return
    }
    defer resp.Body.Close()

    fmt.Printf("Status code: %d\n", resp.StatusCode)
}
```

### Node.js Example

```javascript
const axios = require('axios')
const { SocksProxyAgent } = require('socks-proxy-agent')

async function main() {
    // 1. Read proxy endpoint (host:port) and credentials (username:password)
    const proxyDomain = process.env.PROXY_DOMAIN
    const proxyAuth = process.env.PROXY_AUTH
    console.log(`Proxy configured: ${Boolean(proxyAuth && proxyDomain)}`)

    // 2. Build the SOCKS5 proxy URL (never log this value — it contains the password)
    const proxyUrl =
        proxyAuth && proxyDomain ? `socks5://${proxyAuth}@${proxyDomain}` : null

    // 3. Create HTTP client config
    const axiosConfig = {
        timeout: 30000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
    }

    // 4. Configure agent if proxy exists
    if (proxyUrl) {
        const agent = new SocksProxyAgent(proxyUrl)
        axiosConfig.httpAgent = agent
        axiosConfig.httpsAgent = agent
        axiosConfig.proxy = false // Must disable axios default proxy handling
    }

    // 5. Example request
    try {
        const response = await axios.get('https://ipinfo.io/ip', axiosConfig)
        console.log(`Status code: ${response.status}`)
        console.log(`Current exit IP: ${String(response.data).trim()}`)
    } catch (err) {
        console.error(`Request failed: ${err.message}`)
    }
}

main()
```

:::note[Notes]

- Never hard-code, print, or log proxy usernames, passwords, or the full proxy URL — log only whether a proxy is present.
- Always use the platform-injected `PROXY_AUTH` and `PROXY_DOMAIN`.
- In Node.js, `proxy = false` must be set, otherwise the SOCKS proxy will not work.

:::

## Execution Regions

The proxy can exit from a specific country or region. The available region codes are returned by the API and may change over time, so query them at runtime rather than relying on a hard-coded list:

- **API**: [List Proxy Regions](/api/proxy/region/) — `GET /api/v2/proxy/region`
- **MCP**: `list_proxy_regions`

Pass the selected region code through the Worker's system parameters (for example a `proxy_region` field, when the Worker's input schema exposes one). When no region is specified, the platform selects a default exit.
