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
    integrations: [
        starlight({
            plugins: [starlightImageZoom()],
            title: 'CoreClaw',
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
                            label: 'Base URL & Authentication',
                            slug: 'api',
                            translations: {
                                'zh-CN': '基础 URL 与认证',
                            },
                        },
                        {
                            label: 'Worker',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'Worker',
                            },
                            items: [
                                {
                                    label: 'Start Worker',
                                    slug: 'api/worker/run',
                                    translations: {
                                        'zh-CN': '运行爬虫',
                                    },
                                },
                                {
                                    label: 'Abort Worker',
                                    slug: 'api/worker/abort',
                                    translations: {
                                        'zh-CN': '中止爬虫',
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
                            items: [
                                {
                                    label: 'Run History',
                                    slug: 'api/run/history',
                                    translations: {
                                        'zh-CN': '运行历史',
                                    },
                                },
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
                            ],
                        },
                        {
                            label: 'Tasks',
                            collapsed: true,
                            translations: {
                                'zh-CN': 'Tasks',
                            },
                            items: [
                                {
                                    label: 'Start Task',
                                    slug: 'api/task/run',
                                    translations: {
                                        'zh-CN': '运行任务',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Marketplace',
                            collapsed: true,
                            translations: {
                                'zh-CN': '市场',
                            },
                            items: [
                                {
                                    label: 'Search Scrapers',
                                    slug: 'api/marketplace/search',
                                    translations: {
                                        'zh-CN': '搜索爬虫',
                                    },
                                },
                                {
                                    label: 'Scraper Details',
                                    slug: 'api/marketplace/details',
                                    translations: {
                                        'zh-CN': '爬虫详情',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Account',
                            collapsed: true,
                            translations: {
                                'zh-CN': '账户',
                            },
                            items: [
                                {
                                    label: 'Account Info',
                                    slug: 'api/account/info',
                                    translations: {
                                        'zh-CN': '账户信息',
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
                            label: 'Invitation Program',
                            slug: 'events/invitation-program',
                            translations: {
                                'zh-CN': '邀请计划',
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
