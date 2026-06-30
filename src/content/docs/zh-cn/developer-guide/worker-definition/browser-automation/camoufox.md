---
title: Camoufox
description: 使用 Playwright Firefox 连接平台托管的 Camoufox 浏览器
sidebar:
  order: 2
---

Camoufox 是平台托管的 Firefox 兼容浏览器后端。Worker 需要 Firefox 浏览器环境，并希望使用平台托管的网络、指纹和会话隔离能力时，可以使用 Camoufox。

## 定位

Camoufox **不是**浏览器自动化框架，而是平台托管的浏览器端点。

开发者仍然使用 Playwright 等客户端库编写自动化逻辑。区别在于，Playwright 连接的是 Camoufox 会话，而不是启动本地 Firefox，也不是连接 Chromium CDP 端点。

## 依赖要求

在 `requirements.txt` 中锁定支持的 Playwright 版本：

```txt
playwright==1.49.1
```

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `CamoufoxDomain` | 平台注入的 Camoufox HTTP 域名或基础 URL |
| `PROXY_AUTH` | 平台注入的认证信息，格式为 `username:password` |

:::danger[重要]
- 不要在 Worker 代码中硬编码 `PROXY_AUTH`、运行 ID、任务 ID 或 Camoufox 认证信息。
- 从运行环境读取 `CamoufoxDomain`。
- 创建 Camoufox 会话以及连接返回的 WebSocket 端点时，都需要将 `PROXY_AUTH` 作为 Basic `Authorization` header 传入。
:::

## 端点与认证规则

连接前按以下规则处理：

- 如果 `CamoufoxDomain` 是裸域名，将其归一化为 `http://<domain>`。
- 如果 `CamoufoxDomain` 已经是完整的 `http://` 或 `https://` 基础 URL，则原样使用。
- 通过 `POST /session` 创建浏览器会话。
- 会话响应中包含 `wsEndpoint`，将它传给 `playwright.firefox.connect`。
- 认证使用 HTTP `Authorization` header 的 Basic scheme。header 内容由 `username:password` 格式的 `PROXY_AUTH` 生成。

## 推荐的 Playwright 连接方式

当 `CamoufoxDomain` 可能被注入为裸域名或完整 HTTP 基础 URL 时，推荐使用下面的写法。

```python
import asyncio
import base64
import json
import os
import urllib.request

from playwright.async_api import async_playwright


TIMEOUT_MS = 60000


def basic_auth_header(auth: str) -> str:
    token = base64.b64encode(auth.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def camoufox_base_url(value: str) -> str:
    endpoint = value.rstrip("/")
    if endpoint.startswith(("http://", "https://")):
        return endpoint
    return f"http://{endpoint}"


def create_camoufox_session(base_url: str, auth_header: str) -> dict:
    request = urllib.request.Request(
        f"{base_url}/session",
        data=b"",
        method="POST",
        headers={
            "Authorization": auth_header,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_MS / 1000) as response:
        return json.loads(response.read().decode("utf-8"))


async def main() -> None:
    auth_header = basic_auth_header(os.environ["PROXY_AUTH"])
    base_url = camoufox_base_url(os.environ["CamoufoxDomain"])
    session = create_camoufox_session(base_url, auth_header)

    async with async_playwright() as playwright:
        browser = await playwright.firefox.connect(
            session["wsEndpoint"],
            headers={"Authorization": auth_header},
            timeout=TIMEOUT_MS,
        )
        try:
            page = await browser.new_page()
            await page.goto(
                "https://ipinfo.io/ip",
                wait_until="domcontentloaded",
                timeout=TIMEOUT_MS,
            )
            print((await page.text_content("body") or "").strip())
        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
```

## 集成 CoreSDK 的完整 Worker 示例

将 Camoufox 自动化打包为 CoreClaw Worker 时，可以在 `main.py` 中使用下面的结构。SDK 负责读取输入参数、记录日志、设置表头，并将结果回传到平台。

```python
import asyncio
import base64
import json
import os
import urllib.request

from playwright.async_api import async_playwright
from sdk import CoreSDK


TIMEOUT_MS = 60000


def basic_auth_header(auth: str) -> str:
    token = base64.b64encode(auth.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def camoufox_base_url(value: str) -> str:
    endpoint = value.rstrip("/")
    if endpoint.startswith(("http://", "https://")):
        return endpoint
    return f"http://{endpoint}"


def create_camoufox_session(base_url: str, auth_header: str) -> dict:
    request = urllib.request.Request(
        f"{base_url}/session",
        data=b"",
        method="POST",
        headers={
            "Authorization": auth_header,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_MS / 1000) as response:
        return json.loads(response.read().decode("utf-8"))


async def run() -> None:
    CoreSDK.Log.info("Starting Camoufox Worker...")

    headers = [
        {"label": "url", "key": "url", "format": "text"},
        {"label": "ip", "key": "ip", "format": "text"},
        {"label": "html", "key": "html", "format": "text"},
        {"label": "resp_status", "key": "resp_status", "format": "text"},
    ]
    CoreSDK.Result.set_table_header(headers)

    input_json = CoreSDK.Parameter.get_input_json_dict()
    url = input_json.get("url") or "https://ipinfo.io/ip"

    result = {
        "url": url,
        "ip": "",
        "html": "",
        "resp_status": "200",
    }

    browser = None
    try:
        auth_header = basic_auth_header(os.environ["PROXY_AUTH"])
        base_url = camoufox_base_url(os.environ["CamoufoxDomain"])

        CoreSDK.Log.info("Creating Camoufox session...")
        session = create_camoufox_session(base_url, auth_header)

        async with async_playwright() as playwright:
            CoreSDK.Log.info("Connecting to Camoufox...")
            browser = await playwright.firefox.connect(
                session["wsEndpoint"],
                headers={"Authorization": auth_header},
                timeout=TIMEOUT_MS,
            )

            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT_MS)

            result["html"] = await page.content()
            result["ip"] = (await page.text_content("body") or "").strip()
            CoreSDK.Log.info("Camoufox page loaded successfully")
    except Exception as exc:
        result["resp_status"] = "500"
        result["html"] = str(exc)
        CoreSDK.Log.error(f"Camoufox run failed: {exc}")
    finally:
        if browser:
            await browser.close()
        CoreSDK.Result.push_data(result)


if __name__ == "__main__":
    asyncio.run(run())
```

## 最佳实践

- 需要 Firefox 兼容远程浏览器后端时使用 Camoufox。
- 页面级逻辑仍然放在 Playwright 的选择器和导航 API 中。
- 为会话创建、浏览器连接和页面跳转设置明确超时时间。
- 在 Worker 代码中使用 `CoreSDK.Parameter` 读取输入、`CoreSDK.Log` 记录进度、`CoreSDK.Result` 输出结果。
- 在 `finally` 中关闭远程浏览器。
- 不要为浏览器页面手动配置 SOCKS5 代理；远程浏览器会处理外网访问。
