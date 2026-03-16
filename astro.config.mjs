// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightImageZoom from 'starlight-image-zoom'

const locales = {
    root: {
        label: 'English',
        lang: 'en', // lang 是 root 语言必须的
    },
    'zh-cn': {
        label: '简体中文',
        lang: 'zh-CN',
    },
}

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            plugins: [starlightImageZoom()],
            title: 'CafeScraper',
            logo: {
                src: './src/assets/logo.png',
            },
            defaultLocale: 'root',
            locales,
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
                    autogenerate: {
                        directory: 'api',
                    },
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
        }),
    ],

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
