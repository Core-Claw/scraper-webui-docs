---
title: "Java 示例"
description: "CoreClaw API v2 集成代码示例"
sidebar:
  order: 3
---

下面示例覆盖认证检查、启动 Worker、用返回的 `run_slug` 查询结果三步。

示例中的 `YOUR_WORKER_ID` 是占位符。请替换为要运行的 Worker slug，或把 `owner/name` 路径写成 `owner~name`。`input` 必须按该 Worker 的输入 schema 构造；不同 Worker 的字段不一定相同。

默认使用 `is_async: true` 异步提交并轮询结果。如需等待执行完成，把 `is_async` 改为 `false`，并用 `offset` / `limit` 控制同步返回的数据窗口。

```java
// Java 11+
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CoreClawExample {
    static final String API_BASE_URL = "https://openapi.coreclaw.com";
    static final String API_KEY = System.getenv("CORECLAW_API_KEY");
    static final String WORKER_ID = System.getenv().getOrDefault("CORECLAW_WORKER_ID", "YOUR_WORKER_ID");
    static final HttpClient HTTP = HttpClient.newHttpClient();

    public static void main(String[] args) throws Exception {
        if (API_KEY == null || API_KEY.isBlank()) throw new IllegalStateException("Set CORECLAW_API_KEY first.");

        String account = request("GET", "/api/v2/users/account", null, null);
        System.out.println(account);

        String runBody = "{"
            + "\"input\":{\"parameters\":{\"custom\":{"
            + "\"keywords\":[\"coffee\"],"
            + "\"base_location\":\"New York,USA\","
            + "\"max_results\":1"
            + "}}},"
            + "\"is_async\":true,"
            + "\"offset\":0,"
            + "\"limit\":20"
            + "}";
        String run = request("POST", "/api/v2/workers/" + encode(WORKER_ID) + "/runs", null, runBody);
        System.out.println(run);

        String runId = extract(run, "\\\"run_slug\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");
        String completedRun = waitForRun(runId, 300_000);
        String results = request("GET", "/api/v2/worker-runs/" + encode(runId) + "/result", Map.of("offset", "0", "limit", "20"), null);
        System.out.println("status=" + extract(completedRun, "\"status\"\s*:\s*\"([^\"]+)\"") + " results=" + results);
    }

    static String waitForRun(String runId, long timeoutMs) throws Exception {
        long deadline = System.currentTimeMillis() + timeoutMs;
        long delayMs = 2_000;
        while (System.currentTimeMillis() < deadline) {
            String detail = request("GET", "/api/v2/worker-runs/" + encode(runId), null, null);
            String status = extract(detail, "\"status\"\s*:\s*\"([^\"]+)\"");
            if (status.equals("succeeded")) return detail;
            if (Set.of("failed", "aborting").contains(status)) {
                String logs = request("GET", "/api/v2/worker-runs/" + encode(runId) + "/log", null, null);
                throw new IllegalStateException("run status=" + status + " logs=" + logs);
            }
            if (!Set.of("ready", "running").contains(status)) {
                throw new IllegalStateException("Unexpected run status: " + status);
            }
            Thread.sleep(delayMs);
            delayMs = Math.min(delayMs * 2, 15_000);
        }
        throw new IllegalStateException("Timed out waiting for run " + runId);
    }

    static String request(String method, String path, Map<String, String> query, String body) throws Exception {
        URI uri = URI.create(API_BASE_URL + path + queryString(query));
        HttpRequest.Builder builder = HttpRequest.newBuilder(uri)
            .header("Authorization", "Bearer " + API_KEY)
            .method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body));
        if (body != null) builder.header("Content-Type", "application/json");
        HttpResponse<String> response = HTTP.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode() + ": " + response.body());
        }
        return response.body();
    }

    static String queryString(Map<String, String> query) {
        if (query == null || query.isEmpty()) return "";
        return "?" + query.entrySet().stream()
            .map(e -> encode(e.getKey()) + "=" + encode(e.getValue()))
            .reduce((a, b) -> a + "&" + b)
            .orElse("");
    }

    static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    static String extract(String text, String regex) {
        Matcher matcher = Pattern.compile(regex).matcher(text);
        if (!matcher.find()) throw new IllegalStateException("run_slug not found in response: " + text);
        return matcher.group(1);
    }
}
```
