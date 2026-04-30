---
title: Node.js 示例
description: 使用 Node.js 构建 Worker
sidebar:
  order: 2
---

学习如何使用 Node.js 构建 Worker。

## GitHub 仓库

Node.js 脚本示例仓库：
[NodeScirptDemo](https://github.com/Core-Claw/NodeScirptDemo)

---

## 必需文件（项目根目录）

```text
├── main.js              # 脚本入口文件
├── package.json         # Node.js 依赖
├── input_schema.json    # 输入表单配置
├── output_schema.json   # 输出表格配置
├── sdk.js               # CoreClaw SDK - 核心功能
├── sdk_pb.js            # 数据处理模块
└── sdk_grpc_pb.js       # 网络通信模块
```

### 文件概览

| 文件 | 说明 |
| ---- | ---- |
| **main.js** | 脚本入口文件（执行入口），必须命名为 `main` |
| **package.json** | Node.js 依赖管理文件 |
| **input_schema.json** | UI 输入表单配置文件 |
| **output_schema.json** | 输出表格结构配置文件 |
| **sdk.js** | 核心 SDK 功能 |
| **sdk_pb.js** | 增强数据处理模块 |
| **sdk_grpc_pb.js** | 网络通信模块 |

这三个 SDK 文件（`sdk.js`、`sdk_pb.js`、`sdk_grpc_pb.js`）是必需的，必须放置在项目的**根目录**中。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

---

## 核心 SDK 使用说明

CoreClaw SDK（`coresdk`）提供每个 Worker 都需要的三大核心能力：

### 1. 环境参数获取 — 获取脚本启动时的配置信息

当 Worker 启动时，平台会传入一些配置参数（比如要采集的网站地址、搜索关键词等）。使用以下方法获取这些参数：

```javascript
const coresdk = require('./sdk')

// 获取所有传入的参数，以 JSON 对象形式返回
const inputJson = await coresdk.parameter.getInputJSONObject()

// 示例：获取特定参数
const url = inputJson?.url
```

**使用场景**：通过传入不同的参数来采集不同网站的数据，无需修改代码。

### 2. 运行日志 — 记录脚本执行过程

脚本执行过程中，可以记录不同级别的日志信息。这些日志会显示在控制台界面，方便查看执行状态和问题排查：

```javascript
// 调试信息（最详细，用于问题排查）
await coresdk.log.debug("正在连接目标网站...")

// 一般信息（正常流程记录）
await coresdk.log.info("成功获取10条数据")

// 警告信息（需要注意但非错误的情况）
await coresdk.log.warn("网络连接较慢，可能影响采集速度")

// 错误信息（执行出错时使用）
await coresdk.log.error("无法访问目标网站")
```

**日志级别说明**：
- **debug** — 最详细的调试信息，适合开发时使用
- **info** — 正常的流程记录，推荐在关键步骤使用
- **warn** — 警告信息，表示可能有问题但程序还能运行
- **error** — 错误信息，表示出现了需要关注的问题

### 3. 结果返回 — 将采集的数据发送回平台

脚本采集到数据后，需要通过以下两个步骤将数据返回给平台：

#### 第一步：设置表格表头

在推送具体数据之前，先定义数据的表格结构，就像 Excel 中先定义列标题一样：

```javascript
const headers = [
    { label: "标题", key: "title", format: "text" },
    { label: "链接", key: "url", format: "text" },
    { label: "分类", key: "category", format: "text" },
]
await coresdk.result.setTableHeader(headers)
```

**字段说明**：
- **label** — 表格中显示的列标题（用户可见）
- **key** — 数据的唯一标识符（代码中使用，需与 pushData 中的 key 一致）
- **format** — 数据类型：`"text"`、`"integer"`、`"boolean"`、`"array"`、`"object"`

#### 第二步：逐条推送数据

设置好表头后，开始推送采集到的数据：

```javascript
for (const item of collectedData) {
    const obj = {
        title: item.title,
        url: item.url,
        category: item.category,
    }
    await coresdk.result.pushData(obj)
}
```

**重要提醒**：
- 设置表头与推送数据的顺序可以颠倒
- 推送数据时，对象中的 key 必须与表头中定义的 key 完全一致
- 数据需要**逐条推送**，不能一次性推送多条
- 建议在每次推送后记录日志，方便跟踪执行进度

---

## 脚本入口文件（main.js）

### 完整示例

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. 获取输入参数
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)

        // 2. 代理配置（从环境变量读取）
        const proxyAuth = process.env.PROXY_AUTH || null
        await coresdk.log.info(`代理认证信息: ${proxyAuth}`)

        // 3. 业务逻辑
        const url = inputJson?.url
        await coresdk.log.info(`正在处理 URL: ${url}`)

        const result = {
            url,
            status: 'success',
        }

        // 4. 推送结果数据
        await coresdk.result.pushData(result)

        // 5. 设置表格表头
        const headers = [
            { label: 'URL', key: 'url', format: 'text' },
            { label: '状态', key: 'status', format: 'text' },
        ]
        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('脚本执行完成')
    } catch (err) {
        await coresdk.log.error(`执行错误: ${err.message}`)

        await coresdk.result.pushData({
            error: err.message,
            error_code: '500',
            status: 'failed',
        })
        throw err
    }
}

run()
```

### 工作原理

脚本遵循四个阶段：

1. **接收指令** — 从平台获取输入参数（URL、关键词等）
2. **网络配置** — 通过 `PROXY_AUTH` 环境变量配置代理，访问外部网站
3. **执行任务** — 在目标页面上运行核心采集逻辑
4. **上报结果** — 将采集数据推送回平台并设置表格表头

---

## Node.js 依赖管理（package.json）

此文件声明了运行脚本所需的所有 Node.js 依赖。平台会自动安装此文件中指定的所有依赖。

### 示例

```json
{
    "name": "node",
    "version": "1.0.0",
    "main": "main.js",
    "type": "commonjs",
    "dependencies": {
        "@grpc/grpc-js": "^1.13.4",
        "google-protobuf": "^4.0.0"
    }
}
```

### 注意事项

#### 必需依赖

- **@grpc/grpc-js** 和 **google-protobuf** 是必需的（SDK 所需）
- 所有第三方库必须列在 `dependencies` 中

#### 版本管理

- 核心依赖使用固定版本（如 `"1.13.4"`）以确保稳定性
- 兼容更新可使用脱字符范围（如 `"^1.13.4"`）

#### 安装说明

- 依赖由平台自动安装
- `type` 字段应设置为 `"commonjs"`（SDK 使用 CommonJS 模块）
- `main` 字段必须指向入口文件（`main.js`）

---

## 常见问题

**问：为什么必须使用 CommonJS？**
答：CoreClaw SDK 使用 CommonJS（`require`）模块格式。如果使用 ES 模块（`import`），SDK 将无法正确加载。

**问：如何添加新依赖？**
答：在 `package.json` 的 `dependencies` 中添加包，然后重新上传 ZIP 包，平台会在下次运行时自动安装。

**问：安装失败怎么办？**
答：检查包名和版本是否正确，确认网络连接正常或尝试其他版本。