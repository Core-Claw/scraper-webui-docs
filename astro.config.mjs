// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightImageZoom from 'starlight-image-zoom'

import react from '@astrojs/react';

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
    integrations: [starlight({
        plugins: [starlightImageZoom()],
        title: 'CafeScraper',
        logo: {
            src: './src/assets/logo.png',
        },
        defaultLocale: 'root',
        locales,
        lastUpdated: true,
        social: [
            { icon: 'github', label: 'GitHub', href: 'https://github.com/Cafe-scraper' },
        ],
        components: {
            Header: './src/components/Header.astro',
            MobileMenuFooter: './src/components/MobileMenuFooter.astro',
            TableOfContents: './src/components/TableOfContents.astro',
        },
        customCss: [
            './src/styles/common.css',
            '@fontsource-variable/ibm-plex-sans/index.css',
        ],
        favicon: '/favicon.jpg',
        sidebar: [
            {
                label: 'About CafeScraper',
                slug: 'about-cafe-scraper',
                translations: {
                    'zh-CN': '关于 CafeScraper',
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
                        label: 'Web Unlocker',
                        translations: {
                            'zh-CN': '网页解锁器',
                        },
                        autogenerate: {
                            directory: 'developer-guide/web-unlocker',
                        },
                    },
                    {
                        label: 'Script',
                        translations: {
                            'zh-CN': '脚本',
                        },
                        autogenerate: {
                            directory: 'developer-guide/script',
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
                        label: 'Basic Information',
                        collapsed: true,
                        translations: {
                            'zh-CN': '基础信息',
                        },
                        autogenerate: {
                            directory: 'api/basic',
                        },
                    },
                    {
                        label: 'Scraper',
                        collapsed: true,
                        translations: {
                            'zh-CN': 'Scraper',
                        },
                        autogenerate: {
                            directory: 'api/scraper',
                        },
                    },
                    {
                        label: 'Runs',
                        collapsed: true,
                        translations: {
                            'zh-CN': 'Runs',
                        },
                        autogenerate: {
                            directory: 'api/run',
                        },
                    },
                    {
                        label: 'Tasks',
                        collapsed: true,
                        translations: {
                            'zh-CN': 'Tasks',
                        },
                        autogenerate: {
                            directory: 'api/task',
                        },
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
                label: 'Partnership & Promotion',
                collapsed: true,
                translations: {
                    'zh-CN': '推广合作',
                },
                autogenerate: { directory: 'partnership-promotion' },
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
                        label: 'Payment Problem',
                        translations: {
                            'zh-CN': '支付问题',
                        },
                        autogenerate: {
                            directory: 'faq/payment-problem',
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
    }), react()],
    
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