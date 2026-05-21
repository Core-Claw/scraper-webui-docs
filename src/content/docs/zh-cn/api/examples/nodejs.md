---
title: Node.js 示例
description: CoreClaw API 集成的完整 Node.js 示例
sidebar:
  order: 2
---

完整的 Node.js 示例，展示如何运行 Worker 并获取结果。

## 环境准备

安装 axios 库：

```bash
npm install axios
```

## 完整示例

```javascript
/**
 * CoreClaw API 示例：运行 Worker 并获取结果
 */
const axios = require("axios");

// API 配置
const API_BASE_URL = "https://openapi.coreclaw.com";
const API_KEY = "YOUR_API_KEY";
const TIMEOUT = 30000;

/**
 * 启动异步 Worker 运行
 */
async function runScraperAsync(params) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/scraper/run`,
            params,
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, runSlug: null, error: `${message} (code: ${code})` };
        }

        return { success: true, runSlug: data.run_slug, error: null };
    } catch (error) {
        if (error.response) {
            return { success: false, runSlug: null, error: `HTTP ${error.response.status}` };
        }
        return { success: false, runSlug: null, error: error.message };
    }
}

/**
 * 获取运行状态
 */
async function getRunStatus(runSlug) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/run/detail`,
            { run_slug: runSlug },
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, status: null, error: message };
        }

        return {
            success: true,
            status: data.status,
            results: data.results || 0,
            duration: data.duration || 0,
            error: null
        };
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}

/**
 * 轮询直到完成（成功或失败）
 * 状态：1=就绪, 2=运行中, 3=成功, 4=失败, 5=中止中
 */
async function pollUntilComplete(runSlug, maxWaitMs = 300000) {
    const terminalStates = [3, 4, 5];
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        const statusResult = await getRunStatus(runSlug);

        if (!statusResult.success) {
            return statusResult;
        }

        const { status } = statusResult;

        if (terminalStates.includes(status)) {
            return statusResult;
        }

        console.log(`状态: ${status} (运行中...)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return { success: false, status: null, error: `超时（${maxWaitMs / 1000}秒）` };
}

/**
 * 获取结果数据
 */
async function getResults(runSlug, pageIndex = 1, pageSize = 20) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/run/result/list`,
            { run_slug: runSlug, page_index: pageIndex, page_size: pageSize },
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                timeout: TIMEOUT
            }
        );

        const { code, message, data } = response.data;

        if (code !== 0) {
            return { success: false, data: null, error: message };
        }

        return {
            success: true,
            count: data.count,
            headers: data.headers,
            list: data.list,
            error: null
        };
    } catch (error) {
        return { success: false, data: null, error: error.message };
    }
}

/**
 * 主函数
 */
async function main() {
    // 构建请求参数（基于 /api/scraper 返回的 schema）
    const requestParams = {
        scraper_slug: "YOUR_SCRAPER_SLUG",
        version: "v1.0.0",  // 从 /api/scraper 获取
        is_async: true,
        input: {
            parameters: {
                system: {
                    cpus: 0.125,
                    memory: 512,
                    execute_limit_time_seconds: 1800,
                    max_total_charge: 0,
                    max_total_traffic: 0
                },
                custom: {
                    // 从 /api/scraper 响应构建
                }
            }
        }
    };

    // 步骤 1：启动 Worker
    console.log("正在启动爬虫...");
    const runResult = await runScraperAsync(requestParams);

    if (!runResult.success) {
        console.log(`启动失败: ${runResult.error}`);
        return;
    }

    const { runSlug } = runResult;
    console.log(`已启动！运行 ID: ${runSlug}`);

    // 步骤 2：轮询状态
    console.log("正在轮询状态...");
    const finalStatus = await pollUntilComplete(runSlug);

    if (!finalStatus.success) {
        console.log(`轮询失败: ${finalStatus.error}`);
        return;
    }

    const { status } = finalStatus;

    if (status === 3) {  // 成功
        console.log(`完成！结果数: ${finalStatus.results}，耗时: ${finalStatus.duration}秒`);

        // 步骤 3：获取结果
        const results = await getResults(runSlug);

        if (results.success) {
            console.log(`获取到 ${results.count} 条记录`);
            // 处理结果...
        } else {
            console.log(`获取结果失败: ${results.error}`);
        }
    } else if (status === 4) {  // 失败
        console.log("运行失败！");
    } else {
        console.log(`运行中止（状态: ${status}）`);
    }
}

// 执行
main().catch(console.error);
```

## 核心函数

| 函数 | 用途 |
|------|------|
| `runScraperAsync()` | 启动异步 Worker 运行 |
| `getRunStatus()` | 获取当前运行状态 |
| `pollUntilComplete()` | 轮询直到终态（成功/失败） |
| `getResults()` | 分页获取结果数据 |

## 状态码

| 代码 | 状态 |
|------|------|
| 1 | 就绪 |
| 2 | 运行中 |
| 3 | 成功 |
| 4 | 失败 |
| 5 | 中止中 |