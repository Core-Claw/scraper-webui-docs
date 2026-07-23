---
title: "Python Example"
description: "CoreClaw API v2 integration code example"
sidebar:
  order: 1
---

The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.

`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker's input schema; fields differ by Worker.

The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.

```python
import os
import time

import requests

API_BASE_URL = "https://openapi.coreclaw.com"
API_KEY = os.environ["CORECLAW_API_KEY"]
WORKER_ID = os.environ.get("CORECLAW_WORKER_ID", "YOUR_WORKER_ID")


def coreclaw_request(method, path, *, params=None, json_body=None):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    if json_body is not None:
        headers["Content-Type"] = "application/json"

    response = requests.request(
        method,
        f"{API_BASE_URL}{path}",
        headers=headers,
        params=params,
        json=json_body,
        timeout=60,
    )
    response.raise_for_status()
    payload = response.json()
    if payload.get("code") != 0:
        raise RuntimeError(payload)
    return payload


def wait_for_run(run_id, timeout_seconds=300):
    deadline = time.monotonic() + timeout_seconds
    delay_seconds = 2
    while time.monotonic() < deadline:
        detail = coreclaw_request("GET", f"/api/v2/worker-runs/{run_id}")
        run_data = detail["data"]
        status = run_data.get("status")
        if status == "succeeded":
            return run_data
        if status in {"failed", "aborting"}:
            logs = coreclaw_request("GET", f"/api/v2/worker-runs/{run_id}/log")
            raise RuntimeError({
                "status": status,
                "err_msg": run_data.get("err_msg"),
                "request_id": detail.get("request_id"),
                "logs": logs.get("data"),
            })
        if status not in {"ready", "running"}:
            raise RuntimeError({"unexpected_status": status, "run": run_data})
        time.sleep(delay_seconds)
        delay_seconds = min(delay_seconds * 2, 15)
    raise TimeoutError(f"Timed out waiting for run {run_id}")


account = coreclaw_request("GET", "/api/v2/users/account")
print("Account:", account["data"])

run = coreclaw_request(
    "POST",
    f"/api/v2/workers/{WORKER_ID}/runs",
    json_body={
        # Replace input.parameters.custom with fields from the Worker's input schema.
        "input": {
            "parameters": {
                "custom": {
                    "keywords": ["coffee"],
                    "base_location": "New York,USA",
                    "max_results": 1,
                }
            }
        },
        "is_async": True,
        "offset": 0,
        "limit": 20,
    },
)
run_id = run["data"]["run_slug"]
print("Run ID:", run_id)

completed_run = wait_for_run(run_id)
results = coreclaw_request(
    "GET",
    f"/api/v2/worker-runs/{run_id}/result",
    params={"offset": 0, "limit": 20},
)
print({"status": completed_run["status"], "results": results["data"]})
```
