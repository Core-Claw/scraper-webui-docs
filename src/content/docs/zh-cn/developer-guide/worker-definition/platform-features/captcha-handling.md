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

### 返回值处理

`Captchas.automaticSolver` 不保证一定成功。该命令可能返回 `status=false`，也可能在目标页面没有可识别验证码时返回类似 `target page don't have verify code` 的信息。

调用方必须先根据返回的 `status` 分支处理，再决定是否继续后续流程。不要只假设验证码已经绕过成功；非成功返回应结合当前页面状态和业务逻辑处理。

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
    print(f"绕过未完成: {result}")
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
else:
    print(f"绕过未完成: {result}")
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
} else {
    console.log('绕过未完成:', result)
}
```

## 验证码类型映射

| 验证码类型 | solverType |
| ---------- | ---------- |
| Cloudflare 点击验证码 | cloudflare |
| DataDome 滑块验证码 | datadome |
| Google reCAPTCHA v2 | google-v2 |
| Google reCAPTCHA v3 | google-v3 |
| OOCL 滑块验证码 | oocl_slide |
| PerimeterX 按压验证码 | perimeterx |
| SHEIN 图像识别点击验证码 | shein_same_object_click |
| Temu（所有验证码类型） | temu_auto |
| TikTok 缺口滑块验证码 | tiktok_slide_simple |
| TikTok 双螺旋滑块验证码 | tiktok_slide_auto |

:::note[使用说明]
当 `status = true` 时，验证码已成功处理。如果 `status = false`，或返回信息为 `target page don't have verify code`，需要先检查当前页面状态并显式处理该分支，再继续登录、数据采集、表单提交或其他业务逻辑。
:::
