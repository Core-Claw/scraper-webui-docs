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
                    autogenerate: { directory: 'getting-started' },
                },
                {
                    label: 'User Guide',
                    collapsed: true,
                    translations: {
                        'zh-CN': '用户指南',
                    },
                    autogenerate: { directory: 'user-guide' },
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
                            autogenerate: {
                                directory: 'developer-guide/worker',
                            },
                        },
                        {
                            label: 'Framework',
                            translations: {
                                'zh-CN': '数据采集框架',
                            },
                            autogenerate: {
                                directory: 'developer-guide/framework',
                            },
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
                    autogenerate: { directory: 'website-events' },
                },
                {
                    label: 'Platform Policies',
                    collapsed: true,
                    translations: {
                        'zh-CN': '平台政策',
                    },
                    autogenerate: {
                        directory: 'platform-policies',
                    },
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
