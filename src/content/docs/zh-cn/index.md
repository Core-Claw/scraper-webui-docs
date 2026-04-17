---
title: '文档'
description: CoreClaw 致力于为不同背景和技术能力的用户提供高效、稳定、可扩展的数据采集解决方案。
template: splash
---

<div class="breadcrumb-home">
	<a href="https://coreclaw.com" class="breadcrumb-home-link">首页</a>
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
	<span class="breadcrumb-home-current">文档中心</span>
</div>

<div class="hero-section">
	<h1 class="hero-title">CoreClaw <span class="hero-title-accent">文档中心</span></h1>
	<p class="hero-subtitle">无论你是初次使用还是深度开发，文档中心为你提供完整指引。</p>
	<div class="hero-actions">
		<a href="/zh-cn/getting-started/quick-start/" class="hero-btn hero-btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
			浏览文档
		</a>
		<a href="https://console.coreclaw.com/" class="hero-btn hero-btn-secondary" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
			控制台
		</a>
	</div>
</div>

<style>
	.breadcrumb-home {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 16px;
		color: #94a3b8;
		width: 100%;
		max-width: var(--sl-content-width);
		margin: 0 auto;
		padding: 12px 24px 0;
		box-sizing: border-box;
	}
	.breadcrumb-home-link {
		color: #94a3b8;
		text-decoration: none;
	}
	.breadcrumb-home-link:hover {
		color: #0f4c81;
	}
	.breadcrumb-home-current {
		color: #475569;
		font-weight: 500;
	}
	.hero-section {
		text-align: center;
		padding: 48px 24px 40px;
		margin-bottom: 0;
	}
	.hero-title {
		font-size: 36px;
		font-weight: 700;
		margin: 0 0 16px;
		color: #0f172a;
		line-height: 1.1;
	}
	.hero-title-accent {
		background: linear-gradient(135deg, #0f4c81, #1aa6a3);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.hero-subtitle {
		font-size: 15px;
		color: #94a3b8;
		max-width: 520px;
		margin: 0 auto 32px;
		line-height: 1.7;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 28px;
		border-radius: 12px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		font-size: 15px;
	}
	.hero-btn-primary {
		background: linear-gradient(135deg, #0f4c81, #1aa6a3);
		color: #fff !important;
		box-shadow: 0 4px 14px rgba(15,76,129,.25);
	}
	.hero-btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(15,76,129,.3);
		color: #fff !important;
	}
	.hero-btn-secondary {
		background: #fff;
		color: #0f4c81;
		border: 2px solid #0f4c81;
	}
	.hero-btn-secondary:hover {
		background: #f0f9ff;
		transform: translateY(-2px);
	}
	:global(:root[data-theme='dark']) .breadcrumb-home-link {
		color: #94a3b8;
	}
	:global(:root[data-theme='dark']) .breadcrumb-home-current {
		color: #e2e8f0;
	}
	:global(:root[data-theme='dark']) .hero-title {
		color: #e2e8f0;
	}
	:global(:root[data-theme='dark']) .hero-subtitle {
		color: #94a3b8;
	}
	:global(:root[data-theme='dark']) .hero-btn-secondary {
		background: transparent;
		border-color: #0f4c81;
		color: #0f4c81;
	}
	:global(:root[data-theme='dark']) .hero-btn-secondary:hover {
		background: rgba(15,76,129,0.1);
	}
	@media (max-width: 50rem) {
		.hero-title { font-size: 1.75rem; }
		.hero-subtitle { font-size: 1rem; }
		.hero-actions { flex-direction: column; align-items: center; }
		.hero-btn { width: 100%; max-width: 280px; justify-content: center; }
	}
</style>

<div class="nav-grid">
	<a href="/zh-cn/getting-started/quick-start/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #f59e0b">新手必读</span>
		</div>
		<h3 class="nav-card-title">快速上手 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">5 分钟完成注册、配置到首次数据采集的完整流程</p>
	</a>
	<a href="/zh-cn/getting-started/core-concepts/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #6366f1">入门</span>
		</div>
		<h3 class="nav-card-title">核心概念 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">理解 Worker、任务、调度、数据流等平台基础架构</p>
	</a>
	<a href="/zh-cn/api/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #0f4c81">开发</span>
		</div>
		<h3 class="nav-card-title">API 参考 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">完整的 RESTful API 端点、参数说明与调用示例</p>
	</a>
	<a href="/zh-cn/developer-guide/worker/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #1aa6a3">进阶</span>
		</div>
		<h3 class="nav-card-title">Worker 开发 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">从脚手架到发布：创建、调试、部署自定义 Worker</p>
	</a>
	<a href="/zh-cn/developer-guide/web-unlocker/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="3" y="3" rx="1"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #8b5cf6">集成</span>
		</div>
		<h3 class="nav-card-title">集成与插件 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Webhook、SDK、第三方工具对接与自动化工作流</p>
	</a>
	<a href="/zh-cn/developer-guide/framework/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
			</div>
			<span class="nav-card-tag" style="--tag-color: #ef4444">实战</span>
		</div>
		<h3 class="nav-card-title">最佳实践 <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">反爬策略、代理轮换、速率控制等生产级经验总结</p>
	</a>
</div>

<div class="updates-grid">
	<div class="updates-panel">
		<div class="updates-panel-header">
			<h2 class="updates-panel-title">热门文档</h2>
			<a href="/zh-cn/developer-guide/web-unlocker/" class="updates-panel-link">查看全部 →</a>
		</div>
		<div class="updates-list">
			<a href="/zh-cn/developer-guide/web-unlocker/overview/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #6366f1"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">网页解锁器</div>
					<div class="updates-item-desc">指纹浏览器、SOCKS5 代理、验证码绕过，内置免费使用</div>
				</div>
			</a>
			<a href="/zh-cn/developer-guide/worker/what-is-worker/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #10b981"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">什么是 Worker？</div>
					<div class="updates-item-desc">无服务器架构的云端采集程序，JSON 标准化输入输出</div>
				</div>
			</a>
			<a href="/zh-cn/developer-guide/framework/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #f59e0b"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">数据采集框架</div>
					<div class="updates-item-desc">Selenium · Playwright · Puppeteer · DrissionPage 四大框架接入指南</div>
				</div>
			</a>
			<a href="/zh-cn/api/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #3b82f6"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">CoreClaw API</div>
					<div class="updates-item-desc">完整的 Worker / Run / Task / Account RESTful 接口文档</div>
				</div>
			</a>
		</div>
	</div>
	<div class="updates-panel">
		<div class="updates-panel-header">
			<h2 class="updates-panel-title">最近更新</h2>
			<a href="/zh-cn/changelog/" class="updates-panel-link">查看完整日志 →</a>
		</div>
		<div class="updates-list">
			<a href="/zh-cn/partnership-promotion/data-bounty-earnings/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #10b981"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">上线数据悬赏计划</div>
					<div class="updates-item-desc">发布数据需求，开发者认领完成即可获得悬赏奖励</div>
				</div>
				<span class="updates-item-date">2026-02-02</span>
			</a>
			<a href="/zh-cn/developer-guide/worker/worker-directory/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #3b82f6"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">上线 Worker 版本更新</div>
					<div class="updates-item-desc">模板支持版本管理与一键更新到最新版</div>
				</div>
				<span class="updates-item-date">2025-12-01</span>
			</a>
		</div>
		<div class="updates-hint">💡 文档持续更新中</div>
	</div>
</div>

<h2 class="help-section-title">帮助与社区</h2>

<div class="help-grid">
	<a href="/zh-cn/faq/" class="help-card">
		<div class="help-card-icon" style="--help-bg: #fef3c7">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
		</div>
		<div class="help-card-title">常见问题</div>
		<div class="help-card-desc">快速找到高频问题的解答</div>
	</a>
	<a href="https://coreclaw.com/blog" class="help-card" target="_blank">
		<div class="help-card-icon" style="--help-bg: #dcfce7">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
		</div>
		<div class="help-card-title">博客文章</div>
		<div class="help-card-desc">深度教程与行业实践分享</div>
	</a>
	<a href="https://github.com/Core-Claw" class="help-card" target="_blank">
		<div class="help-card-icon" style="--help-bg: #f3e8ff">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
		</div>
		<div class="help-card-title">GitHub</div>
		<div class="help-card-desc">提交 Issue 或参与开源贡献</div>
	</a>
	<a href="mailto:support@coreclaw.com" class="help-card">
		<div class="help-card-icon" style="--help-bg: #dbeafe">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>
		</div>
		<div class="help-card-title">联系我们</div>
		<div class="help-card-desc">邮箱：support@coreclaw.com</div>
	</a>
</div>

<div class="company-footer">
	<div class="company-name">Apex DataWorks Limited</div>
	<div class="company-address">UNIT 9, 1/F, THE CLOUD, 111 TUNG CHAU STREET, TAI KOK TSUI, KOWLOON, HONG KONG</div>
</div>
