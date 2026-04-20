---
title: Account Info
description: Get the account information
sidebar:
    order: 10
---

**Request Method:** `POST`

**Request URL:** `/api/v1/account/info`

Send the request body with **Content-Type: application/json**.

## Header Request Example

```json
{
    "api-key": "<YOUR_API_KEY>"
}
```

#### Parameter Description

| Parameter | Example Value | Type   | Required | Description |
| --------- | ------------- | ------ | -------- | ----------- |
| api-key   | -             | String | Yes      | API key     |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "balance": "10122.5547",
        "traffic": 178194757135,
        "traffic_expiration_at": 1775267018
    }
}
```

#### Parameter Description

| Parameter                | Example Value | Type    | Description                                  |
| ------------------------ | ------------- | ------- | -------------------------------------------- |
| code                     | 0             | Integer | [View help](/api/basic/base/#global-status-codes) |
| message                  | success       | String  | Error description                            |
| data                     | -             | Object  | -                                            |
| └─ balance               | 10122.5547    | String  | Account balance ($)                          |
| └─ traffic               | 178194757135  | Integer | Consumed traffic (bytes)                     |
| └─ traffic_expiration_at | 1775267018    | Integer | Traffic expiration time (timestamp, seconds) |
