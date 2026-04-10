---
title: Welcome to CoreClaw Documentation
description: CoreClaw is dedicated to providing efficient, stable, and scalable data acquisition solutions for users with diverse backgrounds and technical capabilities.
template: splash
---

<div class="hero-section">
	<h1 class="hero-title">CoreClaw Documentation</h1>
	<p class="hero-subtitle">Learn how to put the web to work with CoreClaw. Extract data from any website, automate workflows, and scale your data operations.</p>
	<div class="hero-actions">
		<a href="/getting-started/quick-start/" class="hero-btn hero-btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
			Get Started
		</a>
		<a href="/getting-started/core-concepts/" class="hero-btn hero-btn-secondary">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
			Learn More
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

## Get Started

<div class="quick-links">
	<a href="/getting-started/quick-start/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Quick Start</span>
			<span class="quick-link-desc">Get up and running in minutes</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/getting-started/core-concepts/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Core Concepts</span>
			<span class="quick-link-desc">Understand the fundamentals</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/user-guide/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">User Guide</span>
			<span class="quick-link-desc">Learn how to use effectively</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/developer-guide/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Developer Guide</span>
			<span class="quick-link-desc">Build your own Workers</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>

---

## Key Features

<div class="hero-cards">
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
		</div>
		<h3>No-Code Templates</h3>
		<p>200+ ready-to-use templates for popular sites</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
		</div>
		<h3>Developer SDK</h3>
		<p>Build custom Workers with powerful API</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
		</div>
		<h3>Web Unlocker</h3>
		<p>Bypass anti-scraping measures automatically</p>
	</div>
	<div class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
		</div>
		<h3>Structured Data</h3>
		<p>Export clean, formatted data instantly</p>
	</div>
</div>

---

## Who Is This For?

### Enterprise & Business Users

For teams that need reliable data without building technical infrastructure:

- **No-Code Template Scraping** — Start immediately without coding
- **Custom Data Requirements** — Post your needs, we'll handle the rest
- **Full-Process Management** — From extraction to delivery
- **Enterprise Security** — Compliance and privacy assurance

### Developers & Technical Users

For those who want full control over their data pipelines:

- **Powerful API** — RESTful API with comprehensive documentation
- **Custom Scripts** — Write your own Workers in Python or JavaScript
- **Framework Integration** — Use our SDKs and frameworks
- **Pay-As-You-Go** — Only pay for what you use

---

## Need Help?

<div class="quick-links">
	<a href="/faq/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">FAQ</span>
			<span class="quick-link-desc">Find answers to common questions</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="https://github.com/Cafe-Worker" class="quick-link" target="_blank">
		<div class="quick-link-content">
			<span class="quick-link-title">GitHub Community</span>
			<span class="quick-link-desc">Join our open-source community</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
