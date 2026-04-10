---
title: 欢迎来到 CoreClaw 文档中心
description: CoreClaw 致力于为不同背景和技术能力的用户提供高效、稳定、可扩展的数据采集解决方案。
template: splash
---

<div class="hero-section">
	<h1 class="hero-title">CoreClaw 文档中心</h1>
	<p class="hero-subtitle">学习如何使用 CoreClaw 让网页数据为您工作。从任意网站提取数据、自动化工作流程、扩展您的数据运营能力。</p>
	<div class="hero-actions">
		<a href="/zh-cn/getting-started/quick-start/" class="hero-btn hero-btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
			快速开始
		</a>
		<a href="/zh-cn/getting-started/core-concepts/" class="hero-btn hero-btn-secondary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
			了解更多
		</a>
	</div>
</div>

<style>
	.hero-section {
		text-align: center;
		padding: 3rem 1rem;
		margin-bottom: 2rem;
		background: linear-gradient(135deg, hsla(var(--cafe-primary-hsl), 0.06) 0%, hsla(var(--cafe-secondary-hsl), 0.04) 100%);
		border-radius: var(--cafe-radius);
		border: 1px solid hsla(var(--cafe-primary-hsl), 0.1);
	}
	
	.hero-title {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem;
		background: linear-gradient(135deg, var(--cafe-gradient-1), var(--cafe-gradient-2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 1.2;
	}
	
	.hero-subtitle {
		font-size: 1.125rem;
		color: var(--sl-color-gray-2);
		max-width: 600px;
		margin: 0 auto 1.5rem;
		line-height: 1.6;
	}
	
	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	
	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: var(--cafe-radius);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		font-size: 0.9375rem;
	}
	
	.hero-btn-primary {
		background: linear-gradient(135deg, var(--cafe-gradient-1), var(--cafe-gradient-2));
		color: white !important;
		box-shadow: 0 4px 12px hsla(var(--cafe-primary-hsl), 0.3);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}
	
	.hero-btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px hsla(var(--cafe-primary-hsl), 0.4);
		color: white !important;
	}
	
	.hero-btn-secondary {
		background: transparent;
		color: hsl(var(--cafe-primary-hsl));
		border: 1px solid hsla(var(--cafe-primary-hsl), 0.3);
	}
	
	.hero-btn-secondary:hover {
		background: hsla(var(--cafe-primary-hsl), 0.08);
		border-color: hsl(var(--cafe-primary-hsl));
	}
	
	:global(:root[data-theme='dark']) .hero-section {
		background: linear-gradient(135deg, hsla(var(--cafe-primary-hsl), 0.1) 0%, hsla(var(--cafe-secondary-hsl), 0.06) 100%);
		border-color: hsla(var(--cafe-primary-hsl), 0.15);
	}
	
	:global(:root[data-theme='dark']) .hero-subtitle {
		color: var(--sl-color-gray-3);
	}
	
	@media (max-width: 50rem) {
		.hero-title {
			font-size: 1.75rem;
		}
		
		.hero-subtitle {
			font-size: 1rem;
		}
		
		.hero-actions {
			flex-direction: column;
			align-items: center;
		}
		
		.hero-btn {
			width: 100%;
			max-width: 280px;
			justify-content: center;
		}
	}
</style>

---

## 快速开始

<div class="quick-links">
	<a href="/zh-cn/getting-started/quick-start/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">快速开始</span>
			<span class="quick-link-desc">5分钟快速上手</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/getting-started/core-concepts/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">核心概念</span>
			<span class="quick-link-desc">理解基础概念</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/user-guide/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">用户指南</span>
			<span class="quick-link-desc">学习如何使用</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/zh-cn/developer-guide/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">开发者指南</span>
			<span class="quick-link-desc">构建爬虫</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>

---

## 核心功能

<div class="hero-cards">
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
		</div>
		<h3>无代码模板</h3>
		<p>200+ 即开即用的热门网站模板</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
		</div>
		<h3>开发者 SDK</h3>
		<p>使用强大的 API 构建自定义爬虫</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
		</div>
		<h3>网页解锁器</h3>
		<p>自动绑过反爬虫措施</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
		</div>
		<h3>结构化数据</h3>
		<p>即时导出整洁、格式化的数据</p>
	</div>
</div>

---

## 适用人群

### 企业与商业用户

适合需要可靠数据但不想搭建技术基础设施的团队：

- **无代码模板抓取** — 无需编程即可立即开始
- **定制数据需求** — 发布您的需求，我们负责处理
- **全流程管理** — 从提取到交付
- **企业级安全** — 合规与隐私保障

### 开发者与技术用户

适合希望完全控制数据管道的用户：

- **强大的 API** — 文档完善的 RESTful API
- **自定义脚本** — 使用 Python 或 JavaScript 编写爬虫
- **框架集成** — 使用我们的 SDK 和框架
- **按需付费** — 只为实际使用付费

---

## 需要帮助？

<div class="quick-links">
	<a href="/zh-cn/faq/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">常见问题</span>
			<span class="quick-link-desc">查找常见问题的解答</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="https://github.com/Cafe-scraper" class="quick-link" target="_blank">
		<div class="quick-link-content">
			<span class="quick-link-title">GitHub 社区</span>
			<span class="quick-link-desc">加入我们的开源社区</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
