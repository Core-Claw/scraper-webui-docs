# CoreClaw 文档

本仓库是 [docs.coreclaw.com](https://docs.coreclaw.com/) 文档站点的源内容与配置文件，基于 [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) 构建。

英文版说明见 [`README.md`](./README.md)。

## 文档架构

CoreClaw 文档按受众划分为以下内容区域：

### 内容区域

| 区域 | 受众 | 内容 |
| --- | --- | --- |
| 用户指南 | 终端用户 | 运行 Worker、查看结果、计费规则、API 调用、常见问题 |
| 开发者指南 | Worker 开发者 | 构建、测试、发布和变现 Worker |
| API 参考 | API 调用方 | 完整的接口文档，含请求/响应 schema |
| 网站活动 | 所有用户 | 平台活动与推广 |
| 更新日志 | 所有用户 | 平台与文档更新记录 |

### 多语言结构

- **English**（`/`）— 默认语言，权威维护
- **简体中文**（`/zh-cn/`）— 完整翻译，并行维护

`src/content/docs/` 与 `src/content/docs/zh-cn/` 下的目录结构相互镜像。新增或修改内容时应保持两套语言同步。

## 关键约定

### Worker / Scraper 术语

CoreClaw 平台对同一概念使用两个术语：

- **Worker** — 文档和界面中使用的名称，指数据采集脚本
- **Scraper** — API 路径和字段名中使用的名称，保持向后兼容（如 `scraper_slug`、`/api/v1/scraper/run`）

### API 文档

API 参考按端点组组织：

- **Worker** — `/api/v1/scraper/*` 端点，用于启动、中止和查看 Worker 运行
- **Runs** — `/api/v1/run/*` 端点，用于历史记录、结果、日志和导出
- **Tasks** — `/api/v1/task/*` 端点，用于已保存的 Task 模板
- **Account** — `/api/v1/account/*` 端点，用于账户信息

每个端点页面记录了 HTTP 方法、路径、请求参数、响应 schema 和错误码。[API 索引页](https://docs.coreclaw.com/zh-cn/api/) 提供了完整的端点速查表。

OpenAPI 规范文件位于 `public/openapi.json`，通过 `/openapi.json` 对外提供。`openapi.swagger.json` 文件仅供本地参考，不纳入版本控制（见 `.gitignore`）。

### 侧边栏配置

导航在 `astro.config.mjs` 中通过显式 `items` 数组手动定义，可完全控制：
- 栏目标签与排序
- 多语言标签翻译
- 可折叠分组与嵌套层级
- 徽章标注（如「必读」）

## 仓库结构

```text
.
├── public/                         # 静态资源（直接输出）
│   ├── openapi.json                #   OpenAPI 规范（通过 /openapi.json 提供）
│   ├── favicon.jpg                 #   站点图标
│   └── logo.png                    #   站点 Logo
├── src/
│   ├── assets/                     # 构建期资源（图片、logo）
│   │   └── docs/                   #   文档截图
│   ├── components/                 # 自定义 Astro 组件
│   │   ├── ApiPlayground.astro     #   交互式 API 调试表单
│   │   ├── CopyForLLMs.astro      #   复制给 LLM 头部下拉
│   │   ├── Banner.astro           #   站点横幅
│   │   ├── Header.astro           #   自定义页头
│   │   ├── Footer.astro           #   自定义页脚
│   │   └── ...                    #   其他覆盖组件
│   ├── content/docs/               # 英文文档（默认语言）
│   │   ├── api/                    #   API 参考
│   │   ├── developer-guide/        #   开发者文档
│   │   ├── user-guide/             #   用户文档
│   │   ├── website-events/         #   活动推广
│   │   ├── home.mdx                #   首页
│   │   ├── changelog.mdx          #   更新日志
│   │   └── zh-cn/                  # 简体中文镜像
│   ├── pages/                      # 动态路由（Copy-for-LLMs .md 导出）
│   └── styles/common.css           # 全局样式覆盖
├── scripts/
│   └── check-copy-for-llms.mjs    # 构建后冒烟测试（.md 导出完整性）
├── astro.config.mjs                # Astro + Starlight 配置
├── package.json
└── tsconfig.json
```

## 技术栈

| 组件 | 用途 |
| --- | --- |
| [Astro](https://astro.build/) | 静态站点生成 |
| [Starlight](https://starlight.astro.build/) | 文档主题（侧边栏、搜索、国际化） |
| [React](https://react.dev/) | 交互式 UI 组件 |
| `starlight-image-zoom` | 图片缩放插件 |
| `sharp` | 图片优化 |
| `turndown` | HTML 转 Markdown（Copy-for-LLMs） |

## 本地开发

```bash
pnpm install          # 安装依赖（Node.js 22+，pnpm 10+）
pnpm run dev          # 启动开发服务器 http://localhost:4321
pnpm run build        # 构建至 dist/（含 Copy-for-LLMs 检查）
pnpm run preview      # 预览构建结果
```

## 质量检查

提交前执行 `pnpm run build`，确认：

- 无内容渲染错误
- 中英文侧边栏顺序一致
- 中英文页面结构对齐
- 无断链或缺失资源引用
- Copy-for-LLMs 冒烟测试通过（每个文档页面导出非空 Markdown）

## 参考链接

- [Astro 文档](https://docs.astro.build/)
- [Starlight 文档](https://starlight.astro.build/)
- [CoreClaw 文档（线上）](https://docs.coreclaw.com/)