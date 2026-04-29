---
title: Node.js 示例
description: 使用 Node.js 构建 Worker
sidebar:
  order: 2
---

学习如何使用 Node.js 构建 Worker。

## GitHub 仓库

Node.js 脚本示例仓库：
[NodeScirptDemo](https://github.com/core-claw/NodeScirptDemo)

---

## 项目结构

```
├── main.js              # 主入口文件
├── package.json         # 依赖
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
├── README.md            # 文档
├── sdk.js               # CoreClaw SDK - 核心功能模块
├── sdk_pb.js            # 数据处理增强模块
└── sdk_grpc_pb.js       # 网络通信模块
```

这三个 SDK 文件（`sdk.js`、`sdk_pb.js`、`sdk_grpc_pb.js`）是必需的，必须放置在项目的**根目录**中。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

---

## 脚本入口文件（main.js）

### 示例

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
        const proxyDomain = process.env.PROXY_DOMAIN
        await coresdk.log.info(`代理域名: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`代理认证信息: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`获取代理认证信息失败: ${err.message}`)
            proxyAuth = null
        }

        // 3. 拼接代理 URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`代理地址: ${proxyUrl}`)

        // 4. 业务逻辑处理
        const url = inputJson?.url
        await coresdk.log.info(`开始处理URL: ${url}`)

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

        // 6. 设置表格表头
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
        await coresdk.log.error(`脚本执行异常: ${err.message}`)

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

## 依赖管理（package.json）

此文件声明了运行脚本所需的所有 Node.js 依赖。系统会自动安装此文件中指定的所有依赖。

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

- **@grpc/grpc-js** 和 **google-protobuf** 必须包含（SDK 所需）
- 所有第三方库必须列出
- 核心依赖应使用固定版本
