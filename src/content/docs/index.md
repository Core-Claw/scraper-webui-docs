---
title: 'Documentation'
description: CoreClaw is dedicated to providing efficient, stable, and scalable data acquisition solutions for users with diverse backgrounds and technical capabilities.
template: splash
---

<div class="breadcrumb-home">
	<a href="https://coreclaw.com" class="breadcrumb-home-link">Home</a>
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
	<span class="breadcrumb-home-current">Documentation Center</span>
</div>

<div class="hero-section">
	<h2 class="hero-title">CoreClaw <span class="hero-title-accent">Documentation</span></h2>
	<p class="hero-subtitle">Whether you're getting started or building advanced solutions, our documentation provides complete guidance.</p>
	<div class="hero-actions">
		<a href="/getting-started/quick-start/" class="hero-btn hero-btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
			Browse Docs
		</a>
		<a href="https://console.coreclaw.com/" class="hero-btn hero-btn-secondary" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
			Console
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
	<a href="/getting-started/quick-start/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #f59e0b">Beginner</span>
		</div>
		<h3 class="nav-card-title">Quick Start <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Complete registration, configuration, and first data collection in 5 minutes</p>
	</a>
	<a href="/getting-started/core-concepts/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #6366f1">Basics</span>
		</div>
		<h3 class="nav-card-title">Core Concepts <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Understand Workers, tasks, scheduling, data flow, and platform architecture</p>
	</a>
	<a href="/api/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #0f4c81">Dev</span>
		</div>
		<h3 class="nav-card-title">API Reference <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Complete RESTful API endpoints, parameters, and usage examples</p>
	</a>
	<a href="/developer-guide/worker/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #1aa6a3">Advanced</span>
		</div>
		<h3 class="nav-card-title">Worker Development <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">From scaffolding to publishing: create, debug, and deploy custom Workers</p>
	</a>
	<a href="/developer-guide/web-unlocker/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="3" y="3" rx="1"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #8b5cf6">Integration</span>
		</div>
		<h3 class="nav-card-title">Integrations & Plugins <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Webhook, SDK, third-party tool integration, and automation workflows</p>
	</a>
	<a href="/developer-guide/framework/" class="nav-card">
		<div class="nav-card-header">
			<div class="nav-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></div>
			<span class="nav-card-tag" style="--tag-color: #ef4444">Practice</span>
		</div>
		<h3 class="nav-card-title">Best Practices <span class="nav-card-arrow">→</span></h3>
		<p class="nav-card-desc">Anti-scraping strategies, proxy rotation, rate limiting, and production tips</p>
	</a>
</div>

<div class="updates-grid">
	<div class="updates-panel">
		<div class="updates-panel-header">
			<h2 class="updates-panel-title">Popular Docs</h2>
			<a href="/developer-guide/web-unlocker/" class="updates-panel-link">View all →</a>
		</div>
		<div class="updates-list">
			<a href="/developer-guide/web-unlocker/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #6366f1"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">Web Unlocker</div>
					<div class="updates-item-desc">Fingerprint browser, SOCKS5 proxy, CAPTCHA bypass — built-in and free</div>
				</div>
			</a>
			<a href="/developer-guide/worker/what-is-worker/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #10b981"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">What is a Worker?</div>
					<div class="updates-item-desc">Serverless cloud scraping programs with JSON-standardized I/O</div>
				</div>
			</a>
			<a href="/developer-guide/framework/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #f59e0b"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">Data Collection Framework</div>
					<div class="updates-item-desc">Selenium · Playwright · Puppeteer · DrissionPage integration guides</div>
				</div>
			</a>
			<a href="/api/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #3b82f6"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">CoreClaw API</div>
					<div class="updates-item-desc">Complete Worker / Run / Task / Account RESTful API documentation</div>
				</div>
			</a>
		</div>
	</div>
	<div class="updates-panel">
		<div class="updates-panel-header">
			<h2 class="updates-panel-title">Recent Updates</h2>
			<a href="/changelog/" class="updates-panel-link">Full changelog →</a>
		</div>
		<div class="updates-list">
			<a href="/website-events/invitation-event/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #8b5cf6"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">Invitation Program Launched</div>
					<div class="updates-item-desc">Invite friends to register and earn rewards through the new invitation campaign</div>
				</div>
				<span class="updates-item-date">2025-04-16</span>
			</a>
			<a href="/developer-guide/worker/worker-directory/" class="updates-item">
				<span class="updates-dot" style="--dot-color: #3b82f6"></span>
				<div class="updates-item-content">
					<div class="updates-item-title">Worker Version Update Launched</div>
					<div class="updates-item-desc">Template version management and one-click update to latest</div>
				</div>
				<span class="updates-item-date">2025-12-01</span>
			</a>
		</div>
		<div class="updates-hint">💡 Documentation is continuously updated</div>
	</div>
</div>

<h2 class="help-section-title">Help & Community</h2>

<div class="help-grid">
	<a href="/faq/" class="help-card">
		<div class="help-card-icon" style="--help-bg: #fef3c7">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
		</div>
		<div class="help-card-title">FAQ</div>
		<div class="help-card-desc">Quick answers to common questions</div>
	</a>
	<a href="https://coreclaw.com/blog" class="help-card" target="_blank">
		<div class="help-card-icon" style="--help-bg: #dcfce7">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
		</div>
		<div class="help-card-title">Blog</div>
		<div class="help-card-desc">In-depth tutorials and industry insights</div>
	</a>
	<a href="https://github.com/Core-Claw" class="help-card" target="_blank">
		<div class="help-card-icon" style="--help-bg: #f3e8ff">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
		</div>
		<div class="help-card-title">GitHub</div>
		<div class="help-card-desc">Submit issues or contribute to open source</div>
	</a>
	<a href="mailto:support@coreclaw.com" class="help-card">
		<div class="help-card-icon" style="--help-bg: #dbeafe">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>
		</div>
		<div class="help-card-title">Contact Us</div>
		<div class="help-card-desc">Email: support@coreclaw.com</div>
	</a>
</div>

<div class="company-footer">
	<div class="company-name">Apex DataWorks Limited</div>
	<div class="company-address">UNIT 9, 1/F, THE CLOUD, 111 TUNG CHAU STREET, TAI KOK TSUI, KOWLOON, HONG KONG</div>
</div>
