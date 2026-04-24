---
title: Developer Guide
description: Build custom Workers and integrate with CoreClaw API
sidebar:
  order: 0
---

Welcome to the CoreClaw Developer Guide. This section is for developers who want to build custom Workers and integrate with our platform programmatically.

## What You Can Build

- **Custom Workers** - Build your own Workers using Python or JavaScript
- **API Integrations** - Integrate CoreClaw into your applications
- **Frameworks** - Use our scraping frameworks for complex projects
- **Web Unlocker** - Bypass anti-scraping measures automatically

<div class="hero-cards">
	<a href="/developer-guide/web-unlocker/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>Web Unlocker</h3>
		<p>Bypass anti-scraping measures automatically</p>
	</a>
	<a href="/developer-guide/worker/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M92.8 145.6a8 8 0 1 1-9.6 12.8l-32-24a8 8 0 0 1 0-12.8l32-24a8 8 0 1 1 9.6 12.8L69.33 128Zm60-48l-32 80a8 8 0 0 1-14.86-5.94l32-80a8 8 0 0 1 14.86 5.94m42.86 36.8l-32 24a8 8 0 1 1-9.6-12.8L182.67 128L153.6 106.4a8 8 0 1 1 9.6-12.8l32 24a8 8 0 0 1 0 12.8"/></svg>
		</div>
		<h3>Script Development</h3>
		<p>Write custom Workers in Python or JavaScript</p>
	</a>
	<a href="/developer-guide/framework/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M48 48h160v160H48Zm112 96a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Z"/></svg>
		</div>
		<h3>Frameworks</h3>
		<p>Use our scraping frameworks</p>
	</a>
	<a href="/api/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>API Reference</h3>
		<p>Full API documentation and examples</p>
	</a>
</div>

## Quick Links

<div class="quick-links">
	<a href="/developer-guide/web-unlocker/fingerprint-browser/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Fingerprint Browser</span>
			<span class="quick-link-desc">Configure browser fingerprints for stealth scraping</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/developer-guide/web-unlocker/bypass-verification-code/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Bypass Verification</span>
			<span class="quick-link-desc">Handle CAPTCHAs and verification codes</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/api/basic/base/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">API Basics</span>
			<span class="quick-link-desc">Learn how to use the CoreClaw API</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
