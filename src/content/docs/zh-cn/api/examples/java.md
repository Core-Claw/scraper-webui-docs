---
title: Java 示例
description: CoreClaw API 集成的完整 Java 示例
sidebar:
  order: 3
---

完整的 Java 示例，展示如何运行 Worker 并获取结果。

## 环境准备

无需外部依赖。使用 Java 11+ 内置的 `java.net.http` 模块。

## 完整示例

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * CoreClaw API 示例：运行 Worker 并获取结果
 */
public class CoreClawExample {
    // API 配置
    private static final String API_BASE_URL = "https://openapi.coreclaw.com";
    private static final String API_KEY = "YOUR_API_KEY";
    private static final int TIMEOUT = 30;

    private static HttpClient client;

    public static void main(String[] args) {
        // 初始化 HttpClient
        client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(TIMEOUT))
            .build();

        // 构建请求参数
        String requestBody = buildRequestBody();

        // 步骤 1：启动 Worker
        System.out.println("正在启动爬虫...");
        String runSlug = runScraperAsync(requestBody);

        if (runSlug == null) {
            System.out.println("启动爬虫失败");
            return;
        }

        System.out.println("已启动！运行 ID: " + runSlug);

        // 步骤 2：轮询状态
        System.out.println("正在轮询状态...");
        int status = pollUntilComplete(runSlug);

        if (status == -1) {
            System.out.println("轮询失败");
            return;
        }

        // 状态：1=就绪, 2=运行中, 3=成功, 4=失败, 5=中止中
        if (status == 3) {
            System.out.println("成功完成！");

            // 步骤 3：获取结果
            String results = getResults(runSlug);
            if (results != null) {
                System.out.println("结果获取成功");
            } else {
                System.out.println("结果获取失败");
            }
        } else if (status == 4) {
            System.out.println("运行失败！");
        } else {
            System.out.println("运行中止（状态: " + status + "）");
        }
    }

    private static String runScraperAsync(String requestBody) {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE_URL + "/api/v1/scraper/run"))
            .timeout(Duration.ofSeconds(TIMEOUT))
            .header("api-key", API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return null;

            String body = response.body();
            Integer code = extractInt(body, "\"code\":");
            if (code == null || code != 0) return null;

            return extractString(body, "\"run_slug\":\"");
        } catch (IOException | InterruptedException e) {
            return null;
        }
    }

    private static int getRunStatus(String runSlug) {
        String requestBody = "{\"run_slug\":\"" + runSlug + "\"}";
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE_URL + "/api/v1/run/detail"))
            .timeout(Duration.ofSeconds(TIMEOUT))
            .header("api-key", API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return -1;

            Integer status = extractInt(response.body(), "\"status\":");
            return status != null ? status : -1;
        } catch (IOException | InterruptedException e) {
            return -1;
        }
    }

    private static int pollUntilComplete(String runSlug) {
        int[] terminalStates = {3, 4, 5};
        long startTime = System.currentTimeMillis();

        while (System.currentTimeMillis() - startTime < 300000) {
            int status = getRunStatus(runSlug);
            if (status == -1) return -1;

            for (int terminal : terminalStates) {
                if (status == terminal) return status;
            }

            System.out.println("状态: " + status + " (运行中...)");
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                return -1;
            }
        }
        return -1;
    }

    private static String getResults(String runSlug) {
        String requestBody = "{\"run_slug\":\"" + runSlug + "\",\"page_index\":1,\"page_size\":20}";
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE_URL + "/api/v1/run/result/list"))
            .timeout(Duration.ofSeconds(TIMEOUT))
            .header("api-key", API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return null;

            Integer code = extractInt(response.body(), "\"code\":");
            return (code != null && code == 0) ? response.body() : null;
        } catch (IOException | InterruptedException e) {
            return null;
        }
    }

    private static String buildRequestBody() {
        return """
            {
                "scraper_slug": "YOUR_SCRAPER_SLUG",
                "version": "v1.0.0",
                "is_async": true,
                "input": {
                    "parameters": {
                        "system": {
                            "cpus": 0.125,
                            "memory": 512,
                            "execute_limit_time_seconds": 1800,
                            "max_total_charge": 0,
                            "max_total_traffic": 0
                        },
                        "custom": {
                            // 从 /api/scraper 响应构建
                        }
                    }
                }
            }
            """;
    }

    private static String extractString(String json, String key) {
        int startIndex = json.indexOf(key);
        if (startIndex == -1) return null;
        startIndex += key.length();
        int endIndex = json.indexOf("\"", startIndex);
        return endIndex == -1 ? null : json.substring(startIndex, endIndex);
    }

    private static Integer extractInt(String json, String key) {
        int startIndex = json.indexOf(key);
        if (startIndex == -1) return null;
        startIndex += key.length();
        int endIndex = startIndex;
        while (endIndex < json.length() && (Character.isDigit(json.charAt(endIndex)) || json.charAt(endIndex) == '-')) {
            endIndex++;
        }
        return Integer.parseInt(json.substring(startIndex, endIndex));
    }
}
```

## 核心方法

| 方法 | 用途 |
|------|------|
| `runScraperAsync()` | 启动异步 Worker 运行 |
| `getRunStatus()` | 获取当前运行状态 |
| `pollUntilComplete()` | 轮询直到终态（成功/失败） |
| `getResults()` | 获取结果数据 |

## 状态码

| 代码 | 状态 |
|------|------|
| 1 | 就绪 |
| 2 | 运行中 |
| 3 | 成功 |
| 4 | 失败 |
| 5 | 中止中 |

## 下一步

- [返回集成指南](/zh-cn/api/integration/)
- [PHP 示例](/zh-cn/api/examples/php/)