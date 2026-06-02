---
title: Lightpanda
description: 通过 CDP 连接平台托管的 Lightpanda 浏览器
sidebar:
  order: 2
---

Lightpanda 是 CoreClaw 通过 Chrome DevTools Protocol（CDP）暴露的轻量级浏览器后端。Worker 需要浏览器级导航、JavaScript 执行或页面渲染时，可以使用 Lightpanda，而不需要在项目中打包或启动本地浏览器。

## 定位

Lightpanda **不是**浏览器自动化框架，而是平台托管的浏览器端点。

开发者仍然使用 Playwright 等客户端库编写自动化逻辑。区别在于，Playwright 连接的是 Lightpanda CDP 端点，而不是启动本地浏览器进程。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `LightpandaDomain` | 平台注入的 Lightpanda CDP 域名或端点 |
| `PROXY_AUTH` | 平台注入的认证信息，格式为 `username:password` |

:::danger[重要]
- 不要在 Worker 代码中硬编码 `PROXY_AUTH` 或 Lightpanda 认证信息。
- 从运行环境读取 `LightpandaDomain`。
- 连接 Lightpanda 时，将 `PROXY_AUTH` 作为 Basic `Authorization` header 传入。
:::

## 端点与认证规则

调用 `connect_over_cdp` 前，按以下规则处理：

- 如果 `LightpandaDomain` 是裸域名，将其归一化为 `ws://<domain>/devtools/browser/new`。
- 如果 `LightpandaDomain` 已经是完整的 `ws://`、`wss://`、`http://` 或 `https://` CDP 端点，则原样使用。
- 认证使用 HTTP `Authorization` header 的 Basic scheme。header 内容由 `username:password` 格式的 `PROXY_AUTH` 生成。

## 推荐的 Playwright 连接方式

当 `LightpandaDomain` 可能被注入为裸域名或完整 CDP 端点时，推荐使用下面的写法。

```python
import asyncio
import base64
import os

from playwright.async_api import async_playwright


def basic_auth_header(auth: str) -> str:
    token = base64.b64encode(auth.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def lightpanda_cdp_endpoint(value: str) -> str:
    endpoint = value.rstrip("/")
    if endpoint.startswith(("ws://", "wss://", "http://", "https://")):
        return endpoint
    return f"ws://{endpoint}/devtools/browser/new"


async def main() -> None:
    auth = os.environ["PROXY_AUTH"]
    cdp_endpoint = lightpanda_cdp_endpoint(os.environ["LightpandaDomain"])

    async with async_playwright() as playwright:
        browser = await playwright.chromium.connect_over_cdp(
            cdp_endpoint,
            headers={"Authorization": basic_auth_header(auth)},
            timeout=60000,
        )
        try:
            page = await browser.new_page()
            await page.goto(
                "https://ipinfo.io/ip",
                wait_until="domcontentloaded",
                timeout=60000,
            )
            print((await page.text_content("body") or "").strip())
        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
```

## HTTP CDP 端点

上面的推荐 helper 已经支持完整 HTTP CDP 端点。如果可以确定 `LightpandaDomain` 始终注入为完整 HTTP 端点，也可以使用下面的短写法：

```python
import asyncio
import base64
import os

from playwright.async_api import async_playwright


def basic_auth_header(auth: str) -> str:
    token = base64.b64encode(auth.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


async def main() -> None:
    auth = os.environ["PROXY_AUTH"]
    cdp_endpoint = os.environ["LightpandaDomain"]

    async with async_playwright() as playwright:
        browser = await playwright.chromium.connect_over_cdp(
            cdp_endpoint,
            headers={"Authorization": basic_auth_header(auth)},
            timeout=60000,
        )
        try:
            page = await browser.new_page()
            await page.goto("https://ipinfo.io/ip", wait_until="domcontentloaded")
            print((await page.text_content("body") or "").strip())
        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
```

## 集成 CoreSDK 的完整 Worker 示例

将 Lightpanda 自动化打包为 CoreClaw Worker 时，可以在 `main.py` 中使用下面的结构。SDK 负责读取输入参数、记录日志、设置表头，并将结果回传到平台。

```python
import asyncio
import base64
import os

from playwright.async_api import async_playwright
from sdk import CoreSDK


def basic_auth_header(auth: str) -> str:
    token = base64.b64encode(auth.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def lightpanda_cdp_endpoint(value: str) -> str:
    endpoint = value.rstrip("/")
    if endpoint.startswith(("ws://", "wss://", "http://", "https://")):
        return endpoint
    return f"ws://{endpoint}/devtools/browser/new"


async def run() -> None:
    CoreSDK.Log.info("Starting Lightpanda Worker...")

    headers = [
        {"label": "url", "key": "url", "format": "text"},
        {"label": "ip", "key": "ip", "format": "text"},
        {"label": "html", "key": "html", "format": "text"},
        {"label": "resp_status", "key": "resp_status", "format": "text"},
    ]
    CoreSDK.Result.set_table_header(headers)

    input_json = CoreSDK.Parameter.get_input_json_dict()
    url = input_json.get("url") or "https://ipinfo.io/ip"

    auth = os.environ["PROXY_AUTH"]
    cdp_endpoint = lightpanda_cdp_endpoint(os.environ["LightpandaDomain"])

    result = {
        "url": url,
        "ip": "",
        "html": "",
        "resp_status": "200",
    }

    browser = None
    try:
        async with async_playwright() as playwright:
            CoreSDK.Log.info("Connecting to Lightpanda...")
            browser = await playwright.chromium.connect_over_cdp(
                cdp_endpoint,
                headers={"Authorization": basic_auth_header(auth)},
                timeout=60000,
            )

            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)

            result["html"] = await page.content()
            result["ip"] = (await page.text_content("body") or "").strip()
            CoreSDK.Log.info("Lightpanda page loaded successfully")
    except Exception as exc:
        result["resp_status"] = "500"
        result["html"] = str(exc)
        CoreSDK.Log.error(f"Lightpanda run failed: {exc}")
    finally:
        if browser:
            await browser.close()
        CoreSDK.Result.push_data(result)


if __name__ == "__main__":
    asyncio.run(run())
```

## 最佳实践

- 在适合轻量级托管浏览器的 CDP 自动化场景中使用 Lightpanda。
- 页面级逻辑仍然放在 Playwright 的选择器和导航 API 中。
- 为浏览器连接和页面跳转设置明确超时时间。
- 在 Worker 代码中使用 `CoreSDK.Parameter` 读取输入、`CoreSDK.Log` 记录进度、`CoreSDK.Result` 输出结果。
- 在 `finally` 中关闭远程浏览器。
- 不要为浏览器页面手动配置 SOCKS5 代理；远程浏览器会处理外网访问。
