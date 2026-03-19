---
title: 指纹浏览器配置
description: 指纹浏览器
sidebar:
    order: 2
---

### 🧩 浏览器指纹环境说明

为应对目标网站的**浏览器指纹识别与自动化检测机制**，平台在脚本运行时会**自动提供并托管**一个**隔离的浏览器指纹环境**，用于执行需要真实浏览器上下文的操作（如 JS 渲染、页面交互、登录态访问等）。

该指纹环境由平台统一维护，**开发者无需自行部署、购买或管理指纹浏览器实例**，即可直接使用稳定、可用的浏览器运行环境。

该机制可有效避免因设备特征、浏览器信息重复而导致的访问失败或账号关联风险。

### 📌 指纹环境配置说明

- **类型**：Chromium（平台托管远程实例）
- **连接方式**：`WebSocket`
- **访问入口**：平台内部浏览器服务
- **认证方式**：
    - **环境变量名**：`PROXY_AUTH`
    - **格式**：`username:password`
- **使用说明**：脚本读取 `PROXY_AUTH` 并拼接 WebSocket 地址即可连接
- **费用说明**：**平台内置提供，无需额外付费或单独配置**

---

### 🐍 Python 示例

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"当前获取的浏览器认证信息: {Auth}")
except Exception as e:
    CafeSDK.Log.error(f"当前获取浏览器认证信息失败: {e}")
    Auth = None

# 代理浏览器 WebSocket 地址
browser_url = f'ws://{Auth}@chrome-ws-inner.cafescraper.com'

CafeSDK.Log.info(f"使用代理浏览器地址: {browser_url}")

# ✅ 使用 ipinfo 验证测试
test_url = "https://ipinfo.io/ip"

company_overview = GlassdoorCrawlerCompanyOverview(
    browser_url=browser_url
)

status, soup = await company_overview.fetch_with_playwright(test_url)

# 打印抓取结果
if soup:
    ip_text = soup.get_text(strip=True)
    CafeSDK.Log.info(f"当前代理出口 IP: {ip_text}")
else:
    CafeSDK.Log.error("未获取到页面内容")

CafeSDK.Log.info(f"请求状态码: {status}")
```

### 🧱 Go 示例

```go
ctx := context.Background()

// 读取 PROXY_AUTH
auth := os.Getenv("PROXY_AUTH")
CafeSDK.Log.Info(fmt.Sprintf("当前获取的浏览器认证信息: %s", auth))

// 拼接代理浏览器 WS 地址
browserURL := "ws://chrome-ws-inner.cafescraper.com"
if auth != "" {
	browserURL = fmt.Sprintf("ws://%s@chrome-ws-inner.cafescraper.com", auth)
}
CafeSDK.Log.Info(ctx, "使用代理浏览器地址: %s", browserURL)

// 启动 Playwright
pw, err := playwright.Run()
if err != nil {
	CafeSDK.Log.Error(ctx, "Playwright 启动失败: %v", err)
	return
}
defer playwright.Stop()

// 连接代理浏览器
browser, err := pw.Chromium.ConnectOverCDP(browserURL)
if err != nil {
	CafeSDK.Log.Error(ctx, "连接代理浏览器失败: %v", err)
	return
}
defer browser.Close()

// 创建页面
page, err := browser.NewPage()
if err != nil {
	CafeSDK.Log.Error(ctx, "创建页面失败: %v", err)
	return
}

// 访问 ipinfo 验证出口 IP
resp, err := page.Goto("https://ipinfo.io/ip")
if err != nil {
	CafeSDK.Log.Error(ctx, "页面访问失败: %v", err)
	return
}

page.WaitForLoadState("networkidle")

content, err := page.TextContent("body")
if err != nil {
	CafeSDK.Log.Error(ctx, "获取页面内容失败: %v", err)
	return
}

CafeSDK.Log.Info(ctx, "当前代理出口 IP: %s", content)
CafeSDK.Log.Info(ctx, "请求状态码: %d", resp.Status())
```

### 🟢 Node.js 示例

```js
const { chromium } = require('playwright')

;(async () => {
    // 获取 PROXY_AUTH
    const Auth = process.env.PROXY_AUTH
    console.log('当前获取的浏览器认证信息:', Auth)

    // 拼接代理浏览器 WS
    const browserUrl = Auth
        ? `ws://${Auth}@chrome-ws-inner.cafescraper.com`
        : `ws://chrome-ws-inner.cafescraper.com`

    console.log('使用代理浏览器地址:', browserUrl)

    // 连接代理浏览器
    const browser = await chromium.connectOverCDP(browserUrl)
    const page = await browser.newPage()

    // 访问 ipinfo
    const response = await page.goto('https://ipinfo.io/ip', {
        timeout: 60000,
    })

    await page.waitForLoadState('networkidle')

    // 获取 IP
    const ipText = await page.textContent('body')

    console.log('当前代理出口 IP:', ipText.trim())
    console.log('请求状态码:', response.status())

    await browser.close()
})()
```

:::danger[注意事项]

- ❗ 不要硬编码代理账号或密码
- ❗ 始终优先使用平台注入的 `PROXY_AUTH`
  :::
