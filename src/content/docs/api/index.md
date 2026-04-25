---
title: API Overview
description: Complete API documentation for CoreClaw
sidebar:
  order: 0
---

Welcome to the CoreClaw API documentation. Our RESTful API allows you to integrate web scraping capabilities into your applications.

## Getting Started

All API requests require authentication using your API key. You can find your API key in your [account settings](/api/account/info/).

<div class="hero-cards">
	<a href="/api/basic/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>API Basics</h3>
		<p>Authentication, endpoints, and rate limits</p>
	</a>
	<a href="/api/worker/run/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M48 48h160v160H48Zm112 96a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Zm0-32a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16Z"/></svg>
		</div>
		<h3>Worker API</h3>
		<p>Manage and run Workers</p>
	</a>
	<a href="/api/run/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>Runs API</h3>
		<p>Monitor and manage Worker runs</p>
	</a>
	<a href="/api/task/run/" class="hero-card">
		<div class="hero-card-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H84a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"/></svg>
		</div>
		<h3>Tasks API</h3>
		<p>Schedule automated scraping tasks</p>
	</a>
</div>

## Quick Links

<div class="quick-links">
	<a href="/api/basic/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">API Base URL</span>
			<span class="quick-link-desc">Base URL and authentication details</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/api/account/info/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Account API</span>
			<span class="quick-link-desc">Manage your account and API keys</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/api/basic/proxy/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Proxy Configuration</span>
			<span class="quick-link-desc">Configure proxies for your Workers</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<a href="/api/basic/device-configuration/" class="quick-link">
		<div class="quick-link-content">
			<span class="quick-link-title">Device Configuration</span>
			<span class="quick-link-desc">Configure device settings for Workers</span>
		</div>
		<svg class="quick-link-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
</div>
