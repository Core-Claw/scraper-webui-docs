---
title: Account Info
description: Get the account information
sidebar:
    order: 10
---

**Method:** `GET`

**Endpoint:** `/api/v1/account/info`

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "balance": "10122.5547",
        "traffic": 178194757135,
        "traffic_expires_at": 1775267018
    }
}
```

#### Response Fields

| Parameter          | Example Value | Type    | Description                                    |
| ------------------ | ------------- | ------- | ---------------------------------------------- |
| code               | 0             | Integer | [View help](/api/#global-status-codes)         |
| message            | success       | String  | Response message                               |
| data               | -             | Object  | Response payload                               |
| └─ balance         | 10122.5547    | String  | Account balance ($)                            |
| └─ traffic         | 178194757135  | Integer | Traffic quota in bytes                         |
| └─ traffic_expires_at | 1775267018 | Integer | Traffic expiration time (timestamp, seconds)   |
