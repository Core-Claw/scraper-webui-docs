---
title: Bypass verification code
description: 验证码绕过
---

## 🚀 CAPTCHA Bypass Service (Fingerprint Browser–Based)

When using our fingerprint browser for data scraping or automation, if the target website triggers a CAPTCHA (such as sliders or human verification), there’s no need to implement complex recognition or simulation logic yourself.

Our platform integrates **automatic CAPTCHA bypassing** and exposes it via **custom CDP commands**. Developers only need to call the specified command in their crawler code to automatically handle CAPTCHA challenges.

✅ No third-party CAPTCHA solving services

✅ No image recognition required

✅ Deeply integrated with the browser environment for higher stability

---

## 🧠 Core Capabilities

- Invoke the platform’s CAPTCHA bypass feature via **CDP (Chrome DevTools Protocol)**
- Supports multiple mainstream CAPTCHA types (Cloudflare / Google / TikTok / Temu / DataDome, etc.)
- **Blocking wait** until the CAPTCHA is completed, with clear success/failure status
- Continue subsequent business logic immediately after CAPTCHA is passed

---

## 📌 Universal Invocation Method

Use the following unified CDP command:

```go
Captchas.automaticSolver
```

### Parameter Description

| Parameter  | Type   | Description                                    |
| ---------- | ------ | ---------------------------------------------- |
| timeout    | number | Maximum wait time for CAPTCHA bypass (seconds) |
| solverType | string | CAPTCHA type (see the mapping table below)     |

## 🧩 Examples by Framework

##### 1️⃣ DrissionPage (Python)

```python
result = page.run_cdp(
    'Captchas.automaticSolver',   # Predefined CAPTCHA bypass command
    timeout=120,                  # Maximum wait time (seconds)
    solverType='tiktok_slide_simple'
)

if result.get("status", False) == True:
    print("Bypass succeeded")
else:
    print("Bypass failed")
```

##### 2️⃣ Playwright (Python)

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
    print("Bypass succeeded")
else:
    print("Bypass failed")
```

##### 3️⃣ Puppeteer (Node.js)

```js
const client = await page.target().createCDPSession()

const result = await client.send('Captchas.automaticSolver', {
    timeout: 120,
    solverType: 'tiktok_slide_simple',
})

if (result.status) {
    console.log('Bypass succeeded')
} else {
    console.log('Bypass failed')
}
```

##### 4️⃣ Selenium (Python)

```python
result = driver.execute_cdp_cmd(
    "Captchas.automaticSolver",
    {
        "timeout": 120,
        "solverType": "tiktok_slide_simple"
    }
)

if result.get("status", False) == True:
    print("Bypass succeeded")
else:
    print("Bypass failed")
```

---

## ✅ CAPTCHA Type Mapping (solverType)

| CAPTCHA Type             | solverType          |
| ------------------------ | ------------------- |
| Cloudflare Turnstile     | cloudflare          |
| Google reCAPTCHA v2      | google-v2           |
| Google reCAPTCHA v3      | google-v3           |
| DataDome Slider CAPTCHA  | datadome            |
| OOCL Rotate Slide        | oocl_slide          |
| Temu (All CAPTCHA Types) | temu_auto           |
| TikTok Slider CAPTCHA    | tiktok_slide_simple |

:::note[Usage Notes]
When status = true, the CAPTCHA has been successfully handled. You can directly proceed with login, data scraping, form submission, or other business logic.

If the request fails, retry or switch to another CAPTCHA type as needed.
:::
