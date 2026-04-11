---
title: API 参考
description: CoreClaw 完整 API 文档
---

欢迎来到 CoreClaw API 文档。我们的 RESTful API 允许您将网页爬取功能集成到您的应用程序中。

## 快速开始

所有 API 请求都需要使用您的 API 密钥进行身份验证。您可以在[账户设置](/zh-cn/api/account/)中找到您的 API 密钥。

<div class="hero-cards">
	<a href="/zh-cn/api/basic/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>API 基础</h3>
		<p>身份验证、端点和速率限制</p>
	</a>
	<a href="/zh-cn/api/worker/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M48 48h160v160H48Zm112 96a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Z"/></svg>
		</div>
		<h3>Worker API</h3>
		<p>管理和运行爬虫</p>
	</a>
	<a href="/zh-cn/api/run/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>Runs API</h3>
		<p>监控和管理爬虫运行</p>
	</a>
	<a href="/zh-cn/api/task/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>Tasks API</h3>
		<p>调度自动化爬取任务</p>
	</a>
</div>

## 快速链接

<div class="quick-links">
	<a href="/zh-cn/api/basic/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">API 基础 URL</span>
			<span class="quick-link-desc">基础 URL 和身份验证详情</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/api/account/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">账户 API</span>
			<span class="quick-link-desc">管理您的账户和 API 密钥</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/api/basic/proxy/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">代理配置</span>
			<span class="quick-link-desc">为您的爬虫配置代理</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/api/basic/device-configuration/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">设备配置</span>
			<span class="quick-link-desc">配置爬虫的设备设置</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
