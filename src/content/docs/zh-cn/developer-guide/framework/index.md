---
title: 概述
description: 了解 CoreClaw 支持的数据采集框架，包括 Selenium、Playwright、Puppeteer 和 DrissionPage。
sidebar:
  order: 0
---

# 数据采集框架

CoreClaw 支持多种数据采集框架，以满足不同的爬取需求。每个框架都有其独特的优势，适用于特定的使用场景。

## 可用框架

<div class="quick-links">
	<a href="./why-use-collection-framework/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">为什么使用框架？</span>
			<span class="quick-link-desc">使用采集框架的优势</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="./use-selenium/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Selenium</span>
			<span class="quick-link-desc">经典的浏览器自动化框架</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="./use-playwright/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Playwright</span>
			<span class="quick-link-desc">现代跨浏览器自动化工具</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="./use-puppeteer/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Puppeteer</span>
			<span class="quick-link-desc">Node.js 浏览器控制库</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="./use-drissionpage/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">DrissionPage</span>
			<span class="quick-link-desc">Python 浏览器自动化工具</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>

## 框架对比

| 框架         | 语言    | 速度 | 学习曲线 | 适用场景                   |
| ------------ | ------- | ---- | -------- | -------------------------- |
| Selenium     | 多语言  | 中等 | 低       | 跨浏览器测试、遗留系统     |
| Playwright   | 多语言  | 快   | 中等     | 现代网页应用、跨浏览器测试 |
| Puppeteer    | Node.js | 快   | 低       | Chrome 专精爬取            |
| DrissionPage | Python  | 快   | 低       | Python 自动化              |
