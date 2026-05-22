---
title: Java Example
description: Complete Java example for CoreClaw API integration
sidebar:
  order: 3
---

Complete Java example showing how to run a Worker and retrieve results.

## Prerequisites

No external dependencies required. Uses Java 11+ built-in `java.net.http` module.

## Complete Example

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * CoreClaw API Example: Run a Worker and retrieve results
 */
public class CoreClawExample {
    // API Configuration
    private static final String API_BASE_URL = "https://openapi.coreclaw.com";
    private static final String API_KEY = "YOUR_API_KEY";
    private static final int TIMEOUT = 30;

    private static HttpClient client;

    public static void main(String[] args) {
        // Initialize HttpClient
        client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(TIMEOUT))
            .build();

        // Build request params
        String requestBody = buildRequestBody();

        // Step 1: Start Worker
        System.out.println("Starting scraper...");
        String runSlug = runScraperAsync(requestBody);

        if (runSlug == null) {
            System.out.println("Failed to start scraper");
            return;
        }

        System.out.println("Started! Run ID: " + runSlug);

        // Step 2: Poll status
        System.out.println("Polling status...");
        int status = pollUntilComplete(runSlug);

        if (status == -1) {
            System.out.println("Polling failed");
            return;
        }

        // Status: 1=Ready, 2=Running, 3=Succeeded, 4=Failed, 5=Aborting
        if (status == 3) {
            System.out.println("Completed successfully!");

            // Step 3: Get results
            String results = getResults(runSlug);
            if (results != null) {
                System.out.println("Results fetched successfully");
            } else {
                System.out.println("Failed to fetch results");
            }
        } else if (status == 4) {
            System.out.println("Run failed!");
        } else {
            System.out.println("Run aborted (status: " + status + ")");
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

            System.out.println("Status: " + status + " (Running...)");
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
                "version": "<version>",
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
                            // Build from /api/scraper response
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

## Key Methods

| Method | Purpose |
|--------|---------|
| `runScraperAsync()` | Start an async Worker run |
| `getRunStatus()` | Get current run status |
| `pollUntilComplete()` | Poll until terminal state (success/failure) |
| `getResults()` | Retrieve result data |

## Status Codes

| Code | Status |
|------|--------|
| 1 | Ready |
| 2 | Running |
| 3 | Succeeded |
| 4 | Failed |
| 5 | Aborting |

## Next Steps

- [Back to Integration Guide](/api/integration/)
- [PHP Example](/api/examples/php/)