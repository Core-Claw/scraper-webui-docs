---
title: CAPTCHA Handling
description: Automatically bypass CAPTCHAs via CDP commands
sidebar:
  order: 3
---

## CAPTCHA Bypass Service

When using our fingerprint browser for data collection or automation, if the target website triggers a CAPTCHA (such as slider or human verification), you don't need to implement complex recognition or simulation logic yourself.

Our platform integrates an **automatic CAPTCHA bypass** feature, exposed through **custom CDP commands**.

### Key Advantages

- **No third-party CAPTCHA solving service required**
- **No image recognition implementation needed**
- **Deep integration with browser environment for higher stability**

## Universal Calling Method

Use the following unified CDP command:

```
Captchas.automaticSolver
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| timeout | number | Maximum wait time for CAPTCHA bypass (seconds) |
| solverType | string | CAPTCHA type (see mapping table below) |

### Return Value Handling

`Captchas.automaticSolver` does not guarantee success. The command may return `status=false`, or a message such as `target page don't have verify code` when the target page has no detectable verification code.

Always branch on the returned `status` before continuing. Treat non-success responses according to your page state and business flow instead of assuming that the CAPTCHA was solved.

## Framework Examples

### DrissionPage (Python)

```python
result = page.run_cdp(
    'Captchas.automaticSolver',
    timeout=120,
    solverType='tiktok_slide_simple'
)

if result.get("status", False) == True:
    print("Bypass successful")
else:
    print(f"Bypass not completed: {result}")
```

### Playwright (Python)

```python
cdp_session = await page.context.new_cdp_session(page)

result = await cdp_session.send(
    "Captchas.automaticSolver",
    {
        "timeout": 120,
        "solverType": "tiktok_slide_simple"
    }
)

if result.get("status", False):
    print("Bypass successful")
else:
    print(f"Bypass not completed: {result}")
```

### Puppeteer (Node.js)

```javascript
const client = await page.target().createCDPSession()

const result = await client.send('Captchas.automaticSolver', {
    timeout: 120,
    solverType: 'tiktok_slide_simple',
})

if (result.status) {
    console.log('Bypass successful')
} else {
    console.log('Bypass not completed:', result)
}
```

## CAPTCHA Type Mapping

| CAPTCHA Type | solverType |
|--------------|------------|
| Cloudflare Click CAPTCHA | cloudflare |
| DataDome Slider CAPTCHA | datadome |
| Google reCAPTCHA v2 | google-v2 |
| Google reCAPTCHA v3 | google-v3 |
| OOCL Slider CAPTCHA | oocl_slide |
| PerimeterX Press-and-Hold CAPTCHA | perimeterx |
| SHEIN Image Recognition Click CAPTCHA | shein_same_object_click |
| Temu (all CAPTCHA types) | temu_auto |
| TikTok Slider CAPTCHA | tiktok_slide_simple |
| TikTok Double-Spiral Slider CAPTCHA | tiktok_slide_auto |

:::note[Usage]
When `status = true`, the CAPTCHA has been successfully handled. If `status = false` or the response says `target page don't have verify code`, check the current page state and handle that branch explicitly before continuing with login, data collection, form submission, or other business logic.
:::
