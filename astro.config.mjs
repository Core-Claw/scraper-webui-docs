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
                    label: 'About CoreClaw',
                    slug: 'about-coreclaw',
                    translations: {
                        'zh-CN': '关于 CoreClaw',
                    },
                },
                {
                    label: 'Getting Started',
                    collapsed: false,
                    translations: {
                        'zh-CN': '快速开始',
                    },
                    items: [
                        {
                            label: 'Overview',
                            slug: 'getting-started',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Quick Start',
                            slug: 'getting-started/quick-start',
                            translations: {
                                'zh-CN': '快速上手',
                            },
                        },
                        {
                            label: 'Introduction',
                            slug: 'getting-started/introduction',
                            translations: {
                                'zh-CN': '介绍',
                            },
                        },
                        {
                            label: 'Core Concepts',
                            slug: 'getting-started/core-concepts',
                            translations: {
                                'zh-CN': '核心概念',
                            },
                        },
                        {
                            label: 'FAQ',
                            slug: 'getting-started/faq',
                            translations: {
                                'zh-CN': '常见问题',
                            },
                        },
                    ],
                },
                {
                    label: 'User Guide',
                    collapsed: true,
                    translations: {
                        'zh-CN': '用户指南',
                    },
                    items: [
                        {
                            label: 'Overview',
                            slug: 'user-guide',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Find a Worker',
                            slug: 'user-guide/how-to-find-a-worker',
                            translations: {
                                'zh-CN': '如何查找 Worker',
                            },
                        },
                        {
                            label: 'Run Scraper',
                            slug: 'user-guide/run-scraper',
                            translations: {
                                'zh-CN': '运行爬虫',
                            },
                        },
                        {
                            label: 'Download Data',
                            slug: 'user-guide/how-to-download-data',
                            translations: {
                                'zh-CN': '如何下载数据',
                            },
                        },
                        {
                            label: 'Website Registration',
                            slug: 'user-guide/how-to-collect-data-through-website-registration',
                            translations: {
                                'zh-CN': '网站注册采集',
                            },
                        },
                        {
                            label: 'Worker Tasks',
                            slug: 'user-guide/worker-task',
                            translations: {
                                'zh-CN': 'Worker 任务',
                            },
                        },
                        {
                            label: 'Pricing Rules',
                            slug: 'user-guide/worker-pricing-rules',
                            translations: {
                                'zh-CN': '计价规则',
                            },
                        },
                        {
                            label: 'Download Data',
                            slug: 'user-guide/how-to-download-data',
                            translations: {
                                'zh-CN': '如何下载数据',
                            },
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
                            label: 'Overview',
                            slug: 'developer-guide',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Web Unlocker',
                            translations: {
                                'zh-CN': '网页解锁器',
                            },
                            items: [
                                {
                                    label: 'Overview',
                                    slug: 'developer-guide/web-unlocker',
                                    translations: {
                                        'zh-CN': '概述',
                                    },
                                },
                                {
                                    label: 'Fingerprint Browser',
                                    slug: 'developer-guide/web-unlocker/fingerprint-browser',
                                    translations: {
                                        'zh-CN': '指纹浏览器配置',
                                    },
                                },
                                {
                                    label: 'Bypass Verification Code',
                                    slug: 'developer-guide/web-unlocker/bypass-verification-code',
                                    translations: {
                                        'zh-CN': '验证码绕过服务',
                                    },
                                },
                                {
                                    label: 'HTTP/Socks5 Network Proxy',
                                    slug: 'developer-guide/web-unlocker/socks5-network-proxy',
                                    translations: {
                                        'zh-CN': 'HTTP/Socks5 网络代理',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Worker',
                            translations: {
                                'zh-CN': 'Worker',
                            },
                            items: [
                                {
                                    label: 'Overview',
                                    slug: 'developer-guide/worker',
                                    translations: {
                                        'zh-CN': '概述',
                                    },
                                },
                                {
                                    label: 'What is a Worker?',
                                    slug: 'developer-guide/worker/what-is-worker',
                                    translations: {
                                        'zh-CN': '什么是 Worker？',
                                    },
                                },
                                {
                                    label: 'Worker Directory',
                                    slug: 'developer-guide/worker/worker-directory',
                                    translations: {
                                        'zh-CN': 'Worker 目录结构',
                                    },
                                },
                                {
                                    label: 'Go Script',
                                    slug: 'developer-guide/worker/go-script',
                                    translations: {
                                        'zh-CN': 'Go 脚本',
                                    },
                                },
                                {
                                    label: 'Python Script',
                                    slug: 'developer-guide/worker/python-script',
                                    translations: {
                                        'zh-CN': 'Python 脚本',
                                    },
                                },
                                {
                                    label: 'Node.js Script',
                                    slug: 'developer-guide/worker/nodejs-script',
                                    translations: {
                                        'zh-CN': 'Node.js 脚本',
                                    },
                                },
                                {
                                    label: 'Input Schema',
                                    slug: 'developer-guide/worker/input-schema',
                                    translations: {
                                        'zh-CN': '输入配置（Input Schema）',
                                    },
                                },
                                {
                                    label: 'Test Environment',
                                    slug: 'developer-guide/worker/test-environment',
                                    translations: {
                                        'zh-CN': '测试环境',
                                    },
                                },
                                {
                                    label: 'Publish Script',
                                    slug: 'developer-guide/worker/publish-script',
                                    translations: {
                                        'zh-CN': '发布脚本',
                                    },
                                },
                                {
                                    label: 'Publish Version',
                                    slug: 'developer-guide/worker/publish-version',
                                    translations: {
                                        'zh-CN': '发布版本',
                                    },
                                },
                                {
                                    label: 'Script Update',
                                    slug: 'developer-guide/worker/script-update',
                                    translations: {
                                        'zh-CN': '脚本更新',
                                    },
                                },
                                {
                                    label: 'Data Saving',
                                    slug: 'developer-guide/worker/data-saving',
                                    translations: {
                                        'zh-CN': '数据保存',
                                    },
                                },
                                {
                                    label: 'View Earnings',
                                    slug: 'developer-guide/worker/view-earnings',
                                    translations: {
                                        'zh-CN': '查看收益',
                                    },
                                },
                            ],
                        },
                        {
                            label: 'Framework',
                            translations: {
                                'zh-CN': '数据采集框架',
                            },
                            items: [
                                {
                                    label: 'Overview',
                                    slug: 'developer-guide/framework',
                                    translations: {
                                        'zh-CN': '概述',
                                    },
                                },
                                {
                                    label: 'Why Use Framework?',
                                    slug: 'developer-guide/framework/why-use-collection-framework',
                                    translations: {
                                        'zh-CN': '为什么使用框架？',
                                    },
                                },
                                {
                                    label: 'Selenium',
                                    slug: 'developer-guide/framework/use-selenium',
                                    translations: {
                                        'zh-CN': 'Selenium',
                                    },
                                },
                                {
                                    label: 'Playwright',
                                    slug: 'developer-guide/framework/use-playwright',
                                    translations: {
                                        'zh-CN': 'Playwright',
                                    },
                                },
                                {
                                    label: 'Puppeteer',
                                    slug: 'developer-guide/framework/use-puppeteer',
                                    translations: {
                                        'zh-CN': 'Puppeteer',
                                    },
                                },
                                {
                                    label: 'DrissionPage',
                                    slug: 'developer-guide/framework/use-drissionpage',
                                    translations: {
                                        'zh-CN': 'DrissionPage',
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
                            label: 'Overview',
                            slug: 'api',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Basic Information',
                            collapsed: true,
                            translations: {
                                'zh-CN': '基础信息',
                            },
                            items: [
                                {
                                    label: 'Overview',
                                    slug: 'api/basic',
                                    translations: {
                                        'zh-CN': '概述',
                                    },
                                },
                                {
                                    label: 'Base URL & Authentication',
                                    slug: 'api/basic/base',
                                    translations: {
                                        'zh-CN': '基础 URL 与认证',
                                    },
                                },
                                {
                                    label: 'Device Configuration',
                                    slug: 'api/basic/device-configuration',
                                    translations: {
                                        'zh-CN': '设备配置',
                                    },
                                },
                                {
                                    label: 'Proxy Nodes',
                                    slug: 'api/basic/proxy',
                                    translations: {
                                        'zh-CN': '代理节点',
                                    },
                                },
                            ],
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
                            label: 'Account Information',
                            collapsed: true,
                            translations: {
                                'zh-CN': '账户信息',
                            },
                            autogenerate: {
                                directory: 'api/account',
                            },
                        },
                    ],
                },
                {
                    label: 'Website Events',
                    collapsed: true,
                    translations: {
                        'zh-CN': '网站活动',
                    },
                    items: [
                        {
                            label: 'Overview',
                            slug: 'website-events',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Invitation Program',
                            slug: 'website-events/invitation-event',
                            translations: {
                                'zh-CN': '邀请计划',
                            },
                        },
                    ],
                },
                {
                    label: 'Platform Policies',
                    collapsed: true,
                    translations: {
                        'zh-CN': '平台政策',
                    },
                    items: [
                        {
                            label: 'Overview',
                            slug: 'platform-policies',
                            translations: {
                                'zh-CN': '概述',
                            },
                        },
                        {
                            label: 'Privacy Policy',
                            slug: 'platform-policies/privacy-policy',
                            translations: {
                                'zh-CN': '隐私政策',
                            },
                        },
                        {
                            label: 'Terms of Service',
                            slug: 'platform-policies/terms-of-service',
                            translations: {
                                'zh-CN': '服务条款',
                            },
                        },
                    ],
                },
                {
                    label: 'FAQ',
                    collapsed: true,
                    translations: {
                        'zh-CN': '常见问题',
                    },
                    items: [
                        {
                            label: 'Overview',
                            slug: 'faq',
                            translations: {
                                'zh-CN': '概述',
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
