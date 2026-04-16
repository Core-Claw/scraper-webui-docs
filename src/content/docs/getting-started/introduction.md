---
title: Introduction
description: Learn about CoreClaw features and capabilities
sidebar:
  order: 0
---

## What is CoreClaw?

CoreClaw is a cloud-based web scraping platform designed to make data extraction accessible to everyone. Whether you're a business user needing data without coding, or a developer building sophisticated scrapers, CoreClaw provides the tools you need.

## Key Features

### No-Code Scraping

- **200+ Pre-built Templates**: Ready-to-use scrapers for popular websites
- **Simple Configuration**: Just input your parameters and run
- **No Infrastructure**: Everything runs in the cloud

### Developer-Friendly

- **Multiple Frameworks**: Support for DrissionPage, Playwright, Puppeteer, and Selenium
- **Full API Access**: RESTful API for integration
- **SDK Support**: JavaScript and Python SDKs

### Enterprise-Ready

- **Web Unlocker**: Bypass anti-scraping measures automatically
- **Proxy Network**: Global rotating proxy pools
- **High Availability**: 99.9% uptime guarantee

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CoreClaw Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Web UI     │    │   API        │    │   SDKs       │  │
│  │   Portal     │    │   Gateway    │    │   (JS/Py)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│          │                   │                   │          │
│          └───────────────────┼───────────────────┘          │
│                              │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Execution Engine                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  Worker    │  │   Task     │  │   Run      │     │  │
│  │  │  Runtime   │  │  Scheduler │  │  Manager   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Infrastructure                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Proxy    │  │   Web      │  │   Data     │     │  │
│  │  │   Network  │  │   Unlocker │  │   Storage  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Use Cases

### E-commerce Data

- Product pricing and availability
- Competitor monitoring
- Review analysis

### Lead Generation

- Business directory scraping
- Contact information extraction
- Social media data

### Market Research

- Industry trends analysis
- News aggregation
- Financial data collection

## Next Steps

- [Quick Start Guide](/getting-started/quick-start/) - Get started in 5 minutes
- [Core Concepts](/getting-started/core-concepts/) - Understand the fundamentals
- [User Guide](/user-guide/) - Learn how to use CoreClaw
