# CoreClaw Documentation

CoreClaw 官方文档仓库，使用 [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) 构建，提供英文与简体中文两套文档内容。

本仓库承载了 CoreClaw 文档站点的内容、导航配置、首页引导、组件定制与样式主题，适用于本地开发、内容维护、版本发布与静态构建部署。

英文版仓库说明见 [`README.md`](./README.md)。

## 项目概览

- 文档框架：Astro + Starlight
- UI 扩展：自定义 Header、Banner、目录组件、移动端页脚等
- 多语言：
  - English（默认）
  - 简体中文（`/zh-cn/`）
- 内容类型：
  - Getting Started
  - User Guide
  - Developer Guide
  - API Reference
  - Website Events
  - Platform Policies
  - FAQ
  - Changelog

## 技术栈

- [Astro](https://astro.build/)
- [Starlight](https://starlight.astro.build/)
- [React](https://react.dev/)（用于部分扩展能力）
- `starlight-image-zoom`
- `sharp`

## 仓库结构

```text
.
├── public/                         # 静态资源（直接原样输出）
├── src/
│   ├── assets/                     # 构建期资源（图片、logo 等）
│   │   ├── docs/
│   │   └── logo.png
│   ├── components/                 # Starlight 自定义组件
│   │   ├── Banner.astro
│   │   ├── Header.astro
│   │   ├── MobileMenuFooter.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   └── docs/                   # 文档内容根目录
│   │       ├── about-coreclaw/
│   │       ├── api/
│   │       ├── developer-guide/
│   │       ├── faq/
│   │       ├── getting-started/
│   │       ├── platform-policies/
│   │       ├── user-guide/
│   │       ├── website-events/
│   │       ├── changelog.mdx
│   │       ├── index.md            # 英文首页
│   │       └── zh-cn/              # 简体中文文档
│   └── styles/
│       └── common.css              # 全局样式
├── astro.config.mjs                # Astro / Starlight 主配置
├── package.json                    # 脚本与依赖
├── package-lock.json
├── tsconfig.json
├── README.md                       # 英文仓库说明
└── README.zh-CN.md                 # 中文仓库说明
```

## 内容组织约定

### 1. 文档目录

英文文档位于：

- `src/content/docs/`

中文文档位于：

- `src/content/docs/zh-cn/`

通常要求中英文目录结构保持对应，便于维护和导航一致性。

### 2. index 文件职责

每个文档分组通常使用 `index.md` / `index.mdx` 作为该目录概述页：

- 英文标题统一为 `Overview`
- 中文标题统一为 `概述`
- 若要求目录中首项展示，需设置：

```yaml
sidebar:
  order: 0
```

### 3. Frontmatter 约定

常见 frontmatter 字段：

```yaml
---
title: Overview
description: Page description
sidebar:
  order: 0
---
```

说明：

- `title`：页面标题，也是默认侧边栏显示名
- `description`：页面描述，用于 SEO 与页面摘要
- `sidebar.order`：控制同级文档排序
- `.mdx` 页面可额外引入组件、图片资源和交互内容

## 多语言配置

多语言配置位于 `astro.config.mjs` 中：

- 默认语言：`root`（English）
- 中文语言：`zh-cn`
- 默认访问路径：`/`
- 中文访问路径：`/zh-cn/`

当前配置还包含：

- 自定义 sidebar
- 自定义 Header / Banner / TOC 等组件
- 自定义 CSS
- 站点地址 `site`

## 侧边栏说明

侧边栏主要由 `astro.config.mjs` 中的 `sidebar` 配置控制。

本仓库中同时存在两种方式：

1. `autogenerate`
   - 适合结构清晰、按目录自动生成的栏目
2. `items`
   - 适合需要显式控制顺序、标题、概述页与子项名称的栏目

如果某个目录的“概述”显示异常，通常优先检查：

- 该目录 `index.*` 的 `title`
- `sidebar.order`
- `astro.config.mjs` 是否使用了显式 `items`

## 本地开发

### 环境要求

- Node.js 18+
- npm 9+

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认地址：

- <http://localhost:4321>

### 生产构建

```bash
npm run build
```

构建输出目录：

- `dist/`

### 本地预览构建结果

```bash
npm run preview
```

## 常用维护流程

### 新增文档页面

1. 在对应语言目录下新增 `.md` 或 `.mdx` 文件
2. 补充 frontmatter
3. 根据需要设置 `sidebar.order`
4. 如果是分组概述页，使用 `index.md` / `index.mdx`
5. 本地运行 `npm run dev` 检查渲染与侧边栏顺序

### 新增图片资源

如果图片要在 `.mdx` 中安全使用，推荐放到：

- `src/assets/docs/`

然后通过导入方式使用：

```mdx
import demoImage from '@/assets/docs/example.png'

<img src={demoImage.src} alt="example" />
```

不要直接在 Markdown 图片语法里使用别名路径：

```md
![](@/assets/docs/example.png)
```

这类写法容易在内容渲染阶段报错。

### 调整导航结构

优先修改：

- `astro.config.mjs`

适用场景：

- 显式指定“概述”显示名
- 调整某栏目在侧边栏的层级
- 将自动生成改为手工控制 `items`
- 处理多语言标题不一致问题

## 质量检查建议

每次修改内容后，建议至少执行：

```bash
npm run build
```

重点检查：

- 是否有内容渲染错误
- 是否有缺失图片/资源引用
- 侧边栏顺序是否符合预期
- 中英文页面是否对应一致

## 已知注意事项

- `src/content/docs/` 下的内容页和 `astro.config.mjs` 的 sidebar 配置需要保持一致，否则可能出现：
  - 左侧目录名称不符合预期
  - 页面存在但目录不显示
  - 概述页未排到首项
- `.mdx` 中引用图片时，应使用 `import` 而不是 Markdown 别名路径
- 构建日志中如果出现不影响输出的外层提示，可先以最终构建成功为准，再判断是否值得追踪

## 脚本命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建静态站点 |
| `npm run preview` | 预览构建结果 |

## 发布与推送

常规发布流程建议：

1. 本地修改内容
2. 运行 `npm run build`
3. 检查页面与导航
4. 提交代码
5. 推送到 GitHub 仓库

远端仓库：

- `https://github.com/Core-Claw/scraper-webui-docs`

## 维护建议

- 保持中英文目录结构同步
- 概述页标题统一：
  - English：`Overview`
  - 中文：`概述`
- 对导航敏感目录，优先用显式 `items` 而不是完全依赖自动生成
- 变更首页、changelog、活动页时，同步检查中英文是否一致

## 参考链接

- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Integration Guide](https://docs.astro.build/en/guides/integrations-guide/)