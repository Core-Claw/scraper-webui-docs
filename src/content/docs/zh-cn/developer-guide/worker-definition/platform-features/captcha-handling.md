---
title: 验证码处理
description: 通过 CDP 命令自动绕过验证码
sidebar:
  order: 3
---

## 验证码绕过服务

使用我们的指纹浏览器进行数据采集或自动化时，如果目标网站触发验证码（如滑块或人机验证），无需自行实现复杂的识别或模拟逻辑。

我们的平台集成了**自动验证码绕过**功能，并通过**自定义 CDP 命令**暴露。

### 核心优势

- **无需第三方验证码解决服务**
- **无需图像识别实现**
- **与浏览器环境深度集成，稳定性更高**

## 通用调用方法

使用以下统一的 CDP 命令：

```
Captchas.automaticSolver
```

### 参数

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| timeout | number | 验证码绕过最大等待时间（秒） |
| solverType | string | 验证码类型（见下方映射表） |

## 各框架示例

### DrissionPage (Python)

```python
result = page.run_cdp(
    'Captchas.automaticSolver',
    timeout=120,
    solverType='tiktok_slide_simple'
)

if result.get("status", False) == True:
    print("绕过成功")
else:
    print("绕过失败")
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
    print("绕过成功")
```

### Puppeteer (Node.js)

```javascript
const client = await page.target().createCDPSession()

const result = await client.send('Captchas.automaticSolver', {
    timeout: 120,
    solverType: 'tiktok_slide_simple',
})

if (result.status) {
    console.log('绕过成功')
}
```

## 验证码类型映射

| 验证码类型 | solverType |
| ---------- | ---------- |
| Cloudflare Turnstile | cloudflare |
| Google reCAPTCHA v2 | google-v2 |
| Google reCAPTCHA v3 | google-v3 |
| DataDome 滑块验证码 | datadome |
| Temu（所有验证码类型） | temu_auto |
| TikTok 滑块验证码 | tiktok_slide_simple |

:::note[使用说明]
当 `status = true` 时，验证码已成功处理。您可以直接继续登录、数据采集、表单提交或其他业务逻辑。
:::
