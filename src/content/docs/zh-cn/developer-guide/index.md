---
title: 开发者指南
description: 构建自定义爬虫并集成 CoreClaw API
---

欢迎来到 CoreClaw 开发者指南。本章节面向希望构建自定义爬虫并通过编程方式集成我们平台的开发者。

## 您可以构建什么

- **自定义爬虫** - 使用 Python 或 JavaScript 构建您自己的爬虫
- **API 集成** - 将 CoreClaw 集成到您的应用程序中
- **框架** - 使用我们的爬虫框架处理复杂项目
- **网页解锁器** - 自动绑过反爬虫措施

<div class="hero-cards">
	<a href="/zh-cn/developer-guide/web-unlocker/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>网页解锁器</h3>
		<p>自动绑过反爬虫措施</p>
	</a>
	<a href="/zh-cn/developer-guide/script/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M92.8 145.6a8 8 0 1 1-9.6 12.8l-32-24a8 8 0 0 1 0-12.8l32-24a8 8 0 1 1 9.6 12.8L69.33 128Zm60-48l-32 80a8 8 0 0 1-14.86-5.94l32-80a8 8 0 0 1 14.86 5.94m42.86 36.8l-32 24a8 8 0 1 1-9.6-12.8L182.67 128L153.6 106.4a8 8 0 1 1 9.6-12.8l32 24a8 8 0 0 1 0 12.8"/></svg>
		</div>
		<h3>脚本开发</h3>
		<p>使用 Python 或 JavaScript 编写自定义爬虫</p>
	</a>
	<a href="/zh-cn/developer-guide/framework/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M48 48h160v160H48Zm112 96a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Z"/></svg>
		</div>
		<h3>数据采集框架</h3>
		<p>使用我们的爬虫框架</p>
	</a>
	<a href="/zh-cn/api/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>API 参考</h3>
		<p>完整的 API 文档和示例</p>
	</a>
</div>

## 快速链接

<div class="quick-links">
	<a href="/zh-cn/developer-guide/web-unlocker/fingerprint-browser/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">指纹浏览器</span>
			<span class="quick-link-desc">配置浏览器指纹以实现隐形爬取</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/developer-guide/web-unlocker/bypass-verification-code/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">绑过验证</span>
			<span class="quick-link-desc">处理验证码和验证代码</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/api/base/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">API 基础</span>
			<span class="quick-link-desc">了解如何使用 CoreClaw API</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
