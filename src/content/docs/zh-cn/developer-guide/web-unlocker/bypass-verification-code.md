---
title: 验证码绕过服务
description: 验证码绕过
sidebar:
    order: 1
---

## 🚀 验证码绕过服务（依赖指纹浏览器）

在使用我们的**指纹浏览器**进行数据采集或自动化操作时，若目标网站触发验证码（如滑块、人机校验等），无需自行实现复杂的识别与模拟逻辑。

我们的平台集成了 **验证码自动绕过能力**，并通过 **自定义 CDP 命令** 对外开放，开发者只需在爬虫代码中调用指定命令，即可自动完成验证码处理。

✅ 无需打码平台

✅ 无需图像识别

✅ 与浏览器环境深度融合，稳定性更高

---

## 🧠 核心能力说明

- 通过 **CDP（Chrome DevTools Protocol）** 调用平台的验证码绕过功能
- 支持多种主流验证码类型（Cloudflare / Google / TikTok / Temu / Datadome 等）
- 阻塞式等待验证码完成，成功 / 失败状态清晰返回
- 验证码通过后即可继续执行后续业务逻辑

---

## 📌 通用调用方式

统一使用以下 CDP 命令：

```go
Captchas.automaticSolver
```

### 参数说明

| 参数名     | 类型   | 说明                               |
| ---------- | ------ | ---------------------------------- |
| timeout    | number | 验证码绕过最大等待时间（单位：秒） |
| solverType | string | 验证码类型（见下方对照表）         |

## 🧩 各爬虫框架调用示例

##### 1️⃣ DrissionPage 示例（Python）

```python
result = page.run_cdp(
    'Captchas.automaticSolver',   # 使用我们预定义的验证码绕过命令
    timeout=120,                  # 最大等待时间（秒）
    solverType='tiktok_slide_simple'
)

if result.get("status", False) == True:
    print("绕过成功")
else:
    print("绕过失败")
```

##### 2️⃣ Playwright 示例（Python ）

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
    print("绕过失败")
```

##### 3️⃣ Puppeteer 示例（Node.js）

```js
const client = await page.target().createCDPSession()

const result = await client.send('Captchas.automaticSolver', {
    timeout: 120,
    solverType: 'tiktok_slide_simple',
})

if (result.status) {
    console.log('绕过成功')
} else {
    console.log('绕过失败')
}
```

##### 4️⃣ Selenium 示例（Python）

```python
result = driver.execute_cdp_cmd(
    "Captchas.automaticSolver",
    {
        "timeout": 120,
        "solverType": "tiktok_slide_simple"
    }
)

if result.get("status", False) == True:
    print("绕过成功")
else:
    print("绕过失败")
```

---

## ✅ 验证码类型对照表（solverType）

| 验证码类型           | solverType          | 示例                          |
| -------------------- | ------------------- | ----------------------------- |
| Cloudflare Turnstile | cloudflare          | ![Cloudflare Turnstile](@/assets/docs/code_1.jpg) |
| Google reCAPTCHA v2  | google-v2           | ![Google reCAPTCHA v2](@/assets/docs/code_2.jpg) |
| Google reCAPTCHA v3  | google-v3           | ![Google reCAPTCHA v3](@/assets/docs/code_3.jpg) |
| DataDome 滑块验证码  | datadome            | ![DataDome 滑块验证码](@/assets/docs/code_4.jpg) |
| OOCL Rotate Slide    | oocl_slide          | ![OOCL Rotate Slide](@/assets/docs/code_5.jpg) |
| Temu 全系列验证码    | temu_auto           | ![Temu 全系列验证码](@/assets/docs/code_6.jpg) |
| TikTok 滑块验证码    | tiktok_slide_simple | ![TikTok 滑块验证码](@/assets/docs/code_7.jpg) |

:::note[使用说明]
当 `status = true` 时，表示验证码已成功处理，可直接继续执行登录、数据抓取、表单提交等后续业务逻辑；

若返回失败，可根据业务需要选择重试或更换验证码类型。
:::
