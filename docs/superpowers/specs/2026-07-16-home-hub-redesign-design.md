# `/home/` 文档枢纽页重做设计

**日期**: 2026-07-16
**范围**: `src/content/docs/home.mdx`（EN）与 `src/content/docs/zh-cn/home.mdx`（中），以及 `src/styles/common.css` 中新增的 `.home-hero` / `.home-tracks` 相关样式。
**明确不动**: `src/content/docs/index.md`（`/` splash 落地页）及其样式。

## 背景

`/home/` 是侧边栏 "Home / 首页" 项指向的页面，是用户进入文档后的枢纽。现状问题：

1. **6 张 `hero-card` 完全同质**——2 张 "Get started" + 4 张 "Contents"，视觉无层级，用户不知道先点哪个。
2. **两张卡片链接同一目标**（Quick Start）。
3. 文案三句话平铺（"CoreClaw is a powerful cloud-based..."），无价值主张、无差异化、无 hook。
4. 卡片为居中圆角渐变方块，图标用 `fill="currentColor"` 的复杂多 path SVG，像模板不像产品。

## 目标

把 `/home/` 重做为**双轨分流**的文档枢纽页：按用户身份（免代码用户 / 开发者）二分，每轨给出该路径的关键子链接与直达 CTA。视觉采用方案 B（Stripe 风单色克制）：单 teal 主色 `#0f7f7c`、大留白、细线分隔，渐变只保留在 hero 标题的一个词上。

## 非目标 (YAGNI)

- 不动 `/` splash 页。
- 不重做 `common.css` 里其它页面的样式（nav-card / hero-card / updates-grid 等保留，因为 `index.md` 还在用）。
- 不引入新依赖、不改 Astro 配置、不改侧边栏结构。
- 不新增组件文件——`/home/` 是内容页，HTML 直接写在 `.mdx` 里，样式追加到 `common.css`。
- 不做 JS 交互（无需客户端脚本）。

## 信息架构

```
[面包屑: 网站首页 › 文档中心]   ← 沿用 index.md 的 .breadcrumb-home 模式，便于用户回到 coreclaw.com

[Hero]
  eyebrow:  CoreClaw 文档
  title:    找到你的 <入口>          ← "入口" 二字做 teal 渐变
  subtitle: 按你的身份走两条路——免代码运行现成 Worker，或自建开发并发布。

[双轨分流 — 两列，中间细线分隔]
  左轨: 免代码 · 用户路径
    h3: 运行 Worker
    desc: 从 CoreClaw Store 搜索现成采集器，一键运行，导出数据。无需写一行代码。
    子链接:
      - 快速开始             → /user-guide/run-worker/quick-start/
      - 任务与定时            → /user-guide/run-worker/worker-tasks/
      - 导出结果 (CSV/JSON)  → /user-guide/user-faq/how-to-export-data/
      - 计费规则             → /user-guide/run-worker/pricing-rules/
      - 常见问题             → /user-guide/user-faq/how-to-run-worker/
    CTA: 开始运行 →  → /user-guide/run-worker/quick-start/

  右轨: 开发 · 开发者路径
    h3: 开发 Worker
    desc: 用 Python / Node / Go 自建采集器，接入代理、指纹、验证码处理，发布到 Store 或保持私有。
    子链接:
      - 快速开始             → /developer-guide/develop-worker/quick-start/
      - 项目结构             → /developer-guide/worker-definition/project-structure/
      - 平台能力（代理/指纹/验证码） → /developer-guide/worker-definition/platform-features/proxy-support/  (作为入口页，其余从侧边栏进)
      - 浏览器自动化         → /developer-guide/worker-definition/browser-automation/overview/
      - 发布与变现           → /developer-guide/publishing-and-monetization/publish-your-worker/
    CTA: 开始开发 →  → /developer-guide/develop-worker/quick-start/

[快捷入口条 — 横排 4 项，细线分隔]
  API 参考         → /api/
  Worker 定义      → /developer-guide/worker-definition/project-structure/
  邀请活动         → /website-events/invitation-event/
  更新日志         → /changelog/
```

所有链接已核对存在（见仓库 slug 清单）。

## 视觉规格 (方案 B)

