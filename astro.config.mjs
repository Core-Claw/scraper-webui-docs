// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightImageZoom from 'starlight-image-zoom'

import react from '@astrojs/react'

const locales = {
    root: {
        label: 'English',
        lang: 'en',
    },
    'zh-cn': {
        label: '简体中文',
        lang: 'zh-CN',
    },
}

export default defineConfig({
    site: 'https://docs.coreclaw.com',
    redirects: {
        '/user-guide': '/user-guide/run-worker/quick-start',
        '/developer-guide': '/developer-guide/develop-worker/quick-start',
        '/faq': '/user-guide/user-faq/how-to-run-worker',
        '/zh-cn/user-guide': '/zh-cn/user-guide/run-worker/quick-start',
        '/zh-cn/developer-guide': '/zh-cn/developer-guide/develop-worker/quick-start',
        '/zh-cn/faq': '/zh-cn/user-guide/user-faq/how-to-run-worker',
        '/events/invitation-program': '/website-events/invitation-event',
        '/zh-cn/events/invitation-program': '/zh-cn/website-events/invitation-event',
    },
    integrations: [
        starlight({
            plugins: [starlightImageZoom()],
            title: 'CoreClaw',
            expressiveCode: {
                // Use github-dark/light for now — they're well-tested and
                // legible. We tone down the chrome via styleOverrides so
                // they fit the site's quieter teal palette instead of
                // shouting in primary GitHub colours.
                themes: ['github-dark', 'github-light'],
                styleOverrides: {
                    borderRadius: '10px',
                    borderColor: 'hsla(220, 14%, 60%, 0.22)',
                    // System monospace stack — looks native on macOS / Windows
                    // / Linux without shipping a webfont. JetBrains Mono and
                    // Fira Code only kick in if the user already has them.
                    codeFontFamily:
                        'ui-monospace, "SF Mono", "Cascadia Mono", "JetBrains Mono", "Fira Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
                    codeFontSize: '0.8125rem',
                    codeLineHeight: '1.7',
                    codePaddingBlock: '0.95rem',
                    codePaddingInline: '1.1rem',
                    // Lift line-numbers / scroll-bars to subtle teal
                    scrollbarThumbColor: 'hsla(199, 50%, 50%, 0.25)',
                    scrollbarThumbHoverColor: 'hsla(199, 50%, 50%, 0.5)',
                    // Frame chrome (window bar, file tab) — neutral, then
                    // a thin teal underline to mark active state
                    frames: {
                        editorActiveTabBackground: 'transparent',
                        editorActiveTabBorderColor: 'transparent',
                        editorActiveTabIndicatorTopColor: 'transparent',
                        editorActiveTabIndicatorBottomColor:
                            'hsl(199, 89%, 50%)',
                        editorTabBarBackground: 'transparent',
                        editorTabBarBorderBottomColor:
                            'hsla(220, 14%, 60%, 0.18)',
                        editorTabBorderRadius: '6px',
                        terminalTitlebarBackground:
                            'hsla(220, 14%, 96%, 0.6)',
                        terminalTitlebarBorderBottomColor:
                            'hsla(220, 14%, 60%, 0.18)',
                        terminalTitlebarForeground: 'hsl(220, 14%, 32%)',
                        terminalBackground: '#0f1117',
                        terminalTitlebarDotsForeground:
                            'hsla(220, 14%, 70%, 0.6)',
                        terminalTitlebarDotsOpacity: '0.7',
                        frameBoxShadowCssValue:
                            '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        tooltipSuccessBackground: 'hsl(151, 55%, 40%)',
                        tooltipSuccessForeground: 'white',
                    },
                },
            },
            logo: {
                src: './src/assets/logo.png',
                alt: 'CoreClaw Logo',
            },
            defaultLocale: 'root',
            locales,
            lastUpdated: false,
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/Core-Claw',
                },
            ],
            components: {
                Header: './src/components/Header.astro',
                MobileMenuFooter: './src/components/MobileMenuFooter.astro',
                TableOfContents: './src/components/TableOfContents.astro',
                Banner: './src/components/Banner.astro',
                PageTitle: './src/components/PageTitle.astro',
                Footer: './src/components/Footer.astro',
            },
            editLink: {
                // Adjust the path/branch if the docs source moves.
                baseUrl:
                    'https://github.com/Core-Claw/scraper-webui-docs/edit/main/',
            },
            customCss: [
                './src/styles/common.css',
                '@fontsource-variable/ibm-plex-sans/index.css',
            ],
            favicon: '/logo.png',
            sidebar: [

                {
                    label: 'Home',
                    slug: 'home',
                    translations: {
                        'zh-CN': '首页',
                    },
                },
                {
                    label: 'User Guide',
                    collapsed: true,
                    translations: {
                        'zh-CN': '用户指南',
                    },
                    items: [
                        {
                            label: 'Run Worker',
                            collapsed: true,
                            translations: {
                                'zh-CN': '运行 Worker',
                            },
                            items: [
                                {
                                    label: 'Quick Start',
                                    slug: 'user-guide/run-worker/quick-start',
                                    translations: {
                                        'zh-CN': '快速上手',
                                    },
                                },
                                {
                                    label: 'Input and Output',
                                    slug: 'user-guide/run-worker/input-output',
                                    translations: {
                                        'zh-CN': '输入与输出',
                                    },
                                },
                                {
                                    label: 'Builds and Runs',
                                    slug: 'user-guide/run-worker/builds-and-runs',
                                    translations: {
                                        'zh-CN': '构建与运行',
                                    },
                                },
                                {
                                    label: 'Worker Tasks',
                                    slug: 'user-guide/run-worker/worker-tasks',
                                    translations: {
                                        'zh-CN': 'Worker 任务',
                                    },
                                },
                                {
                                    label: 'API Calls',
                                    slug: 'user-guide/run-worker/api-calls',
                                    translations: {
                                        'zh-CN': 'API 调用',
                                    },
                                },
                                {
                                    label: 'Pricing Rules',
                                    slug: 'user-guide/run-worker/pricing-rules',
                                    translations: {
                                        'zh-CN': '计价规则',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'User FAQ',
                            collapsed: true,
                            translations: {
                                'zh-CN': '用户常见问题',
                            },
                            items: [
                                {
                                    label: 'How to run a Worker?',
                                    slug: 'user-guide/user-faq/how-to-run-worker',
                                    translations: {
                                        'zh-CN': '如何运行 Worker？',
                                    },
                                },
                                {
                                    label: 'Worker failed?',
                                    slug: 'user-guide/user-faq/worker-failed',
                                    translations: {
                                        'zh-CN': 'Worker 运行失败？',
                                    },
                                },
                                {
                                    label: 'How to export data?',
                                    slug: 'user-guide/user-faq/how-to-export-data',
                                    translations: {
                                        'zh-CN': '如何导出数据？',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Developer Guide',
                    collapsed: true,
                    translations: {
                        'zh-CN': '开发者指南',
                    },
                    items: [
                        {
                            label: 'Develop Worker',
                            collapsed: true,
                            translations: {
                                'zh-CN': '开发 Worker',
                            },
                            items: [
                                {
                                    label: 'Quick Start',
                                    slug: 'developer-guide/develop-worker/quick-start',
                                    translations: {
                                        'zh-CN': '快速上手',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Worker Definition',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'Worker 定义',
                            },
                            items: [
                                {
                                    label: 'Project Structure',
                                    slug: 'developer-guide/worker-definition/project-structure',
                                    badge: { text: 'Required', variant: 'danger' },
                                    translations: {
                                        'zh-CN': '项目结构',
                                    },
                                },
                                {
                                    label: 'Platform Features',
                                    collapsed: true,
                                    translations: {
                                        'zh-CN': '平台功能',
                                    },
                                    items: [
                                        {
                                            label: 'Proxy Support',
                                            slug: 'developer-guide/worker-definition/platform-features/proxy-support',
                                            badge: { text: 'Required', variant: 'danger' },
                                            translations: {
                                                'zh-CN': '代理支持',
                                            },
                                        },
                                        {
                                            label: 'Browser Fingerprinting',
                                            slug: 'developer-guide/worker-definition/platform-features/browser-fingerprinting',
                                            translations: {
                                                'zh-CN': '浏览器指纹',
                                            },
                                        },
                                        {
                                            label: 'CAPTCHA Handling',
                                            slug: 'developer-guide/worker-definition/platform-features/captcha-handling',
                                            translations: {
                                                'zh-CN': '验证码处理',
                                            },
                                        },
                                    ],
                                },
                                {
                                    label: 'Input Schema',
                                    slug: 'developer-guide/worker-definition/input-schema',
                                    badge: { text: 'Required', variant: 'danger' },
                                    translations: {
                                        'zh-CN': '输入配置',
                                    },
                                },
                                {
                                    label: 'Output Schema',
                                    slug: 'developer-guide/worker-definition/output-schema',
                                    badge: { text: 'Required', variant: 'danger' },
                                    translations: {
                                        'zh-CN': '输出配置',
                                    },
                                },
                                {
                                    label: 'SDK Modules',
                                    slug: 'developer-guide/worker-definition/sdk-modules',
                                    badge: { text: 'Required', variant: 'danger' },
                                    translations: {
                                        'zh-CN': 'SDK 模块',
                                    },
                                },
                                {
                                    label: 'Examples',
                                    collapsed: true,
                                    translations: {
                                        'zh-CN': '示例',
                                    },
                                    items: [
                                        {
                                            label: 'Python Example',
                                            slug: 'developer-guide/worker-definition/examples/python-example',
                                            translations: {
                                                'zh-CN': 'Python 示例',
                                            },
                                        },
                                        {
                                            label: 'Node.js Example',
                                            slug: 'developer-guide/worker-definition/examples/nodejs-example',
                                            translations: {
                                                'zh-CN': 'Node.js 示例',
                                            },
                                        },
                                        {
                                            label: 'Go Example',
                                            slug: 'developer-guide/worker-definition/examples/go-example',
                                            translations: {
                                                'zh-CN': 'Go 示例',
                                            },
                                        },
                                    ],
                                },
                                {
                                    label: 'Browser Automation',
                                    collapsed: true,
                                    translations: {
                                        'zh-CN': '浏览器自动化',
                                    },
                                    items: [
                                        {
                                            label: 'Overview',
                                            slug: 'developer-guide/worker-definition/browser-automation/overview',
                                            translations: {
                                                'zh-CN': '概述',
                                            },
                                        },
                                        {
                                            label: 'Playwright',
                                            slug: 'developer-guide/worker-definition/browser-automation/playwright',
                                            translations: {
                                                'zh-CN': 'Playwright',
                                            },
                                        },
                                        {
                                            label: 'Lightpanda',
                                            slug: 'developer-guide/worker-definition/browser-automation/lightpanda',
                                            translations: {
                                                'zh-CN': 'Lightpanda',
                                            },
                                        },
                                        {
                                            label: 'Puppeteer',
                                            slug: 'developer-guide/worker-definition/browser-automation/puppeteer',
                                            translations: {
                                                'zh-CN': 'Puppeteer',
                                            },
                                        },
                                        {
                                            label: 'Selenium',
                                            slug: 'developer-guide/worker-definition/browser-automation/selenium',
                                            translations: {
                                                'zh-CN': 'Selenium',
                                            },
                                        },
                                        {
                                            label: 'DrissionPage',
                                            slug: 'developer-guide/worker-definition/browser-automation/drissionpage',
                                            translations: {
                                                'zh-CN': 'DrissionPage',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Deployment',
                            slug: 'developer-guide/deployment',
                            translations: {
                                'zh-CN': '部署',
                            },
                        },
                        {
                            label: 'Builds & Runs',
                            slug: 'developer-guide/builds-and-runs',
                            translations: {
                                'zh-CN': '构建与运行',
                            },
                        },
                        {
                            label: 'Test Your Worker',
                            slug: 'developer-guide/test-your-worker',
                            translations: {
                                'zh-CN': '测试 Worker',
                            },
                        },
                        {
                            label: 'Publishing & Monetization',
                            collapsed: true,
                            translations: {
                                'zh-CN': '发布与变现',
                            },
                            items: [
                                {
                                    label: 'Publish Your Worker',
                                    slug: 'developer-guide/publishing-and-monetization/publish-your-worker',
                                    translations: {
                                        'zh-CN': '发布 Worker',
                                    },
                                },
                                {
                                    label: 'Monetize Your Worker',
                                    slug: 'developer-guide/publishing-and-monetization/monetize-your-worker',
                                    translations: {
                                        'zh-CN': 'Worker 变现',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Developer FAQ',
                            collapsed: true,
                            translations: {
                                'zh-CN': '开发者常见问题',
                            },
                            items: [
                                {
                                    label: 'How to deploy?',
                                    slug: 'developer-guide/developer-faq/how-to-deploy',
                                    translations: {
                                        'zh-CN': '如何部署？',
                                    },
                                },
                                {
                                    label: 'Build failed?',
                                    slug: 'developer-guide/developer-faq/build-failed',
                                    translations: {
                                        'zh-CN': '构建失败？',
                                    },
                                },
                                {
                                    label: 'Test errors?',
                                    slug: 'developer-guide/developer-faq/test-errors',
                                    translations: {
                                        'zh-CN': '测试错误？',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'API',
                    translations: {
                        'zh-CN': 'API',
                    },
                    collapsed: true,
                    items: [
                        {
                            label: 'API Integration',
                            slug: 'api/integration',
                            translations: {
                                'zh-CN': 'API 集成指南',
                            },
                        },
                        {
                            label: 'Base URL & Authentication',
                            slug: 'api',
                            translations: {
                                'zh-CN': '基础 URL 与认证',
                            },
                        },
                        // Account info comes early — users typically hit it
                        // first to verify their API key and check balance
                        // before doing anything else.
                        {
                            label: 'Account Info',
                            slug: 'api/account/info',
                            translations: {
                                'zh-CN': '账户信息',
                            },
                        },
                        {
                            label: 'Worker',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'Worker',
                            },
                            items: [
                                // Highest-frequency action goes first.
                                {
                                    label: 'Start Worker',
                                    slug: 'api/worker/run',
                                    translations: {
                                        'zh-CN': '运行 Worker',
                                    },
                                },
                                {
                                    label: 'Worker Detail',
                                    slug: 'api/worker/detail',
                                    translations: {
                                        'zh-CN': 'Worker 详情',
                                    },
                                },
                                {
                                    label: 'Search Workers',
                                    slug: 'api/worker/search',
                                    translations: {
                                        'zh-CN': '搜索 Worker',
                                    },
                                },
                                {
                                    label: 'Abort Worker',
                                    slug: 'api/worker/abort',
                                    translations: {
                                        'zh-CN': '中止 Worker',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Runs',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'Runs',
                            },
                            // Reordered by usage flow: after starting a
                            // worker you check its detail, fetch results,
                            // read logs, export, rerun if needed; History
                            // is the catch-all browse-everything endpoint
                            // and goes last.
                            items: [
                                {
                                    label: 'Run Detail',
                                    slug: 'api/run/detail',
                                    translations: {
                                        'zh-CN': '运行详情',
                                    },
                                },
                                {
                                    label: 'Run Result',
                                    slug: 'api/run/result',
                                    translations: {
                                        'zh-CN': '运行结果',
                                    },
                                },
                                {
                                    label: 'Run Log',
                                    slug: 'api/run/log',
                                    translations: {
                                        'zh-CN': '运行日志',
                                    },
                                },
                                {
                                    label: 'Export Run Result',
                                    slug: 'api/run/export',
                                    translations: {
                                        'zh-CN': '导出运行结果',
                                    },
                                },
                                {
                                    label: 'Re-run',
                                    slug: 'api/run/rerun',
                                    translations: {
                                        'zh-CN': '重新运行',
                                    },
                                },
                                {
                                    label: 'Run History',
                                    slug: 'api/run/history',
                                    translations: {
                                        'zh-CN': '运行历史',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Start Task',
                            slug: 'api/task/run',
                            translations: {
                                'zh-CN': '运行任务（模板）',
                            },
                        },
                        {
                            label: 'Code Examples',
                            collapsed: true,
                            translations: {
                                'zh-CN': '代码示例',
                            },
                            items: [
                                {
                                    label: 'Python',
                                    slug: 'api/examples/python',
                                    translations: {
                                        'zh-CN': 'Python',
                                    },
                                },
                                {
                                    label: 'Node.js',
                                    slug: 'api/examples/nodejs',
                                    translations: {
                                        'zh-CN': 'Node.js',
                                    },
                                },
                                {
                                    label: 'Java',
                                    slug: 'api/examples/java',
                                    translations: {
                                        'zh-CN': 'Java',
                                    },
                                },
                                {
                                    label: 'PHP',
                                    slug: 'api/examples/php',
                                    translations: {
                                        'zh-CN': 'PHP',
                                    },
                                },
                                {
                                    label: 'Go',
                                    slug: 'api/examples/go',
                                    translations: {
                                        'zh-CN': 'Go',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Integrations',
                    collapsed: true,
                    translations: {
                        'zh-CN': '集成',
                    },
                    items: [
                        {
                            label: 'AI',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'AI',
                            },
                            items: [
                                {
                                    label: 'MCP Server',
                                    collapsed: true,
                                    translations: {
                                        'zh-CN': 'MCP 服务',
                                    },
                                    items: [
                                        {
                                            label: 'Overview',
                                            slug: 'integrations/ai/mcp',
                                            translations: {
                                                'zh-CN': '概述',
                                            },
                                        },
                                        {
                                            label: 'Claude Desktop',
                                            slug: 'integrations/ai/mcp/claude-desktop',
                                            translations: {
                                                'zh-CN': 'Claude Desktop',
                                            },
                                        },
                                        {
                                            label: 'Codex Desktop',
                                            slug: 'integrations/ai/mcp/codex-desktop',
                                            translations: {
                                                'zh-CN': 'Codex Desktop',
                                            },
                                        },
                                        {
                                            label: 'Codex CLI',
                                            slug: 'integrations/ai/mcp/codex-cli',
                                            translations: {
                                                'zh-CN': 'Codex CLI',
                                            },
                                        },
                                        {
                                            label: 'Cursor',
                                            slug: 'integrations/ai/mcp/cursor',
                                            translations: {
                                                'zh-CN': 'Cursor',
                                            },
                                        },
                                        {
                                            label: 'ChatGPT',
                                            slug: 'integrations/ai/mcp/chatgpt',
                                            translations: {
                                                'zh-CN': 'ChatGPT',
                                            },
                                        },
                                        {
                                            label: 'VS Code',
                                            slug: 'integrations/ai/mcp/vscode',
                                            translations: {
                                                'zh-CN': 'VS Code',
                                            },
                                        },
                                        {
                                            label: 'Windsurf',
                                            slug: 'integrations/ai/mcp/windsurf',
                                            translations: {
                                                'zh-CN': 'Windsurf',
                                            },
                                        },
                                        {
                                            label: 'Cline',
                                            slug: 'integrations/ai/mcp/cline',
                                            translations: {
                                                'zh-CN': 'Cline',
                                            },
                                        },
                                        {
                                            label: 'n8n',
                                            slug: 'integrations/ai/mcp/n8n',
                                            translations: {
                                                'zh-CN': 'n8n',
                                            },
                                        },
                                        {
                                            label: 'Generic HTTP',
                                            slug: 'integrations/ai/mcp/generic-http',
                                            translations: {
                                                'zh-CN': '通用 HTTP',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Workflows & notifications',
                            collapsed: true,
                            translations: {
                                'zh-CN': '工作流与通知',
                            },
                            items: [
                                {
                                    label: 'n8n',
                                    slug: 'integrations/workflows-and-notifications/n8n',
                                    translations: {
                                        'zh-CN': 'n8n',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Events',
                    collapsed: true,
                    translations: {
                        'zh-CN': '活动',
                    },
                    items: [
                        {
                            label: 'Invitation Event',
                            slug: 'website-events/invitation-event',
                            translations: {
                                'zh-CN': '邀请活动',
                            },
                        },
                    ],
                },
                {
                    label: 'Changelog',
                    slug: 'changelog',
                    translations: {
                        'zh-CN': '更新日志',
                    },
                },
            ],
        }),
        react(),
    ],

    prefetch: {
        prefetchAll: true,
    },

    vite: {
        build: {
            rollupOptions: {
                output: {
                    hashCharacters: 'hex',
                    entryFileNames: 'js/[hash].js',
                    chunkFileNames: 'js/chunks/[hash].js',
                    assetFileNames: 'static/css/[hash][extname]',
                },
            },
        },
    },
    build: {
        assets: 'static',
    },
})
