---
title: Node.js 脚本
description: 学习如何编写 Node.js 脚本
---

# Node.js 脚本示例

## GitHub 仓库

[https://github.com/core-claw/NodeScirptDemo](https://github.com/core-claw/NodeScirptDemo)

---

## 必需文件（位于项目根目录）

```
├── main.js
├── package.json
├── input_schema.json
├── README.md
├── sdk.js
├── sdk_pb.js
├── sdk_grpc_pb.js
```

| 文件名              | 说明                                                     |
| :------------------ | :------------------------------------------------------- |
| `main.js`           | 脚本入口文件（执行入口点），必须命名为 `main`             |
| `package.json`      | Node.js 依赖管理文件                                     |
| `input_schema.json` | UI 输入表单配置                                          |
| `README.md`         | 项目文档                                                 |
| `sdk.js`            | SDK 核心功能                                             |
| `sdk_pb.js`         | 数据处理增强模块                                         |
| `sdk_grpc_pb.js`    | 网络通信模块                                             |

---

# 核心 SDK 文件

## 文件概览

以下三个 SDK 文件是必需的，必须放置在脚本的**根目录**中：

| **文件名**       | **主要功能**           |
| :--------------- | :--------------------- |
| `sdk.js`         | 核心功能模块            |
| `sdk_pb.js`      | 数据处理增强模块        |
| `sdk_grpc_pb.js` | 网络通信模块            |

这三个文件共同构成脚本的**工具箱**，提供爬虫执行和与平台后端交互所需的所有核心能力。

---

## 核心功能使用指南

### 1. 环境参数——获取脚本启动配置

脚本启动时，可从外部传入配置参数（如目标网站 URL 或搜索关键词）。

使用以下方法获取：

```javascript
// 获取所有输入参数
const inputJson = await coresdk.parameter.getInputJSONObject()
await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)
```

**使用场景：**
如果不同任务需要采集不同网站，只需传入不同参数，无需修改脚本代码。

---

### 2. 运行日志——追踪脚本执行

执行过程中，可以记录不同级别的日志。这些日志将在平台控制台中展示，便于监控执行状态和排查问题：

```javascript
// 调试日志（最详细，用于排查问题）
coresdk.log.debug("正在连接目标网站...")

// 信息日志（正常执行流程）
coresdk.log.info("成功获取 10 条新闻")

// 警告日志（非关键问题）
coresdk.log.warn("网络连接缓慢，可能影响性能")

// 错误日志（执行失败）
coresdk.log.error("无法访问目标网站，请检查网络连接")
```

**日志级别说明：**

* **debug**：详细调试信息，开发期间推荐
* **info**：正常执行流程日志
* **warn**：表示潜在问题但不阻止执行的警告
* **error**：需要关注的错误

---

### 3. 结果提交——将采集数据回传到平台

数据采集完成后，必须通过两步将结果返回平台。

---

### 第一步：定义表头（必填）

在推送任何数据之前，需要定义表结构——类似于在 Excel 中定义列标题：

```javascript
// 定义表格列
const headers = [
    {
        label: 'URL',
        key: 'url',
        format: 'text'
    },
    {
        label: '状态',
        key: 'status',
        format: 'text'
    }
]

// 设置表头
await coresdk.result.setTableHeader(headers)
```

**字段说明：**

* **label**：显示给用户的列名（用户可见）
* **key**：代码中使用的唯一标识符
* **format**：数据类型，支持的值：
  * `"text"` – 字符串
  * `"integer"` – 整数
  * `"boolean"` – 布尔值
  * `"array"` – 列表/数组
  * `"object"` – 对象/字典

---

### 第二步：逐行推送数据

设置表头后，逐条推送采集到的数据：

```javascript
// 模拟业务结果
const result = {
    status: 'success',
    data: [
        {
            title: '示例标题',
            content: '示例内容'
        }
    ]
}

// 推送结果数据
await coresdk.log.info(`处理结果: ${JSON.stringify(result)}`)
const dataObject = result.data

for (let index = 0; index < dataObject.length; index++) {
    await coresdk.result.pushData(dataObject[index])
}
```

**注意事项：**

1. 设置表头和推送数据的顺序无关
2. 推送数据中的键必须与表头中定义的键完全匹配
3. 数据必须**逐条推送**
4. 建议每次推送后记录日志以便追踪

---

### 常见问题与注意事项

1. **文件位置**：确保三个 SDK 文件都放置在脚本的**根目录**
2. **导入**：可以在代码中直接使用 `SDK` 或 `CoreSDK`
3. **键一致性**：数据键必须与表头键完全匹配（区分大小写）
4. **错误处理**：始终检查 SDK 调用结果，特别是推送数据时

借助这些功能，你的脚本可以与平台后端无缝集成，实现灵活的参数配置、透明的执行监控和标准化的数据输出。

---

# 脚本入口文件（`main.js`）

## 示例代码

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. 获取输入参数
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)

        // 2. 获取代理配置（从环境变量读取，支持灵活部署）
        const proxyDomain = process.env.PROXY_DOMAIN || 'proxy-inner.coreclaw.com:6000'
        await coresdk.log.info(`代理域名: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`代理认证: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`获取代理认证失败: ${err.message}`)
            proxyAuth = null
        }

        // 3. 构建代理 URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`代理 URL: ${proxyUrl}`)

        // 4. 业务逻辑处理
        const url = inputJson?.url
        await coresdk.log.info(`开始处理 URL: ${url}`)

        // 模拟业务结果
        const result = {
            url,
            status: 'success',
            data: [
                {
                    title: '示例标题',
                    content: '示例内容'
                }
            ]
        }

        // 5. 推送结果数据
        await coresdk.log.info(`处理结果: ${JSON.stringify(result)}`)
        const dataObject = result.data
        for (let index = 0; index < dataObject.length; index++) {
            await coresdk.result.pushData(dataObject[index])
        }

        // 6. 设置表头
        const headers = [
            {
                label: 'URL',
                key: 'url',
                format: 'text'
            },
            {
                label: '状态',
                key: 'status',
                format: 'text'
            }
        ]

        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('脚本执行完成')
    } catch (err) {
        await coresdk.log.error(`脚本执行错误: ${err.message}`)

        const errorResult = {
            error: err.message,
            error_code: '500',
            status: 'failed'
        }

        await coresdk.result.pushData(errorResult)
        throw err
    }
}

run()
```

---

# 自动化数据采集脚本：工作流与原理

## 1. 脚本概览

这是一个自动化工具的脚本，充当**数字员工**。
它自动打开指定网页（如社交媒体网站），提取所需信息，并将其整理为结构化表格。

---

## 2. 工作原理

整个过程可简化为四个主要阶段：

---

### 步骤一：接收指令（输入参数）

执行前，你提供指令，如：

* 目标页面 URL
* 要采集的记录数量

---

### 步骤二：隐身准备（代理网络配置）

为可靠访问海外或受限网站，脚本自动配置安全代理通道。

---

### 步骤三：自动执行（业务逻辑处理）

这是核心阶段，脚本在此：

* 访问目标页面
* 提取标题、内容、图片等所需数据

---

### 步骤四：结果上报（数据推送与表格生成）

采集完成后：

* 原始数据转换为标准化格式
* 结果保存到系统
* 自动生成表头（如"URL"、"内容"）
