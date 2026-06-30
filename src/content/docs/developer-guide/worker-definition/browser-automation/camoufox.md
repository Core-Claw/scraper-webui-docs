---
title: Camoufox
description: Connect to the platform-hosted Camoufox browser with Playwright Firefox
sidebar:
  order: 2
---

Camoufox is a platform-hosted Firefox-compatible browser backend. Use it when your Worker needs a Firefox browser environment with platform-managed networking, fingerprinting, and session isolation.

## Positioning

Camoufox is **not** a browser automation framework. It is a platform-hosted browser endpoint.

You still write automation logic with a client library such as Playwright. The difference is that Playwright connects to a Camoufox session instead of launching Firefox locally or connecting to a Chromium CDP endpoint.

## Requirements

Pin Playwright to the supported version in `requirements.txt`:

```txt
playwright==1.49.1
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `CamoufoxDomain` | Platform-injected Camoufox HTTP domain or base URL |
| `PROXY_AUTH` | Platform-injected credentials in `username:password` format |

:::danger[Important]
- Never hardcode `PROXY_AUTH`, run IDs, task IDs, or Camoufox credentials in Worker code.
- Read `CamoufoxDomain` from the runtime environment.
- Pass `PROXY_AUTH` as a Basic `Authorization` header when creating the Camoufox session and when connecting to the returned WebSocket endpoint.
:::

## Endpoint and Authentication Rules

Apply these rules before connecting:

- If `CamoufoxDomain` is a bare domain, normalize it to `http://<domain>`.
- If `CamoufoxDomain` is already a full `http://` or `https://` base URL, use it as provided.
- Create a browser session with `POST /session`.
- The session response contains `wsEndpoint`, which is passed to `playwright.firefox.connect`.
- Authentication uses the HTTP `Authorization` header with the Basic scheme. Build the header from `PROXY_AUTH` in `username:password` format.

## Recommended Playwright Connection

Use this version when `CamoufoxDomain` may be injected as either a bare domain or a full HTTP base URL.

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

## Complete Worker Example with CoreSDK

Use this structure in `main.py` when packaging Camoufox automation as a CoreClaw Worker. The SDK handles input parameters, logs, table headers, and result delivery back to the platform.

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

## Best Practices

- Use Camoufox when a Firefox-compatible remote browser backend is required.
- Keep page-level logic in Playwright selectors and navigation APIs.
- Set explicit timeouts for session creation, browser connection, and page navigation.
- In Worker code, use `CoreSDK.Parameter` for inputs, `CoreSDK.Log` for progress, and `CoreSDK.Result` for output.
- Close the remote browser in a `finally` block.
- Do not configure SOCKS5 proxy manually for browser pages; the remote browser handles outbound access.
