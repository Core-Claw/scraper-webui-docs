---
title: Python 示例
description: CoreClaw API 集成的完整 Python 示例
sidebar:
  order: 1
---

完整的 Python 示例，展示如何运行 Worker 并获取结果。

## 环境准备

安装 requests 库：

```bash
pip install requests
```

## 完整示例

```python
#!/usr/bin/env python3
"""
CoreClaw API 示例：运行 Worker 并获取结果
"""
import requests
import json
import time
from typing import Dict, Any

# API 配置
API_BASE_URL = "https://openapi.coreclaw.com"
API_KEY = "YOUR_API_KEY"
TIMEOUT = 30

def run_scraper_async(params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    """启动异步 Worker 运行"""
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
        return {"success": False, "run_slug": None, "error": f"超时（{TIMEOUT}秒）"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "run_slug": None, "error": str(e)}
    except json.JSONDecodeError as e:
        return {"success": False, "run_slug": None, "error": f"JSON 错误: {e}"}

def get_run_status(run_slug: str, api_key: str) -> Dict[str, Any]:
    """获取运行状态"""
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
    """轮询直到完成（成功或失败）"""
    # 状态：1=就绪, 2=运行中, 3=成功, 4=失败, 5=中止中
    terminal_states = {3, 4, 5}
    
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        status_result = get_run_status(run_slug, api_key)
        
        if not status_result["success"]:
            return status_result
        
        status = status_result["status"]
        
        if status in terminal_states:
            return status_result
        
        print(f"状态: {status} (运行中...)")
        time.sleep(5)
    
    return {"success": False, "status": None, "error": f"超时（{max_wait}秒）"}

def get_results(run_slug: str, api_key: str, page: int = 1, size: int = 20) -> Dict[str, Any]:
    """获取结果数据"""
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
    # 构建请求参数（基于 /api/scraper 返回的 schema）
    request_params = {
        "scraper_slug": "YOUR_SCRAPER_SLUG",
        "version": "v1.0.0",  # 从 /api/scraper 获取
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
                    # 从 /api/scraper 响应构建
                }
            }
        }
    }
    
    # 步骤 1：启动 Worker
    print("正在启动爬虫...")
    run_result = run_scraper_async(request_params, API_KEY)
    
    if not run_result["success"]:
        print(f"启动失败: {run_result['error']}")
        return
    
    run_slug = run_result["run_slug"]
    print(f"已启动！运行 ID: {run_slug}")
    
    # 步骤 2：轮询状态
    print("正在轮询状态...")
    final_status = poll_until_complete(run_slug, API_KEY)
    
    if not final_status["success"]:
        print(f"轮询失败: {final_status['error']}")
        return
    
    status = final_status["status"]
    
    if status == 3:  # 成功
        print(f"完成！结果数: {final_status['results']}，耗时: {final_status['duration']}秒")
        
        # 步骤 3：获取结果
        results = get_results(run_slug, API_KEY)
        
        if results["success"]:
            print(f"获取到 {results['count']} 条记录")
            # 处理结果...
        else:
            print(f"获取结果失败: {results['error']}")
    
    elif status == 4:  # 失败
        print("运行失败！")
    else:
        print(f"运行中止（状态: {status}）")

if __name__ == "__main__":
    main()
```

## 核心函数

| 函数 | 用途 |
|------|------|
| `run_scraper_async()` | 启动异步 Worker 运行 |
| `get_run_status()` | 获取当前运行状态 |
| `poll_until_complete()` | 轮询直到终态（成功/失败） |
| `get_results()` | 分页获取结果数据 |

## 状态码

| 代码 | 状态 |
|------|------|
| 1 | 就绪 |
| 2 | 运行中 |
| 3 | 成功 |
| 4 | 失败 |
| 5 | 中止中 |