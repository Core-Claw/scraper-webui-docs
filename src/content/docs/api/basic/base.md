---
title: Overview
description: Base URL, headers, and global status codes for the CoreClaw API.
sidebar:
    order: 1
---

## API Base URL

```
https://openapi.coreclaw.com
```

**Header Parameters**

| Parameter Name | Example Value       | Type   | Required | Description |
| -------------- | ------------------- | ------ | -------- | ----------- |
| api-key        | <YOUR_API_KEY>      | string | Yes      | -           |
| content-type   | application/json    | string | Yes      | -           |

## Global Status Codes

Each API request may return a success code or an error code. You can use these codes to debug requests and identify issues.

The global response codes are as follows:

| CODE  | Description                 |
| ----- | --------------------------- |
| 0     | Success                     |
| 5000  | Internal server error       |
| 4000  | Invalid request parameters  |
| 4010  | Unauthorized access         |
| 4040  | Resource not found          |
| 4290  | Rate limit exceeded         |
| 10001 | User does not exist         |
| 10002 | User is disabled            |
| 20001 | Invalid API key             |
| 20002 | API key expired             |
| 30001 | Insufficient balance        |
| 30002 | Insufficient traffic quota  |
| 50001 | Worker does not exist       |
| 50002 | Worker execution failed     |
| 50003 | Worker version unavailable  |
| 60001 | Task does not exist         |
| 70001 | Run record does not exist   |
| 70002 | Run abort failed            |

