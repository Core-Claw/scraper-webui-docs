---
title: "Java Example"
description: "CoreClaw API v2 integration code example"
sidebar:
  order: 3
---

The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.

`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker's input schema; fields differ by Worker.

The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.

```java
// Java 11+
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
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
        String results = request("GET", "/api/v2/worker-runs/" + encode(runId) + "/result", Map.of("offset", "0", "limit", "20"), null);
        System.out.println(results);
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
