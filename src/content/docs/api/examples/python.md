---
title: Python Example
description: Complete Python example for CoreClaw API integration
sidebar:
  order: 1
---

Complete Python example showing how to run a Worker and retrieve results.

## Prerequisites

Install the requests library:

```bash
pip install requests
```

## Complete Example

```python
#!/usr/bin/env python3
"""
CoreClaw API Example: Run a Worker and retrieve results
"""
import requests
import json
import time
from typing import Dict, Any

# API Configuration
API_BASE_URL = "https://openapi.coreclaw.com"
API_KEY = "YOUR_API_KEY"
TIMEOUT = 30

def run_scraper_async(params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    """Start an async Worker run"""
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/v1/scraper/run",
            headers=headers,
            json=params,
            timeout=TIMEOUT
        )
        
        if response.status_code != 200:
            return {
                "success": False,
                "run_slug": None,
                "error": f"HTTP {response.status_code}: {response.text}"
            }
        
        result = response.json()
        
        if result.get("code") != 0:
            return {
                "success": False,
                "run_slug": None,
                "error": f"{result.get('message')} (code: {result.get('code')})"
            }
        
        return {
            "success": True,
            "run_slug": result["data"]["run_slug"],
            "error": None
        }
        
    except requests.exceptions.Timeout:
        return {"success": False, "run_slug": None, "error": f"Timeout after {TIMEOUT}s"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "run_slug": None, "error": str(e)}
    except json.JSONDecodeError as e:
        return {"success": False, "run_slug": None, "error": f"JSON error: {e}"}

def get_run_status(run_slug: str, api_key: str) -> Dict[str, Any]:
    """Get run status"""
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/v1/run/detail",
            headers=headers,
            json={"run_slug": run_slug},
            timeout=TIMEOUT
        )
        
        if response.status_code != 200:
            return {"success": False, "status": None, "error": f"HTTP {response.status_code}"}
        
        result = response.json()
        
        if result.get("code") != 0:
            return {"success": False, "status": None, "error": result.get("message")}
        
        data = result["data"]
        return {
            "success": True,
            "status": data["status"],
            "results": data.get("results", 0),
            "duration": data.get("duration", 0),
            "usage": data.get("usage", "0"),
            "error": None
        }
        
    except Exception as e:
        return {"success": False, "status": None, "error": str(e)}

def poll_until_complete(run_slug: str, api_key: str, max_wait: int = 300) -> Dict[str, Any]:
    """Poll until complete (success or failure)"""
    # Status: 1=Ready, 2=Running, 3=Succeeded, 4=Failed, 5=Aborting
    terminal_states = {3, 4, 5}
    
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        status_result = get_run_status(run_slug, api_key)
        
        if not status_result["success"]:
            return status_result
        
        status = status_result["status"]
        
        if status in terminal_states:
            return status_result
        
        print(f"Status: {status} (Running...)")
        time.sleep(5)
    
    return {"success": False, "status": None, "error": f"Timeout after {max_wait}s"}

def get_results(run_slug: str, api_key: str, page: int = 1, size: int = 20) -> Dict[str, Any]:
    """Get result data"""
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/v1/run/result/list",
            headers=headers,
            json={"run_slug": run_slug, "page_index": page, "page_size": size},
            timeout=TIMEOUT
        )
        
        if response.status_code != 200:
            return {"success": False, "data": None, "error": f"HTTP {response.status_code}"}
        
        result = response.json()
        
        if result.get("code") != 0:
            return {"success": False, "data": None, "error": result.get("message")}
        
        return {
            "success": True,
            "count": result["data"]["count"],
            "headers": result["data"]["headers"],
            "list": result["data"]["list"],
            "error": None
        }
        
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}

def main():
    # Build request params (based on /api/scraper schema)
    request_params = {
        "scraper_slug": "YOUR_SCRAPER_SLUG",
        "version": "<version>",  # Get from /api/scraper
        "is_async": True,
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
                    # Build from /api/scraper response
                }
            }
        }
    }
    
    # Step 1: Start Worker
    print("Starting scraper...")
    run_result = run_scraper_async(request_params, API_KEY)
    
    if not run_result["success"]:
        print(f"Failed to start: {run_result['error']}")
        return
    
    run_slug = run_result["run_slug"]
    print(f"Started! Run ID: {run_slug}")
    
    # Step 2: Poll status
    print("Polling status...")
    final_status = poll_until_complete(run_slug, API_KEY)
    
    if not final_status["success"]:
        print(f"Polling failed: {final_status['error']}")
        return
    
    status = final_status["status"]
    
    if status == 3:  # Succeeded
        print(f"Completed! Results: {final_status['results']}, Duration: {final_status['duration']}s")
        
        # Step 3: Get results
        results = get_results(run_slug, API_KEY)
        
        if results["success"]:
            print(f"Got {results['count']} records")
            # Process results...
        else:
            print(f"Failed to get results: {results['error']}")
    
    elif status == 4:  # Failed
        print("Run failed!")
    else:
        print(f"Run aborted (status: {status})")

if __name__ == "__main__":
    main()
```

## Key Functions

| Function | Purpose |
|----------|---------|
| `run_scraper_async()` | Start an async Worker run |
| `get_run_status()` | Get current run status |
| `poll_until_complete()` | Poll until terminal state (success/failure) |
| `get_results()` | Retrieve result data with pagination |

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
- [Node.js Example](/api/examples/nodejs/)