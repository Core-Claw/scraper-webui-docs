---
title: Lightpanda
description: Connect to the platform-hosted Lightpanda browser through CDP
sidebar:
  order: 2
---

Lightpanda is a lightweight browser backend exposed by CoreClaw through the Chrome DevTools Protocol (CDP). Use it when your Worker needs browser-level navigation, JavaScript execution, or page rendering without packaging or launching a browser locally.

## Positioning

Lightpanda is **not** a browser automation framework. It is a platform-hosted browser endpoint.

You still write automation logic with a client library such as Playwright. The difference is that Playwright connects to the Lightpanda CDP endpoint instead of starting a local browser process.

## Environment Variables

| Variable | Description |
| --- | --- |
| `LightpandaDomain` | Platform-injected Lightpanda CDP domain or endpoint |
| `PROXY_AUTH` | Platform-injected credentials in `username:password` format |

:::danger[Important]
- Never hardcode `PROXY_AUTH` or Lightpanda credentials in Worker code.
- Read `LightpandaDomain` from the runtime environment.
- Pass `PROXY_AUTH` as a Basic `Authorization` header when connecting to Lightpanda.
:::

## Endpoint and Authentication Rules

Apply these rules before calling `connect_over_cdp`:

- If `LightpandaDomain` is a bare domain, normalize it to `ws://<domain>/devtools/browser/new`.
- If `LightpandaDomain` is already a full `ws://`, `wss://`, `http://`, or `https://` CDP endpoint, use it as provided.
- Authentication uses the HTTP `Authorization` header with the Basic scheme. Build the header from `PROXY_AUTH` in `username:password` format.

## Recommended Playwright Connection

Use this version when `LightpandaDomain` may be injected as either a bare domain or a full CDP endpoint.

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

## HTTP CDP Endpoint

The recommended helper above already supports full HTTP CDP endpoints. If you know `LightpandaDomain` is always injected as a full HTTP endpoint, this shorter form is equivalent:

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

## Complete Worker Example with CoreSDK

Use this structure in `main.py` when packaging Lightpanda automation as a CoreClaw Worker. The SDK handles input parameters, logs, table headers, and result delivery back to the platform.

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

## Best Practices

- Use Lightpanda for CDP-based browser automation where a lightweight hosted browser is sufficient.
- Keep page-level logic in Playwright selectors and navigation APIs.
- Set explicit timeouts for browser connection and page navigation.
- In Worker code, use `CoreSDK.Parameter` for inputs, `CoreSDK.Log` for progress, and `CoreSDK.Result` for output.
- Close the remote browser in a `finally` block.
- Do not configure SOCKS5 proxy manually for browser pages; the remote browser handles outbound access.
