---
title: What is a Scraper?
description: Learn what a scraper is and how it works in CafeScraper
---

import Icon from '@/components/Icon.astro'

## <Icon name="puzzle" /> What is a Scraper?

A **Scraper** is an automated script designed to extract data from websites. In CafeScraper, scrapers are the core components that enable users to collect structured data from various online sources.

#### Core Features

- **High Flexibility**：Powered by state persistence and restart mechanisms, Script have extremely elastic execution lifecycles. They can scale smoothly from a few seconds to several hours, and even support long-running tasks when needed.
- **Standardized Interface**：An Script is essentially an encapsulated executable unit. It receives instructions (**input**) in a standard **JSON** format and produces structured **JSON** results (**output**) after execution.

---

#### Automated Data Collection Script: Workflow Overview

This script acts as an efficient **“digital worker”**, capable of simulating human browsing behavior to automatically visit target websites (such as social media platforms or e-commerce sites), extract key information, and organize it into structured reports.

#### Core Execution Stages

The entire automation process can be divided into the following four key steps:

##### Step 1: Receive Instructions (Input Parameters)

Before launching the script, you provide it with specific instructions—such as the target page URL and the number of records you want to collect.

##### Step 2: Stealth Preparation (Proxy Network / Fingerprint Browser)

To ensure smooth access to websites with access restrictions, the script automatically configures a secure and anonymized connection.

Developers do not need to manually set up proxies or browser fingerprint environments. The platform centrally manages network egress and environment isolation, ensuring stable and compliant execution.

##### Step 3: Automated Execution (Business Logic Processing)

This is the core of the script. Based on the provided URLs, it automatically navigates to the target pages and extracts relevant information such as titles, content, and image URLs.

##### Step 4: Result Reporting (Data Submission & Table Generation)

Once data collection is complete, the script converts unstructured information into standardized formats and stores it in the system.
It also automatically generates well-structured table headers for easy data analysis and export.

## ⭐ Code example

| 类型    | 地址                                            |
| ------- | ----------------------------------------------- |
| Python  | https://github.com/CafeScraper/PythonScirptDemo |
| Go      | https://github.com/CafeScraper/GoScirptDemo     |
| Node.js | https://github.com/CafeScraper/NodeScirptDemo   |
