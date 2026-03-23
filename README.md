# CafeScraper Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

CafeScraper 官方文档网站，基于 [Astro](https://astro.build) 和 [Starlight](https://starlight.astro.build) 构建。

## 🚀 项目结构

```
.
├── public/
│   └── favicon.jpg
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── Header.astro
│   │   ├── MobileMenuFooter.astro
│   │   ├── TableOfContents.astro
│   │   └── TableOfContentsList.astro
│   ├── content/
│   │   └── docs/
│   │       ├── getting-started/
│   │       ├── user-guide/
│   │       ├── developer-guide/
│   │       ├── api/
│   │       ├── zh-cn/          # 中文文档
│   │       └── ...
│   └── styles/
│       └── common.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🧞 命令

| 命令 | 说明 |
|:------------------------|:-----------------------------------------------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务器 `localhost:4321` |
| `npm run build` | 构建生产版本到 `./dist/` |
| `npm run preview` | 本地预览构建结果 |

## 🌐 多语言支持

- **English** (默认) - `/`
- **简体中文** - `/zh-cn/`

## 📚 文档结构

- **About CafeScraper** - 产品介绍
- **Getting Started** - 快速入门指南
- **User Guide** - 用户使用指南
- **Developer Guide** - 开发者指南
- **API** - API 文档
- **Partnership & Promotion** - 推广合作
- **Platform Policies** - 平台政策
- **FAQ** - 常见问题

## 👀 了解更多

- [Starlight 文档](https://starlight.astro.build/)
- [Astro 文档](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)