颜色（与现有 token 对齐，复用 `--core-primary-hsl`，但 home 区禁用渐变泛滥）：

- 主色 teal：`#0f7f7c`（亮）/ dark 用 `#5eead4` 系
- 标题文字：`#0a2540`（亮）/ `#f1f5f9`（暗）
- 正文：`#475569`（亮）/ `#94a3b8`（暗）
- 分隔线：`#eef2f6`（亮）/ `rgba(148,163,184,.16)`（暗）
- eyebrow 小字：teal
- **唯一的渐变**：hero 标题里的 "入口" 二字，`linear-gradient(135deg, #0a3a63, #0f7f7c)`，dark 模式 `linear-gradient(135deg, #5eead4, #a5b4fc)`

排版与间距：

- Hero 居中，`padding: 48px 24px 40px`。eyebrow 13px / title 30px 800 weight `letter-spacing: -.025em` / subtitle 15px。
- 双轨区 `display: grid; grid-template-columns: 1fr 1fr`，中间用右轨 `border-left: 1px solid` 分隔。每轨 `padding: 24px 0`。
- 子链接为竖排列表，每项 `display:flex; justify-content:space-between`，底部 1px 细线，hover 时文字变 teal、右侧箭头从 `-8px` 滑入（复用 `.quick-link-arrow` 的位移模式）。
- CTA 按钮：实心 teal 背景、白字、`border-radius: 8px`，hover 上移 2px + 阴影。无渐变。
- 快捷入口条：4 等分，`border-top` 分隔，每项标题 + 一行小字说明。
- 移动端 `<=50rem`：双轨变单列、分隔线改横线；快捷入口条变 2 列。

不使用：`hero-card`（现状卡片）、`nav-card`、卡片顶部渐变条 `::before`、标题渐变文字（除 hero 那一个词外）、`translateY(-8px)` 大幅 hover 位移。

## 深色模式

`:root[data-theme='dark']` 覆盖：背景透出 Starlight 暗底（不额外设背景色，继承 main），文字色切换为上面暗色值，分隔线切暗，CTA 保持 teal 但暗背景下可微提亮到 `#14b8a6`，hero 渐变词切暗色版。

## 双语

`zh-cn/home.mdx` 镜像，文案：

- eyebrow: CoreClaw 文档
- title: 找到你的<入口>  （中文渐变词用"入口"）
- subtitle: 按你的身份走两条路——免代码运行现成 Worker，或自建开发并发布。
- 左轨：免代码 · 用户路径 / 运行 Worker / 从 CoreClaw Store 搜索现成采集器，一键运行并导出数据。无需写一行代码。 / 子链接中文标签 / 开始运行 →
- 右轨：开发 · 开发者路径 / 开发 Worker / 用 Python / Node / Go 自建采集器，接入代理、指纹、验证码处理，发布到 Store 或保持私有。 / 子链接中文标签 / 开始开发 →
- 快捷入口：API 参考 / Worker 定义 / 邀请活动 / 更新日志

链接 href 全部加 `/zh-cn/` 前缀。

## 样式落点

在 `common.css` 末尾新增一段 `/* === Home hub page (Stripe-style) === */`，所有选择器前缀 `.sl-markdown-content .home-`，避免污染其它页面。home.mdx 根容器加 `home-hub` class 做作用域。考虑到 Starlight 会给 home 页也套 H1，沿用 index.md 的 `home-hide-auto-h1` 技巧隐藏自动 H1，hero 自带视觉标题。

## 文件改动清单

1. `src/content/docs/home.mdx` — 全量重写（frontmatter 保留 title/description/sidebar order）。
2. `src/content/docs/zh-cn/home.mdx` — 全量重写，镜像。
3. `src/styles/common.css` — 追加 `.home-*` 样式段，不动现有样式。

## 验收

用户本地 `pnpm dev` 起 dev 服务，验收：

- `/home/` 与 `/zh-cn/home/` 两页布局正确，深浅色都正常。
- 所有子链接可达（无 404）。
- 移动端窄屏（375px）双轨变单列、快捷入口变 2 列。
- 与 `/` splash 风格协调但不撞（splash 仍是它自己的 hero+nav-card）。

dev 服务由我在分支上启动后交给用户在浏览器亲自验收，迭代到满意。
